import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  score: number;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  score,
  color = 'bg-neonGreen',
  className = ''
}) => {
  return (
    <div className={`w-full font-inter ${className}`}>
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-gray-300 font-poppins">{label}</span>
        <span className="text-white font-mono">{score}%</span>
      </div>
      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
          style={{
            boxShadow: color.includes('bg-neonGreen') ? '0 0 8px rgba(0, 255, 153, 0.4)' : 'none'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
