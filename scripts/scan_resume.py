import sys
import json
import warnings
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

warnings.filterwarnings("ignore")

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())

def calculate_match(resume_text, job_desc):
    clean_resume = clean_text(resume_text)
    clean_job = clean_text(job_desc)

    # 1. Cosine Similarity
    documents = [clean_resume, clean_job]
    tfidf = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    tfidf_matrix = tfidf.fit_transform(documents)
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix)[0][1] * 100

    # 2. Keyword Overlap
    feature_names = tfidf.get_feature_names_out()
    job_words = set(clean_job.split())
    significant_job_words = [w for w in job_words if w in feature_names]
    
    if not significant_job_words:
        keyword_score = 0
    else:
        hits = sum(1 for word in significant_job_words if word in clean_resume)
        keyword_score = (hits / len(significant_job_words)) * 100

    # Weighted Average
    final_score = (cosine_sim * 0.4) + (keyword_score * 0.6)
    
    if final_score > 30:
        final_score = min(98, final_score * 1.5 + 15)

    return round(final_score, 1)

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        if not input_data:
            raise ValueError("No input data received")
            
        data = json.loads(input_data)
        
        # FIX: Changed 'resume' to 'resumeText' to match the API route
        resume_text = data.get('resumeText', '') 
        job_desc = data.get('jobDesc', '')
        
        score = calculate_match(resume_text, job_desc)
        
        print(json.dumps({"success": True, "score": score}))
        
    except Exception as e:
        # Print error in JSON format so Node can parse it
        print(json.dumps({"success": False, "error": str(e)}))