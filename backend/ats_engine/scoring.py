import re
from typing import Dict, List, Any, Tuple

# Common active verbs to detect
ACTION_VERBS = {
    'led', 'managed', 'designed', 'developed', 'implemented', 'architected', 'optimized',
    'collaborated', 'delivered', 'improved', 'created', 'built', 'spearheaded', 'executed',
    'increased', 'decreased', 'reduced', 'maximized', 'transformed', 'formulated'
}

# Weak verbs/passive language to flag
WEAK_VERBS = {
    'assisted', 'helped', 'worked on', 'responsible for', 'duties included', 'participated',
    'attempted', 'served as', 'handled'
}

def analyze_formatting(parsed_data: Dict[str, Any]) -> Tuple[int, List[str], List[str]]:
    """
    Evaluates resume formatting and returns formatting score, strengths, and weaknesses.
    """
    score = 100
    strengths = []
    weaknesses = []
    
    # 1. Contact info check
    has_email = parsed_data.get("email") != "Not Found"
    has_phone = parsed_data.get("phone") != "Not Found"
    has_links = len(parsed_data.get("links", [])) > 0
    
    if has_email and has_phone:
        strengths.append("Complete contact information (Email and Phone found)")
    else:
        score -= 15
        weaknesses.append("Missing essential contact details (Email or Phone number)")
        
    if has_links:
        strengths.append("Included professional profiles (GitHub/LinkedIn/Portfolio links)")
    else:
        score -= 10
        weaknesses.append("No professional links (LinkedIn or GitHub) detected")
        
    # 2. Section presence check
    sections_present = []
    sections_missing = []
    
    for sect in ["experience", "education", "skills", "projects"]:
        if parsed_data.get(sect, "").strip():
            sections_present.append(sect.title())
        else:
            sections_missing.append(sect.title())
            
    if not sections_missing:
        strengths.append("Well-structured with all essential sections present")
    else:
        score -= len(sections_missing) * 15
        weaknesses.append(f"Missing core section(s): {', '.join(sections_missing)}")
        
    # 3. Resume length check (based on raw text size)
    raw_text = parsed_data.get("raw_text", "")
    words = len(raw_text.split())
    
    if 300 <= words <= 1000:
        strengths.append("Optimal word count (300 - 1000 words)")
    elif words < 200:
        score -= 15
        weaknesses.append("Resume is too brief (under 200 words), lacking depth")
    else:
        score -= 10
        weaknesses.append("Resume is overly verbose (over 1000 words), consider condensing")
        
    # 4. Bullet points and descriptions checks
    bullet_count = len(re.findall(r'^[•\-\*]|\s{2,}[•\-\*]', raw_text, re.MULTILINE))
    if bullet_count >= 8:
        strengths.append("Excellent use of bullet points for readability")
    elif bullet_count > 0:
        score -= 5
        weaknesses.append("Limited bullet point usage; block paragraphs reduce readability")
    else:
        score -= 15
        weaknesses.append("No bullet points detected; raw paragraphs make it hard for ATS to parse")
        
    # Adjust score to fit 0-100 range
    score = max(30, min(100, score))
    
    # Ensure there's always at least something to show
    if not strengths:
        strengths = ["Proper layout size", "Structured headers"]
    if not weaknesses:
        weaknesses = ["Include more industry-standard abbreviations"]
        
    return score, strengths, weaknesses

