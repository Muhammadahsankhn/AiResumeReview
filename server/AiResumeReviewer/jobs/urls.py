from django.urls import path
from .views import (
    RecruiterJobView, 
    RecruiterJobDetailView, 
    PublicJobListView,  # <--- NEW: For candidates to see jobs
    ApplyJobView,        # <--- NEW: For candidates to upload resumes
    JobApplicantsView
)

urlpatterns = [
    # ==============================
    # 1. RECRUITER ENDPOINTS (For Dashboard)
    # ==============================
    
    # Get my jobs / Post a new job
    path('my-jobs/', RecruiterJobView.as_view(), name='recruiter-jobs'),
    
    # Delete a specific job (e.g., jobs/my-jobs/5/)
    path('my-jobs/<int:pk>/', RecruiterJobDetailView.as_view(), name='recruiter-job-detail'),


    # List all active jobs (No login required)
    path('public/', PublicJobListView.as_view(), name='public-jobs'),
    
    # Apply to a specific job (e.g., jobs/5/apply/) - Requires Token
    path('<int:pk>/apply/', ApplyJobView.as_view(), name='apply-job'),


    path('<int:pk>/applicants/', JobApplicantsView.as_view()),,
]