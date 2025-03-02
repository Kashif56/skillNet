# Generated by Django 5.1.5 on 2025-02-06 08:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Gig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('gigImage', models.ImageField(blank=True, null=True, upload_to='gig_images/')),
                ('isActive', models.BooleanField(default=True)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('desiredSkills', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='desired_in_gigs', to='core.skill')),
                ('offeredSkills', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offered_in_gigs', to='core.skill')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-createdAt'],
            },
        ),
        migrations.CreateModel(
            name='SwapRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('gig', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swap_requests', to='gigs.gig')),
                ('requestor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swap_requests_sent', to=settings.AUTH_USER_MODEL)),
                ('responder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swap_requests_received', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
