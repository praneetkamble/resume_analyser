import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Cpu, Columns, GraduationCap, ShieldCheck, ArrowRight, Star } from 'lucide-react';

interface HomeProps {
  setActivePage: (page: string) => void;
  onViewDemo: () => void;
}

export const Home: React.FC<HomeProps> = ({ setActivePage, onViewDemo }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas floating particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1
      };
    };

    // Populate particles
    const particleCount = Math.min(60, Math.floor((width * height) / 20000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 153, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 255, 153, 0.5)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      title: "ATS Scoring Engine",
      description: "Get evaluated by a matching engine configured with real recruiter tracking heuristics.",
      icon: ShieldCheck
    },
    {
      title: "Keyword & Skill Matches",
      description: "Spot industry-specific omissions and cross-reference your resume across multiple fields.",
      icon: Cpu
    },
    {
      title: "A/B Comparison Model",
      description: "Upload two different variants of your resume and see exactly which version ranks higher.",
      icon: Columns
    },
    {
      title: "Interview Readiness Guide",
      description: "Predict interview weaknesses based on your experience and review targeted mock questions.",
      icon: GraduationCap
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Background canvas for floating particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Grid backdrop */}
      <div className="animated-grid select-none" />

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] radial-glow-green pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] radial-glow-purple pointer-events-none z-0" />

      {/* Core Hero Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-16 text-center z-20 flex flex-col items-center">
        {/* Top announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-xs text-gray-300 font-mono mb-8 select-none"
        >
          <Star className="w-3.5 h-3.5 text-neonGreen fill-neonGreen" />
          <span>Next-Gen ATS Parser V2.5 Live</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-neon-gradient text-4xl sm:text-5xl md:text-6xl font-poppins font-extrabold tracking-tight leading-none max-w-4xl"
        >
          Land More Interviews With AI-Powered Resume Analysis
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-gray-400 font-inter text-base sm:text-lg md:text-xl max-w-2xl mt-6 leading-relaxed"
        >
          Upload your resume and instantly discover ATS issues, missing skills, weak sections, and optimization opportunities.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => setActivePage('dashboard')}
            className="group"
          >
            Analyze Resume
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={onViewDemo}
          >
            View Demo
          </Button>
        </motion.div>

        {/* Value Prop Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full border-t border-white/5 pt-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">100K+</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Resumes Scanned</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-poppins text-neonGreen">87%</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Higher Interview Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">&lt; 3s</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Analysis Speed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">Free</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">No Card Required</span>
          </div>
        </motion.div>

        {/* Features section grid */}
        <div className="mt-28 w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white">Powered by Advanced Parser Tech</h2>
            <p className="text-sm text-gray-500 mt-2">ResumeIQ breaks down complex resumes into structured semantic maps.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-neonGreen/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-neonGreen/10 group-hover:border-neonGreen/30 transition-all">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-neonGreen transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold font-poppins text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
