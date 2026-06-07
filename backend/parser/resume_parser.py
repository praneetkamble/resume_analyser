import re
import io
from pypdf import PdfReader
from docx import Document
from typing import Dict, List, Any

# Regular Expressions for Contact Info
EMAIL_REGEX = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
PHONE_REGEX = re.compile(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
LINK_REGEX = re.compile(r'(?:https?://)?(?:www\.)?(?:linkedin\.com/in/|github\.com/)[\w\.-]+|portfolio:?\s*(?:https?://)?[\w\.-]+\.\w+')

# Section Heading Markers
SECTION_MARKERS = {
    'summary': ['summary', 'profile', 'objective', 'professional summary', 'about me'],
    'experience': ['experience', 'work experience', 'employment history', 'professional experience', 'employment'],
    'education': ['education', 'academic background', 'academic history', 'academic qualification'],
    'projects': ['projects', 'academic projects', 'personal projects', 'key projects'],
    'skills': ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise'],
    'certifications': ['certifications', 'licenses', 'certifications & awards', 'awards', 'courses']
}

def clean_text(text: str) -> str:
    # Replace non-breaking spaces and clean whitespace
    text = text.replace('\xa0', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_pdf(file_bytes: bytes) -> str:
    pdf = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def parse_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                text += cell.text + " "
            text += "\n"
    return text

def parse_txt(file_bytes: bytes) -> str:
    try:
        return file_bytes.decode('utf-8')
    except UnicodeDecodeError:
        return file_bytes.decode('latin-1', errors='ignore')

def extract_text(file_bytes: bytes, filename: str) -> str:
    ext = filename.split('.')[-1].lower()
    if ext == 'pdf':
        return parse_pdf(file_bytes)
    elif ext in ['docx', 'doc']:
        return parse_docx(file_bytes)
    elif ext == 'txt':
        return parse_txt(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def extract_contact_info(text: str) -> Dict[str, Any]:
    emails = EMAIL_REGEX.findall(text)
    phones = PHONE_REGEX.findall(text)
    links = LINK_REGEX.findall(text)
    
    email = emails[0] if emails else None
    phone = phones[0] if phones else None
    
    # Heuristic for Name: Search first 4 lines that aren't empty and don't contain email/phone
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    name = None
    for line in lines[:5]:
        # Skip line if it contains contact details
        if EMAIL_REGEX.search(line) or PHONE_REGEX.search(line) or "github.com" in line.lower() or "linkedin.com" in line.lower():
            continue
        # Skip if it is too long (likely a summary or sentence) or too short
        words = line.split()
        if len(words) >= 2 and len(words) <= 5:
            # Check if capitalized
            if all(w[0].isupper() for w in words if w.isalpha()):
                name = line
                break
    
    # Fallback to first line if no neat name found
    if not name and lines:
        name = lines[0]
        
    return {
        "name": name or "Unknown Candidate",
        "email": email or "Not Found",
        "phone": phone or "Not Found",
        "links": list(set(links))
    }

def segment_resume(text: str) -> Dict[str, str]:
    """
    Segments the resume into standard sections by finding headers.
    """
    lines = text.split('\n')
    sections = {k: [] for k in SECTION_MARKERS.keys()}
    sections['general'] = []
    
    current_section = 'general'
    
    for line in lines:
        cleaned_line = line.strip()
        if not cleaned_line:
            continue
            
        # Check if line looks like a header (short, capitalized, matches marker)
        is_header = False
        if len(cleaned_line) < 40:
            lower_line = cleaned_line.lower()
            # Remove punctuation and numbers to match markers
            stripped_line = re.sub(r'[^a-z\s]', '', lower_line).strip()
            
            for section, markers in SECTION_MARKERS.items():
                if stripped_line in markers or any(m == stripped_line for m in markers) or (len(stripped_line) > 3 and any(stripped_line.startswith(m) or stripped_line.endswith(m) for m in markers)):
                    current_section = section
                    is_header = True
                    break
        
        if not is_header:
            sections[current_section].append(cleaned_line)
            
    # Join the lists into strings
    return {k: "\n".join(v) for k, v in sections.items()}

def parse_resume(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    raw_text = extract_text(file_bytes, filename)
    contact = extract_contact_info(raw_text)
    segmented = segment_resume(raw_text)
    
    # Estimate counts of projects and experience entries
    # A project or experience is usually marked by bullet points, dates (e.g. 2021 - 2023), or specific titles
    experience_text = segmented.get('experience', '')
    projects_text = segmented.get('projects', '')
    education_text = segmented.get('education', '')
    certifications_text = segmented.get('certifications', '')
    
    # Count experiences: look for years like 2020, 2021, 'Present', etc.
    year_pattern = re.compile(r'\b(19\d{2}|20\d{2})\b|present', re.IGNORECASE)
    exp_entries = len(set(year_pattern.findall(experience_text)))
    if exp_entries == 0 and len(experience_text.strip()) > 50:
        # Fallback heuristic based on paragraphs or bullet counts
        bullets = len(re.findall(r'^[•\-\*]|\s{2,}[•\-\*]', experience_text, re.MULTILINE))
        exp_entries = max(1, bullets // 3)
    else:
        exp_entries = max(1, exp_entries)

    # Count projects: search for headings or bullets
    project_bullets = len(re.findall(r'^[•\-\*]|\s{2,}[•\-\*]', projects_text, re.MULTILINE))
    proj_entries = max(1, project_bullets // 2) if projects_text.strip() else 0
    if proj_entries == 0 and len(projects_text.strip()) > 30:
        proj_entries = 1

    # Extract skills: we can scan for words and comma-separated elements in the skills section
    skills_text = segmented.get('skills', '')
    skills_list = []
    if skills_text:
        # Split by commas, semicolons, bullets, newlines, and bars
        parts = re.split(r'[,;\n•|]|\s{2,}', skills_text)
        for part in parts:
            cleaned_part = re.sub(r'^[•\-\*\s]+', '', part).strip()
            # Filter out category titles (e.g. "Languages:")
            if cleaned_part and not cleaned_part.endswith(':') and len(cleaned_part) < 30:
                skills_list.append(cleaned_part)
    
    return {
        "name": contact["name"],
        "email": contact["email"],
        "phone": contact["phone"],
        "links": contact["links"],
        "skills_count": len(skills_list),
        "skills_raw": skills_list,
        "experience_count": exp_entries if experience_text.strip() else 0,
        "projects_count": proj_entries,
        "education": education_text.strip(),
        "experience": experience_text.strip(),
        "projects": projects_text.strip(),
        "skills": skills_text.strip(),
        "certifications": certifications_text.strip(),
        "summary": segmented.get('summary', '').strip(),
        "raw_text": raw_text
    }
