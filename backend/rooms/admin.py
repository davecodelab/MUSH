from django.contrib import admin
from .models import Room, RoomSpace

class RoomSpaceInline(admin.TabularInline):
    model = RoomSpace
    extra = 0
    fields = ('space_identifier', 'occupant', 'is_available')
    readonly_fields = ('is_available',)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'floor', 'room_type', 'capacity', 'gender_policy', 'price_per_space', 'available_spaces_display')
    list_filter = ('floor', 'room_type', 'gender_policy')
    search_fields = ('room_number',)
    inlines = [RoomSpaceInline]

    def available_spaces_display(self, obj):
        total = obj.spaces.count()
        vacant = obj.spaces.filter(occupant__isnull=True).count()
        return f"{vacant} / {total} free"
    available_spaces_display.short_description = "Availability"

@admin.register(RoomSpace)
class RoomSpaceAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'room', 'space_identifier', 'occupant', 'is_available')
    list_filter = ('room__floor', 'room__room_type', 'room__gender_policy')
    search_fields = ('room__room_number', 'space_identifier', 'occupant__username', 'occupant__first_name', 'occupant__last_name')
