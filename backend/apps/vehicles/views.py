from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Driver
from .serializers import DriverSerializer
from django.shortcuts import get_object_or_404
from rest_framework import permissions


class DriverListCreateAPIView(APIView):
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

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
