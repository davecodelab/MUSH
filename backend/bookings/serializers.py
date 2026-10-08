from rest_framework import serializers
from .models import Booking
from rooms.models import RoomSpace, Room

class BookingSerializer(serializers.ModelSerializer):
    room_number = serializers.CharField(source='room_space.room.room_number', read_only=True)
    floor = serializers.CharField(source='room_space.room.floor', read_only=True)
    room_type = serializers.CharField(source='room_space.room.room_type', read_only=True)
    space_identifier = serializers.CharField(source='room_space.space_identifier', read_only=True)
    student_name = serializers.SerializerMethodField()
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 
            'student', 
            'student_name',
            'room_space', 
            'room_number', 
            'floor', 
            'room_type', 
            'space_identifier', 
            'status', 
            'paystack_reference', 
            'amount_paid', 
            'created_at', 
            'expires_at', 
            'is_expired'
        ]
        read_only_fields = ['id', 'student', 'created_at', 'expires_at', 'is_expired']

    def get_student_name(self, obj):
        full = f"{obj.student.first_name} {obj.student.last_name}".strip()
        return full if full else obj.student.username
