import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X } from 'lucide-react';

interface SpiralGalleryProps {
  images: { url: string; caption: string }[];
  title: string;
  subtitle: string;
  description: string;
  onClose: () => void;
}

const SpiralGallery: React.FC<SpiralGalleryProps> = ({ images, title, subtitle, description, onClose }) => {
  const worldRef = useRef<HTMLDivElement>(null);
  const [currentScroll, setCurrentScroll] = useState(0);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const autoScrollActiveRef = useRef(false);
  const autoScrollSpeed = 1;
  const requestRef = useRef<number>();

  // Configuration
  const ANGLE_STEP = 30;
  const HEIGHT_STEP = 60;
  const [radius, setRadius] = useState(400);

  useEffect(() => {
    const handleResize = () => {
        setRadius(window.innerWidth < 768 ? 250 : 400);
    };
    
    handleResize(); // Initial set
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Repeat the whole set of photos to make sure at least 12 photos shown in the gallery
  const displayImages = useMemo(() => {
    if (images.length === 0) return [];
    let result = [...images];
    while (result.length < 12) {
      result = [...result, ...images];
    }
    return result;
  }, [images]);

  const TOTAL_CARDS = displayImages.length;
  const MIN_SCROLL = -HEIGHT_STEP;
  const MAX_SCROLL = ((TOTAL_CARDS - 1) * HEIGHT_STEP) + HEIGHT_STEP;

  const limitScroll = () => {
    if (targetScrollRef.current < MIN_SCROLL) targetScrollRef.current = MIN_SCROLL;
    if (targetScrollRef.current > MAX_SCROLL) targetScrollRef.current = MAX_SCROLL;
  };

  const animate = () => {
    // Lerp
    currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08;
    
    if (autoScrollActiveRef.current) {
        targetScrollRef.current += autoScrollSpeed;
        limitScroll();
        
        // Stop auto scroll if we hit the end
        if (targetScrollRef.current >= MAX_SCROLL || targetScrollRef.current <= MIN_SCROLL) {
            autoScrollActiveRef.current = false;
        }
    }

    if (worldRef.current) {
        const worldY = -currentScrollRef.current;
        const rotationRatio = ANGLE_STEP / HEIGHT_STEP;
        const worldRotateY = -currentScrollRef.current * rotationRatio;
        
        worldRef.current.style.transform = `translateY(${worldY}px) rotateY(${worldRotateY}deg)`;
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    targetScrollRef.current = 0;
    currentScrollRef.current = 0;
    requestRef.current = requestAnimationFrame(animate);

    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Event Handlers
  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault(); // React's synthetic event doesn't support preventing default for wheel in the same way as native
    autoScrollActiveRef.current = false;
    targetScrollRef.current += e.deltaY * 0.5;
    limitScroll();
  };

  // We need to attach non-passive wheel listener to window/container to prevent default scrolling
  useEffect(() => {
    const preventDefault = (e: WheelEvent) => e.preventDefault();
    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', preventDefault, { passive: false });
    return () => {
        document.body.style.overflow = '';
        window.removeEventListener('wheel', preventDefault);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    lastYRef.current = targetScrollRef.current;
    autoScrollActiveRef.current = false;
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = (e.clientY - startYRef.current) * 2;
    targetScrollRef.current = lastYRef.current - deltaY;
    limitScroll();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    lastYRef.current = targetScrollRef.current;
    autoScrollActiveRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    // e.preventDefault(); // Handled by CSS touch-action: none
    const deltaY = (e.touches[0].clientY - startYRef.current) * 2;
    targetScrollRef.current = lastYRef.current - deltaY;
    limitScroll();
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div 
        className="fixed inset-0 z-[60] bg-[#0f1115] text-white overflow-hidden animate-in fade-in duration-500 touch-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
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
                        // SCROLL OR DRAG
                    </span>
                    <span className="text-[10px] md:text-xs font-mono text-stone-400 md:hidden">
                        // SWIPE TO EXPLORE
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

        {/* 3D Scene */}
        <div className="relative w-full h-full flex items-center justify-center perspective-1000 bg-[radial-gradient(circle_at_center,#1a1d24_0%,#000000_100%)]">
            <div 
                ref={worldRef}
                className="relative w-0 h-0 preserve-3d transition-transform duration-100 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
                {displayImages.map((img, i) => {
                    const rotateY = i * ANGLE_STEP;
                    const translateY = i * HEIGHT_STEP;
                    // We use inline styles for the complex 3D transforms
                    return (
                        <div
                            key={i}
                            className="absolute left-[-80px] top-[-120px] w-[160px] h-[240px] md:w-[200px] md:h-[300px] bg-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[2px] border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-125 hover:border-[#646cff] hover:shadow-[0_0_20px_rgba(100,108,255,0.4)]"
                            style={{
                                transform: `rotateY(${rotateY}deg) translateZ(${radius}px) translateY(${translateY}px)`,
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            <img 
                                src={img.url} 
                                alt={img.caption} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute bottom-2 right-2 text-2xl font-extrabold text-white/10 pointer-events-none leading-none">
                                {(i + 1).toString().padStart(2, '0')}
                            </div>
                            <div className="absolute bottom-4 left-4 text-xs text-white/90 font-medium text-shadow-sm pointer-events-none bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 whitespace-nowrap">
                                {img.caption}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <style>{`
            .perspective-1000 {
                perspective: 1000px;
            }
            .preserve-3d {
                transform-style: preserve-3d;
            }
        `}</style>
    </div>
  );
};

export default SpiralGallery;
