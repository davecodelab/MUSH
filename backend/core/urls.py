from decimal import Decimal, InvalidOperation
from django.contrib import admin, messages
from django.db.models import Count, Min, Q, Sum
from django.shortcuts import redirect
from django.urls import path, include
from django.utils import timezone
from django.views.generic import RedirectView

from bookings.models import Booking
from rooms.models import Room, RoomSpace
from users.models import Student

admin.site.site_header = "Mushia Hostel Administration"
admin.site.site_title = "Mushia Hostel Admin"
admin.site.index_title = "Executive Command & Analytics Center"


def get_hostel_analytics():
    now = timezone.now()

    room_stats = Room.objects.aggregate(
        total_rooms=Count('id'),
        male_rooms=Count('id', filter=Q(gender_policy='MALE')),
        female_rooms=Count('id', filter=Q(gender_policy='FEMALE')),
        unassigned_rooms=Count('id', filter=Q(gender_policy='UNASSIGNED')),
    )
    space_stats = RoomSpace.objects.aggregate(
        total_spaces=Count('id'),
        occupied_spaces=Count('id', filter=Q(occupant__isnull=False)),
    )
    total_spaces = space_stats['total_spaces'] or 0
    occupied_spaces = space_stats['occupied_spaces'] or 0
    vacant_spaces = total_spaces - occupied_spaces
    occupancy_pct = round((occupied_spaces / total_spaces) * 100, 1) if total_spaces else 0.0

    booking_stats = Booking.objects.aggregate(
        confirmed_count=Count('id', filter=Q(status='CONFIRMED')),
        active_holds=Count('id', filter=Q(status='PENDING', expires_at__gt=now)),
        cancelled_count=Count('id', filter=Q(status='CANCELLED')),
        confirmed_revenue=Sum('amount_paid', filter=Q(status='CONFIRMED')),
        pending_revenue=Sum('amount_paid', filter=Q(status='PENDING', expires_at__gt=now)),
    )

    student_stats = Student.objects.filter(is_superuser=False).aggregate(
        total_students=Count('id'),
        male_students=Count('id', filter=Q(gender='MALE')),
        female_students=Count('id', filter=Q(gender='FEMALE')),
    )

    # Dynamic Floor breakdown ordered by appearance in MUSHIA.xlsx (Min('id'))
    floor_rows = (
        Room.objects.values('floor')
        .annotate(
            first_id=Min('id'),
            rooms_count=Count('id', distinct=True),
            total_beds=Count('spaces'),
            occupied_beds=Count('spaces', filter=Q(spaces__occupant__isnull=False)),
        )
        .order_by('first_id')
    )
    floors = []
    for r in floor_rows:
        t_beds = r['total_beds'] or 0
        o_beds = r['occupied_beds'] or 0
        floors.append({
            'name': (r['floor'] or '').title(),
            'rooms_count': r['rooms_count'],
            'total_beds': t_beds,
            'occupied_beds': o_beds,
            'vacant_beds': t_beds - o_beds,
            'pct': round((o_beds / t_beds) * 100, 1) if t_beds else 0.0,
        })

    # Room Type (Capacity) breakdown & live price tiers
    all_rooms_qs = list(Room.objects.order_by('id'))
    potential_revenue = sum(float(r.price_per_space) * r.capacity for r in all_rooms_qs)

    cap_rows = (
        Room.objects.values('capacity')
        .annotate(
            rooms_count=Count('id', distinct=True),
            total_beds=Count('spaces'),
            occupied_beds=Count('spaces', filter=Q(spaces__occupant__isnull=False)),
        )
        .order_by('capacity')
    )

    price_tiers = {}
    for cap in (1, 2, 3, 4):
        non_ac_room = next(
            (r for r in all_rooms_qs if r.capacity == cap and 'AC' not in (r.room_type or '').upper()),
            None,
        )
        ac_room = next(
            (r for r in all_rooms_qs if r.capacity == cap and 'AC' in (r.room_type or '').upper()),
            None,
        )
        price_tiers[cap] = {
            'non_ac': f"{float(non_ac_room.price_per_space):.0f}" if non_ac_room else '0',
            'ac': f"{float(ac_room.price_per_space):.0f}" if ac_room else '0',
            'has_ac_rooms': ac_room is not None,
            'has_non_ac_rooms': non_ac_room is not None,
        }

    capacities = []
    for c in cap_rows:
        cap_num = c['capacity']
        t_beds = c['total_beds'] or 0
        o_beds = c['occupied_beds'] or 0
        tier = price_tiers.get(cap_num, {'non_ac': '0', 'ac': '0', 'has_ac_rooms': False, 'has_non_ac_rooms': True})
        capacities.append({
            'capacity': cap_num,
            'label': f"{cap_num}-in-1 Suite",
            'rooms_count': c['rooms_count'],
            'total_beds': t_beds,
            'occupied_beds': o_beds,
            'vacant_beds': t_beds - o_beds,
            'pct': round((o_beds / t_beds) * 100, 1) if t_beds else 0.0,
            'non_ac_price': tier['non_ac'],
            'ac_price': tier['ac'],
            'has_ac_rooms': tier['has_ac_rooms'],
            'has_non_ac_rooms': tier['has_non_ac_rooms'],
        })

    recent_bookings = list(
        Booking.objects.select_related('student', 'room_space__room')
        .order_by('-created_at')[:6]
    )

    return {
        'total_rooms': room_stats['total_rooms'] or 0,
        'male_rooms': room_stats['male_rooms'] or 0,
        'female_rooms': room_stats['female_rooms'] or 0,
        'unassigned_rooms': room_stats['unassigned_rooms'] or 0,
        'total_spaces': total_spaces,
        'occupied_spaces': occupied_spaces,
        'vacant_spaces': vacant_spaces,
        'occupancy_pct': occupancy_pct,
        'confirmed_bookings': booking_stats['confirmed_count'] or 0,
        'active_holds': booking_stats['active_holds'] or 0,
        'cancelled_bookings': booking_stats['cancelled_count'] or 0,
        'confirmed_revenue': f"{float(booking_stats['confirmed_revenue'] or 0):,.2f}",
        'pending_revenue': f"{float(booking_stats['pending_revenue'] or 0):,.2f}",
        'potential_revenue': f"{potential_revenue:,.0f}",
        'total_students': student_stats['total_students'] or 0,
        'male_students': student_stats['male_students'] or 0,
        'female_students': student_stats['female_students'] or 0,
        'floors': floors,
        'capacities': capacities,
        'recent_bookings': recent_bookings,
        'all_rooms': all_rooms_qs,
    }


