from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Student

@admin.register(Student)
class StudentAdmin(UserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email', 'phone_number', 'gender', 'is_profile_complete')
    list_filter = ('gender', 'is_profile_complete', 'is_staff')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone_number')
    fieldsets = UserAdmin.fieldsets + (
        ('Hostel Student Details', {'fields': ('phone_number', 'gender', 'emergency_contact', 'is_profile_complete')}),
    )
