# Generated by Django 5.1 on 2024-11-13 19:06

import booking.models.media
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0008_alter_tagtype_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoomImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('media', models.ImageField(upload_to=booking.models.media.room_directory_path, verbose_name='Изображение')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='booking.room', verbose_name='Комната')),
            ],
        ),
    ]
