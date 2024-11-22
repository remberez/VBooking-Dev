# Generated by Django 5.1 on 2024-11-22 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_fellowtraveler_sex_alter_user_sex'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(error_messages={'unique': 'Данная почта занята.'}, max_length=254, unique=True, verbose_name='Почта'),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, error_messages={'unique': 'Данный номер телефона занят.'}, null=True, unique=True, verbose_name='Номер телефона'),
        ),
    ]
