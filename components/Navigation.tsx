import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { Sun, Moon } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  theme: 'day' | 'night';
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, theme }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Corrected class names based on tailwind.config in index.html
  // Config defines colors: 'text-day', 'text-night', 'accent-day', 'accent-night'
  // So utility classes are 'text-text-day', 'text-text-night', 'text-accent-day', etc.
  const textColor = theme === 'day' ? 'text-text-day' : 'text-text-night';
  const subColor = theme === 'day' ? 'text-stone-500' : 'text-stone-400';
  const borderColor = theme === 'day' ? 'border-stone-200' : 'border-white/10';
  const activeColor = theme === 'day' ? 'text-accent-day' : 'text-accent-night';
  const glassBg = theme === 'day' ? 'bg-white/80' : 'bg-black/50';

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-500 ${borderColor} ${glassBg} h-12 flex items-center`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-4 whitespace-nowrap">
           <button 
            onClick={() => scrollToSection('home')} 
            className={`text-lg font-bold tracking-tight hover:opacity-70 transition-opacity ${textColor}`}
          >
            YAHAN.YOU
          </button>
          <div className={`hidden md:block w-[1px] h-6 ${borderColor}`}></div>
          <span className={`hidden md:block font-mono text-xs ${subColor}`}>
            LANDSCAPE_ARCH.v2.0
          </span>
        </div>

        {/* Desktop Menu - Justified Alignment */}
        <div className="hidden md:flex flex-1 items-center justify-between px-12 xl:px-32">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-xs font-mono tracking-widest transition-colors relative group uppercase ${
                activeSection === link.id ? activeColor : `${subColor} hover:${textColor}`
              }`}
            >
              {link.label}
              {/* Active Indicator Dot */}
              {activeSection === link.id && (
                  <span className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${theme === 'day' ? 'bg-accent-day' : 'bg-accent-night'}`} />
              )}
            </button>
          ))}
        </div>

        {/* Status / Clock */}
        <div className={`flex items-center gap-4 font-mono text-xs ${textColor} whitespace-nowrap`}>
            <div className="flex items-center gap-2">
                <span>{time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className={`w-[1px] h-4 ${borderColor}`}></div>
            <div className="flex items-center gap-2">
                {theme === 'day' ? (
                    <>
                        <Sun className="w-3 h-3" />
                        <span className="hidden sm:inline">WORK_MODE</span>
                    </>
                ) : (
                    <>
                        <Moon className={`w-3 h-3 text-accent-night`} />
                        <span className="text-accent-night hidden sm:inline">MOON_MODE</span>
                    </>
                )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;