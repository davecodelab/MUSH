import os
import json
import urllib.parse
import urllib.request
import hmac
import hashlib
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from rest_framework import views, status, permissions
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer
from rooms.models import Room, RoomSpace


from django.conf import settings


def get_paystack_secret():
    return (
        os.getenv('PAYSTACK_SECRET_KEY', '').strip()
        or getattr(settings, 'PAYSTACK_SECRET_KEY', '').strip()
    )


def is_real_paystack():
    secret = get_paystack_secret()
    return bool(secret and not secret.startswith('sk_test_your_'))


def get_room_price(room):
    price = float(room.price_per_space)
    if price > 0:
        return price
    default_prices = {1: 14000.00, 2: 10800.00, 3: 8200.00}
    return default_prices.get(room.capacity, 6500.00)


def confirm_booking_allocation(booking):
    """Atomically finalize booking, assign student to bed space, and lock room gender."""
    with transaction.atomic():
        space = RoomSpace.objects.select_for_update().select_related('room').get(id=booking.room_space_id)
        if space.occupant_id is not None and space.occupant_id != booking.student_id:
            raise ValueError("This bed space has already been claimed by another student.")

        booking.status = 'CONFIRMED'
        booking.save(update_fields=['status', 'updated_at'])

        space.occupant = booking.student
        space.save(update_fields=['occupant'])

        room = space.room
        student_gender = (booking.student.gender or '').upper()
        if room.gender_policy == 'UNASSIGNED' and student_gender in ('MALE', 'FEMALE'):
            room.gender_policy = student_gender
            room.save(update_fields=['gender_policy'])


