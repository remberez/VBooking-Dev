# Generated by Django 5.1 on 2024-11-12 11:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_mail_confirmed_emailactivate'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='data_of_birth',
            field=models.DateField(blank=True, null=True, verbose_name='Дата рождения'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(default=1, max_length=254, unique=True, verbose_name='Почта'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='patronymic',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Отчество'),
        ),
        migrations.CreateModel(
            name='FellowTraveler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=25, verbose_name='Имя')),
                ('last_name', models.CharField(max_length=25, verbose_name='Фамилия')),
                ('patronymic', models.CharField(blank=True, max_length=25, null=True, verbose_name='Отчество')),
                ('date_of_birth', models.DateField(verbose_name='Дата рождения')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fellow_travelers', to=settings.AUTH_USER_MODEL, verbose_name='Чей попутчик')),
            ],
            options={
                'verbose_name': 'Попутчик',
                'verbose_name_plural': 'Попутчики',
            },
        ),
    ]
