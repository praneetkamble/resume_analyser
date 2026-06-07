from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn

# Import custom engines
from parser.resume_parser import parse_resume
from keyword_engine.extractor import extract_keywords_from_text, analyze_skills_match, get_detected_and_missing_keywords
from ats_engine.scoring import evaluate_ats_scores
from recommendation_engine.advisor import generate_recommendations

app = FastAPI(
    title="ResumeIQ AI - Backend Services",
    description="ATS Engine, Keyword Matcher, Recommendation Advisor, and Interview Prep APIs.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "ResumeIQ AI Backend is running smoothly."}

@app.post("/api/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    target_domain: Optional[str] = Form(None)
):
    try:
        # Read file contents
        content = await file.read()
        filename = file.filename
        
        # 1. Parse resume
        parsed_data = parse_resume(content, filename)
        
        # 2. Extract keywords & skills
        extracted_skills = extract_keywords_from_text(parsed_data["raw_text"])
        
        # Update parsed data with extracted skills
        if extracted_skills:
            parsed_data["skills_raw"] = list(extracted_skills)
            parsed_data["skills_count"] = len(extracted_skills)
            parsed_data["skills"] = ", ".join(list(extracted_skills))
            
        # 3. Analyze Keyword Match & Detected/Missing
        keyword_analysis = get_detected_and_missing_keywords(extracted_skills, target_domain)
        detected_domain = keyword_analysis["target_domain"]
        
        # 4. Analyze Skill Match (percentages for domains)
        skill_percentages = analyze_skills_match(extracted_skills)
        
        # 5. Calculate ATS scores & Strengths/Weaknesses
        ats_results = evaluate_ats_scores(parsed_data, keyword_analysis, skill_percentages)
        
        # 6. Generate Recommendations
        recommendations = generate_recommendations(parsed_data, detected_domain)
        
        # 7. Generate Interview Readiness details (for quick display)
        readiness_score = int((ats_results["strength_score"] * 0.6) + (ats_results["skills_score"] * 0.4))
        # Ensure it fits well
        readiness_score = max(40, min(95, readiness_score + 5))
        
        return {
            "success": True,
            "filename": filename,
            "parsed_data": {
                "name": parsed_data["name"],
                "email": parsed_data["email"],
                "phone": parsed_data["phone"],
                "links": parsed_data["links"],
                "skills_count": parsed_data["skills_count"],
                "experience_count": parsed_data["experience_count"],
                "projects_count": parsed_data["projects_count"],
                "education": parsed_data["education"],
                "experience": parsed_data["experience"],
                "projects": parsed_data["projects"],
                "skills": parsed_data["skills"],
                "certifications": parsed_data["certifications"],
                "summary": parsed_data["summary"]
            },
            "scores": {
                "ats_score": ats_results["ats_score"],
                "strength_score": ats_results["strength_score"],
                "skills_score": ats_results["skills_score"],
                "formatting_score": ats_results["formatting_score"],
                "keyword_score": ats_results["keyword_score"],
                "readiness_score": readiness_score
            },
            "section_breakdown": ats_results["section_breakdown"],
            "analysis": {
                "strengths": ats_results["strengths"],
                "weaknesses": ats_results["weaknesses"]
            },
            "keywords": {
                "detected": keyword_analysis["detected"],
                "missing": keyword_analysis["missing"],
                "domain": detected_domain
            },
            "skills_match": {
                "Frontend": skill_percentages.get("Frontend", 50),
                "Backend": skill_percentages.get("Backend", 50),
                "Database": skill_percentages.get("Database", 50),
                "DevOps": skill_percentages.get("DevOps", 50),
                "DataScience": skill_percentages.get("Data Science", 50),
                "ProductManagement": skill_percentages.get("Product Management", 50)
            },
            "recommendations": recommendations
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.post("/api/compare")
async def compare_resumes_endpoint(
    resume1: UploadFile = File(...),
    resume2: UploadFile = File(...)
):
    try:
        # Parse Resume 1
        content1 = await resume1.read()
        parsed1 = parse_resume(content1, resume1.filename)
        skills1 = extract_keywords_from_text(parsed1["raw_text"])
        kw1 = get_detected_and_missing_keywords(skills1)
        sp1 = analyze_skills_match(skills1)
        score1 = evaluate_ats_scores(parsed1, kw1, sp1)
        
        # Parse Resume 2
        content2 = await resume2.read()
        parsed2 = parse_resume(content2, resume2.filename)
        skills2 = extract_keywords_from_text(parsed2["raw_text"])
        kw2 = get_detected_and_missing_keywords(skills2)
        sp2 = analyze_skills_match(skills2)
        score2 = evaluate_ats_scores(parsed2, kw2, sp2)
        
        return {
            "success": True,
            "resume1": {
                "name": parsed1["name"],
                "filename": resume1.filename,
                "ats_score": score1["ats_score"],
                "strength_score": score1["strength_score"],
                "skills_score": score1["skills_score"],
                "formatting_score": score1["formatting_score"],
                "keyword_score": score1["keyword_score"],
                "skills_count": len(skills1),
                "projects_count": parsed1["projects_count"],
                "experience_count": parsed1["experience_count"],
                "keywords": kw1["detected"][:8],
                "strengths": score1["strengths"][:3],
                "weaknesses": score1["weaknesses"][:3]
            },
            "resume2": {
                "name": parsed2["name"],
                "filename": resume2.filename,
                "ats_score": score2["ats_score"],
                "strength_score": score2["strength_score"],
                "skills_score": score2["skills_score"],
                "formatting_score": score2["formatting_score"],
                "keyword_score": score2["keyword_score"],
                "skills_count": len(skills2),
                "projects_count": parsed2["projects_count"],
                "experience_count": parsed2["experience_count"],
                "keywords": kw2["detected"][:8],
                "strengths": score2["strengths"][:3],
                "weaknesses": score2["weaknesses"][:3]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

@app.post("/api/interview-readiness")
async def interview_readiness_endpoint(
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        parsed = parse_resume(content, file.filename)
        skills = extract_keywords_from_text(parsed["raw_text"])
        kw = get_detected_and_missing_keywords(skills)
        sp = analyze_skills_match(skills)
        scores = evaluate_ats_scores(parsed, kw, sp)
        
        # Dynamic calculation of Readiness Score (0-100)
        # Combine ATS score, strength, and skills count
        readiness = int((scores["ats_score"] * 0.4) + (scores["strength_score"] * 0.4) + (min(100, len(skills) * 5) * 0.2))
        readiness = max(30, min(98, readiness))
        
        # Interview Strengths & Weaknesses
        strengths = []
        weaknesses = []
        mock_questions = []
        
        domain = kw["target_domain"]
        
        # Heuristics based on parsed findings
        if len(skills) >= 10:
            strengths.append("Excellent technical breadth. Prepared for wide-ranging engineering questions.")
            mock_questions.append(f"You listed a wide variety of tools like {', '.join(list(skills)[:3])}. How do you choose the right tool for a given problem?")
        else:
            weaknesses.append("Narrow technical stack. May struggle with questions outside your specific framework.")
            mock_questions.append("Can you describe a time when you had to learn a completely new technology under a tight deadline?")
            
        if parsed["experience_count"] >= 3:
            strengths.append("Substantial work history. Strong pool of situational/behavioral examples to draw from.")
            mock_questions.append("Tell me about a time when you had a conflict with a team member or stakeholder and how you resolved it.")
        else:
            weaknesses.append("Limited workplace experience. Will need to heavily rely on project-based or academic stories.")
            mock_questions.append("How do you manage deadlines and prioritize tasks when working on self-directed projects?")
            
        # Domain-specific mock questions
        if domain == "Frontend":
            strengths.append("Good familiarity with modern UI development pipelines.")
            mock_questions.extend([
                "Explain the virtual DOM in React. What are the key performance optimizations in React 18?",
                "How do you handle state management across large application trees? Compare Context API, Redux, and Zustand.",
                "Describe how you would optimize a web page with a low Google Lighthouse score."
            ])
            weaknesses.append("Lack of database/system architecture experience in key highlights.")
        elif domain == "Backend":
            strengths.append("Understand API principles and backend architectures.")
            mock_questions.extend([
                "How do you design a database schema to handle high-frequency writes while maintaining consistency?",
                "Explain the differences between REST, GraphQL, and gRPC. When would you prefer one over the others?",
                "How do you protect backend endpoints against SQL Injection, XSS, and DDoS attacks?"
            ])
            weaknesses.append("Visual or frontend design experience is missing from current profile.")
        elif domain == "DevOps":
            strengths.append("Familiar with infrastructure automation and orchestration.")
            mock_questions.extend([
                "What is Infrastructure as Code (IaC)? How do you manage state drift in Terraform?",
                "How do you set up a zero-downtime blue-green deployment pipeline in Kubernetes?",
                "Describe a scenario where a production database went down. What debugging steps would you take?"
            ])
            weaknesses.append("Less focus on application-level feature building.")
        else: # Default/Others
            strengths.append("Adaptable generalist skills.")
            mock_questions.extend([
                "What is your approach to system design when building an application from scratch?",
                "Explain how you measure the success of a feature after it has been launched to users.",
                "How do you ensure code readability and maintainability when working in a fast-paced environment?"
            ])
            
        # General readiness strengths
        if len(parsed["projects"]) > 30:
            strengths.append("Hands-on builder. Can talk in-depth about software projects you started.")
            mock_questions.append("If you had to rewrite one of your projects from scratch, what architectural changes would you make and why?")
            
        if not strengths:
            strengths = ["Structured education base", "Has core domain focus"]
        if not weaknesses:
            weaknesses = ["Include more metrics in project descriptions to answer behavioral questions easily"]
            
        return {
            "success": True,
            "readiness_score": readiness,
            "strengths": strengths[:3],
            "weaknesses": weaknesses[:3],
            "mock_questions": mock_questions[:5]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview assessment failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
