from rest_framework import serializers
from django.contrib.auth import get_user_model

Student = get_user_model()

class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    knustId = serializers.CharField(source='username', read_only=True)
    phone = serializers.CharField(source='phone_number', read_only=True)
    hasPaid = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    bookingId = serializers.SerializerMethodField()
    roomNumber = serializers.SerializerMethodField()
    spaceNumber = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'phone_number', 'gender', 'emergency_contact', 'is_profile_complete',
            'name', 'knustId', 'phone', 'hasPaid', 'bookingId', 'roomNumber', 'spaceNumber'
        ]
        read_only_fields = ['id']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full if full else obj.username

    def get_hasPaid(self, obj):
        return obj.bookings.filter(status='CONFIRMED').exists()

    def get_bookingId(self, obj):
        booking = obj.bookings.filter(status='CONFIRMED').first()
        return str(booking.id) if booking else None

    def get_roomNumber(self, obj):
        booking = obj.bookings.filter(status='CONFIRMED').first()
        return str(booking.room_space.room.room_number) if booking else None

    def get_spaceNumber(self, obj):
        booking = obj.bookings.filter(status='CONFIRMED').first()
        return booking.room_space.space_number if booking else None

    def get_gender(self, obj):
        return 'Male' if obj.gender == 'MALE' else ('Female' if obj.gender == 'FEMALE' else '')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'gender']

    def create(self, validated_data):
        user = Student.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            gender=validated_data.get('gender', '')
        )
        return user
