import os
import json
import urllib.request
import urllib.error
import hmac
import hashlib
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from rest_framework import views, status, permissions
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer
from rooms.models import Room, RoomSpace

PAYSTACK_SECRET = os.getenv('PAYSTACK_SECRET_KEY', '').strip()
IS_REAL_PAYSTACK = bool(PAYSTACK_SECRET and not PAYSTACK_SECRET.startswith('sk_test_your_'))

class HoldSpaceView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        space_id = request.data.get('space_id')
        room_number = request.data.get('room_number')
        space_number = request.data.get('space_number')

        space = None
        if space_id:
            space = RoomSpace.objects.filter(id=space_id).first()
        elif room_number and space_number:
            room = Room.objects.filter(room_number=room_number).first()
            if room:
                spaces = list(room.spaces.order_by('id'))
                idx = int(space_number) - 1
                if 0 <= idx < len(spaces):
                    space = spaces[idx]

        if not space:
            return Response({"detail": "Requested room space could not be found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if space already has a permanent occupant
        if space.occupant is not None:
            return Response({"detail": "This space is already occupied."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if space is currently on an active hold by someone else
        active_hold = space.bookings.filter(
            status='PENDING',
            expires_at__gt=timezone.now()
        ).exclude(student=request.user).first()

        if active_hold:
            return Response({
                "detail": "This space is currently held by another student. Please select another space or wait a few minutes."
            }, status=status.HTTP_409_CONFLICT)

        # Enforce Room Gender Policy
        room = space.room
        user_gender = (request.user.gender or '').upper()

        if room.gender_policy != 'UNASSIGNED' and user_gender:
            if room.gender_policy != user_gender:
                return Response({
                    "detail": f"Room {room.room_number} is reserved for {room.gender_policy.capitalize()} students only."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Release any existing pending holds for this student
        Booking.objects.filter(student=request.user, status='PENDING').update(status='CANCELLED')

        # Determine price
        price = room.price_per_space
        if float(price) <= 0:
            # Fallback default price based on capacity
            if room.capacity == 1:
                price = 14000.00
            elif room.capacity == 2:
                price = 10800.00
            elif room.capacity == 3:
                price = 8200.00
            else:
                price = 6500.00

        # Create new 15-minute booking hold
        expires_at = timezone.now() + timedelta(minutes=15)
        booking = Booking.objects.create(
            student=request.user,
            room_space=space,
            status='PENDING',
            amount_paid=price,
            expires_at=expires_at
        )

        return Response({
            "message": f"Space {space.space_identifier} in Room {room.room_number} held for 15 minutes.",
            "booking": BookingSerializer(booking).data,
            "expires_at": expires_at.isoformat(),
        }, status=status.HTTP_201_CREATED)

class ReleaseHoldView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        if booking_id:
            Booking.objects.filter(id=booking_id, student=request.user, status='PENDING').update(status='CANCELLED')
        else:
            Booking.objects.filter(student=request.user, status='PENDING').update(status='CANCELLED')

        return Response({"message": "Active hold successfully released."}, status=status.HTTP_200_OK)

class InitializePaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        booking = Booking.objects.filter(id=booking_id, student=request.user).first()

        if not booking:
            return Response({"detail": "Booking reservation not found."}, status=status.HTTP_404_NOT_FOUND)

        if booking.status != 'PENDING':
            return Response({"detail": f"Booking is already in {booking.status} status."}, status=status.HTTP_400_BAD_REQUEST)

        if booking.is_expired:
            booking.status = 'CANCELLED'
            booking.save()
            return Response({"detail": "Your 15-minute hold has expired. Please select a space again."}, status=status.HTTP_400_BAD_REQUEST)

        ref = f"MSH-{booking.id}-{int(timezone.now().timestamp())}"
        booking.paystack_reference = ref
        booking.save()

        amount_pesewas = int(float(booking.amount_paid) * 100)

        if IS_REAL_PAYSTACK:
            try:
                url = "https://api.paystack.co/transaction/initialize"
                payload = json.dumps({
                    "email": request.user.email or f"{request.user.username}@st.knust.edu.gh",
                    "amount": amount_pesewas,
                    "reference": ref,
                    "currency": "GHS",
                    "metadata": {
                        "booking_id": booking.id,
                        "student_id": request.user.id,
                        "room_number": booking.room_space.room.room_number,
                        "space": booking.room_space.space_identifier,
                    }
                }).encode('utf-8')

                req = urllib.request.Request(
                    url,
                    data=payload,
                    headers={
                        "Authorization": f"Bearer {PAYSTACK_SECRET}",
                        "Content-Type": "application/json",
                    }
                )
                with urllib.request.urlopen(req) as resp:
                    res_data = json.loads(resp.read().decode('utf-8'))
                    if res_data.get('status'):
                        return Response({
                            "authorization_url": res_data['data']['authorization_url'],
                            "access_code": res_data['data']['access_code'],
                            "reference": ref,
                            "amount": float(booking.amount_paid)
                        })
            except Exception as e:
                # Fallback to test reference if network or key issue
                pass

        # Sandbox / Local dev response
        return Response({
            "message": "Payment initialized successfully (Test/Sandbox mode)",
            "reference": ref,
            "amount": float(booking.amount_paid),
            "currency": "GHS",
            "mock": True
        }, status=status.HTTP_200_OK)

class VerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        reference = request.data.get('reference')
        if not reference:
            return Response({"detail": "Transaction reference is required."}, status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.filter(paystack_reference=reference).first()
        if not booking:
            return Response({"detail": "Booking with this reference was not found."}, status=status.HTTP_404_NOT_FOUND)

        if booking.status == 'CONFIRMED':
            return Response({
                "message": "Booking is already confirmed.",
                "booking": BookingSerializer(booking).data
            }, status=status.HTTP_200_OK)

        # If live Paystack key is available, verify with Paystack API
        if IS_REAL_PAYSTACK:
            try:
                url = f"https://api.paystack.co/transaction/verify/{reference}"
                req = urllib.request.Request(
                    url,
                    headers={
                        "Authorization": f"Bearer {PAYSTACK_SECRET}",
                        "Content-Type": "application/json",
                    }
                )
                with urllib.request.urlopen(req) as resp:
                    res_data = json.loads(resp.read().decode('utf-8'))
                    if not (res_data.get('status') and res_data['data']['status'] == 'success'):
                        return Response({"detail": "Payment verification failed with Paystack."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"detail": f"Error contacting Paystack verification: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)

        # Finalize allocation atomically
        with transaction.atomic():
            booking.status = 'CONFIRMED'
            booking.save()

            space = booking.room_space
            space.occupant = booking.student
            space.save()

            room = space.room
            # First-Come Gender Assignment rule:
            # If the room is UNASSIGNED, lock the entire room to this first student's gender!
            student_gender = (booking.student.gender or '').upper()
            if room.gender_policy == 'UNASSIGNED' and student_gender in ['MALE', 'FEMALE']:
                room.gender_policy = student_gender
                room.save()

        return Response({
            "message": "Payment verified! Your room space is confirmed.",
            "booking": BookingSerializer(booking).data
        }, status=status.HTTP_200_OK)

class PaystackWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        signature = request.headers.get('x-paystack-signature', '')

        if PAYSTACK_SECRET:
            computed_signature = hmac.new(
                PAYSTACK_SECRET.encode('utf-8'),
                payload,
                hashlib.sha512
            ).hexdigest()

            if not hmac.compare_digest(signature, computed_signature):
                return Response({"detail": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = json.loads(payload.decode('utf-8'))
            if data.get('event') == 'charge.success':
                reference = data['data'].get('reference')
                booking = Booking.objects.filter(paystack_reference=reference).first()
                if booking and booking.status != 'CONFIRMED':
                    with transaction.atomic():
                        booking.status = 'CONFIRMED'
                        booking.save()

                        space = booking.room_space
                        space.occupant = booking.student
                        space.save()

                        room = space.room
                        student_gender = (booking.student.gender or '').upper()
                        if room.gender_policy == 'UNASSIGNED' and student_gender in ['MALE', 'FEMALE']:
                            room.gender_policy = student_gender
                            room.save()

            return Response({"status": "processed"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RoommatesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, room_id):
        room = None
        if str(room_id).isdigit():
            room = Room.objects.filter(id=int(room_id)).first()
        if not room:
            room = Room.objects.filter(room_number=room_id).first()

        if not room:
            return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the requesting student has a confirmed space in this room
        has_space = room.spaces.filter(occupant=request.user).exists()
        if not has_space:
            return Response({
                "detail": "Roommate contact details are only visible to confirmed students residing in this room."
            }, status=status.HTTP_403_FORBIDDEN)

        roommates = []
        for space in room.spaces.filter(occupant__isnull=False):
            occ = space.occupant
            roommates.append({
                "space_identifier": space.space_identifier,
                "name": f"{occ.first_name} {occ.last_name}".strip() or occ.username,
                "phone_number": occ.phone_number,
                "email": occ.email,
                "gender": occ.gender,
                "is_you": occ.id == request.user.id
            })

        return Response({
            "room_number": room.room_number,
            "floor": room.floor,
            "roommates": roommates
        }, status=status.HTTP_200_OK)
