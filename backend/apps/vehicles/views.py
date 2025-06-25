from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Driver, Vehicle, BlockedVehicle
from .serializers import DriverSerializer, VehicleSerializer, BlockedVehicleSerializer, UnblockVehicleSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.utils import timezone
from apps.utils.api_filters import apply_search_order_pagination


class DriverListCreateAPIView(APIView):
    def get(self, request):
        drivers = Driver.objects.all()

        result = apply_search_order_pagination(
            queryset=drivers,
            request=request,
            search_fields=['name', 'license'],
            ordering_fields=['id', 'name', 'license', 'license_expiry']
        )

        serializer = DriverSerializer(result['results'], many=True)
        return Response({
            'count': result['count'],
            'total_pages': result['total_pages'],
            'current_page': result['current_page'],
            'results': serializer.data
        })

    def post(self, request):
        serializer = DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverDetailAPIView(APIView):
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

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
        return Response(status=status.HTTP_200_OK)


class VehicleListCreateAPIView(APIView):

    def get(self, request):
        blocked_vehicle_ids = BlockedVehicle.objects.filter(is_blocked=True).values_list('vehicle_id', flat=True)
        vehicles = Vehicle.objects.exclude(id__in=blocked_vehicle_ids)

        result = apply_search_order_pagination(
            queryset=vehicles,
            request=request,
            search_fields=['plate', 'license', 'chassis_number', 'model', 'type'],
            ordering_fields=['id', 'plate', 'license', 'last_inspection_date']
        )
        

        serializer = VehicleSerializer(result['results'], many=True)

        return Response({
            'count': result['count'],
            'total_pages': result['total_pages'],
            'current_page': result['current_page'],
            'results': serializer.data
        })


    def post(self, request):
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VehicleDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

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
        return Response(status=status.HTTP_200_OK)


class BlockedVehiclesListAPIView(APIView):

    def get(self, request):
        queryset = BlockedVehicle.objects.select_related("vehicle").filter(
            status="blocked",
            is_blocked=True
        )


        result = apply_search_order_pagination(
            queryset=queryset,
            request=request,
            search_fields=['vehicle__plate', 'vehicle__license', 'vehicle__chassis_number', 'vehicle__model', 'vehicle__type'],
            ordering_fields=['id', 'vehicle__plate', 'vehicle__license', 'manipulative_date']
        )
        
        serializer = BlockedVehicleSerializer(result['results'], many=True)

        return Response({
            'count': result['count'],
            'total_pages': result['total_pages'],
            'current_page': result['current_page'],
            'results': serializer.data
        })


class UnblockVehicleAPIView(APIView):
    permission_classes = [IsAdminUser]

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
