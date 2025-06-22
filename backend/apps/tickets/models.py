from django.db import models
from apps.business.models import Item, Scale, Client
# from apps.vehicles.models import Vehicle, Driver


from apps.vehicles.models import Vehicle, Driver

Ticket_Types = [("IN", "التفريغ"), ("OUT", "المبيعات")]


class Ticket(models.Model):
    scale = models.ForeignKey(Scale, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True)

    ticket_number = models.IntegerField(unique=True, null=True, blank=True)
    ticket_type = models.CharField(max_length=10, choices=Ticket_Types, default="IN")

    first_weight = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )
    first_weight_date = models.CharField(max_length=250, null=True, blank=True)

    second_weight = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )
    second_weight_date = models.CharField(max_length=250, null=True, blank=True)

    trailer_first_weight = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )
    trailer_second_weight = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )
    trailer_plate_number = models.CharField(max_length=10, null=True, blank=True)

    net_weight = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )

    farm = models.CharField(max_length=50, null=True, blank=True)
    boxes_number = models.IntegerField(null=True, blank=True)
    birds_number = models.IntegerField(null=True, blank=True)
    gas_ratio = models.DecimalField(
        max_digits=10, decimal_places=3, null=True, blank=True
    )

    is_completed = models.BooleanField(default=False)

    notes = models.CharField(max_length=250, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-calculate net_weight
        if self.first_weight is not None and self.second_weight is not None:
            self.net_weight = abs(self.second_weight - self.first_weight)

        super().save(*args, **kwargs)
