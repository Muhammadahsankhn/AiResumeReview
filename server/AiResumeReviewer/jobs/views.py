# jobs/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Job, Application
from .forms import ApplicationForm
from django.db.models import F # Import F for complex queries if needed

# IMPORT YOUR NEW UTILS
from .utils import extract_text_from_pdf, get_ai_match_score

def job_list(request):
    jobs = Job.objects.all()
    return render(request, 'jobs/job_list.html', {'jobs': jobs})

@login_required
def apply_for_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    
    if request.method == 'POST':
        form = ApplicationForm(request.POST, request.FILES)
        if form.is_valid():
            application = form.save(commit=False)
            application.job = job
            application.candidate = request.user
            
            # --- START AI PROCESSING ---
            try:
                # 1. Get the uploaded file from the form
                uploaded_file = request.FILES['resume_file']
                
                # 2. Extract Text
                resume_text = extract_text_from_pdf(uploaded_file)
                application.resume_text_content = resume_text # Save text to DB
                
                # 3. Get AI Score
                score, summary = get_ai_match_score(resume_text, job.requirements)
                
                # 4. Save results to DB
                application.ai_match_percentage = score
                application.ai_summary = summary
                
            except Exception as e:
                print(f"Error processing resume: {e}")
                # We save it anyway, even if AI fails (score will be 0)
            
            application.save()
            # --- END AI PROCESSING ---
            
            return redirect('job_list')
    else:
        form = ApplicationForm()
    
    return render(request, 'jobs/apply.html', {'form': form, 'job': job})





@login_required
def hr_dashboard(request):
    """
    Shows only the jobs posted by the CURRENT logged-in HR user.
    """
    # Check if user is HR (optional but good security)
    # if not request.user.is_recruiter: return redirect('home')
    
    my_jobs = Job.objects.filter(recruiter=request.user)
    return render(request, 'jobs/hr_dashboard.html', {'jobs': my_jobs})

@login_required
def job_applicants(request, job_id):
    """
    Shows all applicants for a specific job.
    Handles the 'Sort by AI' button logic.
    """
    job = get_object_or_404(Job, id=job_id, recruiter=request.user)
    applications = job.applications.all() # Get all applicants
    
    # CHECK: Did the user click the 'Sort' button?
    sort_type = request.GET.get('sort')
    
    if sort_type == 'ai_score':
        # Sort by Score (High to Low)
        applications = applications.order_by('-ai_match_percentage')
    else:
        # Default: Sort by newest first
        applications = applications.order_by('-applied_at')

    return render(request, 'jobs/applicants.html', {
        'job': job, 
        'applications': applications
    })