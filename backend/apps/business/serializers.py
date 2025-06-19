from rest_framework import serializers
from .models import Scale, Client, Item


class ScaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scale
        fields = "__all__"

    def validate(self, data):
        connection_type = data.get("connection_type", None)

        # لو بتعمل update، و connection_type مش موجود في data (يعني ماتبعتش)، خده من الـ instance
        if connection_type is None and self.instance:
            connection_type = self.instance.connection_type

        # TCP → امنع بيانات السيريال
        if connection_type == "tcp":
            serial_fields = [
                "serial_port",
                "baudrate",
                "parity",
                "stop_bits",
                "flow_control",
            ]
            for field in serial_fields:
                if data.get(field) not in [None, "", 0]:  # القيمة مش فاضية
                    raise serializers.ValidationError(
                        {
                            field: f"Field '{field}' is not allowed when connection_type is TCP."
                        }
                    )

        # Serial → امنع بيانات TCP
        elif connection_type == "serial":
            tcp_fields = ["ip", "port"]
            for field in tcp_fields:
                if data.get(field) not in [None, "", 0]:
                    raise serializers.ValidationError(
                        {
                            field: f"Field '{field}' is not allowed when connection_type is Serial."
                        }
                    )

        return data


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"
