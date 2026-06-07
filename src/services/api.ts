const API_BASE_URL = 'http://localhost:8000/api';

export interface ParsedData {
  name: string;
  email: string;
  phone: string;
  links: string[];
  skills_count: number;
  experience_count: number;
  projects_count: number;
  education: string;
  experience: string;
  projects: string;
  skills: string;
  certifications: string;
  summary: string;
}

export interface AnalysisScores {
  ats_score: number;
  strength_score: number;
  skills_score: number;
  formatting_score: number;
  keyword_score: number;
  readiness_score: number;
}

export interface KeywordAnalysis {
  detected: string[];
  missing: string[];
  domain: string;
}

export interface Recommendation {
  title: string;
  description: string;
  current: string;
  better: string;
}

export interface SectionBreakdownItem {
  subject: string;
  A: number;
}

export interface AnalysisReport {
  success: boolean;
  filename: string;
  parsed_data: ParsedData;
  scores: AnalysisScores;
  section_breakdown: SectionBreakdownItem[];
  analysis: {
    strengths: string[];
    weaknesses: string[];
  };
  keywords: KeywordAnalysis;
  skills_match: {
    Frontend: number;
    Backend: number;
    Database: number;
    DevOps: number;
    DataScience: number;
    ProductManagement: number;
  };
  recommendations: Recommendation[];
}

export interface ComparisonReport {
  success: boolean;
  resume1: {
    name: string;
    filename: string;
    ats_score: number;
    strength_score: number;
    skills_score: number;
    formatting_score: number;
    keyword_score: number;
    skills_count: number;
    projects_count: number;
    experience_count: number;
    keywords: string[];
    strengths: string[];
    weaknesses: string[];
  };
  resume2: {
    name: string;
    filename: string;
    ats_score: number;
    strength_score: number;
    skills_score: number;
    formatting_score: number;
    keyword_score: number;
    skills_count: number;
    projects_count: number;
    experience_count: number;
    keywords: string[];
    strengths: string[];
    weaknesses: string[];
  };
}

export interface InterviewReadinessReport {
  success: boolean;
  readiness_score: number;
  strengths: string[];
  weaknesses: string[];
  mock_questions: string[];
}

// Fallback Mock Data for Frontend-only Sandbox execution
export const MOCK_ANALYSIS: AnalysisReport = {
  success: true,
  filename: "john_doe_resume.pdf",
  parsed_data: {
    name: "Alex Mercer",
    email: "alex.mercer@devmail.com",
    phone: "+1 (555) 019-2834",
    links: ["github.com/alexmercer", "linkedin.com/in/alexmercer"],
    skills_count: 12,
    experience_count: 3,
    projects_count: 2,
    education: "B.S. in Computer Science - Stanford University (2018 - 2022)",
    experience: "Software Engineer at TechCorp (2022 - Present)\n- Built microservices and user dashboards.\n- Handled high throughput data systems.",
    projects: "E-Commerce Microservices Platform\n- Created backend logic with Node and PostgreSQL.\nResumeIQ Portfolio\n- Structured React Frontend with Framer Motion.",
    skills: "React, Node.js, Python, JavaScript, TypeScript, PostgreSQL, MongoDB, Docker, Git, REST APIs, HTML5, CSS3",
    certifications: "AWS Certified Developer Associate (2023)",
    summary: "Dedicated Software Engineer with 2+ years of experience crafting beautiful frontend dashboards and scalable backend microservices. Highly proficient in JavaScript, TypeScript, and Python."
  },
  scores: {
    ats_score: 84,
    strength_score: 85,
    skills_score: 80,
    formatting_score: 90,
    keyword_score: 82,
    readiness_score: 78
  },
  section_breakdown: [
    { subject: "Summary", A: 85 },
    { subject: "Skills", A: 80 },
    { subject: "Projects", A: 85 },
    { subject: "Experience", A: 90 },
    { subject: "Education", A: 95 }
  ],
  analysis: {
    strengths: [
      "Strong technical stack with diverse frontend and backend libraries",
      "Good experience progression from top universities and workplaces",
      "Clean formatting and layout utilizing readable sections",
      "Effective deployment of standard contact and professional details"
    ],
    weaknesses: [
      "Missing critical DevOps tools like Kubernetes and CI/CD tools",
      "Several project summaries lack measurable business metrics",
      "Action verbs in early job descriptions are relatively passive (e.g. 'handled')",
      "Summary could be rewritten to focus more on quantified achievements"
    ]
  },
  keywords: {
    detected: ["React", "Python", "JavaScript", "Node.js", "TypeScript", "PostgreSQL", "Docker", "REST APIs"],
    missing: ["AWS", "CI/CD", "Kubernetes", "Redis", "GraphQL", "Jest", "Tailwind CSS"],
    domain: "Fullstack / Backend"
  },
  skills_match: {
    Frontend: 85,
    Backend: 80,
    Database: 75,
    DevOps: 50,
    DataScience: 40,
    ProductManagement: 30
  },
  recommendations: [
    {
      title: "Add quantifiable achievements",
      description: "Recruiters and ATS systems look for measurable accomplishments. Show what value your actions drove.",
      current: "Built a portfolio website.",
      better: "Built a portfolio website that increased recruiter engagement by 40%."
    },
    {
      title: "Specify tech stack details",
      description: "Be explicit about the technologies you used on each job and project rather than summarizing generically.",
      current: "Worked on the backend of the ecommerce app.",
      better: "Architected the backend of the ecommerce app using Node.js, Express, and PostgreSQL, reducing query latency by 35%."
    },
    {
      title: "Use powerful action verbs",
      description: "Lead your bullets with dynamic verbs that prove your leadership and developer agency.",
      current: "Responsible for maintaining code quality.",
      better: "Streamlined code quality standards by implementing automated unit testing, lowering error rates by 22%."
    }
  ]
};

