from django.contrib import admin
from django.db import transaction
from django.utils.html import format_html
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'student',
        'room_space',
        'status_badge',
        'amount_paid',
        'paystack_reference',
        'created_at',
        'expires_at',
        'is_expired',
    )
    list_select_related = ('student', 'room_space', 'room_space__room')
    list_filter = ('status', 'room_space__room__floor', 'created_at')
    search_fields = (
        'student__username',
        'student__first_name',
        'student__last_name',
        'student__email',
        'paystack_reference',
        'room_space__room__room_number',
    )
    readonly_fields = ('created_at', 'updated_at', 'is_expired')
    autocomplete_fields = ('student', 'room_space')
    list_per_page = 35
    actions = ['confirm_bookings', 'cancel_bookings']

    @admin.display(description="Status", ordering='status')
    def status_badge(self, obj):
        colors = {
            'CONFIRMED': '#16a34a',
            'PENDING': '#d97706',
            'CANCELLED': '#6b7280',
            'FAILED': '#dc2626',
        }
        color = colors.get(obj.status, '#374151')
        return format_html(
            '<span style="color: {}; font-weight: 600;">{}</span>',
            color,
            obj.status,
        )

    @admin.action(description="Confirm selected bookings & assign bed space")
    def confirm_bookings(self, request, queryset):
        count = 0
        with transaction.atomic():
            for booking in queryset.select_related('student', 'room_space__room'):
                booking.status = 'CONFIRMED'
                booking.save(update_fields=['status', 'updated_at'])

                space = booking.room_space
                space.occupant = booking.student
                space.save(update_fields=['occupant'])

                room = space.room
                if room.gender_policy == 'UNASSIGNED' and booking.student.gender:
                    room.gender_policy = booking.student.gender.upper()
                    room.save(update_fields=['gender_policy'])
                count += 1
        self.message_user(request, f"Confirmed {count} booking(s) and assigned students to their bed spaces.")

    @admin.action(description="Cancel selected bookings & release bed space")
    def cancel_bookings(self, request, queryset):
        count = 0
        with transaction.atomic():
            for booking in queryset.select_related('student', 'room_space__room'):
                booking.status = 'CANCELLED'
                booking.save(update_fields=['status', 'updated_at'])

                space = booking.room_space
                if space.occupant_id == booking.student_id:
                    space.occupant = None
                    space.save(update_fields=['occupant'])
                count += 1
        self.message_user(request, f"Cancelled {count} booking(s) and released associated bed spaces.")
