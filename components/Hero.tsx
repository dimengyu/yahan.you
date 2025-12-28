import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Force start at top of page
    window.scrollTo(0, 0);
    
    // 2. Disable scrolling while loading (both html and body for robustness)
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Phase 1: Mount content behind loader & start loader fade-out (3.5s)
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 3500);

    // Phase 2: Remove loader from DOM after transition completes (4.5s)
    const cleanupTimer = setTimeout(() => {
      setShowLoader(false);
      // Re-enable scrolling
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }, 4500); // 3500ms + 1000ms transition

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(cleanupTimer);
      // Ensure scroll is restored if component unmounts
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const scrollToWork = () => {
      document.getElementById('9-5')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[90vh] flex flex-col justify-between p-8 md:p-16 bg-card-hero rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes draw-line {
          from { stroke-dashoffset: 4000; }
          to { stroke-dashoffset: 0; }
        }
        .animate-draw {
          stroke-dasharray: 4000;
          stroke-dashoffset: 4000;
          animation: draw-line 3.5s ease-out forwards;
        }
        .animate-draw-fast {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 1.5s ease-out forwards;
        }
        .animate-draw-delay-1 { animation-delay: 0.2s; }
        .animate-draw-delay-2 { animation-delay: 0.5s; }
        .animate-draw-delay-3 { animation-delay: 0.8s; }

        @keyframes loader-line {
            0% { width: 0; left: 50%; }
            50% { width: 100px; left: calc(50% - 50px); }
            100% { width: 100%; left: 0; }
        }
        
        @keyframes text-reveal {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        /* Clipping Mask Reveal Animation */
        @keyframes slide-up-reveal {
            0% { transform: translateY(110%); }
            100% { transform: translateY(0); }
        }
        
        .animate-slide-up {
            transform: translateY(110%);
            animation: slide-up-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
      `}</style>

      {/* LOADING SCREEN */}
      {showLoader && (
          <div 
            className={`fixed inset-0 z-[100] bg-card-hero flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${
                isMounted ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
              <div className="relative w-full max-w-lg md:max-w-2xl flex flex-col items-center gap-8">
                  {/* Structure (Top) */}
                  <div className="font-bold uppercase tracking-[0.3em] text-xl md:text-3xl animate-[text-reveal_1s_ease-out_forwards]">
                      Initializing Structure
                  </div>

                  {/* Horizon Line Loader */}
                  <div className="relative w-full max-w-md h-[1px] bg-black/5 overflow-hidden">
                      <div className="absolute inset-0 bg-accent-day h-full animate-[loader-line_3.2s_ease-in-out_forwards]"></div>
                  </div>

                  {/* Soul (Bottom) */}
                  <div className="font-light italic text-stone-400 tracking-widest text-lg md:text-2xl animate-[text-reveal_1s_ease-out_0.5s_forwards] opacity-0">
                      Loading Soul...
                  </div>

                  {/* Coordinates ticker */}
                  <div className="absolute -bottom-16 font-mono text-xs md:text-sm text-stone-300 animate-pulse">
                      39.7684° N, 86.1581° W
                  </div>
              </div>
          </div>
      )}

      {/* MAIN CONTENT */}
      {isMounted && (
        <>
            {/* Decorative Topo Lines Background (Animated) */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path className="animate-draw animate-draw-delay-1" d="M0,500 C200,400 400,500 800,500 S1200,600 1600,550" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path className="animate-draw animate-draw-delay-2" d="M0,600 C250,550 500,600 900,650 S1400,600 1800,650" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path className="animate-draw animate-draw-delay-3" d="M0,700 C300,650 600,700 1000,750 S1500,700 1900,750" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path 
                        className="animate-draw" 
                        d="M-100,200 Q400,150 600,400 T1400,800" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        style={{ opacity: 0.4 }}
                    />
                </svg>
            </div>

            {/* Top Section */}
            <div className="relative z-10 w-full">
                <div className="flex justify-end items-start mb-16 md:mb-24 relative">
                    {/* Center Line */}
                    <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-px h-12 bg-black/10 origin-top animate-[text-reveal_1s_ease-out_forwards]"></div>
                    
                    {/* Location Data */}
                    <div className="overflow-hidden text-right">
                        <div className="font-mono text-stone-400 text-xs tracking-widest animate-slide-up delay-200">
                            LAT: 39.7684 N <br/>
                            LNG: 86.1581 W
                        </div>
                    </div>
                </div>

                <h1 className="flex flex-col text-[14vw] md:text-[12vw] leading-[0.75] tracking-tighter text-text-day uppercase select-none">
                    {/* 9-5 Time Indicator */}
                    <div className="self-start ml-1 overflow-hidden mb-4">
                        <div className="font-mono text-accent-day text-xs tracking-widest leading-normal animate-slide-up">
                            [ 09:00 — 17:00 ]
                        </div>
                    </div>

                    {/* Structure */}
                    <div className="overflow-hidden self-start z-10 p-1">
                        <span className="block font-bold transform hover:translate-x-4 transition-transform duration-700 cursor-default animate-slide-up delay-100">
                            Structure
                        </span>
                    </div>
                    
                    {/* The Horizon Line */}
                    <div className="flex items-center gap-4 my-6 md:my-2 w-full relative z-20">
                        <div className="h-[2px] w-full relative">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0,0,0,0.1)" strokeWidth="1" className="animate-draw-fast" />
                            </svg>
                        </div>
                        
                        <div className="flex-shrink-0">
                             <span className="block font-mono text-xs md:text-sm whitespace-nowrap text-stone-400 tracking-[0.2em] animate-slide-up delay-300">
                                THE DUAL HORIZON
                            </span>
                        </div>
                        
                        <div className="h-[2px] w-full relative">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0,0,0,0.1)" strokeWidth="1" className="animate-draw-fast" style={{transform: 'rotate(180deg)', transformOrigin: 'center'}} />
                            </svg>
                        </div>
                    </div>

                    {/* Soul */}
                    <div className="overflow-hidden self-end z-10 p-1">
                        <span className="block font-extralight italic text-stone-400 hover:text-accent-day transition-colors duration-500 cursor-default animate-slide-up delay-200">
                            Soul
                        </span>
                    </div>
                </h1>

                {/* 5-9 Time Indicator */}
                <div className="flex justify-end mt-4">
                    <div className="overflow-hidden">
                        <div className="font-mono text-stone-400 text-xs tracking-widest animate-slide-up delay-300">
                            [ 17:00 — 21:00 ]
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 flex flex-col md:flex-row items-end justify-between w-full mt-12">
                <div className="max-w-md">
                    <div className="overflow-hidden mb-4">
                        <p className="text-xl md:text-2xl font-medium leading-tight animate-slide-up delay-500">
                            Yahan You
                        </p>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-stone-500 font-light leading-relaxed animate-slide-up delay-700">
                            Defining public realms.<br/>
                            Curating private expressions.
                        </p>
                    </div>
                </div>

                <div className="mt-12 md:mt-0 overflow-hidden">
                    <button 
                        onClick={scrollToWork}
                        className="group flex items-center gap-3 text-sm md:text-base font-mono uppercase tracking-widest text-text-day hover:text-accent-day transition-colors cursor-hover animate-slide-up delay-700"
                    >
                        <span className="hidden md:inline-block border-b border-transparent group-hover:border-accent-day transition-all">Begin Transition</span>
                        <span className="w-12 h-12 border border-black/10 rounded-full flex items-center justify-center bg-white group-hover:scale-110 transition-transform shadow-sm">
                            <ArrowDown className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default Hero;