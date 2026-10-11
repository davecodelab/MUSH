from django.contrib import admin
from django.db.models import Count, Q
from django.utils.html import format_html
from .models import Room, RoomSpace


class RoomSpaceInline(admin.TabularInline):
    model = RoomSpace
    extra = 0
    fields = ('space_identifier', 'occupant', 'is_available')
    readonly_fields = ('is_available',)
    autocomplete_fields = ('occupant',)


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        'room_number',
        'floor',
        'room_type',
        'capacity',
        'gender_policy',
        'price_per_space',
        'availability_badge',
    )
    list_editable = ('gender_policy', 'price_per_space')
    list_filter = ('floor', 'gender_policy', 'capacity', 'room_type')
    search_fields = ('room_number', 'floor', 'room_type')
    ordering = ('id',)
    list_per_page = 35
    inlines = [RoomSpaceInline]
    actions = ['reset_rooms_unassigned']

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            total_spaces=Count('spaces'),
            vacant_spaces=Count('spaces', filter=Q(spaces__occupant__isnull=True)),
        )

    @admin.display(description="Availability")
    def availability_badge(self, obj):
        total = getattr(obj, 'total_spaces', obj.capacity)
        vacant = getattr(obj, 'vacant_spaces', 0)
        if vacant == 0:
            color = '#dc2626'
            label = f"FULL (0/{total})"
        elif vacant < total:
            color = '#d97706'
            label = f"{vacant}/{total} free"
        else:
            color = '#16a34a'
            label = f"{vacant}/{total} free"
        return format_html(
            '<span style="color: {}; font-weight: 600;">{}</span>',
            color,
            label,
        )

    @admin.action(description="Reset selected rooms (vacate all spaces & set UNASSIGNED)")
    def reset_rooms_unassigned(self, request, queryset):
        RoomSpace.objects.filter(room__in=queryset).update(occupant=None)
        updated = queryset.update(gender_policy='UNASSIGNED')
        self.message_user(request, f"Reset {updated} room(s) to UNASSIGNED and vacated their bed spaces.")


@admin.register(RoomSpace)
class RoomSpaceAdmin(admin.ModelAdmin):
    list_display = ('space_label', 'room_floor', 'room_type', 'occupant', 'availability_status')
    list_select_related = ('room', 'occupant')
    list_filter = ('room__floor', 'room__gender_policy', 'room__capacity')
    search_fields = (
        'room__room_number',
        'space_identifier',
        'occupant__username',
        'occupant__first_name',
        'occupant__last_name',
    )
    autocomplete_fields = ('room', 'occupant')
    list_per_page = 50
    actions = ['vacate_selected_spaces']

    @admin.display(description="Bed Space", ordering='room__room_number')
    def space_label(self, obj):
        return f"Room {obj.room.room_number} — Bed {obj.space_identifier}"

    @admin.display(description="Floor", ordering='room__floor')
    def room_floor(self, obj):
        return obj.room.floor

    @admin.display(description="Room Type", ordering='room__room_type')
    def room_type(self, obj):
        return obj.room.room_type

    @admin.display(description="Available", boolean=True)
    def availability_status(self, obj):
        return obj.occupant_id is None

    @admin.action(description="Vacate selected bed spaces (remove occupant)")
    def vacate_selected_spaces(self, request, queryset):
        updated = queryset.update(occupant=None)
        self.message_user(request, f"Vacated {updated} bed space(s).")
