import React from 'react';
import { Cpu, Columns, GraduationCap, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Cpu },
    { id: 'dashboard', label: 'Analyzer', icon: LayoutDashboard },
    { id: 'compare', label: 'Compare Resumes', icon: Columns },
    { id: 'interview', label: 'Interview Prep', icon: GraduationCap }
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 md:px-8">
      <nav className="mx-auto max-w-7xl rounded-2xl glass-panel px-6 py-4 flex items-center justify-between border border-white/5 shadow-lg">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => setActivePage('home')}
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-neonGreen/10 border border-neonGreen/30 group-hover:border-neonGreen group-hover:shadow-neon transition-all duration-300">
            <Cpu className="w-5 h-5 text-neonGreen group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-poppins font-bold text-xl tracking-tight text-white">
            Resume<span className="text-neonGreen">IQ</span>
            <span className="text-xs font-mono font-normal ml-1.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">AI</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-neonGreen/10 text-neonGreen border border-neonGreen/20 shadow-neon' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Small Screen Nav Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={item.label}
                className={`
                  p-2.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-neonGreen/10 text-neonGreen border border-neonGreen/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className="w-4.5 h-4.5" />
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
