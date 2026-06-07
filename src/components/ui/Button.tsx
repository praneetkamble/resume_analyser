import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = "font-poppins font-medium rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-neonGreen text-black hover:bg-neonGreen-hover shadow-neon hover:shadow-neonGlow border border-transparent",
    secondary: "glass-panel text-white hover:bg-white/5 border border-white/10 hover:border-white/20",
    danger: "bg-red-600/80 text-white hover:bg-red-600 border border-transparent hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseStyle} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export default Button;
