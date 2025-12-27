from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    applicant_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'title', 'location', 'description', 'requirements', 'posted_at', 'is_active', 'applicant_count']
        read_only_fields = ['id', 'posted_at', 'is_active', 'applicant_count']

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'job', 'resume', 'applied_at', 'ai_score', 'ai_summary']
        read_only_fields = ['id', 'job', 'applied_at', 'ai_score', 'ai_summary']