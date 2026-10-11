from django.contrib import admin
from django.db.models import Count, Q, Sum
from django.urls import path, include
from django.utils import timezone
from django.views.generic import RedirectView

from bookings.models import Booking
from rooms.models import Room, RoomSpace
from users.models import Student

admin.site.site_header = "Mushia Hostel Administration"
admin.site.site_title = "Mushia Hostel Admin"
admin.site.index_title = "Hostel Management & Analytics Portal"


def get_hostel_analytics():
    now = timezone.now()

    # 1. Room & Space aggregates
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

    # 2. Booking & Revenue aggregates
    booking_stats = Booking.objects.aggregate(
        confirmed_count=Count('id', filter=Q(status='CONFIRMED')),
        active_holds=Count('id', filter=Q(status='PENDING', expires_at__gt=now)),
        cancelled_count=Count('id', filter=Q(status='CANCELLED')),
        confirmed_revenue=Sum('amount_paid', filter=Q(status='CONFIRMED')),
        pending_revenue=Sum('amount_paid', filter=Q(status='PENDING', expires_at__gt=now)),
    )

    # 3. Student aggregates
    student_stats = Student.objects.filter(is_superuser=False).aggregate(
        total_students=Count('id'),
        male_students=Count('id', filter=Q(gender='MALE')),
        female_students=Count('id', filter=Q(gender='FEMALE')),
    )

    # 4. Floor breakdown
    floor_order = [
        'GROUND FLOOR',
        'FIRST FLOOR',
        'SECOND FLOOR',
        'THIRD FLOOR',
        'FOURTH FLOOR',
        'FIFTH FLOOR',
    ]
    floor_rows = (
        Room.objects.values('floor')
        .annotate(
            rooms_count=Count('id', distinct=True),
            total_beds=Count('spaces'),
            occupied_beds=Count('spaces', filter=Q(spaces__occupant__isnull=False)),
        )
    )
    floor_map = {r['floor']: r for r in floor_rows}
    floors = []
    for fl in floor_order:
        r = floor_map.get(fl, {'rooms_count': 0, 'total_beds': 0, 'occupied_beds': 0})
        t_beds = r['total_beds'] or 0
        o_beds = r['occupied_beds'] or 0
        floors.append({
            'name': fl.title(),
            'rooms_count': r['rooms_count'],
            'total_beds': t_beds,
            'occupied_beds': o_beds,
            'vacant_beds': t_beds - o_beds,
            'pct': round((o_beds / t_beds) * 100, 1) if t_beds else 0.0,
        })

    # 5. Room Type (Capacity) breakdown
    cap_rows = (
        Room.objects.values('capacity')
        .annotate(
            rooms_count=Count('id', distinct=True),
            total_beds=Count('spaces'),
            occupied_beds=Count('spaces', filter=Q(spaces__occupant__isnull=False)),
        )
        .order_by('capacity')
    )
    capacities = []
    for c in cap_rows:
        t_beds = c['total_beds'] or 0
        o_beds = c['occupied_beds'] or 0
        capacities.append({
            'label': f"{c['capacity']}-in-1 Rooms",
            'rooms_count': c['rooms_count'],
            'total_beds': t_beds,
            'occupied_beds': o_beds,
            'vacant_beds': t_beds - o_beds,
            'pct': round((o_beds / t_beds) * 100, 1) if t_beds else 0.0,
        })

    # 6. Recent Bookings
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
        'total_students': student_stats['total_students'] or 0,
        'male_students': student_stats['male_students'] or 0,
        'female_students': student_stats['female_students'] or 0,
        'floors': floors,
        'capacities': capacities,
        'recent_bookings': recent_bookings,
    }


_original_admin_index = admin.site.index


def custom_admin_index(request, extra_context=None):
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
