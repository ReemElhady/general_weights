from rest_framework import serializers
from .models import Ticket
from apps.business.serializers import ClientSerializer, ItemSerializer
from apps.vehicles.serializers import VehicleSerializer, DriverSerializer

class TicketSerializer(serializers.ModelSerializer):
    customer = ClientSerializer(read_only=True)
    driver = DriverSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    item = ItemSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
