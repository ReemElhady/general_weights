import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
# import oracledb  ← لو هتشغّل Oracle شيل التعليق

# # تهيئة Oracle client
# oracledb.init_oracle_client(lib_dir=r"D:\oracle\instantclient_11_2")  

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')  # ← تأكد أن "config" هو اسم فولدر الإعدادات فعلاً
django.setup()

# استيراد WebSocket Consumer
from apps.business.websok import ScaleConsumer  # ← تأكد أن المسار والاسم صح

# تعريف التطبيق
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
        path("ws/scale/", ScaleConsumer.as_asgi()),  # WebSocket endpoint
    ]),
})
