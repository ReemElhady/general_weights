from django.db import models


# Create your models here.
class Scale(models.Model):
    CONNECTION_TYPE_CHOICES = [
        ("serial", "Serial"),
        ("tcp", "TCP"),
    ]
    BAUDRATE_CHOICES = [
        (110, "110"),
        (300, "300"),
        (600, "600"),
        (1200, "1200"),
        (2400, "2400"),
        (4800, "4800"),
        (9600, "9600"),
        (14400, "14400"),
        (19200, "19200"),
        (38400, "38400"),
    ]

    BITS_NUMBER_CHOICES = [
        (i, str(i)) for i in [5, 6, 7, 8, 16, 32, 64, 128, 256, 512, 1024]
    ]

    PARITY_CHOICES = [

        ("none", "None"),
        ("even", "Even"),
        ("odd", "Odd"),
        ("mark", "Mark"),
        ("space", "Space"),
    ]

    STOP_BITS_CHOICES = [
        (1, "1"),
        (1.5, "1.5"),
        (2, "2"),
    ]
    FLOW_CONTROL_CHOICES = [
        ("none", "None"),
        ("hardware", "Hardware"),
        ("Xon/Xoff", "Xon/Xoff"),
    ]

    DELAY_CHOICES = [
        (1, "1 "),
        (0.75, "0.75"),
        (0.5, "0.5"),
        (0.25, "0.25"),
        (0.1, "0.1"),
    ]

    SERIAL_PORT_CHOICES = [
        ("COM1", "COM1"),
        ("COM2", "COM2"),
        ("COM3", "COM3"),
        ("COM4", "COM4"),
        ("COM5", "COM5"),
        ("COM6", "COM6"),
    ]

    name = models.CharField(max_length=250)
    manufacturer = models.CharField(max_length=250, null=True, blank=True)
    model = models.CharField(max_length=250, null=True, blank=True)

    front_camera_ip = models.CharField(max_length=100, blank=True, null=True)
    front_camera_port = models.CharField(max_length=100, blank=True, null=True)

    rear_camera_ip = models.CharField(max_length=100, blank=True, null=True)
    rear_camera_port = models.CharField(max_length=100, blank=True, null=True)

    status = models.BooleanField(default=True)

    connection_type = models.CharField(
        max_length=10, choices=CONNECTION_TYPE_CHOICES, default="tcp"
    )

    # TCP Connection
    ip = models.CharField(max_length=250, blank=True, null=True)
    port = models.IntegerField( blank=True, null=True)
    delay = models.FloatField(choices=DELAY_CHOICES, default=0.5, blank=True, null=True)
    bits_number = models.IntegerField(choices=BITS_NUMBER_CHOICES)

    # Serial Connection
    serial_port = models.CharField(
        max_length=10, choices=SERIAL_PORT_CHOICES, blank=True, null=True
    )
    baudrate = models.IntegerField(
        choices=BAUDRATE_CHOICES, default=9600, blank=True, null=True
    )
    parity = models.CharField(
        max_length=10, choices=PARITY_CHOICES, blank=True, null=True
    )
    stop_bits = models.FloatField(choices=STOP_BITS_CHOICES, blank=True, null=True)
    flow_control = models.CharField(
        max_length=20, choices=FLOW_CONTROL_CHOICES, blank=True, null=True
    )

    weight_start_index = models.PositiveIntegerField(null=True, blank=True)
    weight_end_index = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

class Client(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    name = models.CharField(max_length=200)
    manager = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    notes = models.TextField(blank=True, null=True)
    joined_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    SECTOR_CHOICES = [
        ('طيور', 'طيور'),
        ('زراعة', 'زراعة'),
        ('اغنام', 'اغنام'),
    ]

    TYPE_CHOICES = [
        ('حي', 'حي'),
        ('نافق', 'نافق'),
    ]

    name = models.CharField(max_length=100, null=True)
    sector = models.CharField(max_length=10, choices=SECTOR_CHOICES)
    type = models.CharField(max_length=5, choices=TYPE_CHOICES, null=True)

    def __str__(self):
        return f"{self.sector} - {self.type}"
