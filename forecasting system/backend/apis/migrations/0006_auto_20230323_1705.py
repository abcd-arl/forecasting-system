# Generated by Django 3.2.16 on 2023-03-23 17:05

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0005_auto_20230124_1659'),
    ]

    operations = [
        migrations.RenameField(
            model_name='case',
            old_name='skips',
            new_name='dates_to_drop',
        ),
        migrations.RemoveField(
            model_name='case',
            name='start_date',
        ),
        migrations.AddField(
            model_name='case',
            name='model',
            field=models.FileField(default=django.utils.timezone.now, upload_to='models'),
            preserve_default=False,
        ),
    ]
