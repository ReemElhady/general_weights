from rest_framework import serializers
from .models import Driver, Vehicle, BlockedVehicle


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = "__all__"


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"

class BlockedVehicleSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)  # full nested vehicle data

    class Meta:
        model = BlockedVehicle
        fields = '__all__'  # or list only fields you want exposed


class UnblockVehicleSerializer(serializers.ModelSerializer):
    unblock_reason = serializers.CharField(required=False)

    class Meta:
        model = BlockedVehicle
        fields = ['unblock_reason']
