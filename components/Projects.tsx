import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import Footer from './Footer';
import { ArrowUpRight, MapPin, Maximize, X, ArrowRight } from 'lucide-react';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Detail View Logic
  const contentRef = useRef<HTMLDivElement>(null);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const projectSections = useMemo(() => {
    if (!selectedProject) return [];
    
    const sections = [];
    
    // Only add main image if not hidden
    if (!selectedProject.hideMainImageInDetail) {
        sections.push({
            type: 'main',
            caption: selectedProject.mainImageCaption || "PROJECT STATEMENT",
            category: selectedProject.mainImageCategory || "OVERVIEW",
            url: selectedProject.imageUrl,
            ...selectedProject
        });
    } else {
        // If main image is hidden, we still need a "main" section for the text content?
        // The current rendering logic uses `section.type === 'main'` to render the title/description.
        // If we remove it from the array, the title/description won't render.
        // We should probably keep the section but maybe mark it as "text-only" or handle the image hiding in the render loop.
        // However, the prompt says "hide the main image in the detail view".
        // If I look at the render loop:
        /*
        {projectSections.map((section, idx) => (
            <section ...>
                {section.type === 'main' && ( ... text content ... )}
                
                <div className="w-full flex flex-col items-center ...">
                    <img src={section.url} ... />
                </div>
            </section>
        ))}
        */
        // So if I remove it from `projectSections`, the text content also disappears.
        // I should keep it in `projectSections` but maybe add a flag `hideImage` to the section object?
        // Or I can modify the render loop to check `selectedProject.hideMainImageInDetail` when rendering the image for the main section.
        
        // Let's go with modifying the render loop. It's safer to keep the structure.
        // So I will revert the change to `projectSections` logic here and handle it in the JSX.
        // Wait, if I don't change `projectSections`, the image URL is still there.
        
        // Let's stick to the original plan but be careful.
        // If I remove the main section, I lose the text.
        // So I must keep the main section.
        
        sections.push({
            type: 'main',
            caption: selectedProject.mainImageCaption || "PROJECT STATEMENT",
            category: selectedProject.mainImageCategory || "OVERVIEW",
            url: selectedProject.imageUrl,
            hideImage: selectedProject.hideMainImageInDetail, // Pass this down
            ...selectedProject
        });
    }

    if (selectedProject.gallery) {
        sections.push(...selectedProject.gallery.map(item => ({
            type: 'gallery',
            caption: item.caption,
            category: item.category || "GALLERY",
            url: item.url
        })));
    }
    
    return sections;
  }, [selectedProject]);

  const categories = useMemo(() => {
      const cats: string[] = [];
      const seen = new Set<string>();
      projectSections.forEach(s => {
          if (!seen.has(s.category)) {
              seen.add(s.category);
              cats.push(s.category);
          }
      });
      return cats;
  }, [projectSections]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container || !selectedProject) return;

    const handleScroll = () => {
        const viewportCenter = container.scrollTop + (container.clientHeight * 0.5);
        const sections = container.querySelectorAll('section');
        
        categories.forEach((cat, index) => {
            const link = navLinkRefs.current[index];
            if (!link) return;

            // Find sections for this category
            // We rely on the order matching projectSections
            const catSections: HTMLElement[] = [];
            projectSections.forEach((s, sIdx) => {
                if (s.category === cat && sections[sIdx]) {
                    catSections.push(sections[sIdx] as HTMLElement);
                }
            });

            if (catSections.length === 0) return;

            const firstSection = catSections[0];
            const lastSection = catSections[catSections.length - 1];
            
            const categoryTop = firstSection.offsetTop;
            const categoryBottom = lastSection.offsetTop + lastSection.offsetHeight;
            const categoryHeight = categoryBottom - categoryTop;

            if (viewportCenter >= categoryTop && viewportCenter < categoryBottom) {
                if (!link.classList.contains('active')) {
                    navLinkRefs.current.forEach(l => {
                        if (l) {
                            l.classList.remove('active');
                            l.style.height = '';
                        }
                    });
                    link.classList.add('active');
                }

                // Dynamic Height Calculation
                let progress = (viewportCenter - categoryTop) / categoryHeight;
                progress = Math.max(0, Math.min(1, progress));

                const BASE_HEIGHT = 64; 
                const SCALING_FACTOR = 0.15;
                let calculatedMaxHeight = categoryHeight * SCALING_FACTOR;
                calculatedMaxHeight = Math.max(100, Math.min(calculatedMaxHeight, 300));
                
                // Use a sine wave for a more "fluid" expand/contract feel (peaks in middle)
                // or linear? The user said "expand/contract", implying it might grow then shrink?
                // Or just grow? The reference code grew linearly.
                // But "fluid feel" might suggest the wave.
                // Let's try a sine wave modification to the progress so it feels more organic.
                // Actually, let's stick to the reference logic which was linear but felt fluid due to CSS transition.
                
                const dynamicHeight = BASE_HEIGHT + ((calculatedMaxHeight - BASE_HEIGHT) * progress);
                link.style.height = `${dynamicHeight}px`;
            }
        });
    };

    container.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedProject, projectSections, categories]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !scrollTrackRef.current) return;
      
      const container = containerRef.current;
      const track = scrollTrackRef.current;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress based on the container's position relative to the viewport
      // The container is 300vh tall. The sticky view is 100vh.
      // So the effective "scrollable distance" is containerHeight - viewportHeight.
      const scrollDist = container.offsetHeight - viewportHeight;
      const scrolled = -rect.top; // Pixels scrolled past the top of the container
      
      if (scrolled <= 0) {
        // Before the section starts scrolling
        track.style.transform = `translateX(0px)`;
      } else if (scrolled >= scrollDist) {
        // After the section finishes scrolling (clamp to end)
        const maxTranslate = track.scrollWidth - (track.parentElement?.clientWidth || 0);
        track.style.transform = `translateX(-${maxTranslate}px)`;
      } else {
        // During the scroll
        const progress = scrolled / scrollDist;
        const maxTranslate = track.scrollWidth - (track.parentElement?.clientWidth || 0);
        track.style.transform = `translateX(-${progress * maxTranslate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Outer Container: Defines the height of the scroll track (speed of scroll) */}
      <div ref={containerRef} className="relative h-[300vh]">
        
        {/* Sticky Container: Holds the visual card in place while scrolling */}
        <div className="sticky top-6 h-screen flex items-center justify-center overflow-hidden">
            
            {/* The Visual Card */}
            <div className="relative w-full h-[90vh] flex flex-col p-6 md:p-16 bg-card-day rounded-[2.5rem] shadow-2xl border border-white/50 text-text-day overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.05] pointer-events-none rounded-[2.5rem]" />

                {/* Header */}
                <div className="relative z-10 flex-none flex flex-col md:flex-row md:items-baseline justify-between mb-8 md:mb-12 border-b border-black/10 pb-6">
                  <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter">
                      01 // 9-5
                  </h2>
                  <div className="flex flex-col items-end mt-4 md:mt-0">
                      <span className="font-mono text-accent-day text-[10px] md:text-sm tracking-widest">
                      [ PROFESSIONAL_WORKS_DATABASE ]
                      </span>
                      <span className="font-mono text-stone-400 text-[10px] mt-1 flex items-center gap-1">
                      SCROLL DOWN TO NAVIGATE <ArrowRight className="w-3 h-3 rotate-90" />
                      </span>
                  </div>
                </div>

                {/* Horizontal Sliding Area */}
                <div className="relative z-10 flex-grow overflow-hidden flex items-center">
                    {/* The Moving Track */}
                    <div ref={scrollTrackRef} className="flex gap-8 items-center will-change-transform pl-4">
                        {PROJECTS.map((project) => (
                        <div 
                            key={project.id} 
                            className="shrink-0 w-[85vw] md:w-[600px] h-[50vh] md:h-[55vh] flex flex-col group cursor-hover cursor-pointer relative"
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden mb-6 w-full flex-grow bg-stone-200 rounded-xl">
                            <img 
                                src={project.imageUrl} 
                                alt={project.title} 
                                className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105 group-hover:grayscale group-hover:contrast-125"
                            />
                            {/* Tech Overlay */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-between p-4 bg-black/5">
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-mono bg-accent-day text-white px-1">IMG_SRC_0{project.id}</span>
                                    <span className="text-[10px] font-mono bg-white text-black px-1">CLICK_TO_EXPAND</span>
                                </div>
                            </div>
                            </div>
                            
                            {/* Project Info */}
                            <div className="flex-none space-y-4">
                            <div className="flex justify-between items-start border-l-2 border-black/10 pl-4 group-hover:border-orange-500 transition-colors">
                                <div>
                                <h3 className="text-3xl font-medium mb-1 group-hover:text-orange-500 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-stone-500 font-mono text-xs mb-2">
                                    {project.category} — {project.year}
                                </p>
                                </div>
                                <ArrowUpRight className="w-6 h-6 text-text-day opacity-0 group-hover:opacity-100 transition-all" />
                            </div>

                            {/* Data Points */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-black/10">
                                <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
                                    <MapPin className="w-3 h-3 text-accent-day" />
                                    {project.locationCoordinates}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold tracking-wider border border-stone-200 px-2 py-1 text-stone-400 rounded-md">
                                    {tag}
                                </span>
                                ))}
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Project Detail Page (Full Screen Overlay) */}
      {selectedProject && (
        <div ref={contentRef} className="fixed inset-0 z-50 bg-card-day overflow-y-auto animate-in slide-in-from-bottom duration-500">
            
            {/* Styles for the sidebar animation */}
            <style>{`
                .dashboard-nav-link {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding-left: 60px;
                    width: 260px;
                    height: 64px;
                    background: rgba(253, 252, 248, 0.9);
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 35px; 
                    position: relative;
                    cursor: pointer;
                    text-decoration: none;
                    color: #1c1917; /* text-day */
                    box-shadow: 0 6px 15px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                }

                .dashboard-nav-link:hover {
                    transform: translateY(-2px);
                    background: #f5f5f4; /* stone-100 */
                }

                .dashboard-nav-link.active {
                    background: #0047AB; /* accent-day */
                    border-color: transparent;
                    color: #fff;
                    box-shadow: 0 18px 40px rgba(0, 71, 171, 0.2);
                }

                .dashboard-nav-text {
                    font-family: 'Bricolage Grotesque', sans-serif;
                    font-size: 0.95rem;
                    font-weight: 800;
                    white-space: normal;
                    line-height: 1.1;
                    text-align: left;
                    padding-right: 10px;
                    letter-spacing: 0.12em;
                    pointer-events: none;
                    text-transform: uppercase;
                }

                .dashboard-nav-link::before {
                    content: attr(data-number);
                    position: absolute;
                    left: 24px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1rem;
                    letter-spacing: 0.06em;
                    opacity: 0.5;
                }

                .dashboard-nav-link.active::before {
                    opacity: 1;
                }
            `}</style>

            {/* Close Button */}
            <button 
                onClick={() => setSelectedProject(null)}
                className="fixed top-8 right-8 z-50 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-accent-day hover:text-white transition-colors cursor-hover shadow-lg border border-black/5"
            >
                <X className="w-6 h-6" />
            </button>

            {(selectedProject.id === 3 || selectedProject.id === 4) ? (
                // Coming Soon Layout
                <div className="min-h-full flex flex-col relative">
                    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-12 py-24">
                        <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Header Info */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="font-mono text-accent-day text-sm tracking-widest">
                                    PROJECT_0{selectedProject.id}
                                </span>
                                <div className="h-[1px] w-12 bg-accent-day"></div>
                                <span className="font-mono text-stone-400 text-sm">
                                    {selectedProject.year}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-text-day">
                                {selectedProject.title}
                            </h1>

                            {/* Description & Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-black/10 pt-8 mb-12">
                                <div className="md:col-span-2">
                                    <div className="text-xl font-light leading-relaxed text-stone-600 space-y-6">
                                        {selectedProject.description.split('\n\n').map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 font-mono text-sm text-stone-500">
                                    <div className="flex justify-between border-b border-black/5 pb-2">
                                        <span>Category</span>
                                        <span className="text-text-day">{selectedProject.category}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-black/5 pb-2">
                                        <span>Location</span>
                                        <span className="text-text-day">{selectedProject.locationCoordinates}</span>
                                    </div>
                                    <div className="pt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.tags.map(tag => (
                                                <span key={tag} className="text-[10px] uppercase font-bold tracking-wider border border-stone-200 px-2 py-1 text-stone-400 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Coming Soon Creative Element */}
                            <div className="w-full h-[40vh] bg-stone-100 rounded-2xl border border-dashed border-stone-300 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%,rgba(0,0,0,0.02)_100%)] bg-[length:20px_20px] opacity-50" />
                                <div className="text-center z-10">
                                    <h2 className="text-6xl md:text-9xl font-bold text-stone-200 tracking-tighter select-none group-hover:text-accent-day/20 transition-colors duration-500">
                                        COMING SOON
                                    </h2>
                                    <p className="font-mono text-stone-400 mt-4 tracking-widest text-sm uppercase">
                                        [ Project Documentation In Progress ]
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer theme="day" />
                </div>
            ) : (
                // Standard Layout
                <>
                    <div className="flex min-h-full relative">
                        {/* Sidebar */}
                        <nav className="w-[320px] sticky top-0 h-screen flex flex-col justify-center items-start z-40 bg-card-day flex-shrink-0 pl-8">
                            <ul className="flex flex-col gap-6 items-start w-full">
                                {categories.map((cat, idx) => (
                                    <li key={idx} className="relative flex items-center">
                                        <a 
                                            href={`#category-${idx}`}
                                            className="dashboard-nav-link"
                                            data-number={String(idx + 1).padStart(2, '0')}
                                            ref={el => navLinkRefs.current[idx] = el}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const firstSectionIdx = projectSections.findIndex(s => s.category === cat);
                                                if (firstSectionIdx !== -1) {
                                                    document.getElementById(`section-${firstSectionIdx}`)?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                        >
                                            <span className="dashboard-nav-text">
                                                {cat}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Main Content */}
                        <div className="flex-1 relative pt-24">
                            {projectSections.map((section, idx) => (
                                <section 
                                    key={idx} 
                                    id={`section-${idx}`}
                                    className="w-full flex flex-col justify-center items-center mb-16 relative px-4 md:px-12"
                                >
                                    {/* For the first section (Main), show the header info */}
                                    {section.type === 'main' && (
                                        <div className="max-w-4xl w-full mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                            <div className="flex items-center gap-4 mb-6">
                                                <span className="font-mono text-accent-day text-sm tracking-widest">
                                                    PROJECT_0{selectedProject.id}
                                                </span>
                                                <div className="h-[1px] w-12 bg-accent-day"></div>
                                                <span className="font-mono text-stone-400 text-sm">
                                                    {selectedProject.year}
                                                </span>
                                            </div>
                                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-text-day">
                                                {selectedProject.title}
                                            </h1>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-black/10 pt-8 mb-12">
                                                <div className="md:col-span-2">
                                                    <div className="text-xl font-light leading-relaxed text-stone-600 space-y-6">
                                                        {selectedProject.description.split('\n\n').map((paragraph, i) => (
                                                            <p key={i}>{paragraph}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4 font-mono text-sm text-stone-500">
                                                    <div className="flex justify-between border-b border-black/5 pb-2">
                                                        <span>Category</span>
                                                        <span className="text-text-day">{selectedProject.category}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-black/5 pb-2">
                                                        <span>Location</span>
                                                        <span className="text-text-day">{selectedProject.locationCoordinates}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Image */}
                                    {/* @ts-ignore */}
                                    {!section.hideImage && (
                                        <div 
                                            className="w-full flex flex-col items-center rounded-2xl overflow-hidden relative group cursor-zoom-in"
                                            onClick={() => setLightboxImage(section.url)}
                                        >
                                            <img 
                                                src={section.url} 
                                                alt={section.caption}
                                                className="w-full h-auto object-contain max-h-[85vh]"
                                            />
                                            <div className="self-end mt-1 bg-white/90 backdrop-blur px-3 py-1 rounded font-mono text-xs text-stone-500 flex gap-2 items-center">
                                                <span className="font-bold">FIG. {String(idx).padStart(2, '0')}</span>
                                                <span className="w-[1px] h-3 bg-stone-300"></span>
                                                <span>{section.caption}</span>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>
                    </div>
                    
                    <Footer theme="day" />
                </>
            )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div 
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setLightboxImage(null)}
        >
            <button 
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                onClick={() => setLightboxImage(null)}
            >
                <X className="w-8 h-8" />
            </button>
            <img 
                src={lightboxImage} 
                alt="Enlarged view" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
      )}
    </>
  );
};

export default Projects;