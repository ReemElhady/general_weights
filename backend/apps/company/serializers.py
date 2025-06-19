from rest_framework import serializers
from .models import EmailSettings,SystemSettings



class EmailSettingsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = EmailSettings
        fields = '__all__'
        
        
        
class SystemSettingsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SystemSettings
        fields = '__all__'
        
        