class HoldSpaceView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'booking'

    def post(self, request):
        if RoomSpace.objects.filter(occupant=request.user).exists():
            return Response(
                {"detail": "You already have a confirmed room allocation."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        space_id = request.data.get('space_id')
        room_number = request.data.get('room_number')
        space_number = request.data.get('space_number')

        with transaction.atomic():
            space = None
            if space_id:
                space = (
                    RoomSpace.objects.select_for_update()
                    .select_related('room')
                    .filter(id=space_id)
                    .first()
                )
            elif room_number and space_number:
                room = Room.objects.filter(room_number=str(room_number).strip()).first()
                if room:
                    spaces = list(
                        RoomSpace.objects.select_for_update()
                        .select_related('room')
                        .filter(room=room)
                        .order_by('id')
                    )
                    try:
                        idx = int(space_number) - 1
                        if 0 <= idx < len(spaces):
                            space = spaces[idx]
                    except (ValueError, TypeError):
                        space = None

            if not space:
                return Response(
                    {"detail": "Requested room space could not be found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if space.occupant_id is not None:
                return Response(
                    {"detail": "This space is already occupied."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            active_hold = (
                space.bookings.filter(status='PENDING', expires_at__gt=timezone.now())
                .exclude(student=request.user)
                .exists()
            )
            if active_hold:
                return Response(
                    {"detail": "This space is currently held by another student. Please select another space or wait a few minutes."},
                    status=status.HTTP_409_CONFLICT,
                )

            room = space.room
            req_gender = (request.data.get('gender') or '').strip().upper()
            req_phone = (request.data.get('phone_number') or '').strip()
            req_email = (request.data.get('email') or '').strip().lower()
            req_name = (request.data.get('full_name') or '').strip()

            update_fields = []
            if req_gender in ('MALE', 'FEMALE') and request.user.gender != req_gender:
                request.user.gender = req_gender
                update_fields.append('gender')
            if req_phone and request.user.phone_number != req_phone:
                request.user.phone_number = req_phone
                update_fields.append('phone_number')
            if req_email and request.user.email != req_email:
                request.user.email = req_email
                update_fields.append('email')
            if req_name:
                parts = req_name.split()
                first_name = parts[0]
                last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''
                if request.user.first_name != first_name or request.user.last_name != last_name:
                    request.user.first_name = first_name
                    request.user.last_name = last_name
                    update_fields.extend(['first_name', 'last_name'])
            if update_fields:
                request.user.save(update_fields=update_fields)

            user_gender = (request.user.gender or '').upper()
            if room.gender_policy != 'UNASSIGNED' and user_gender and room.gender_policy != user_gender:
                return Response(
                    {"detail": f"Room {room.room_number} is reserved for {room.gender_policy.capitalize()} students only."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            Booking.objects.filter(student=request.user, status='PENDING').update(status='CANCELLED')

            price = get_room_price(room)
            expires_at = timezone.now() + timedelta(minutes=15)
            booking = Booking.objects.create(
                student=request.user,
                room_space=space,
                status='PENDING',
                amount_paid=price,
                expires_at=expires_at,
            )

        return Response(
            {
                "message": f"Space {space.space_identifier} in Room {room.room_number} held for 15 minutes.",
                "booking": BookingSerializer(booking).data,
                "expires_at": expires_at.isoformat(),
            },
            status=status.HTTP_201_CREATED,
        )


class MyBookingsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        # Expire stale pending holds automatically
        Booking.objects.filter(student=request.user, status='PENDING', expires_at__lte=now).update(status='CANCELLED')
        bookings = (
            Booking.objects.select_related('student', 'room_space__room')
            .filter(student=request.user, status__in=['CONFIRMED', 'PENDING'])
            .order_by('-created_at')
        )
        return Response(BookingSerializer(bookings, many=True).data, status=status.HTTP_200_OK)


class ReleaseHoldView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        qs = Booking.objects.filter(student=request.user, status='PENDING')
        if booking_id:
            qs = qs.filter(id=booking_id)
        qs.update(status='CANCELLED')
        return Response({"message": "Active hold successfully released."}, status=status.HTTP_200_OK)


class InitializePaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'booking'

    def post(self, request):
        booking_id = request.data.get('booking_id')
        callback_url = (request.data.get('callback_url') or '').strip()
        booking = (
            Booking.objects.select_related('room_space__room')
            .filter(id=booking_id, student=request.user)
            .first()
        )
        if not booking:
            return Response({"detail": "Booking reservation not found."}, status=status.HTTP_404_NOT_FOUND)

        if booking.status != 'PENDING':
            return Response({"detail": f"Booking is already in {booking.status} status."}, status=status.HTTP_400_BAD_REQUEST)

        if booking.is_expired:
            booking.status = 'CANCELLED'
            booking.save(update_fields=['status', 'updated_at'])
            return Response({"detail": "Your 15-minute hold has expired. Please select a space again."}, status=status.HTTP_400_BAD_REQUEST)

        if not is_real_paystack():
            return Response(
                {"detail": "Paystack secret key is not configured on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        ref = f"MSH-{booking.id}-{int(timezone.now().timestamp())}"
        booking.paystack_reference = ref
        booking.save(update_fields=['paystack_reference', 'updated_at'])

        amount_pesewas = int(float(booking.amount_paid) * 100)

        try:
            body_dict = {
                "email": request.user.email or f"{request.user.username}@st.knust.edu.gh",
                "amount": amount_pesewas,
                "reference": ref,
                "currency": "GHS",
                "channels": ["mobile_money", "card", "bank", "ussd", "qr"],
                "metadata": {
                    "booking_id": booking.id,
                    "student_id": request.user.id,
                    "room_number": booking.room_space.room.room_number,
                    "space": booking.room_space.space_identifier,
                },
            }
            if callback_url:
                body_dict["callback_url"] = callback_url

            payload = json.dumps(body_dict).encode('utf-8')

            req = urllib.request.Request(
                "https://api.paystack.co/transaction/initialize",
                data=payload,
                headers={
                    "Authorization": f"Bearer {get_paystack_secret()}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (compatible; MushiaHostel/1.0)",
                },
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                res_data = json.loads(resp.read().decode('utf-8'))
                if res_data.get('status'):
                    return Response({
                        "authorization_url": res_data['data']['authorization_url'],
                        "access_code": res_data['data']['access_code'],
                        "reference": ref,
                        "amount": float(booking.amount_paid),
                        "currency": "GHS",
                    })
                return Response(
                    {"detail": res_data.get('message') or "Paystack failed to initialize transaction."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
        except Exception as exc:
            return Response(
                {"detail": f"Paystack initialization error: {str(exc)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class VerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'booking'

    def post(self, request):
        reference = (request.data.get('reference') or '').strip()
        if not reference:
            return Response({"detail": "Transaction reference is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Enforce student ownership to prevent IDOR
        booking = (
            Booking.objects.select_related('student', 'room_space__room')
            .filter(paystack_reference=reference, student=request.user)
            .first()
        )
        if not booking:
            return Response({"detail": "Booking with this reference was not found."}, status=status.HTTP_404_NOT_FOUND)

        if booking.status == 'CONFIRMED':
            return Response(
                {"message": "Booking is already confirmed.", "booking": BookingSerializer(booking).data},
                status=status.HTTP_200_OK,
            )

        if not is_real_paystack():
            return Response(
                {"detail": "Paystack secret key is not configured on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            req = urllib.request.Request(
                f"https://api.paystack.co/transaction/verify/{urllib.parse.quote(reference)}",
                headers={
                    "Authorization": f"Bearer {get_paystack_secret()}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (compatible; MushiaHostel/1.0)",
                },
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                res_data = json.loads(resp.read().decode('utf-8'))
                tx_data = res_data.get('data') or {}
                expected_pesewas = int(float(booking.amount_paid) * 100)
                if not (
                    res_data.get('status')
                    and tx_data.get('status') == 'success'
                    and int(tx_data.get('amount', 0)) >= expected_pesewas
                ):
                    return Response(
                        {"detail": "Payment verification failed or payment was not completed on Paystack."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        except Exception:
            return Response(
                {"detail": "Unable to verify payment with Paystack at this time."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        try:
            confirm_booking_allocation(booking)
        except ValueError as err:
            return Response({"detail": str(err)}, status=status.HTTP_409_CONFLICT)

        return Response(
            {
                "message": "Payment verified! Your room space is confirmed.",
                "booking": BookingSerializer(booking).data,
            },
            status=status.HTTP_200_OK,
        )


class PaystackWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        secret = get_paystack_secret()
        signature = request.headers.get('x-paystack-signature', '')
        if not is_real_paystack() or not signature:
            return Response({"detail": "Webhook signature required."}, status=status.HTTP_403_FORBIDDEN)

        payload = request.body
        computed_signature = hmac.new(
            secret.encode('utf-8'),
            payload,
            hashlib.sha512,
        ).hexdigest()

        if not hmac.compare_digest(signature, computed_signature):
            return Response({"detail": "Invalid signature."}, status=status.HTTP_403_FORBIDDEN)

        try:
            data = json.loads(payload.decode('utf-8'))
            if data.get('event') == 'charge.success':
                tx_data = data.get('data') or {}
                reference = tx_data.get('reference')
                booking = (
                    Booking.objects.select_related('student', 'room_space__room')
                    .filter(paystack_reference=reference)
                    .first()
                )
                if booking and booking.status != 'CONFIRMED':
                    expected_pesewas = int(float(booking.amount_paid) * 100)
                    if int(tx_data.get('amount', 0)) >= expected_pesewas:
                        confirm_booking_allocation(booking)

            return Response({"status": "processed"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid webhook payload."}, status=status.HTTP_400_BAD_REQUEST)


class RoommatesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, room_id):
        room_str = str(room_id).strip()
        room = (
            Room.objects.filter(id=int(room_str)).first()
            if room_str.isdigit()
            else Room.objects.filter(room_number=room_str).first()
        )
        if not room:
            return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

        if not room.spaces.filter(occupant=request.user).exists():
            return Response(
                {"detail": "Roommate contact details are only visible to confirmed students residing in this room."},
                status=status.HTTP_403_FORBIDDEN,
            )

        roommates = [
            {
                "space_identifier": space.space_identifier,
                "name": f"{space.occupant.first_name} {space.occupant.last_name}".strip() or space.occupant.username,
                "phone_number": space.occupant.phone_number,
                "email": space.occupant.email,
                "gender": space.occupant.gender,
                "is_you": space.occupant_id == request.user.id,
            }
            for space in room.spaces.select_related('occupant').filter(occupant__isnull=False)
        ]

        return Response(
            {
                "room_number": room.room_number,
                "floor": room.floor,
                "roommates": roommates,
            },
            status=status.HTTP_200_OK,
        )
