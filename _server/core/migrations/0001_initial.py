# Generated by Django 5.0.3 on 2025-04-27 00:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Household',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.TextField()),
                ('lastName', models.TextField()),
                ('addressLine1', models.TextField()),
                ('addressLine2', models.TextField()),
                ('city', models.TextField()),
                ('state', models.CharField(max_length=2)),
                ('zip', models.IntegerField()),
                ('country', models.TextField()),
                ('email', models.EmailField(max_length=254)),
                ('cellPhone', models.IntegerField()),
                ('workPhone', models.IntegerField()),
                ('Notes', models.TextField()),
                ('household', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.household')),
            ],
        ),
    ]
