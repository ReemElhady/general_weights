# import socket
# import asyncio
# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
# import re


# SCALE_IP = '192.168.1.50'
# SCALE_PORT = 30


# def clean_data(data):
#     # تجاهل الرموز غير الطباعة
#     printable = ''.join(c for c in data if c.isprintable())
#     parts = printable.split()
#     numbers = []
#     for part in parts:
#         digits = ''.join([c for c in part if c.isdigit() or c == '.'])
#         if digits:
#             numbers.append(digits)
#     if numbers:
#         selected = numbers[1]
#     else:
#         return None

#     digits_only = ''.join([c for c in selected if c.isdigit()])
#     if not digits_only:
#         return None

#     if len(digits_only) <= 4:
#         weight = int(digits_only) / 10
#     else:
#         weight = int(digits_only) / 100
#     return weight

# def clean_data(data):
#     # استخرج الجزء اللي يحتوي على الرقم فقط باستخدام تعبير منتظم
#     # نبحث عن أول رقم مع احتمال وجود نقطة وعشرية بعدها
#     match = re.search(r'[-+]?[0]*([0-9]+(\.[0-9]+)?)', data)
#     if not match:
#         return None

#     number_str = match.group(1)

#     # لو الرقم هو "0" أو "0.0" أو زي كده، رجع 0.0 مباشرة
#     if float(number_str) == 0:
#         return 0.0

#     # رجع الرقم بعد إزالة الأصفار اليسارية
#     # float يحول الرقم بطريقة تلقائية سليمة
#     return float(number_str)


# class ScaleConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         print("IP WebSocket connected")
#         self.keep_reading = True

#         self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#         self.sock.settimeout(2)
#         try:
#             self.sock.connect((SCALE_IP, SCALE_PORT))
#         except Exception as e:
#             await self.send(text_data=json.dumps({'error': f'فشل الاتصال: {str(e)}'}))
#             await self.close()
#             return

#         # شغل اللوب اللي يقرأ بيانات الوزن
#         asyncio.create_task(self.send_weight_loop())

#     async def disconnect(self, close_code):
#         self.keep_reading = False
#         # اقفل السوكيت لما يتقطع الاتصال
#         if hasattr(self, 'sock'):
#             try:
#                 self.sock.close()
#             except Exception:
#                 pass

#     async def send_weight_loop(self):
#         while self.keep_reading:
#             try:
#                 data = self.sock.recv(1024)
#                 raw_data = data.decode().strip()
#                 print("Raw data from scale:", raw_data)

#                 cleaned_weight = clean_data(raw_data)
#                 print("Cleaned weight:", cleaned_weight)

#                 if cleaned_weight and cleaned_weight < 0:
#                     await self.send(text_data=json.dumps({'error': 'وزن غير صالح'}))
#                 else:
#                     await self.send(text_data=json.dumps({'weight': cleaned_weight}))
#             except Exception as e:
#                 await self.send(text_data=json.dumps({'error': str(e)}))
#                 break

#             await asyncio.sleep(0.1)

# def get_weight_from_scale():
#     try:
#         sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#         sock.settimeout(2)
#         sock.connect((SCALE_IP, SCALE_PORT))
#         data = sock.recv(1024)
#         sock.close()
#         cleaned_data = clean_data(data.decode().strip())
#         return float(cleaned_data) if cleaned_data else None
#     except Exception as e:
#         print("Error reading from scale:", e)
#         return None


import os
import django
import asyncio
import json
from enum import Enum, auto
from socket import socket
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Scale
import serial

# Set up Django environment to access models outside of typical Django flow
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scaleProject.settings")
django.setup()


# ----------------- Helper Functions -----------------


# Replace whitespace in the string with '#' and return list of characters
def transform_raw_to_list(data):
    return ["#" if char.isspace() else char for char in data]


# Enum for connection state tracking
class ConnectionState(Enum):
    DISCONNECTED = auto()
    CONNECTING = auto()
    CONNECTED = auto()
    ERROR = auto()


# ----------------- WebSocket Consumer -----------------

