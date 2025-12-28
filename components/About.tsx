import React, { useRef, useEffect } from 'react';
import { EDUCATION, EXPERIENCES } from '../constants';
import { Mail, Linkedin, Globe, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !rightColumnRef.current) return;
      
      const container = containerRef.current;
      const scrollableContent = rightColumnRef.current;
      const parentHeight = scrollableContent.parentElement?.clientHeight || 0;
      const contentHeight = scrollableContent.scrollHeight;
      
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // The total distance the user scrolls (container height - viewport)
      const scrollDist = container.offsetHeight - viewportHeight;
      const scrolled = -rect.top;
      
      // Calculate how much the inner content needs to move
      // contentHeight - parentHeight is the amount of hidden content we need to reveal
      const maxTranslate = contentHeight - parentHeight;

      if (maxTranslate <= 0) {
          scrollableContent.style.transform = `translateY(0px)`;
          return;
      }
      
      if (scrolled <= 0) {
        scrollableContent.style.transform = `translateY(0px)`;
      } else if (scrolled >= scrollDist) {
        // End of scroll
        scrollableContent.style.transform = `translateY(-${maxTranslate}px)`;
      } else {
        const progress = scrolled / scrollDist;
        scrollableContent.style.transform = `translateY(-${progress * maxTranslate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    // Initial calculation with a small delay to ensure layout is ready
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    // Outer Container determines duration of scroll
    <div ref={containerRef} className="relative h-[250vh]">
        
      {/* Sticky Window */}
      <div className="sticky top-6 h-screen flex items-center justify-center overflow-hidden">
        
        {/* The Visual Card */}
        <div className="relative w-full h-[90vh] flex flex-col p-8 md:p-16 bg-card-night text-text-night rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/20 overflow-hidden transition-colors duration-500">
            
            {/* Header (Static) */}
            <div className="relative z-20 flex-none flex justify-between items-start mb-8 md:mb-10 border-b border-white/10 pb-6 bg-card-night/90 backdrop-blur-sm">
                 <div>
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white">
                        03 // ARCHIVE
                    </h2>
                 </div>
                 <span className="font-mono text-stone-500 text-[10px] flex items-center gap-1 mt-2">
                    SCROLL TO READ <ArrowRight className="w-3 h-3 rotate-90" />
                 </span>
            </div>

            {/* Main Content Grid */}
            <div className="relative z-10 flex-grow overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 h-full">
                        
                    {/* Left: Bio & Status (Static) */}
                    <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto lg:overflow-visible pr-2">
                        <div className="space-y-8">
                            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm rounded-2xl">
                                <div className="font-mono text-xs text-accent-night mb-2">STATUS: ONLINE</div>
                                <div className="h-[1px] w-full bg-white/10 mb-4"></div>
                                <p className="text-lg leading-relaxed text-stone-200 font-light">
                                    "The transition from space to spirit."
                                </p>
                                <p className="mt-4 text-stone-300 text-sm leading-relaxed">
                                    I believe landscape architecture is about observing the silent dialogue between nature and the built environment. Whether drafting plans for a public park or sketching a leaf, my process is driven by attention to detail.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="font-mono text-xs text-stone-400 uppercase tracking-widest">Connect Protocol</div>
                                <div className="flex gap-4">
                                    <a href="mailto:yyou@mkskstudios.com" className="w-14 h-14 flex items-center justify-center border border-white/20 hover:bg-accent-night hover:text-black hover:border-accent-night transition-all duration-300 rounded-full" aria-label="Email">
                                        <Mail className="w-6 h-6" />
                                    </a>
                                    <a href="https://www.linkedin.com/in/yahan-you-7b1a20192/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center border border-white/20 hover:bg-accent-night hover:text-black hover:border-accent-night transition-all duration-300 rounded-full" aria-label="LinkedIn">
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                    <a href="https://mkskstudios.com/team/yahan-you" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center border border-white/20 hover:bg-accent-night hover:text-black hover:border-accent-night transition-all duration-300 rounded-full" aria-label="MKSK Profile">
                                        <Globe className="w-6 h-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Timeline Terminal (Scrollable Window) */}
                    <div className="lg:col-span-7 h-full relative overflow-hidden mask-linear-fade">
                        {/* 
                            This inner div is the one that translates. 
                            We give it padding-bottom to ensure the last item is fully viewable when scrolled to the end.
                        */}
                        <div ref={rightColumnRef} className="will-change-transform pb-24 absolute top-0 left-0 w-full">
                            <div className="relative pl-8 border-l border-white/10">
                                {/* Decoration: Timeline Line */}
                                <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-accent-night to-transparent"></div>

                                <div className="space-y-16">
                                    {/* Experience Section */}
                                    <div>
                                        <h3 className="font-mono text-accent-night text-sm mb-8 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-accent-night rounded-full animate-pulse"></span>
                                            EXPERIENCE_LOG
                                        </h3>
                                        <div className="space-y-10">
                                            {EXPERIENCES.map((exp, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-card-night border border-accent-night shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>
                                                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                                                        <h4 className="text-xl font-bold text-white group-hover:text-accent-night transition-colors">{exp.role}</h4>
                                                        <span className="font-mono text-xs text-stone-400">{exp.period}</span>
                                                    </div>
                                                    <div className="text-sm font-mono text-orange-400 mb-2">{exp.company} // {exp.location}</div>
                                                    <p className="text-sm text-stone-300 max-w-lg">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Education Section */}
                                    <div>
                                        <h3 className="font-mono text-accent-night text-sm mb-8 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-stone-400 rounded-full"></span>
                                            EDUCATION_LOG
                                        </h3>
                                        <div className="space-y-8">
                                            {EDUCATION.map((edu, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-card-night border border-stone-600 group-hover:border-white transition-colors"></div>
                                                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white">{edu.degree}</h4>
                                                            <div className="text-sm font-mono text-stone-300">{edu.school}</div>
                                                        </div>
                                                        <span className="font-mono text-xs text-stone-400">{edu.year}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;