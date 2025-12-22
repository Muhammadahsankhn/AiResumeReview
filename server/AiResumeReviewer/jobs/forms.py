# jobs/forms.py
from django import forms
from .models import Application

class ApplicationForm(forms.ModelForm):
    class Meta:
        model = Application
        # We only want the user to upload the file. 
        # The backend will handle the rest (user ID, job ID, AI score).
        fields = ['resume_file']