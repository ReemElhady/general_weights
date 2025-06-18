from django.db import models


# Create your models here.
class Driver(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]
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
