from django.urls import path
from . import views

urlpatterns = [
    path("scales/", views.ScaleListCreateAPIView.as_view(), name="scale-list-create"),
    path("scales/<int:pk>/", views.ScaleDetailAPIView.as_view(), name="scale-detail"),
    path(
        "clients/", views.ClientListCreateAPIView.as_view(), name="client-list-create"
    ),
    path(
        "clients/<int:pk>/", views.ClientDetailAPIView.as_view(), name="client-detail"
    ),
    path("items/", views.ItemListCreateAPIView.as_view(), name="item-list-create"),
    path("items/<int:pk>/", views.ItemDetailAPIView.as_view(), name="item-detail"),
]
