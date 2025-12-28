import React, { useEffect, useRef, useMemo } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

interface PotteryGalleryProps {
  images: { url: string; caption: string }[];
  title: string;
  subtitle: string;
  description: string;
  onClose: () => void;
}

const PotteryGallery: React.FC<PotteryGalleryProps> = ({ images, title, subtitle, description, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, deltaX: 0, deltaY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate deltas
      mouseRef.current.deltaX = e.clientX - mouseRef.current.x;
      mouseRef.current.deltaY = e.clientY - mouseRef.current.y;
      
      // Update current position
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget.querySelector('img');
    if (!target) return;

    const { deltaX, deltaY } = mouseRef.current;
    
    // Kill existing tweens
    gsap.killTweensOf(target);

    // Simulate the "kick" effect
    // We move the image in the direction of the mouse movement
    // Then snap it back elastically
    
    const tl = gsap.timeline();
    
    // Initial "push" based on velocity
    // We use a quick set or very fast tween to displace it, then elastic back
    // Or we can just animate from the displaced position if we want it to feel instant
    
    // Let's try animating TO the displaced position then back
    // The original code used inertia velocity, which essentially starts moving at that speed
    // and slows down. Since end is 0, it goes to 0.
    
    // We can approximate this by "punching" it:
    // 1. Move it slightly in direction of delta
    // 2. Spring back to 0
    
    const punchFactor = 2; // Adjust for sensitivity
    
    tl.to(target, {
        x: deltaX * punchFactor,
        y: deltaY * punchFactor,
        duration: 0.1,
        ease: "power4.out"
    })
    .to(target, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)"
    });

    // Rotation wobble
    const rotationTl = gsap.timeline();
    rotationTl.fromTo(target, 
        { rotate: 0 },
        {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * 10, // Random wobble
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
        }
    );
  };

  const displayImages = useMemo(() => {
    if (images.length === 0) return [];
    let result = [...images];
    while (result.length < 12) {
      result = [...result, ...images];
    }
    return result;
  }, [images]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60] bg-[#121212] text-[#F1F1F1] overflow-hidden animate-in fade-in duration-500">
        {/* Header */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex flex-col md:flex-row md:items-end gap-4 md:gap-6 pointer-events-none max-w-6xl pr-16 md:pr-24">
            <div className="flex flex-col items-start shrink-0">
                <h2 className="text-3xl md:text-6xl font-bold tracking-tighter text-white mb-2">
                    {title}
                </h2>
                <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-white text-black text-[10px] md:text-xs font-mono uppercase tracking-widest rounded-md">
                        {subtitle}
                    </span>
                    <span className="text-[10px] md:text-xs font-mono text-stone-400 hidden md:inline-block">
                        // HOVER TO INTERACT
                    </span>
                    <span className="text-[10px] md:text-xs font-mono text-stone-400 md:hidden">
                        // TAP TO INTERACT
                    </span>
                </div>
            </div>
            <p className="text-xs md:text-sm text-stone-300 font-mono leading-relaxed max-w-xs md:max-w-md md:mb-1 bg-white/5 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-white/10 shadow-sm hidden md:block">
                {description}
            </p>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
        >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Grid Content */}
        <div className="w-full h-full overflow-y-auto pt-32 md:pt-48 pb-12 px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-[1vw] max-w-[1600px] mx-auto">
                {displayImages.map((img, idx) => (
                    <div 
                        key={idx} 
                        className="relative aspect-square flex items-center justify-center overflow-visible group"
                        onMouseEnter={handleMouseEnter}
                    >
                        <img 
                            src={img.url} 
                            alt={img.caption}
                            className="w-[80%] h-[80%] object-cover rounded-[4%] shadow-2xl will-change-transform pointer-events-none"
                        />
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs pointer-events-none">
                            {img.caption}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default PotteryGallery;
