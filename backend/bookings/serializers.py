from rest_framework import serializers
from .models import Booking
from rooms.models import RoomSpace, Room

class BookingSerializer(serializers.ModelSerializer):
    room_id = serializers.IntegerField(source='room_space.room.id', read_only=True)
    room_number = serializers.CharField(source='room_space.room.room_number', read_only=True)
    floor = serializers.CharField(source='room_space.room.floor', read_only=True)
    room_type = serializers.CharField(source='room_space.room.room_type', read_only=True)
    capacity = serializers.IntegerField(source='room_space.room.capacity', read_only=True)
    space_identifier = serializers.CharField(source='room_space.space_identifier', read_only=True)
    space_number = serializers.SerializerMethodField()
    air_conditioned = serializers.SerializerMethodField()
    room_size = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    student_email = serializers.EmailField(source='student.email', read_only=True)
    student_phone = serializers.CharField(source='student.phone_number', read_only=True)
    student_knust_id = serializers.CharField(source='student.username', read_only=True)
    student_gender = serializers.SerializerMethodField()
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'student',
            'student_name',
            'student_email',
            'student_phone',
            'student_knust_id',
            'student_gender',
            'room_space',
            'room_id',
            'room_number',
            'floor',
            'room_type',
            'capacity',
            'air_conditioned',
            'room_size',
            'space_identifier',
            'space_number',
            'status',
            'paystack_reference',
            'amount_paid',
            'created_at',
            'expires_at',
            'is_expired',
        ]
        read_only_fields = ['id', 'student', 'created_at', 'expires_at', 'is_expired']

    def get_student_name(self, obj):
        full = f"{obj.student.first_name} {obj.student.last_name}".strip()
        return full if full else obj.student.username

    def get_student_gender(self, obj):
        g = (obj.student.gender or '').upper()
        return 'Female' if g == 'FEMALE' else 'Male'

    def get_space_number(self, obj):
        ident = (obj.room_space.space_identifier or 'A').strip().upper()
        return (ord(ident[0]) - ord('A') + 1) if ident and ident[0].isalpha() else 1

    def get_air_conditioned(self, obj):
        rt = (obj.room_space.room.room_type or '').upper()
        amenities = obj.room_space.room.amenities or []
        return 'A/C' in rt or 'AC' in rt or any('AC' in str(a).upper() or 'AIR CONDITION' in str(a).upper() for a in amenities)

    def get_room_size(self, obj):
        rt = (obj.room_space.room.room_type or '').upper()
        return 'Small' if 'SMALL' in rt else 'Standard'

