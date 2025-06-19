from django.urls import path
from . import views

urlpatterns = [
    path("emailsettings/", views.EmailSettingsView.as_view(), name="emailsettings-list-create"),
    path("emailsettings/<int:pk>/", views.EmailSettingsDetail.as_view(), name="emailsettings-detail"),
    
    
    path("systemsettings/", views.SystemSettingsView.as_view(), name="systemsettings-list-create"),
    path("systemsettings/<int:pk>/", views.SystemSettingsDetail.as_view(), name="systemsettings-detail"),
]
