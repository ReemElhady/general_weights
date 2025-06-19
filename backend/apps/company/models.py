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

    def __str__(self):
        return "System Configuration"