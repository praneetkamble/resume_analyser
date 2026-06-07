import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, ArrowLeft, 
  Mail, Phone, Link2, Plus, Sparkles, Eye, Briefcase, Award, FolderGit, Check 
} from 'lucide-react';
import { analyzeResume } from '../services/api';
import type { AnalysisReport } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import ProgressRing from '../components/ui/ProgressRing';
import ProgressBar from '../components/ui/ProgressBar';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  initialReport: AnalysisReport | null;
  setGlobalReport: (report: AnalysisReport | null) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialReport, setGlobalReport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetDomain, setTargetDomain] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [report, setReport] = useState<AnalysisReport | null>(initialReport);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initialReport is set externally (e.g. via View Demo)
  React.useEffect(() => {
    if (initialReport) {
      setReport(initialReport);
    }
  }, [initialReport]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ['.pdf', '.docx', '.txt'];
      const fileExt = '.' + droppedFile.name.split('.').pop()?.toLowerCase();
      
      if (validTypes.includes(fileExt)) {
        setFile(droppedFile);
      } else {
        alert("Please upload only PDF, DOCX, or TXT files.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
  };

  const triggerAnalysis = async () => {
    if (!file) return;
    setLoading(true);
    
    // Custom loading sequence for AI processing vibe
    const statuses = [
      "Reading resume metadata...",
      "Extracting structured raw text...",
      "Identifying contact parameters...",
      "Analyzing technical skill directory...",
      "Matching against industry keywords...",
      "Running scoring algorithms..."
    ];
    
    for (let i = 0; i < statuses.length; i++) {
      setLoadingStatus(statuses[i]);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    
    try {
      const res = await analyzeResume(file, targetDomain || undefined);
      setReport(res);
      setGlobalReport(res);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please check the backend or verify file format.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setGlobalReport(null);
    setFile(null);
    setTargetDomain('');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full px-4 py-8 md:px-8 max-w-7xl mx-auto z-20">
      
      <AnimatePresence mode="wait">
        {!report ? (
          /* ================= UPLOAD AREA ================= */
          <motion.div
            key="upload-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[500px]"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">Analyze Your Resume</h1>
              <p className="text-sm text-gray-400">Select a target domain to match keywords and calculate your custom ATS grade.</p>
            </div>

            <GlassCard className="w-full p-8 border border-white/5 shadow-2xl flex flex-col items-center">
              {/* Optional Target Domain Dropdown */}
              <div className="w-full mb-6">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-poppins">
                  Target Job Field (Optional)
                </label>
                <select
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                >
                  <option value="">Auto-Detect Primary Domain</option>
                  <option value="Frontend">Frontend Engineer</option>
                  <option value="Backend">Backend Engineer</option>
                  <option value="Database">Database Administrator / Developer</option>
                  <option value="DevOps">DevOps / SRE</option>
                  <option value="Data Science">Data Scientist / AI Engineer</option>
                  <option value="Product Management">Product Manager</option>
                </select>
              </div>

              {/* Drag and Drop Box */}
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleBrowse}
                  className={`
                    w-full min-h-[220px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300
                    ${isDragging 
                      ? 'border-neonGreen bg-neonGreen/5 shadow-neonGlow scale-[1.01]' 
                      : 'border-white/10 hover:border-neonGreen/30 hover:bg-white/5'}
                  `}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-400 group-hover:text-neonGreen transition-colors">
                    <Upload className="w-6 h-6 text-neonGreen animate-pulse" />
                  </div>
                  <span className="text-white font-poppins font-medium text-sm text-center">
                    Drag and drop your resume here, or <span className="text-neonGreen underline">browse</span>
                  </span>
                  <span className="text-[10px] text-gray-500 mt-2">
                    Supports PDF, DOCX, TXT (Max 5MB)
                  </span>
                </div>
              ) : (
                /* File Preview Panel */
                <div className="w-full p-4 rounded-xl glass-panel border border-neonGreen/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neonGreen/10 border border-neonGreen/30 flex items-center justify-center text-neonGreen">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-white truncate max-w-[280px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="text-xs text-red-400 hover:text-red-300 hover:underline px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Upload Button */}
              {file && !loading && (
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={triggerAnalysis} 
                  className="mt-6 font-poppins"
                >
                  Analyze Resume
                </Button>
              )}

              {/* Loading State Overlay */}
              {loading && (
                <div className="w-full flex flex-col items-center justify-center py-6 mt-4">
                  <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-neonGreen animate-spin" />
                    <Sparkles className="w-5 h-5 text-neonGreen animate-pulse" />
                  </div>
                  <span className="text-xs text-gray-300 font-medium font-poppins animate-pulse">
                    {loadingStatus}
                  </span>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-neonGreen animate-[pulse-glow-keyframes_2s_infinite]" style={{ width: '60%' }} />
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ) : (
          /* ================= DASHBOARD REPORT ================= */
          <motion.div
            key="dashboard-report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl glass-panel border border-white/5 hover:border-neonGreen/30 hover:text-neonGreen text-gray-400 transition-all"
                  title="Upload Another Resume"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <div className="text-left">
                  <h1 className="text-2xl font-bold font-poppins text-white flex items-center gap-2">
                    Analysis Dashboard
                  </h1>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    File: <span className="text-neonGreen">{report.filename}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-neonGreen/10 border border-neonGreen/20 text-xs font-semibold text-neonGreen font-mono">
                  {report.keywords.domain.toUpperCase()} FOCUS
                </span>
              </div>
            </div>

            {/* Top Row Score Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ATS SCORE Circular Progress */}
              <GlassCard className="p-8 flex flex-col items-center justify-center border border-white/5">
                <ProgressRing score={report.scores.ats_score} size={220} />
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold font-poppins text-white">ATS Compatibility</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                    Based on keyword match, structure layout integrity, contact compliance, and section density.
                  </p>
                </div>
              </GlassCard>

              {/* Individual Metric Cards */}
              <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                <GlassCard className="p-6 flex flex-col justify-between border border-white/5 hoverGlow">
                  <div className="text-left">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-poppins">Strength Score</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-poppins mt-2">{report.scores.strength_score}%</h2>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-4 leading-relaxed">Evaluation of project description depth, career spans, and certifications.</p>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-between border border-white/5 hoverGlow">
                  <div className="text-left">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-poppins">Skills Coverage</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-neonGreen font-poppins mt-2">{report.scores.skills_score}%</h2>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-4 leading-relaxed">Number of relevant technical and soft skills successfully identified.</p>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-between border border-white/5 hoverGlow">
                  <div className="text-left">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-poppins">Formatting Quality</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-poppins mt-2">{report.scores.formatting_score}%</h2>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-4 leading-relaxed">Checks for layouts, bullet usage, length boundaries, and readable grids.</p>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-between border border-white/5 hoverGlow">
                  <div className="text-left">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-poppins">Keywords Density</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-poppins mt-2">{report.scores.keyword_score}%</h2>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-4 leading-relaxed">Matches key vocabulary lists of target companies in your specific field.</p>
                </GlassCard>
              </div>
            </div>

            {/* Second Row: Strengths/Weaknesses and Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Overview Box */}
              <GlassCard className="p-6 border border-white/5 text-left">
                <h3 className="text-lg font-bold font-poppins text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-neonGreen" /> Resume Overview
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Candidate Name</span>
                    <p className="text-base font-semibold text-white mt-0.5">{report.parsed_data.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Email Address</span>
                      <p className="text-sm font-medium text-gray-300 truncate mt-0.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-500" /> {report.parsed_data.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Phone Number</span>
                      <p className="text-sm font-medium text-gray-300 truncate mt-0.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-500" /> {report.parsed_data.phone}
                      </p>
                    </div>
                  </div>
                  {report.parsed_data.links.length > 0 && (
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Professional Handles</span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {report.parsed_data.links.map((ln, i) => (
                          <a
                            href={ln.startsWith('http') ? ln : `https://${ln}`}
                            target="_blank"
                            rel="noreferrer"
                            key={i}
                            className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-neonGreen hover:border-neonGreen/30 transition-all flex items-center gap-1"
                          >
                            <Link2 className="w-3 h-3" /> {ln}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
                    <div className="bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Skills</span>
                      <p className="text-lg font-bold text-neonGreen mt-0.5">{report.parsed_data.skills_count}</p>
                    </div>
                    <div className="bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Projects</span>
                      <p className="text-lg font-bold text-white mt-0.5">{report.parsed_data.projects_count}</p>
                    </div>
                    <div className="bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Experience</span>
                      <p className="text-lg font-bold text-white mt-0.5">{report.parsed_data.experience_count} yr</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Strengths & Weaknesses */}
              <GlassCard className="p-6 border border-white/5 text-left flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-poppins text-white border-b border-white/5 pb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-neonGreen" /> ATS Score Breakdown
                  </h3>
                  <div className="mt-4 space-y-4">
                    {/* Strengths List */}
                    <div>
                      <span className="text-xs text-neonGreen font-semibold uppercase tracking-wider font-poppins">Key Strengths</span>
                      <ul className="mt-2 space-y-2">
                        {report.analysis.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neonGreen mt-1.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses List */}
                    <div className="border-t border-white/5 pt-4">
                      <span className="text-xs text-red-400 font-semibold uppercase tracking-wider font-poppins">Identified Issues</span>
                      <ul className="mt-2 space-y-2">
                        {report.analysis.weaknesses.map((wk, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Third Row: Keywords and Domain Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Keyword Analysis Card */}
              <GlassCard className="p-6 border border-white/5 text-left md:col-span-2">
                <h3 className="text-lg font-bold font-poppins text-white border-b border-white/5 pb-3">
                  Keyword Optimizations
                </h3>
                
                <div className="mt-4 space-y-4">
                  {/* Detected */}
                  <div>
                    <span className="text-xs text-gray-400 font-medium">Detected Keywords ({report.keywords.detected.length})</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {report.keywords.detected.map((kw, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-neonGreen/10 border border-neonGreen/20 text-neonGreen font-medium flex items-center gap-1 select-none">
                          <Check className="w-3 h-3" /> {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="border-t border-white/5 pt-4">
                    <span className="text-xs text-gray-400 font-medium">Missing Relevant Keywords ({report.keywords.missing.length})</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {report.keywords.missing.map((kw, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium flex items-center gap-1 select-none">
                          <Plus className="w-3 h-3 rotate-45" /> {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-3">
                      * Incorpating these missing terms in descriptions naturally helps ranking for {report.keywords.domain} jobs.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Domain Skill Match Progress Bars */}
              <GlassCard className="p-6 border border-white/5 text-left">
                <h3 className="text-lg font-bold font-poppins text-white border-b border-white/5 pb-3">
                  Domain Skill Matching
                </h3>
                <div className="mt-4 space-y-3.5">
                  <ProgressBar label="Frontend Skills" score={report.skills_match.Frontend} />
                  <ProgressBar label="Backend Skills" score={report.skills_match.Backend} />
                  <ProgressBar label="Database Systems" score={report.skills_match.Database} />
                  <ProgressBar label="DevOps & Cloud" score={report.skills_match.DevOps} />
                </div>
              </GlassCard>
            </div>

            {/* Fourth Row: AI Recommendations and Radar Section breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* AI Recommendation Cards (Accordions/Details) */}
              <GlassCard className="p-6 border border-white/5 text-left lg:col-span-3">
                <h3 className="text-lg font-bold font-poppins text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neonGreen animate-pulse" /> AI-Generated Optimizations
                </h3>
                
                <div className="mt-4 space-y-4">
                  {report.recommendations.map((rec, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white font-poppins">{rec.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neonGreen/10 text-neonGreen border border-neonGreen/20">RECOMMENDED</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{rec.description}</p>
                      
                      {/* Before / After Blocks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 font-mono text-[11px]">
                        <div className="p-2.5 rounded bg-red-950/20 border border-red-900/30 text-left">
                          <span className="text-red-400 font-bold block mb-1">CURRENT:</span>
                          <span className="text-gray-400">"{rec.current}"</span>
                        </div>
                        <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/30 text-left">
                          <span className="text-neonGreen font-bold block mb-1">OPTIMIZED REWRITE:</span>
                          <span className="text-gray-300">"{rec.better}"</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Section breakdown Radar Chart */}
              <GlassCard className="p-6 border border-white/5 lg:col-span-2 flex flex-col justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-bold font-poppins text-white border-b border-white/5 pb-3">
                    Section Quality Breakdown
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">Scores represent how well-written, dense, and structured each section is.</p>
                </div>
                
                <div className="w-full flex items-center justify-center my-4">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.section_breakdown}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'Poppins' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.08)" tick={{ fill: '#4b5563', fontSize: 9 }} />
                      <Radar name="Quality" dataKey="A" stroke="#00ff99" fill="#00ff99" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            {/* Fifth Row: Resume Preview */}
            <GlassCard className="p-6 border border-white/5 text-left">
              <h3 className="text-lg font-bold font-poppins text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" /> Structured Resume Output
              </h3>
              
              <div className="mt-4 bg-black/40 border border-white/5 rounded-xl p-6 font-inter text-xs text-gray-300 space-y-6 max-h-[400px] overflow-y-auto leading-relaxed">
                {/* Summary */}
                {report.parsed_data.summary && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-poppins flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neonGreen" /> Profile Summary
                    </h4>
                    <p className="whitespace-pre-line text-gray-400 font-mono text-[11px]">{report.parsed_data.summary}</p>
                  </div>
                )}
                
                {/* Experience */}
                {report.parsed_data.experience && (
                  <div className="border-t border-white/5 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-poppins flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-500" /> Work Experience
                    </h4>
                    <p className="whitespace-pre-line font-mono text-[11px] text-gray-400 bg-white/1 p-3 rounded-lg border border-white/5">{report.parsed_data.experience}</p>
                  </div>
                )}

                {/* Projects */}
                {report.parsed_data.projects && (
                  <div className="border-t border-white/5 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-poppins flex items-center gap-1.5">
                      <FolderGit className="w-3.5 h-3.5 text-gray-500" /> Projects
                    </h4>
                    <p className="whitespace-pre-line font-mono text-[11px] text-gray-400 bg-white/1 p-3 rounded-lg border border-white/5">{report.parsed_data.projects}</p>
                  </div>
                )}

                {/* Education */}
                {report.parsed_data.education && (
                  <div className="border-t border-white/5 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-poppins flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gray-500" /> Education Background
                    </h4>
                    <p className="whitespace-pre-line font-mono text-[11px] text-gray-400">{report.parsed_data.education}</p>
                  </div>
                )}
              </div>
            </GlassCard>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