def evaluate_ats_scores(parsed_data: Dict[str, Any], keyword_data: Dict[str, Any], skill_percentages: Dict[str, int]) -> Dict[str, Any]:
    # 1. Formatting Score
    formatting_score, formatting_strengths, formatting_weaknesses = analyze_formatting(parsed_data)
    
    # 2. Skill Score
    # Evaluated based on total number of unique technical skills extracted
    skills_count = parsed_data.get("skills_count", 0)
    if skills_count >= 15:
        skills_score = 95
    elif skills_count >= 8:
        skills_score = 80
    elif skills_count >= 4:
        skills_score = 60
    else:
        skills_score = 40
        
    # 3. Keyword Optimization Score
    detected_kw = keyword_data.get("detected", [])
    missing_kw = keyword_data.get("missing", [])
    total_kw = len(detected_kw) + len(missing_kw)
    if total_kw > 0:
        kw_score = int((len(detected_kw) / total_kw) * 100)
        # Give it a baseline
        kw_score = max(35, min(100, kw_score + 10))
    else:
        kw_score = 50
        
    # 4. Resume Strength Score
    # Combines education, project counts, and experience depth
    exp_count = parsed_data.get("experience_count", 0)
    proj_count = parsed_data.get("projects_count", 0)
    cert_text = parsed_data.get("certifications", "")
    
    strength_factors = 0
    if exp_count >= 3:
        strength_factors += 35
    elif exp_count >= 1:
        strength_factors += 25
    else:
        strength_factors += 10
        
    if proj_count >= 2:
        strength_factors += 35
    elif proj_count >= 1:
        strength_factors += 20
    else:
        strength_factors += 5
        
    if cert_text.strip():
        strength_factors += 20
    else:
        strength_factors += 5
        
    if len(parsed_data.get("summary", "")) > 30:
        strength_factors += 10
        
    strength_score = max(30, min(100, strength_factors))
    
    # 5. Overall ATS Score
    # Weighted average of components
    overall_ats_score = int(
        (formatting_score * 0.25) +
        (skills_score * 0.25) +
        (kw_score * 0.30) +
        (strength_score * 0.20)
    )
    overall_ats_score = max(10, min(100, overall_ats_score))
    
    # Section breakdowns (for radar chart)
    # Summary, Skills, Projects, Experience, Education
    sections_breakdown = {
        "Summary": 90 if len(parsed_data.get("summary", "")) > 50 else (50 if parsed_data.get("summary", "") else 0),
        "Skills": skills_score,
        "Projects": 90 if proj_count >= 3 else (70 if proj_count >= 1 else 0),
        "Experience": 95 if exp_count >= 3 else (75 if exp_count >= 1 else 0),
        "Education": 95 if parsed_data.get("education", "").strip() else 0
    }
    
    # Ensure they have realistic minimums if sections are present
    for k in sections_breakdown:
        if sections_breakdown[k] == 0:
            # Check if there is some text there
            txt_key = k.lower()
            if parsed_data.get(txt_key, "").strip():
                sections_breakdown[k] = 60
                
    # Compile Strengths & Weaknesses
    all_strengths = []
    all_weaknesses = []
    
    # Technical skills check
    if skills_score >= 80:
        all_strengths.append("Strong technical skills matching industry standards")
    else:
        all_weaknesses.append("Sparse technical skills listing; add more specific tools and frameworks")
        
    # Project & Experience
    if proj_count >= 2:
        all_strengths.append("Good project descriptions showcasing practical application")
    if exp_count >= 2:
        all_strengths.append("Solid career progression shown in experience section")
    else:
        all_weaknesses.append("Limited professional experience; focus on detailed projects and internships")
        
    # Add formatting checks
    all_strengths.extend(formatting_strengths[:2])
    all_weaknesses.extend(formatting_weaknesses[:2])
    
    # Verbs / Measurable metrics checks
    raw_text_lower = parsed_data.get("raw_text", "").lower()
    
    # Check for measurable metrics (percentages, numbers like $50k, 10x, 20% etc.)
    has_metrics = len(re.findall(r'\b\d+%\b|\b\$\d+|\b\d+\s*(?:million|thousand|users|clients|recruits|percent|x)\b', raw_text_lower)) > 0
    if has_metrics:
        all_strengths.append("Effective use of quantifiable metrics to measure achievements")
    else:
        all_weaknesses.append("Insufficient measurable impact; quantify accomplishments with percentages, dollars, or metrics")
        
    # Action verbs check
    found_action_verbs = [v for v in ACTION_VERBS if re.search(r'\b' + v + r'\b', raw_text_lower)]
    found_weak_verbs = [v for v in WEAK_VERBS if re.search(r'\b' + v + r'\b', raw_text_lower)]
    
    if len(found_action_verbs) >= 5:
        all_strengths.append("Strong deployment of action-oriented verbs")
    else:
        all_weaknesses.append("Weak action verbs used; replace passive language (e.g. 'helped', 'worked on') with punchy action verbs")
        
    # Ensure lists are not empty and keep only top items
    all_strengths = list(set(all_strengths))
    all_weaknesses = list(set(all_weaknesses))
    
    if not all_strengths:
        all_strengths = ["Proper section divisions", "Valid contact format"]
    if not all_weaknesses:
        all_weaknesses = ["Add more technical descriptors", "Include certifications to boost authority"]
        
    return {
        "ats_score": overall_ats_score,
        "strength_score": strength_score,
        "skills_score": skills_score,
        "formatting_score": formatting_score,
        "keyword_score": kw_score,
        "section_breakdown": [
            {"subject": "Summary", "A": sections_breakdown["Summary"]},
            {"subject": "Skills", "A": sections_breakdown["Skills"]},
            {"subject": "Projects", "A": sections_breakdown["Projects"]},
            {"subject": "Experience", "A": sections_breakdown["Experience"]},
            {"subject": "Education", "A": sections_breakdown["Education"]}
        ],
        "strengths": all_strengths[:4],
        "weaknesses": all_weaknesses[:4]
    }
