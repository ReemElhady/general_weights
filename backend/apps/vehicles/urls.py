from django.urls import path
from . import views

urlpatterns = [
    path(
        "drivers/", views.DriverListCreateAPIView.as_view(), name="driver-list-create"
    ),
    path(
        "drivers/<int:pk>/", views.DriverDetailAPIView.as_view(), name="driver-detail"
    ),
    path(
        "",
        views.VehicleListCreateAPIView.as_view(),
        name="vehicle-list-create",
    ),
    path(
        "<int:pk>/",
        views.VehicleDetailAPIView.as_view(),
        name="vehicle-detail",
    ),
    path(
        "blocked/",
        views.BlockedVehiclesListAPIView.as_view(),
        name="vehicles-blocked",
    ),
    path(
        "<int:pk>/unblock/",
        views.UnblockVehicleAPIView.as_view(),
        name="vehicle-unblock",
    ),
]
