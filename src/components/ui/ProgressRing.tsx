import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

interface ProgressRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 200,
  strokeWidth = 14,
  label = "ATS SCORE"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [displayScore, setDisplayScore] = useState(0);

  // Animate the text counter
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (value) => setDisplayScore(Math.round(value))
    });
    return () => controls.stop();
  }, [score]);

  // Color mapping based on score
  const getScoreColor = (val: number) => {
    if (val >= 80) return "#00ff99"; // Neon Green
    if (val >= 60) return "#eab308"; // Yellow/Gold
    return "#ef4444"; // Red
  };

  const currentColor = getScoreColor(score);

  return (
    <div className="relative flex flex-col items-center justify-center font-poppins">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Animated foreground ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={currentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${currentColor}33)`
          }}
        />
      </svg>
      
      {/* Centered Content */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold font-poppins tracking-tighter"
          style={{ color: currentColor }}
        >
          {displayScore}%
        </motion.span>
        <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold mt-1">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
