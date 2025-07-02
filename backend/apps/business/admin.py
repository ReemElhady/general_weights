from django.contrib import admin
from .models import Scale, Client, Item


@admin.register(Scale)
class ScaleAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "connection_type", "status", "ip")
    search_fields = ("name", "manufacturer", "model")
    list_filter = ("connection_type", "status")

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "manager", "phone", "email", "status", "joined_at")
    list_filter = ("status", "joined_at")
    search_fields = ("name", "manager", "email")



@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", 'name', 'sector', 'type')
    list_filter = ('sector', 'type')
    search_fields = ('name',)