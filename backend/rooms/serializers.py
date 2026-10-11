from rest_framework import serializers
from django.utils import timezone
from .models import Room, RoomSpace


class RoomSpaceSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = RoomSpace
        fields = ['id', 'space_identifier', 'is_available']

    def get_is_available(self, obj):
        if obj.occupant_id is not None:
            return False
        now = timezone.now()
        for booking in obj.bookings.all():
            if booking.status == 'CONFIRMED' or (booking.status == 'PENDING' and booking.expires_at > now):
                return False
        return True


class RoomSerializer(serializers.ModelSerializer):
    spaces = RoomSpaceSerializer(many=True, read_only=True)
    available_spaces_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Room
        fields = [
            'id', 'room_number', 'floor', 'room_type', 'capacity',
            'price_per_space', 'gender_policy', 'amenities',
            'spaces', 'available_spaces_count',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['available_spaces_count'] = sum(1 for s in data['spaces'] if s['is_available'])
        return data
