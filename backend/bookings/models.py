from django.db import models
from django.conf import settings
from rooms.models import RoomSpace
from django.utils import timezone
from datetime import timedelta

def get_expiration_time():
    return timezone.now() + timedelta(minutes=15)

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('FAILED', 'Failed'),
    )

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    room_space = models.ForeignKey(RoomSpace, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    paystack_reference = models.CharField(max_length=100, unique=True, null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_expiration_time)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} - {self.student} - {self.status}"

    @property
    def is_expired(self):
        if self.status == 'PENDING' and timezone.now() > self.expires_at:
            return True
        return False
