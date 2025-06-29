from rest_framework import serializers
from .models import Driver, Vehicle, BlockedVehicle
from apps.users.serializers import UserSerializer

class DriverMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ["id", "name"]

class VehicleMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["id", "plate"]


class DriverSerializer(serializers.ModelSerializer):
    vehicles = VehicleMiniSerializer(many=True, read_only=True)

    vehicle_ids = serializers.PrimaryKeyRelatedField(
        source="vehicles", many=True, queryset=Vehicle.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Driver
        fields = "__all__"

    def create(self, validated_data):
        vehicles = validated_data.pop('vehicles', [])
        driver = Driver.objects.create(**validated_data)
        driver.vehicles.set(vehicles)
        return driver

    def update(self, instance, validated_data):
        vehicles = validated_data.pop('vehicles', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if vehicles is not None:
            instance.vehicles.set(vehicles)
        return instance


class VehicleSerializer(serializers.ModelSerializer):
    drivers = DriverMiniSerializer(many=True, read_only=True)
    driver_ids = serializers.PrimaryKeyRelatedField(
        source="drivers", many=True, queryset=Driver.objects.all(), write_only=True, required=False
    )
    
    class Meta:
        model = Vehicle
        fields = "__all__"



class BlockedVehicleSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)  # full nested vehicle data
    manipulative_user = UserSerializer(read_only=True)

    class Meta:
        model = BlockedVehicle
        fields = '__all__'  # or list only fields you want exposed


class UnblockVehicleSerializer(serializers.ModelSerializer):
    unblock_reason = serializers.CharField(required=False)

    class Meta:
        model = BlockedVehicle
        fields = ['unblock_reason']
