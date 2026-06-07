import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  hoverGlow = false
}) => {
  return (
    <div
      className={`
        rounded-2xl 
        transition-all 
        duration-300 
        ${glow ? 'glass-panel-glow shadow-neon' : 'glass-panel'} 
        ${hoverGlow ? 'hover:border-neonGreen/40 hover:shadow-neonGlow hover:-translate-y-1' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
