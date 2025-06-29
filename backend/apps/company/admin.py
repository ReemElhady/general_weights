from django.contrib import admin
from .models import EmailSettings , SystemSettings
# Register your models here.
@admin.register(EmailSettings)
class EmailSettingsAdmin(admin.ModelAdmin):
    list_display = ("email_host", "email_port", "email_host_user", "recipient_email", "use_tls")
    search_fields = ("email_host", "email_host_user", "recipient_email")
    list_filter = ("use_tls",)

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ("company_name", "payment_type", "start_ticket_number", "weighing_method", "weighing_unit", "manipulation_threshold")
    search_fields = ("company_name", "payment_type", "weighing_method", "weighing_unit")
#     list_filter = ("connection_type", "status")