def handle_pricing_post(request):
    action = request.POST.get('pricing_action')
    if action == 'bulk_tier_update':
        updated_total = 0
        for cap in (1, 2, 3, 4):
            non_ac_val = request.POST.get(f'price_{cap}_non_ac', '').strip()
            ac_val = request.POST.get(f'price_{cap}_ac', '').strip()
            qs = Room.objects.filter(capacity=cap)
            if non_ac_val:
                try:
                    price = Decimal(non_ac_val)
                    if price >= 0:
                        updated_total += qs.exclude(room_type__icontains='AC').update(price_per_space=price)
                except InvalidOperation:
                    pass
            if ac_val:
                try:
                    price = Decimal(ac_val)
                    if price >= 0:
                        updated_total += qs.filter(room_type__icontains='AC').update(price_per_space=price)
                except InvalidOperation:
                    pass
        messages.success(request, f"Updated prices across {updated_total} rooms successfully.")

    elif action == 'single_room_update':
        room_id = request.POST.get('room_id')
        new_price = request.POST.get('single_price', '').strip()
        new_gender = request.POST.get('single_gender', '').strip()
        room = Room.objects.filter(id=room_id).first()
        if room:
            if new_price:
                try:
                    room.price_per_space = Decimal(new_price)
                except InvalidOperation:
                    pass
            if new_gender in ('UNASSIGNED', 'MALE', 'FEMALE'):
                room.gender_policy = new_gender
            room.save(update_fields=['price_per_space', 'gender_policy'])
            messages.success(
                request,
                f"Updated Room {room.room_number}: GHS {room.price_per_space:,.2f} ({room.gender_policy}).",
            )


_original_admin_index = admin.site.index


def custom_admin_index(request, extra_context=None):
    if request.method == 'POST' and request.user.is_staff and request.POST.get('pricing_action'):
        handle_pricing_post(request)
        return redirect('/admin/')

    extra_context = extra_context or {}
    try:
        extra_context['analytics'] = get_hostel_analytics()
    except Exception:
        extra_context['analytics'] = None
    return _original_admin_index(request, extra_context=extra_context)


admin.site.index = custom_admin_index

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/rooms/', include('rooms.urls')),
    path('api/bookings/', include('bookings.urls')),
]
