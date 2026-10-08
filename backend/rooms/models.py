from django.db import models
from django.conf import settings

class Room(models.Model):
    GENDER_CHOICES = (
        ('UNASSIGNED', 'Unassigned'),
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
    )

    room_number = models.CharField(max_length=10, unique=True)
    floor = models.CharField(max_length=50) # e.g., "GROUND FLOOR"
    room_type = models.CharField(max_length=10) # e.g., "2IN1", "4IN1"
    capacity = models.PositiveIntegerField()
    price_per_space = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    gender_policy = models.CharField(max_length=10, choices=GENDER_CHOICES, default='UNASSIGNED')
    amenities = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.room_number} ({self.room_type})"

class RoomSpace(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='spaces')
    space_identifier = models.CharField(max_length=5) # e.g., "A", "B"
    occupant = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='roomspace'
    )

    class Meta:
        unique_together = ('room', 'space_identifier')

    def __str__(self):
        return f"{self.room.room_number}-{self.space_identifier}"

    @property
    def is_available(self):
        return self.occupant is None
