from django.db import models
from django.contrib.auth.models import AbstractUser

class Student(AbstractUser):
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
    )

    phone_number = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, blank=True)
    emergency_contact = models.CharField(max_length=255, blank=True)
    
    # Track if they have filled out all necessary details after registering
    is_profile_complete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"
