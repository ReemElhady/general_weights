from django.urls import path
from . import views

urlpatterns = [
    path(
        "drivers/", views.DriverListCreateAPIView.as_view(), name="driver-list-create"
    ),
    path(
        "drivers/<int:pk>/", views.DriverDetailAPIView.as_view(), name="driver-detail"
    ),
]
