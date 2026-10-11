from rest_framework import serializers
from django.contrib.auth import get_user_model

Student = get_user_model()


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    knustId = serializers.CharField(source='username', read_only=True)
    phone = serializers.CharField(source='phone_number', read_only=True)
    gender = serializers.SerializerMethodField()
    hasPaid = serializers.BooleanField(read_only=True)
    bookingId = serializers.CharField(read_only=True)
    roomNumber = serializers.CharField(read_only=True)
    spaceNumber = serializers.IntegerField(read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'gender', 'emergency_contact', 'is_profile_complete',
            'name', 'knustId', 'phone', 'hasPaid', 'bookingId', 'roomNumber', 'spaceNumber',
        ]
        read_only_fields = ['id', 'is_profile_complete']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full if full else obj.username

    def get_gender(self, obj):
        return 'Male' if obj.gender == 'MALE' else ('Female' if obj.gender == 'FEMALE' else '')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        booking = (
            instance.bookings.select_related('room_space__room')
            .filter(status='CONFIRMED')
            .first()
        )
        data['hasPaid'] = booking is not None
        data['bookingId'] = str(booking.id) if booking else None
        data['roomNumber'] = booking.room_space.room.room_number if booking else None
        if booking and booking.room_space.space_identifier:
            ident = booking.room_space.space_identifier.upper()
            data['spaceNumber'] = (ord(ident[0]) - ord('A') + 1) if ident[0].isalpha() else 1
        else:
            data['spaceNumber'] = None
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, max_length=128)

    class Meta:
        model = Student
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'gender']

    def validate_username(self, value):
        return value.strip()

    def validate_gender(self, value):
        norm = (value or '').strip().upper()
        if norm in ('MALE', 'M'):
            return 'MALE'
        if norm in ('FEMALE', 'F'):
            return 'FEMALE'
        return ''

    def create(self, validated_data):
        return Student.objects.create_user(
            username=validated_data['username'],
            email=(validated_data.get('email') or '').strip().lower(),
            password=validated_data['password'],
            first_name=(validated_data.get('first_name') or '').strip(),
            last_name=(validated_data.get('last_name') or '').strip(),
            phone_number=(validated_data.get('phone_number') or '').strip(),
            gender=validated_data.get('gender', ''),
        )
