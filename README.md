# ResumeIQ AI 🚀
### Next-Gen AI-Powered Resume Analyzer & Interview Prep Coach

ResumeIQ AI is a premium, startup-grade SaaS web application designed to evaluate engineering and professional resumes. It parses resume files (PDF, DOCX, TXT), evaluates ATS scoring vectors, detects missing industry keywords, offers structural layout audits, and simulates interview screenings with interactive STAR coaching templates.

---

## 🌟 Key Features

1. **AI Parsing & Information Extraction**:
   - High-fidelity parsing of PDFs, DOCX, and TXT files.
   - Extracts contact markers, links, summaries, and divides content into key structural fields.
2. **ATS Grading Index**:
   - Calculates overall ATS compatibility alongside sub-scores for Formatting, Skills, Keyword Density, and Section Completion.
3. **Keyword Matching Directory**:
   - Highlights detected keywords vs missing requirements optimized across job domains (Frontend, Backend, DevOps, Data Science, Databases, Product Management).
4. **Radar Score Breakdown**:
   - Visualizes quality ratings of Resume Sections (Summary, Skills, Projects, Experience, Education) using interactive Recharts.
5. **AI Suggestions & Rewrites**:
   - Provides concrete "Current" vs "Optimized Rewrite" examples showing how to inject active verbs and metrics.
6. **Side-by-Side Comparison**:
   - Compares two resume versions side-by-side to highlight score improvements and keyword additions.
7. **AI Interview Prep Coach**:
   - Grades your interview readiness and generates mock prompts with structural STAR templates.

---

## 📷 Visual Previews

### 1. Landing Hero Page
![Landing Hero](./Screenshot%202026-06-07%20121049.png)

### 2. Analysis Dashboard
![Analysis Dashboard](./Screenshot%202026-06-07%20121237.png)

### 3. Interview Readiness Coach
![Interview Coach](./Screenshot%202026-06-07%20121244.png)

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **Backend**: Python FastAPI, Uvicorn, PyPDF, Python-docx, Pydantic, Regular Expressions.

---

## 📂 Project Structure

```text
resume-analyser/
├── backend/
│   ├── api/                     # API routes config
│   ├── parser/                  # PDF/DOCX parsing logics
│   │   └── resume_parser.py
│   ├── ats_engine/              # Scoring calculators
│   │   └── scoring.py
│   ├── keyword_engine/          # Domain keyword directories
│   │   └── extractor.py
│   ├── recommendation_engine/   # Rewrite suggestions
│   │   └── advisor.py
│   ├── requirements.txt         # Backend dependencies
│   └── main.py                  # FastAPI server entry point
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable glassmorphic UI elements
│   │   │   ├── Button.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ProgressRing.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/                   # Application views
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Compare.tsx
│   │   └── Interview.tsx
│   ├── services/
│   │   └── api.ts               # API queries & mock data fallbacks
│   ├── App.tsx                  # Core app router
│   ├── index.css                # Custom neon and grid CSS styles
│   └── main.tsx
├── tailwind.config.js           # Accent palettes and glass variables
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Backend Installation & Bootup
1. Create a Python Virtual Environment:
   ```bash
   python -m venv .venv
   ```
2. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```bash
     source .venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Start the FastAPI server on port `8000`:
   ```bash
   python -m uvicorn main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
   ```

### 2. Frontend Installation & Bootup
1. Install Node modules:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 🛡️ Verification & Testing
- To build the frontend bundle for production, run:
  ```bash
  npm run build
  ```
- The backend contains mock API configurations inside `src/services/api.ts` that will gracefully execute local sandbox demos if the FastAPI server is offline.
