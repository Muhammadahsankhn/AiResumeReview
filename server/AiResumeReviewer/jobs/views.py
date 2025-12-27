from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer

# --- IMPORT AI UTILS ---
from .utils import extract_text_from_pdf, get_ai_match_score

# ==========================================
# 1. RECRUITER VIEWS (Dashboard Logic)
# ==========================================

class RecruiterJobView(generics.ListCreateAPIView):
    """
    GET: List all jobs posted by the logged-in recruiter.
    POST: Create a new job.
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only jobs belonging to the current user
        return Job.objects.filter(recruiter=self.request.user).order_by('-posted_at')

    def perform_create(self, serializer):
        # Auto-assign the recruiter field
        serializer.save(recruiter=self.request.user)


class RecruiterJobDetailView(generics.RetrieveDestroyAPIView):
    """
    DELETE: Delete a specific job (Only if you own it).
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only delete their own jobs
        return Job.objects.filter(recruiter=self.request.user)


# ==========================================
# 2. CANDIDATE VIEWS (Public & Apply)
# ==========================================

class PublicJobListView(generics.ListAPIView):
    """
    GET: List all active jobs for the 'Find Jobs' page.
    (Accessible to everyone, even guests)
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Job.objects.filter(is_active=True).order_by('-posted_at')


class ApplyJobView(generics.CreateAPIView):
    """
    POST: Upload a resume to apply for a job.
    This triggers the AI Resume Analysis.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser] # Required for File Uploads

    def perform_create(self, serializer):
        # 1. Get the Job ID from the URL
        job_id = self.kwargs['pk']
        job = get_object_or_404(Job, id=job_id)
        
        # 2. Get the uploaded PDF
        # 'resume' must match the key used in React's FormData
        uploaded_file = self.request.FILES['resume'] 
        
        # --- START AI PROCESSING ---
        ai_score = 0
        ai_summary = "AI processing failed or file unreadable."

        try:
            # A. Extract Text from PDF
            resume_text = extract_text_from_pdf(uploaded_file)
            
            # B. Send to Gemini for Scoring
            if resume_text:
                score, summary = get_ai_match_score(resume_text, job.requirements)
                ai_score = score
                ai_summary = summary
        except Exception as e:
            print(f"AI Error: {e}")

        # --- SAVE APPLICATION ---
        # We save the Candidate, Job, AND the calculated AI results
        serializer.save(
            candidate=self.request.user,
            job=job,
            ai_score=ai_score,
            ai_summary=ai_summary
        )





class JobApplicantsView(generics.ListAPIView):
    """
    GET: List all candidates who applied for a SPECIFIC Job.
    Only the Recruiter who posted the job can see this.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_id = self.kwargs['pk'] # Get job_id from URL
        job = get_object_or_404(Job, id=job_id)

        # SECURITY CHECK: Ensure the logged-in user owns this job
        if job.recruiter != self.request.user:
            return Application.objects.none() # Return nothing if they don't own it

        # Return applications for this job, sorted by AI score
        return Application.objects.filter(job=job).order_by('-ai_score')