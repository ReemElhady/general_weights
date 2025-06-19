from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Driver, Vehicle, BlockedVehicle
from .serializers import DriverSerializer, VehicleSerializer, BlockedVehicleSerializer, UnblockVehicleSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from django.utils import timezone


class DriverListCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        driver = get_object_or_404(Driver, pk=pk)
        serializer = DriverSerializer(driver)
        return Response(serializer.data)

    def put(self, request, pk):
        driver = get_object_or_404(Driver, pk=pk)
        serializer = DriverSerializer(driver, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        driver = get_object_or_404(Driver, pk=pk)
        driver.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class VehicleListCreateAPIView(APIView):
    permission_classes = [IsAdminUser]
    # def get_permissions(self):
    #     if self.request.method == "POST":
    #         return [IsAdminUser()]
    #     return [AllowAny()]

    def get(self, request):
        vehicles = Vehicle.objects.all()
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VehicleDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        vehicle = get_object_or_404(Vehicle, pk=pk)
        serializer = VehicleSerializer(vehicle)
        return Response(serializer.data)

    def put(self, request, pk):
        vehicle = get_object_or_404(Vehicle, pk=pk)
        serializer = VehicleSerializer(vehicle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        vehicle = get_object_or_404(Vehicle, pk=pk)
        vehicle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BlockedVehiclesListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicles = BlockedVehicle.objects.filter(
            status="blocked",
            is_blocked=True
        )
        serializer = BlockedVehicleSerializer(vehicles, many=True)
        return Response(serializer.data)


class UnblockVehicleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            vehicle = BlockedVehicle.objects.get(pk=pk)
        except BlockedVehicle.DoesNotExist:
            return Response(
                {"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if not vehicle.is_blocked:
            return Response(
                {"message": "Vehicle is already unblocked"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UnblockVehicleSerializer(data=request.data)
        if serializer.is_valid():
            vehicle.is_blocked = False
            vehicle.status = "unblocked"
            vehicle.unblock_user = request.user
            vehicle.unblock_date = timezone.now()
            vehicle.unblock_reason = serializer.validated_data.get("unblock_reason", "")
            vehicle.save()
            return Response(
                {"message": "Vehicle unblocked successfully"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
