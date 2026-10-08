from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'room_space', 'status', 'amount_paid', 'paystack_reference', 'created_at', 'expires_at', 'is_expired')
    list_filter = ('status', 'created_at')
    search_fields = ('student__username', 'student__first_name', 'student__last_name', 'paystack_reference', 'room_space__room__room_number')
    readonly_fields = ('created_at', 'updated_at', 'is_expired')
