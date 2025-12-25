from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add this field
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    # (Optional) You can add the role field now too if you want
    ROLE_CHOICES = (
        ('candidate', 'Candidate'),
        ('recruiter', 'Recruiter'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')

    def __str__(self):
        return self.username