# Generated by Django 5.1 on 2024-12-31 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0011_remove_object_user_favorites_favorite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favorite',
            name='date_end',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='favorite',
            name='date_start',
            field=models.DateField(blank=True, null=True),
        ),
    ]
