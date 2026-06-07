import React from 'react';
import { Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto border-t border-white/5 py-8 px-4 md:px-8 bg-darkBg text-gray-500 font-inter text-xs md:text-sm">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-2 select-none">
          <Cpu className="w-4 h-4 text-neonGreen/60" />
          <span className="font-poppins font-semibold text-gray-400">
            Resume<span className="text-neonGreen/75">IQ</span> AI
          </span>
          <span className="text-[10px] text-gray-600">© 2026 ResumeIQ AI. All rights reserved.</span>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap justify-center gap-2 text-[10px] font-mono text-gray-600">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">REACT + VITE</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">FASTAPI</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">TAILWIND CSS</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">FRAMER MOTION</span>
        </div>

        {/* Links */}
        <div className="flex gap-4 text-xs font-medium text-gray-400 hover:text-gray-300">
          <a href="#" className="hover:text-neonGreen transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-neonGreen transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-neonGreen transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
