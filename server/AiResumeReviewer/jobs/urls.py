from django.urls import path
from . import views

urlpatterns = [
    # This is the home page for jobs (http://127.0.0.1:8000/jobs/)
    path('', views.job_list, name='job_list'),
    
    # This is the apply page (e.g., http://127.0.0.1:8000/jobs/apply/1/)
    path('apply/<int:job_id>/', views.apply_for_job, name='apply_job'),

    # --- NEW HR URLS ---
    path('hr_dashboard/', views.hr_dashboard, name='hr_dashboard'),
    path('job/<int:job_id>/applicants/', views.job_applicants, name='job_applicants'),
]