export const MOCK_COMPARISON: ComparisonReport = {
  success: true,
  resume1: {
    name: "Alex Mercer (Original)",
    filename: "alex_resume_v1.pdf",
    ats_score: 68,
    strength_score: 65,
    skills_score: 60,
    formatting_score: 75,
    keyword_score: 72,
    skills_count: 6,
    projects_count: 1,
    experience_count: 1,
    keywords: ["JavaScript", "HTML", "CSS", "React"],
    strengths: ["Clean formatting", "Valid contact details"],
    weaknesses: ["Missing backend credentials", "No metrics", "Too brief"]
  },
  resume2: {
    name: "Alex Mercer (Optimized)",
    filename: "alex_resume_v2.pdf",
    ats_score: 87,
    strength_score: 85,
    skills_score: 85,
    formatting_score: 95,
    keyword_score: 90,
    skills_count: 14,
    projects_count: 3,
    experience_count: 3,
    keywords: ["React", "TypeScript", "Node.js", "Docker", "AWS", "REST APIs", "CI/CD"],
    strengths: ["Strong technical verbs", "Quantified achievements", "Rich projects"],
    weaknesses: ["Could add more specific certifications"]
  }
};

export const MOCK_INTERVIEW: InterviewReadinessReport = {
  success: true,
  readiness_score: 76,
  strengths: [
    "Diverse engineering portfolio spanning frontend and backend microservices",
    "Familiar with standard containerization technologies like Docker",
    "Solid academic computer science foundation from a top university"
  ],
  weaknesses: [
    "No explicit mentions of system architecture scaling or large traffic management",
    "Fewer details on collaborative agile sprints or leading junior developers"
  ],
  mock_questions: [
    "Explain the virtual DOM in React. What are the key performance optimizations in React 18?",
    "How do you handle state management across large application trees? Compare Context API, Redux, and Zustand.",
    "Describe how you would design a database schema to handle high-frequency writes while maintaining consistency.",
    "You listed Docker in your resume. How would you design a CI/CD pipeline to deploy a containerized app to AWS?",
    "Can you describe a time when you had to learn a completely new technology under a tight deadline?"
  ]
};

export const analyzeResume = async (file: File, targetDomain?: string): Promise<AnalysisReport> => {
  const formData = new FormData();
  formData.append('file', file);
  if (targetDomain) {
    formData.append('target_domain', targetDomain);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Analysis failed on server');
    }
    return await response.json();
  } catch (error) {
    console.warn("Backend offline, falling back to mock data.", error);
    // Add small delay to mimic network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      ...MOCK_ANALYSIS,
      filename: file.name
    };
  }
};

export const compareResumes = async (file1: File, file2: File): Promise<ComparisonReport> => {
  const formData = new FormData();
  formData.append('resume1', file1);
  formData.append('resume2', file2);

  try {
    const response = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Comparison failed on server');
    }
    return await response.json();
  } catch (error) {
    console.warn("Backend offline, falling back to mock data.", error);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      ...MOCK_COMPARISON,
      resume1: { ...MOCK_COMPARISON.resume1, filename: file1.name },
      resume2: { ...MOCK_COMPARISON.resume2, filename: file2.name }
    };
  }
};

export const getInterviewReadiness = async (file: File): Promise<InterviewReadinessReport> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/interview-readiness`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Interview readiness fetch failed');
    }
    return await response.json();
  } catch (error) {
    console.warn("Backend offline, falling back to mock data.", error);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return MOCK_INTERVIEW;
  }
};
