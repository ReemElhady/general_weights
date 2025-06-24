from django.db import models

# Create your models here.

class EmailSettings(models.Model):
    email_host = models.CharField(max_length=255,default='smtp.gmail.com') 
    email_port = models.IntegerField(default=587) 
    email_host_user = models.EmailField()
    email_host_password = models.TextField()
    recipient_email = models.EmailField() 
    use_tls = models.BooleanField(default=True)

    def __str__(self):
        return f"Email Settings for {self.email_host_user}"




class SystemSettings(models.Model):
    company_name = models.CharField(max_length=250, null=True, blank=True)
    company_logo = models.FileField(upload_to='logo/', null=True, blank=True)
    manipulation_threshold  = models.DecimalField(max_digits=10, decimal_places=3, default=0.000)
    start_ticket_number = models.CharField(default=0,unique=True)
    payment_type = models.CharField(max_length=50)
    weighing_method = models.CharField(max_length=50,choices=[
        ("manual", "Manual"),
    ("auto", "Automatic"),])
    weighing_unit = models.CharField(max_length=50,choices=[
        ('kg', 'Kilogram'),
        ('ton', 'Ton'),], default='kg')
        

    def __str__(self):
        return self.company_name if self.company_name else "System Settings"
    
    