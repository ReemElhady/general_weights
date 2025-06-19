from django.shortcuts import render
from rest_framework import viewsets
from .models import Scale
from .serializers import ScaleSerializer


# Create your views here.


class viewsets_scale(viewsets.ModelViewSet):
    queryset = Scale.objects.all()
    serializer_class = ScaleSerializer
    
