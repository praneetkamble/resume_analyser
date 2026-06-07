import re
from typing import Dict, List, Any

RECOMMENDATIONS_POOL = {
    "quantifiable": {
        "title": "Add quantifiable achievements",
        "description": "Recruiters and ATS engines favor metrics. Quantifying your impact shows exactly what value you brought to your team.",
        "current": "Built a portfolio website.",
        "better": "Built a portfolio website that increased recruiter engagement by 40%."
    },
    "tech_stack": {
        "title": "Specify tech stack details",
        "description": "Instead of general descriptions, specify exactly what tools and languages you used to complete a project.",
        "current": "Worked on the backend of the ecommerce app.",
        "better": "Architected the backend of the ecommerce app using FastAPI, PostgreSQL, and Redis, boosting query speed by 35%."
    },
    "weak_verbs": {
        "title": "Use powerful action verbs",
        "description": "Avoid passive phrasing like 'assisted in' or 'responsible for'. Lead with strong verbs that assert ownership.",
        "current": "Responsible for maintaining code quality.",
        "better": "Streamlined code quality standards by implementing unit testing, reducing bug rates by 22%."
    },
    "devops_cloud": {
        "title": "Incorporate cloud and deployment skills",
        "description": "Even for developers, having deployment, Docker, or CI/CD skills demonstrates an understanding of the full lifecycle.",
        "current": "Deployed app online.",
        "better": "Containerized the application using Docker and set up a CI/CD pipeline with GitHub Actions to deploy on AWS ECS."
    },
    "summary_pitch": {
        "title": "Write a results-focused summary",
        "description": "Your summary should hook recruiters within 6 seconds. Emphasize years of experience, core stacks, and major achievements.",
        "current": "Software developer looking for a job in a cool company.",
        "better": "Performance-driven Software Engineer with 3+ years of experience building scalable web apps. Proven track record of improving latency by 35% and leading cross-functional teams."
    }
}

def generate_recommendations(parsed_data: Dict[str, Any], target_domain: str) -> List[Dict[str, str]]:
    recommendations = []
    raw_text_lower = parsed_data.get("raw_text", "").lower()
    
    # Heuristic 1: Metrics check
    has_metrics = len(re.findall(r'\b\d+%\b|\b\$\d+|\b\d+\s*(?:million|thousand|users|clients|recruits|percent|x)\b', raw_text_lower)) > 0
    if not has_metrics:
        recommendations.append(RECOMMENDATIONS_POOL["quantifiable"])
        
    # Heuristic 2: Weak verbs check
    weak_words = ["assisted", "helped", "worked on", "responsible for", "duties included", "participated"]
    has_weak_verbs = any(w in raw_text_lower for w in weak_words)
    if has_weak_verbs:
        recommendations.append(RECOMMENDATIONS_POOL["weak_verbs"])
        
    # Heuristic 3: Tech details check
    # If the text has too few occurrences of brackets or specific database terms, or is very brief
    if len(parsed_data.get("projects", "")) > 10 and "using" not in raw_text_lower and "built with" not in raw_text_lower:
        recommendations.append(RECOMMENDATIONS_POOL["tech_stack"])
        
    # Heuristic 4: DevOps/Cloud check for developers
    if target_domain in ["Frontend", "Backend", "Database"] and not any(cloud in raw_text_lower for cloud in ["aws", "gcp", "azure", "docker", "kubernetes", "ci/cd"]):
        recommendations.append(RECOMMENDATIONS_POOL["devops_cloud"])
        
    # Heuristic 5: Summary check
    if not parsed_data.get("summary", "").strip() or len(parsed_data.get("summary", "")) < 30:
        recommendations.append(RECOMMENDATIONS_POOL["summary_pitch"])
        
    # Ensure we return at least 3 recommendations
    if len(recommendations) < 3:
        for key, rec in RECOMMENDATIONS_POOL.items():
            if rec not in recommendations:
                recommendations.append(rec)
            if len(recommendations) == 3:
                break
                
    return recommendations
