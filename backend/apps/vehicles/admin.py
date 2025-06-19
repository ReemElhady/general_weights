from django.contrib import admin
from .models import Driver, Vehicle, BlockedVehicle


# Register your models here.
@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ["name", "license"]
    search_fields = ["name", "license"]


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        "plate",
        "license",
        "chassis_number",
        "model",
        "type",
        "capacity",
        "last_inspection_date",
        "total_weight_operations",
        "status",
        "created_at",
    )
    search_fields = (
        "plate",
        "license",
        "chassis_number",
        "model",
        "type",
    )
    list_filter = ("status", "model", "type")


@admin.register(BlockedVehicle)
class BlockedVehicleAdmin(admin.ModelAdmin):
    list_display = (
        'vehicle', 'driver', 'is_blocked', 'status',
        'manipulative_user', 'manipulative_date',
        'unblock_user', 'unblock_date', 'unblock_reason'
    )
    list_filter = ('is_blocked', 'status', 'manipulative_date', 'unblock_date')
    search_fields = ('vehicle__plate', 'driver__name', 'unblock_reason')
    readonly_fields = ('manipulative_date',)

    def vehicle_plate(self, obj):
        return obj.vehicle.plate
