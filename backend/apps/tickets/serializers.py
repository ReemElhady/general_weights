from rest_framework import serializers
from .models import Ticket, PrintTemplate
from apps.business.serializers import ClientSerializer, ItemSerializer, ScaleSerializer
from apps.vehicles.serializers import VehicleSerializer, DriverSerializer

class TicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        fields = '__all__'


class TicketReadSerializer(serializers.ModelSerializer):
    customer = ClientSerializer(read_only=True)
    driver = DriverSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    item = ItemSerializer(read_only=True)
    scale = ScaleSerializer(read_only=True) 
    class Meta:
        model = Ticket
        fields = '__all__'

class PrintSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintTemplate
        fields = ['id', 'name', 'is_default']