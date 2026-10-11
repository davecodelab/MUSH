from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Student


@admin.register(Student)
class StudentAdmin(UserAdmin):
    list_display = (
        'username',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'gender',
        'assigned_room_display',
        'is_profile_complete',
        'is_staff',
    )
    list_filter = ('gender', 'is_profile_complete', 'is_staff', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone_number')
    list_per_page = 35
    fieldsets = UserAdmin.fieldsets + (
        ('Hostel Student Details', {'fields': ('phone_number', 'gender', 'emergency_contact', 'is_profile_complete')}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('roomspace__room')

    @admin.display(description="Assigned Bed")
    def assigned_room_display(self, obj):
        spaces = list(obj.roomspace.all())
        if not spaces:
            return "—"
        return ", ".join(f"{s.room.room_number}-{s.space_identifier}" for s in spaces)
