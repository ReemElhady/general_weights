from rest_framework import routers
from .views import viewsets_scale  
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'scales', viewsets_scale)

urlpatterns = [
    path('', include(router.urls)),
]
