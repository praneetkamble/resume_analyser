import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, GraduationCap, ShieldCheck, HelpCircle, Sparkles, ChevronDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { getInterviewReadiness } from '../services/api';
import type { InterviewReadinessReport, AnalysisReport } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import ProgressRing from '../components/ui/ProgressRing';

interface InterviewProps {
  globalReport: AnalysisReport | null;
}

export const Interview: React.FC<InterviewProps> = ({ globalReport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [report, setReport] = useState<InterviewReadinessReport | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-load interview coach metrics if a resume has already been parsed on the dashboard!
  useEffect(() => {
    if (globalReport) {
      setLoading(true);
      setLoadingStatus("Retrieving dashboard metrics...");
      
      const fetchReadinessForDashboard = async () => {
        try {
          // Generate realistic scores based on already loaded parameters
          const skillsCount = globalReport.parsed_data.skills_count;
          const expCount = globalReport.parsed_data.experience_count;
          const score = globalReport.scores.readiness_score;
          
          // Mimic api call latency
          await new Promise(r => setTimeout(r, 1000));
          
          // Standard mock data customized to dashboard
          const strengths = [
            `Detailed experience records including ${globalReport.parsed_data.projects_count} major projects.`,
            `Exposure to core domains like ${globalReport.keywords.domain}.`,
            "Clean layout structure enables easy behavioral referencing."
          ];
          
          const weaknesses = [];
          if (skillsCount < 10) weaknesses.push("Fewer total listed tools; may face depth questions on core technologies.");
          if (expCount < 2) weaknesses.push("Limited corporate tenure; prepare to draw heavily on self-led projects.");
          if (weaknesses.length === 0) weaknesses.push("Ensure you practice quantified system scaling metrics in response verbalizations.");

          const mockQuestions = [
            globalReport.keywords.detected.length > 0
              ? `You listed ${globalReport.keywords.detected.slice(0, 3).join(', ')}. What are the design trade-offs of using these in a large application?`
              : "Walk me through the main tools and technologies you have used, and why you chose them for your projects.",
            "Describe a challenging bug you encountered in one of your projects and the steps you took to debug it.",
            "Tell me about a time when you had to prioritize multiple conflicting features under tight deadlines.",
            "How do you ensure code maintainability and team alignment when working in agile sprints?"
          ];

          setReport({
            success: true,
            readiness_score: score,
            strengths,
            weaknesses,
            mock_questions: mockQuestions
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchReadinessForDashboard();
    } else {
      setReport(null);
      setFile(null);
    }
  }, [globalReport]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const triggerAssessment = async () => {
    if (!file) return;
    setLoading(true);
    
    const statuses = [
      "Analyzing semantic patterns...",
      "Scrubbing professional highlights...",
      "Simulating recruiter vetting behaviors...",
      "Structuring potential interview prompts..."
    ];

    for (let i = 0; i < statuses.length; i++) {
      setLoadingStatus(statuses[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      const res = await getInterviewReadiness(file);
      setReport(res);
    } catch (e) {
      console.error(e);
      alert("Assessment failed. Verify file parameters.");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  const handleReset = () => {
    setReport(null);
    setFile(null);
  };

  // Helper for mock answer coaching based on STAR technique
  const getSTARCoaching = (question: string) => {
    if (question.toLowerCase().includes("bug") || question.toLowerCase().includes("challenge")) {
      return {
        situation: "State the project context, scale, and why the bug was blocking critical paths.",
        task: "Explain your responsibility: finding the root cause under a deadline.",
        action: "Outline the technical debugging tools (logs, profiles, breakpoints) you implemented.",
        result: "State that the bug was resolved, boosting system performance by X% or preventing data loss."
      };
    }
    if (question.toLowerCase().includes("prioritize") || question.toLowerCase().includes("conflict")) {
      return {
        situation: "Describe a project scope where resource constraints or stakeholder preferences conflicted.",
        task: "Explain your role: coordinating priorities without hurting delivery morale.",
        action: "Outline using data-driven tools: agile backlogs, customer feedback metrics, or trade-off grids.",
        result: "State that a consensus was reached, shipping on time with 100% stakeholder buy-in."
      };
    }
    return {
      situation: "Set up the professional background context: what team were you on, and what was the deliverable?",
      task: "Clarify the target: what problem needed to be resolved or what goal achieved?",
      action: "Detail your specific technical contributions: use action verbs (architected, refactored, coordinated).",
      result: "Conclude with quantifiable impact: speed, user adoption, clean codebase, or team efficiency gains."
    };
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full px-4 py-8 md:px-8 max-w-7xl mx-auto z-20">
      <AnimatePresence mode="wait">
        {!report ? (
          /* ================= UPLOAD/STANDBY SECTION ================= */
          <motion.div
            key="interview-upload"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto text-center flex flex-col justify-center min-h-[500px]"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-poppins font-bold text-white flex items-center justify-center gap-2">
                <GraduationCap className="w-8 h-8 text-neonGreen animate-bounce" /> AI Interview Prep Coach
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Gain insight into how technical recruiters will inspect your profile. Upload your resume to calculate your interview readiness grade and get tailored mock prompts.
              </p>
            </div>

            <GlassCard className="p-8 border border-white/5 flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[200px] rounded-xl border-2 border-dashed border-white/10 hover:border-neonGreen/30 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-6"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-white font-medium">Click to upload your resume</span>
                <span className="text-xs text-gray-500 mt-1">Or return to the <span className="text-neonGreen underline">Analyzer</span> to run a full analysis first.</span>
              </div>

              {file && !loading && (
                <Button variant="primary" fullWidth onClick={triggerAssessment} className="mt-6">
                  Begin Coaching Prep
                </Button>
              )}

              {loading && (
                <div className="w-full flex flex-col items-center justify-center py-6 mt-4">
                  <div className="relative w-10 h-10 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-neonGreen animate-spin" />
                    <Sparkles className="w-4 h-4 text-neonGreen animate-pulse" />
                  </div>
                  <span className="text-xs text-gray-300 font-poppins animate-pulse">
                    {loadingStatus}
                  </span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ) : (
          /* ================= COACHING REPORT ================= */
          <motion.div
            key="interview-coaching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3 text-left">
                {!globalReport && (
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl glass-panel border border-white/5 hover:border-neonGreen/30 hover:text-neonGreen text-gray-400 transition-all"
                  >
                    <ArrowLeft className="w-4.5 h-4.5" />
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold font-poppins text-white flex items-center gap-2">
                    AI Interview Preparation Coach
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">Based on parsed skills and portfolio complexity.</p>
                </div>
              </div>

              {globalReport && (
                <span className="px-3 py-1.5 rounded-xl bg-neonGreen/10 border border-neonGreen/20 text-xs font-semibold text-neonGreen font-mono">
                  LINKED TO ANALYZER
                </span>
              )}
            </div>

            {/* Score and Strengths */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Readiness Score Circle */}
              <GlassCard className="p-8 border border-white/5 flex flex-col items-center justify-center">
                <ProgressRing score={report.readiness_score} size={200} label="READINESS INDEX" />
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold font-poppins text-white">Interview Ready</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Your profile indicates strong alignment with typical market technical screenings.
                  </p>
                </div>
              </GlassCard>

              {/* Strengths & Weaknesses list */}
              <GlassCard className="p-6 border border-white/5 text-left lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold font-poppins text-white border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-neonGreen" /> Screening Profiler
                  </h3>

                  <div className="space-y-4">
                    {/* Strengths */}
                    <div>
                      <span className="text-xs text-neonGreen font-semibold uppercase tracking-wider font-poppins">Interview Strengths</span>
                      <ul className="mt-2 space-y-2">
                        {report.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-neonGreen shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="border-t border-white/5 pt-3">
                      <span className="text-xs text-red-400 font-semibold uppercase tracking-wider font-poppins">Potential Weak Points</span>
                      <ul className="mt-2 space-y-2">
                        {report.weaknesses.map((wk, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Tailored Mock Questions (Interactive accordion) */}
            <GlassCard className="p-6 border border-white/5 text-left">
              <h3 className="text-base font-bold font-poppins text-white border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-neonGreen" /> Custom Mock Interview Prompts
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Recruiters are likely to ask these questions based on your specific keywords. Click on each prompt to reveal an AI STAR-structure answering template.
              </p>

              <div className="space-y-4">
                {report.mock_questions.map((q, idx) => {
                  const isExpanded = expandedQuestion === idx;
                  const star = getSTARCoaching(q);
                  
                  return (
                    <div
                      key={idx}
                      className="border border-white/5 rounded-xl overflow-hidden bg-white/2 hover:border-white/10 transition-all"
                    >
                      <button
                        onClick={() => toggleQuestion(idx)}
                        className="w-full p-4 flex items-center justify-between text-left gap-4 transition-all"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-white font-poppins flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-neonGreen/10 border border-neonGreen/20 text-neonGreen flex items-center justify-center font-mono text-xs font-bold">{idx + 1}</span>
                          {q}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180 text-neonGreen' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-white/5"
                          >
                            <div className="p-4 bg-black/20 text-xs text-gray-300 space-y-3 font-inter">
                              <div className="flex items-center gap-1.5 text-neonGreen font-semibold font-poppins text-xs">
                                <Sparkles className="w-3.5 h-3.5 text-neonGreen" /> STAR Formulation Coaching:
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 font-mono text-[10px]">
                                <div className="p-2.5 rounded bg-white/2 border border-white/5">
                                  <span className="text-gray-400 font-bold block mb-1">SITUATION (CONTEXT):</span>
                                  <span className="text-gray-300">{star.situation}</span>
                                </div>
                                <div className="p-2.5 rounded bg-white/2 border border-white/5">
                                  <span className="text-gray-400 font-bold block mb-1">TASK (OBJECTIVE):</span>
                                  <span className="text-gray-300">{star.task}</span>
                                </div>
                                <div className="p-2.5 rounded bg-white/2 border border-white/5">
                                  <span className="text-gray-400 font-bold block mb-1">ACTION (YOUR WORK):</span>
                                  <span className="text-gray-300">{star.action}</span>
                                </div>
                                <div className="p-2.5 rounded bg-white/2 border border-white/5">
                                  <span className="text-gray-400 font-bold block mb-1">RESULT (METRIC MET):</span>
                                  <span className="text-gray-300">{star.result}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interview;
