from rest_framework import serializers
from .models import Room, RoomSpace
from django.utils import timezone

class RoomSpaceSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = RoomSpace
        fields = ['id', 'space_identifier', 'is_available']

    def get_is_available(self, obj):
        if obj.occupant is not None:
            return False
            
        # Check if there are any active holds (pending bookings that are not expired)
        # or confirmed bookings.
        active_holds = obj.bookings.filter(
            status='PENDING',
            expires_at__gt=timezone.now()
        ).exists()
        
        confirmed_bookings = obj.bookings.filter(status='CONFIRMED').exists()
        
        return not (active_holds or confirmed_bookings)

class RoomSerializer(serializers.ModelSerializer):
    spaces = RoomSpaceSerializer(many=True, read_only=True)
    available_spaces_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'room_number', 'floor', 'room_type', 'capacity', 'price_per_space', 'gender_policy', 'amenities', 'spaces', 'available_spaces_count']

    def get_available_spaces_count(self, obj):
        count = 0
        spaces_serializer = RoomSpaceSerializer(obj.spaces.all(), many=True)
        for space in spaces_serializer.data:
            if space['is_available']:
                count += 1
        return count
