from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)

class Subscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, default="inactive")
    plan = models.CharField(
        max_length=255,
        default=settings.PLANS[0],
        choices=settings.PLANS,
    )


class GoogleProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    uid = models.CharField(blank=True, null=True, max_length=255, unique=True)



