from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Job(models.Model):
    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(help_text="Skills for AI to match against")
    posted_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
    @property
    def applicant_count(self):
        if hasattr(self, 'applications'):
            return self.applications.count()
        return 0


class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_applications')
    resume = models.FileField(upload_to='resumes/')
    
    # AI Fields
    resume_text_content = models.TextField(blank=True, null=True)
    ai_score = models.IntegerField(default=0)
    ai_summary = models.TextField(blank=True, null=True)
    
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-ai_score']
        unique_together = ('job', 'candidate')

    def __str__(self):
        return f"{self.candidate} -> {self.job.title}"