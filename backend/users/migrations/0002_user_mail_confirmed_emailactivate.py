# Generated by Django 5.1 on 2024-10-19 19:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='mail_confirmed',
            field=models.BooleanField(default=False, verbose_name='Почта подтверждена'),
        ),
        migrations.CreateModel(
            name='EmailActivate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=6, verbose_name='Код')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='email_activate', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Активация почты',
                'verbose_name_plural': 'Активация почты',
            },
        ),
    ]
