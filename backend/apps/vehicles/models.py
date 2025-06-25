from django.db import models
from apps.users.models import User


STATUS_CHOICES = [
    ("active", "Active"),
    ("inactive", "Inactive"),
]

BLOCKING_STATUS_CHOICES = [
    ("blocked", "Blocked"),
    ("unblocked", "Unblocked"),
]


class Driver(models.Model):
    name = models.CharField(max_length=250)
    license = models.CharField(max_length=14)
    license_category = models.CharField(max_length=100, null=True)
    license_expiry = models.DateField(null=True)
    notes = models.CharField(max_length=250, null=True, blank=True)
    status = models.CharField(
        max_length=8, choices=STATUS_CHOICES, default="active", null=True, blank=True
    )

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    drivers = models.ManyToManyField("Driver", related_name="vehicles", blank=True)
    plate = models.CharField(max_length=10)
    license = models.CharField(max_length=14)
    chassis_number = models.CharField(max_length=50, null=True, blank=True)
    model = models.CharField(max_length=100, null=True, blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)
    capacity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    last_inspection_date = models.DateField(null=True, blank=True)
    license_weight = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )
    first_weight = models.DecimalField(
        max_digits=10, decimal_places=3, default=0, null=True, blank=True
    )
    total_weight_operations = models.IntegerField(default=0, null=True, blank=True)
    status = models.CharField(
        max_length=8,
        choices=STATUS_CHOICES,
        default="active",
        null=True,
        blank=True,
    )
    notes = models.CharField(max_length=250, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.plate


class BlockedVehicle(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True)
    manipulative_value = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )
    manipulative_date = models.DateTimeField(auto_now_add=True)
    is_blocked = models.BooleanField(default=True)
    manipulative_user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="manipulated_blocks"
    )
    unblock_user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,  blank=True, related_name="unblocked_blocks"
    )
    unblock_date = models.DateTimeField(null=True, blank=True)
    unblock_reason = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=BLOCKING_STATUS_CHOICES, default="blocked"
    )

    def __str__(self):
        return f"{self.vehicle.plate} - {'Blocked' if self.is_blocked else 'Unblocked'}"
