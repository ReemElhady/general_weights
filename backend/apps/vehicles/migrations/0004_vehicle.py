# Generated by Django 5.2.3 on 2025-06-18 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0003_driver_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plate', models.CharField(max_length=10)),
                ('license', models.CharField(max_length=14)),
                ('chassis_number', models.CharField(blank=True, max_length=50, null=True)),
                ('model', models.CharField(blank=True, max_length=100, null=True)),
                ('type', models.CharField(blank=True, max_length=100, null=True)),
                ('capacity', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('last_inspection_date', models.DateField(blank=True, null=True)),
                ('license_weight', models.DecimalField(blank=True, decimal_places=3, max_digits=10, null=True)),
                ('first_weight', models.DecimalField(blank=True, decimal_places=3, default=0, max_digits=10, null=True)),
                ('total_weight_operations', models.IntegerField(blank=True, default=0, null=True)),
                ('status', models.CharField(blank=True, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active', max_length=8, null=True)),
                ('notes', models.CharField(blank=True, max_length=250, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
    ]
