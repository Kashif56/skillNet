# Generated by Django 5.1.5 on 2025-02-12 12:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gigs', '0005_gig_tags'),
        ('userProfile', '0003_userprofile_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='swaprequest',
            name='requestor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swap_requests_sent', to='userProfile.userprofile'),
        ),
        migrations.AlterField(
            model_name='swaprequest',
            name='responder',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swap_requests_received', to='userProfile.userprofile'),
        ),
    ]
