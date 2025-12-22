from django.db import models
from django.conf import settings  # We use this to link to the User model in the other app


class Job(models.Model):
    # Link to the User in the 'accounts' app
    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posted_jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(help_text="Skills for AI to match against")
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='my_applications')
    
    resume_file = models.FileField(upload_to='resumes/')
    
    # AI Fields (Hidden from user, calculated by backend)
    resume_text_content = models.TextField(blank=True, null=True)
    ai_match_percentage = models.IntegerField(default=0)
    ai_summary = models.TextField(blank=True, null=True)
    
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-ai_match_percentage'] # Auto-sort by highest score

    def __str__(self):
        return f"{self.candidate} -> {self.job.title}"