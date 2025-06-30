from django.contrib import admin
from .models import Ticket
from .models import PrintTemplate


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'ticket_number', 'ticket_type', 'vehicle', 'driver', 'item', 'first_weight',
        'second_weight', 'net_weight', 'is_completed', 'created_at'
    )
    list_filter = ('ticket_type', 'is_completed', 'created_at')
    search_fields = ('ticket_number', 'vehicle__plate', 'driver__name', 'item__name', 'notes')
    readonly_fields = ('net_weight', 'created_at')


@admin.register(PrintTemplate)
class PrintTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'content_type', 'is_default']
    search_fields = ['name']
