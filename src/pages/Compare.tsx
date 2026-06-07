import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, ArrowLeft, ArrowRight, Columns, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { compareResumes } from '../services/api';
import type { ComparisonReport } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

export const Compare: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [report, setReport] = useState<ComparisonReport | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile1(e.target.files[0]);
  };

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile2(e.target.files[0]);
  };

  const triggerComparison = async () => {
    if (!file1 || !file2) return;
    setLoading(true);
    
    const statuses = [
      "Loading resume databases...",
      "Analyzing Resume 1 parameters...",
      "Analyzing Resume 2 parameters...",
      "Extracting intersecting keyword sets...",
      "Generating side-by-side scoring reports..."
    ];

    for (let i = 0; i < statuses.length; i++) {
      setLoadingStatus(statuses[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      const res = await compareResumes(file1, file2);
      setReport(res);
    } catch (e) {
      console.error(e);
      alert("Comparison failed. Please verify both files are readable.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setFile1(null);
    setFile2(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full px-4 py-8 md:px-8 max-w-7xl mx-auto z-20">
      <AnimatePresence mode="wait">
        {!report ? (
          /* ================= UPLOAD SECTION ================= */
          <motion.div
            key="compare-upload"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-poppins font-bold text-white flex items-center justify-center gap-2">
                <Columns className="w-8 h-8 text-neonGreen" /> Resume Comparison
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Upload two variations of your resume (e.g. original vs optimized) to compare scores side-by-side.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* File 1 Selector */}
              <GlassCard className="p-6 border border-white/5 flex flex-col items-center justify-center min-h-[240px]">
                <h3 className="text-sm font-bold font-poppins text-gray-300 mb-4 uppercase tracking-wider">RESUME 1 (BASE)</h3>
                {!file1 ? (
                  <div
                    onClick={() => fileInputRef1.current?.click()}
                    className="w-full min-h-[160px] rounded-xl border border-dashed border-white/10 hover:border-neonGreen/30 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4"
                  >
                    <input type="file" ref={fileInputRef1} onChange={handleFileChange1} className="hidden" accept=".pdf,.docx,.txt" />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs text-white font-medium">Click to upload Resume 1</span>
                    <span className="text-[9px] text-gray-500 mt-1">PDF, DOCX, TXT</span>
                  </div>
                ) : (
                  <div className="w-full p-4 rounded-xl bg-white/2 border border-neonGreen/20 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-lg bg-neonGreen/10 flex items-center justify-center text-neonGreen"><FileText className="w-4.5 h-4.5" /></div>
                      <div className="flex flex-col max-w-[180px] truncate">
                        <span className="text-xs font-semibold text-white truncate">{file1.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{(file1.size / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                    <button onClick={() => setFile1(null)} className="text-[10px] text-red-400 hover:underline px-2.5 py-1 bg-red-500/10 rounded-lg">Clear</button>
                  </div>
                )}
              </GlassCard>

              {/* File 2 Selector */}
              <GlassCard className="p-6 border border-white/5 flex flex-col items-center justify-center min-h-[240px]">
                <h3 className="text-sm font-bold font-poppins text-gray-300 mb-4 uppercase tracking-wider">RESUME 2 (COMPARISON)</h3>
                {!file2 ? (
                  <div
                    onClick={() => fileInputRef2.current?.click()}
                    className="w-full min-h-[160px] rounded-xl border border-dashed border-white/10 hover:border-neonGreen/30 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-4"
                  >
                    <input type="file" ref={fileInputRef2} onChange={handleFileChange2} className="hidden" accept=".pdf,.docx,.txt" />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs text-white font-medium">Click to upload Resume 2</span>
                    <span className="text-[9px] text-gray-500 mt-1">PDF, DOCX, TXT</span>
                  </div>
                ) : (
                  <div className="w-full p-4 rounded-xl bg-white/2 border border-neonGreen/20 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-lg bg-neonGreen/10 flex items-center justify-center text-neonGreen"><FileText className="w-4.5 h-4.5" /></div>
                      <div className="flex flex-col max-w-[180px] truncate">
                        <span className="text-xs font-semibold text-white truncate">{file2.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{(file2.size / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                    <button onClick={() => setFile2(null)} className="text-[10px] text-red-400 hover:underline px-2.5 py-1 bg-red-500/10 rounded-lg">Clear</button>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Compare Button */}
            {file1 && file2 && !loading && (
              <Button variant="primary" size="lg" onClick={triggerComparison} className="px-12">
                Compare Resumes <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            )}

            {/* Loading spinner */}
            {loading && (
              <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center py-6 mt-4">
                <div className="relative w-10 h-10 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-neonGreen animate-spin" />
                  <Sparkles className="w-4 h-4 text-neonGreen animate-pulse" />
                </div>
                <span className="text-xs text-gray-300 font-poppins animate-pulse">
                  {loadingStatus}
                </span>
              </div>
            )}
          </motion.div>
        ) : (
          /* ================= COMPARISON DASHBOARD ================= */
          <motion.div
            key="compare-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl glass-panel border border-white/5 hover:border-neonGreen/30 hover:text-neonGreen text-gray-400 transition-all"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <div className="text-left">
                <h1 className="text-2xl font-bold font-poppins text-white">Resume Comparison Report</h1>
                <p className="text-xs text-gray-400">Comparing Base Resume and Target Resume side-by-side.</p>
              </div>
            </div>

            {/* Overall Score Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume 1 Score Box */}
              <GlassCard className="p-6 border border-white/5 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-white/5 text-[9px] font-mono text-gray-500 uppercase rounded-bl-lg">Resume 1</div>
                <span className="text-xs text-gray-400 font-semibold">{report.resume1.name}</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-5xl font-extrabold font-poppins text-white">{report.resume1.ats_score}%</span>
                  <span className="text-xs text-gray-500 font-mono">ATS SCORE</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-gray-400" style={{ width: `${report.resume1.ats_score}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-4 font-mono truncate">Filename: {report.resume1.filename}</p>
              </GlassCard>

              {/* Resume 2 Score Box (Optimized) */}
              <GlassCard className="p-6 border border-neonGreen/20 text-left relative overflow-hidden shadow-neon">
                <div className="absolute top-0 right-0 p-3 bg-neonGreen/10 text-[9px] font-mono text-neonGreen uppercase rounded-bl-lg">Resume 2</div>
                <span className="text-xs text-neonGreen font-semibold">{report.resume2.name}</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-5xl font-extrabold font-poppins text-neonGreen">{report.resume2.ats_score}%</span>
                  <span className="text-xs text-neonGreen font-mono">ATS SCORE</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-neonGreen shadow-neon" style={{ width: `${report.resume2.ats_score}%` }} />
                </div>
                
                {/* Score difference indicator */}
                {report.resume2.ats_score > report.resume1.ats_score && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-neonGreen bg-neonGreen/10 border border-neonGreen/20 px-2 py-0.5 rounded-md font-bold font-mono">
                    +{report.resume2.ats_score - report.resume1.ats_score}% Improvement
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-4 font-mono truncate">Filename: {report.resume2.filename}</p>
              </GlassCard>
            </div>

            {/* Detailed Metric Rows */}
            <GlassCard className="p-6 border border-white/5">
              <h3 className="text-sm font-bold font-poppins text-white mb-6 uppercase tracking-wider text-left">Metrical Comparison</h3>
              
              <div className="space-y-6">
                {/* Strength Score Row */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
                    <span>{report.resume1.strength_score}% (Resume 1)</span>
                    <span className="font-poppins text-white uppercase tracking-wider font-semibold">Resume Strength</span>
                    <span>{report.resume2.strength_score}% (Resume 2)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${report.resume1.strength_score}%` }} />
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-neonGreen" style={{ width: `${report.resume2.strength_score}%` }} />
                    </div>
                  </div>
                </div>

                {/* Skills Coverage Row */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
                    <span>{report.resume1.skills_score}% (Resume 1)</span>
                    <span className="font-poppins text-white uppercase tracking-wider font-semibold">Skills Coverage</span>
                    <span>{report.resume2.skills_score}% (Resume 2)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${report.resume1.skills_score}%` }} />
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-neonGreen" style={{ width: `${report.resume2.skills_score}%` }} />
                    </div>
                  </div>
                </div>

                {/* Formatting Quality Row */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
                    <span>{report.resume1.formatting_score}% (Resume 1)</span>
                    <span className="font-poppins text-white uppercase tracking-wider font-semibold">Formatting Quality</span>
                    <span>{report.resume2.formatting_score}% (Resume 2)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${report.resume1.formatting_score}%` }} />
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-neonGreen" style={{ width: `${report.resume2.formatting_score}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Side-by-Side Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Resume 1 Details */}
              <GlassCard className="p-6 border border-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 mb-4 font-poppins">{report.resume1.name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Identified Strengths</span>
                    <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                      {report.resume1.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Formatting / Content Issues</span>
                    <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                      {report.resume1.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Core Keywords ({report.resume1.skills_count})</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {report.resume1.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 font-mono">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Resume 2 Details */}
              <GlassCard className="p-6 border border-neonGreen/10">
                <h3 className="text-sm font-bold text-neonGreen uppercase tracking-wider border-b border-neonGreen/10 pb-2 mb-4 font-poppins">{report.resume2.name}</h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-neonGreen font-semibold block uppercase">Identified Strengths</span>
                    <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                      {report.resume2.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-neonGreen mt-1.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <span className="text-xs text-red-400 font-semibold block uppercase">Formatting / Content Issues</span>
                    <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                      {report.resume2.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                      {report.resume2.weaknesses.length === 0 && (
                        <li className="text-xs text-gray-500 italic">No major issues identified! Excellent optimizer performance.</li>
                      )}
                    </ul>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <span className="text-xs text-neonGreen font-semibold block uppercase">Core Keywords ({report.resume2.skills_count})</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {report.resume2.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-neonGreen/10 border border-neonGreen/20 text-neonGreen font-mono font-medium flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Compare;
