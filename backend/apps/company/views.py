from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import EmailSettings,SystemSettings
from .serializers import EmailSettingsSerializer,SystemSettingsSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated

# Create your views here.

class EmailSettingsView(APIView):
    
    def get(self,request):
        emailsettings = EmailSettings.objects.all()
        serializer = EmailSettingsSerializer(emailsettings , many = True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = EmailSettingsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

class EmailSettingsDetail(APIView):
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get(self,request,pk):
        emailsetting = get_object_or_404(EmailSettings,pk=pk)
        serializer = EmailSettingsSerializer(emailsetting , many = False)
        return Response(serializer.data)
    
    def put(self,request,pk):
        emailsetting = get_object_or_404(EmailSettings,pk=pk)
        serializer = EmailSettingsSerializer(emailsetting , data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        emailsetting = get_object_or_404(EmailSettings,pk=pk)
        emailsetting.delete()
        return Response(status=status.HTTP_200_OK)
        

class SystemSettingsView(APIView):
    def get(self,request):
        systemsettings = SystemSettings.objects.all()
        serializer = SystemSettingsSerializer(systemsettings,many = True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = SystemSettingsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status=status.HTTP_201_CREATED)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
    
    
class SystemSettingsDetail(APIView):
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    
    def get(self,request,pk):
        systemsettings = get_object_or_404(SystemSettings ,pk=pk)
        serializer = SystemSettingsSerializer(systemsettings , many=False)
        return Response(serializer.data)
    
    def put(self,request,pk):
        systemsettings = get_object_or_404(SystemSettings,pk=pk)
        serializer = SystemSettingsSerializer(systemsettings , data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        systemsettings = get_object_or_404(SystemSettings,pk=pk)
        systemsettings.delete()
        return Response(status=status.HTTP_200_OK)
        