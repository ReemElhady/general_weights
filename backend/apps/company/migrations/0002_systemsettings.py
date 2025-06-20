# Generated by Django 5.2.3 on 2025-06-19 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SystemSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(blank=True, max_length=250, null=True)),
                ('company_logo', models.FileField(blank=True, null=True, upload_to='logo/')),
                ('manipulation_threshold', models.DecimalField(decimal_places=3, default=0.0, max_digits=10)),
            ],
        ),
    ]