# WebSocket consumer to manage scale communication
class ScaleConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.state = ConnectionState.DISCONNECTED  # Initial connection state
        self.reader = None  # TCP reader
        self.writer = None  # TCP writer
        self.ser = None  # Serial object
        self.scale = None  # Scale model instance
        self.DELAY = 0.5  # Delay between reads
        self.NUMBER_OF_BITS = 8  # Bytes to read over TCP

    async def connect(self):
        await self.accept()  # Accept the WebSocket connection
        print("WebSocket connected")

    async def disconnect(self, close_code):
        await self.close_connections()  # Close any open connections
        print("WebSocket disconnected")

    # Close TCP/Serial connections cleanly
    async def close_connections(self):
        self.state = ConnectionState.DISCONNECTED

        if self.writer:
            self.writer.close()
            try:
                await self.writer.wait_closed()
            except Exception:
                pass
            print("TCP connection closed")

        if self.ser and self.ser.is_open:
            try:
                self.ser.flushInput()
                self.ser.flushOutput()
                self.ser.close()
                print("Serial connection closed properly")
            except Exception as e:
                print(f"Error closing serial: {e}")

        # أضف تأخير بسيط للسماح بتحرير المنفذ
        await asyncio.sleep(1.5)

    # Receive WebSocket message from frontend
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)  # Parse incoming JSON
            action = data.get("action")
            scale_id = data.get("scale_id")

            # Check if valid init message
            if action != "init" or not scale_id:
                await self.send_error('يجب إرسال action="init" ومعرف الميزان scale_id')
                return

            # Get scale info from DB using its ID
            try:
                self.scale = await asyncio.to_thread(Scale.objects.get, id=scale_id)
            except Scale.DoesNotExist:
                await self.send_error("الميزان غير موجود")
                return

            # Get settings from DB scale instance
            self.DELAY = self.scale.delay or 0.1
            self.NUMBER_OF_BITS = self.scale.bits_number or 8

            # Close previous connection before starting new one
            await self.close_connections()
            await asyncio.sleep(1.5)
            # Connect via serial or TCP based on scale config
            if self.scale.serial_port:
                await self.connect_serial()
            elif self.scale.ip and self.scale.port:
                await self.connect_tcp()
            else:
                await self.send_error("إعدادات الاتصال غير مكتملة")

        except Exception as e:
            await self.send_error(f"خطأ غير متوقع: {str(e)}")

    # Send an error message back to the client
    async def send_error(self, message):
        await self.send(text_data=json.dumps({"error": message}))

    # Connect to scale via TCP socket
    async def connect_tcp(self):
        try:
            self.state = ConnectionState.CONNECTING
            self.reader, self.writer = await asyncio.open_connection(
                self.scale.ip, self.scale.port
            )
            self.state = ConnectionState.CONNECTED
            print(f"TCP connection established to {self.scale.ip}:{self.scale.port}")
            asyncio.create_task(self.send_weight_loop())  # Start weight reading loop
        except Exception as e:
            self.state = ConnectionState.ERROR
            await self.send_error(f"فشل الاتصال TCP: {str(e)}")

    # Connect to scale via serial port
    async def connect_serial(self):
        import serial.tools.list_ports
        ports = [port.device for port in serial.tools.list_ports.comports()]
        if self.scale.serial_port not in ports:
            await self.send_error("⚠️ لم يتم العثور على المنفذ المتصل بالميزان")
            return

        self.state = ConnectionState.CONNECTING

        # Get serial config from DB or set default
        parity = (
            getattr(serial, f"PARITY_{self.scale.parity.upper()}", serial.PARITY_NONE)
            if self.scale.parity
            else serial.PARITY_NONE
        )
        stopbits = self.scale.stop_bits or serial.STOPBITS_ONE

        for attempt in range(3):
            try:
                print(
                    f"[DEBUG] Attempt {attempt + 1} to open serial port: {self.scale.serial_port}"
                )

                self.ser = serial.Serial(
                    self.scale.serial_port,
                    baudrate=self.scale.baudrate or 9600,
                    bytesize=serial.EIGHTBITS,
                    parity=parity,
                    stopbits=stopbits,
                    timeout=0.1,
                    rtscts=(self.scale.flow_control == "hardware"),
                    xonxoff=(self.scale.flow_control == "Xon/Xoff"),
                )

                print("[DEBUG] Serial port opened successfully.")

                if not self.ser.is_open:
                    raise Exception("فشل فتح منفذ السيريال")

                # Read test data to confirm device is responsive
                test = self.ser.readline()
                if not test:
                    raise Exception("⚠️ الميزان لا يرسل بيانات حالياً")

                self.state = ConnectionState.CONNECTED
                print(f"Serial connection established on {self.scale.serial_port}")
                asyncio.create_task(
                    self.send_serial_weight_loop()
                )  # Start reading loop
                return  # ✅ Exit the loop on success

            except Exception as e:
                print(f"[ERROR] Attempt {attempt + 1} failed: {e}")
                await asyncio.sleep(1.5)

        # If all attempts fail
        self.state = ConnectionState.ERROR
        await self.send_error(
            "⚠️ فشل الاتصال بالسيريال بعد عدة محاولات. برجاء التحقق من توصيل الميزان أو إعادة تشغيل الكابل."
        )

    # Loop to read data from serial and send to WebSocket
    async def send_serial_weight_loop(self):
        buffer = ""

        while self.state == ConnectionState.CONNECTED and self.ser and self.ser.is_open:
            try:
                data = self.ser.read(self.NUMBER_OF_BITS)  # اقرأ عدد بايت ثابت
                if not data:
                    continue

                buffer += data.decode("ascii", errors="ignore")

                if "\x02" in buffer:  # بداية الرسالة
                    parts = buffer.split("\x02")
                    if len(parts) > 1:
                        raw_read = parts[1]

                        # نهاية الرسالة
                        for end_marker in ["# #", "\n", "\r"]:
                            if end_marker in raw_read:
                                raw_read = raw_read.split(end_marker)[0] + end_marker
                                break

                        structured_raw = transform_raw_to_list(raw_read)

                        weight_segment = structured_raw[
                            self.scale.weight_start_index : self.scale.weight_end_index
                        ]
                        weight = "".join(weight_segment)

                        await self.send(
                            text_data=json.dumps(
                                {
                                    "raw": raw_read,
                                    "structured_raw": structured_raw,
                                    "weight": weight,
                                }
                            )
                        )
                        buffer = ""

            except Exception as e:
                await self.send_error(f"خطأ في قراءة البيانات من السيريال: {str(e)}")
                break

            await asyncio.sleep(self.DELAY)

    # Loop to read data from TCP and send to WebSocket
    async def send_weight_loop(self):
        buffer = ""

        while self.state == ConnectionState.CONNECTED and self.reader:
            try:
                data = await self.reader.read(
                    self.NUMBER_OF_BITS
                )  # Read fixed-size chunk
                if not data:
                    break

                buffer += data.decode(errors="ignore")  # Add data to buffer

                if "\x02" in buffer:  # Check for start of data
                    parts = buffer.split("\x02")

                    if len(parts) > 1:
                        raw_read = parts[1].strip()

                        # Look for data end marker
                        for end_marker in ["# #", "\n", "\r"]:
                            if end_marker in raw_read:
                                raw_read = raw_read.split(end_marker)[0] + end_marker
                                break

                        print(f"[TCP] Raw Data: {raw_read}")  # Print raw data

                        structured_raw = transform_raw_to_list(
                            raw_read
                        )  # Convert to list

                        # Extract weight using configured indexes
                        start_index = self.scale.weight_start_index
                        end_index = self.scale.weight_end_index
                        weight_segment = structured_raw[start_index:end_index]
                        weight = "".join(weight_segment)

                        # Prepare data to send to client
                        payload = {
                            "raw": raw_read,
                            "structured_raw": structured_raw,
                            "weight": weight,
                        }

                        await self.send(text_data=json.dumps(payload))

                        buffer = ""  # Reset buffer

            except Exception as e:
                await self.send_error(f"خطأ في قراءة البيانات TCP: {str(e)}")
                break

            await asyncio.sleep(self.DELAY)  # Wait between reads


