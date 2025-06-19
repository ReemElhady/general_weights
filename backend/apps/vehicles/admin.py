from django.contrib import admin
from .models import Driver


# Register your models here.
@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ["name", "license"]
    search_fields = ["name", "license"]
