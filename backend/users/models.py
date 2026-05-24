from django.contrib.auth.models import AbstractUser
from django.db import models
import random

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        from django.utils import timezone
        self.otp_created_at = timezone.now()
        self.save()
        return self.otp

    def __str__(self):
        return self.email