# import asyncio
# import json
# import re
# import serial
# from channels.generic.websocket import AsyncWebsocketConsumer

# SERIAL_PORT = 'COM3'  # عدلها حسب المنفذ الصحيح عندك
# BAUDRATE = 9600


# # def clean_data(data):
# #     # نجرب ناخد أول رقم عشري في أول 5 أحرف فقط
# #     snippet = data[:5]
# #     match = re.search(r'([0-9]+(\.[0-9]+)?)', snippet)
# #     if match:
# #         return float(match.group(1))
# #     return None


# def clean_data(data):
#     # تجاهل الرموز غير الطباعة
#     printable = ''.join(c for c in data if c.isprintable())
#     parts = printable.split()
#     numbers = []

#     for part in parts:
#         digits = ''.join([c for c in part if c.isdigit() or c == '.'])
#         if digits:
#             numbers.append(digits)

#     if numbers:
#         selected = numbers[1] if len(numbers) > 1 else numbers[0]
#     else:
#         return None

#     try:
#         return float(selected)
#     except ValueError:
#         return None


# class ScaleConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         print("Serial WebSocket connected")
#         self.keep_reading = True

#         try:
#             self.ser = serial.Serial(
#                 SERIAL_PORT,
#                 baudrate=BAUDRATE,
#                 bytesize=serial.EIGHTBITS,
#                 parity=serial.PARITY_NONE,
#                 stopbits=serial.STOPBITS_ONE,
#                 timeout=1
#             )
#             print(f"Serial port {SERIAL_PORT} opened successfully")
#         except Exception as e:
#             await self.send(text_data=json.dumps({'error': f'فشل فتح منفذ السيريال: {str(e)}'}))
#             await self.close()
#             return

#         asyncio.create_task(self.send_weight_loop())

#     async def disconnect(self, close_code):
#         self.keep_reading = False
#         if hasattr(self, 'ser'):
#             try:
#                 self.ser.close()
#             except Exception:
#                 pass

#     async def send_weight_loop(self):
#         while self.keep_reading:
#             try:
#                 data = self.ser.readline()
#                 print("Raw bytes from scale:", data)

#                 raw_data = data.decode('ascii', errors='ignore').strip()
#                 print("Raw data from scale (decoded):", raw_data)

#                 cleaned_weight = clean_data(raw_data)
#                 print("Cleaned weight:", cleaned_weight)

#                 if cleaned_weight is None:
#                     # تجاهل البيانات غير المفهومة أو الفارغة
#                     await asyncio.sleep(0.1)
#                     continue

#                 if cleaned_weight < 0:
#                     await self.send(text_data=json.dumps({'error': 'وزن غير صالح'}))
#                 else:
#                     await self.send(text_data=json.dumps({'weight': cleaned_weight}))

#             except Exception as e:
#                 print(f"Exception in send_weight_loop: {e}")
#                 await self.send(text_data=json.dumps({'error': str(e)}))
#                 break

#             await asyncio.sleep(0.1)
