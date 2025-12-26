from rest_framework import serializers
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id','title', 'location', 'description', 'requirements', 'posted_at', 'is_active', 'applicant_count']
        read_only_fields = ['id', 'posted_at', 'is_active', 'applicant_count']
        