# Generated by Django 3.2.16 on 2023-03-26 23:22

from django.db import migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0008_alter_case_model_details'),
    ]

    operations = [
        migrations.AlterField(
            model_name='case',
            name='model_details',
            field=jsonfield.fields.JSONField(null=True),
        ),
    ]
