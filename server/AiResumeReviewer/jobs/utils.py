import google.generativeai as genai
from pypdf import PdfReader
import re

# --- PASTE YOUR REAL API KEY HERE ---
genai.configure(api_key="AIzaSy...PASTE_YOUR_KEY_HERE") 

def extract_text_from_pdf(pdf_file):
    try:
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"PDF Error: {e}")
        return ""

def get_ai_match_score(resume_text, job_requirements):
    # Use the VALID model name:
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are an HR Recruiter. 
    JOB REQUIREMENTS: {job_requirements}
    CANDIDATE RESUME: {resume_text}
    
    TASK:
    1. Compare the resume against the requirements.
    2. Give a match score from 0 to 100.
    3. Write a 2-sentence summary.
    
    OUTPUT FORMAT:
    SCORE: [number]
    SUMMARY: [text]
    """
    
    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        # Safe extraction logic
        score_match = re.search(r'SCORE:\s*(\d+)', text_response, re.IGNORECASE)
        if score_match:
            score = int(score_match.group(1))
        else:
            score = 0 

        if "SUMMARY:" in text_response:
            summary = text_response.split("SUMMARY:")[1].strip()
        else:
            summary = "AI analysis completed."
            
        return score, summary
        
    except Exception as e:
        print(f"AI FAILURE: {e}")
        return 0, "AI analysis failed."