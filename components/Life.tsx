import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { HOBBIES } from '../constants';
import { HobbyType, Hobby } from '../types';
import Footer from './Footer';
import { Camera, PenTool, Hand, X, ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import SpiralGallery from './SpiralGallery';
import PotteryGallery from './PotteryGallery';

gsap.registerPlugin(Draggable);

const SketchesGallery = ({ images, title, subtitle, description, onClose }: { images: { url: string; caption: string }[]; title: string; subtitle: string; description: string; onClose: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  // Repeat the whole set of photos to make sure at least 12 photos shown in the gallery
  const displayImages = React.useMemo(() => {
    if (images.length === 0) return [];
    let result = [...images];
    while (result.length < 12) {
      result = [...result, ...images];
    }
    return result;
  }, [images]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const itemElements = gsap.utils.toArray(".gallery-item");
      const cardElements = gsap.utils.toArray(".gallery-card");
      const imageSize = itemElements.length;
      const total = itemElements.length;
      const degree = 360 / total;

      const timeline = gsap.timeline();

      itemElements.forEach((image: any, index) => {
        const sign = Math.floor((index / 2) % 2) ? 1 : -1;
        const value = Math.floor((index + 4) / 4) * 4;
        const rotation = index > imageSize - 3 ? 0 : sign * value;

        gsap.set(image, {
          rotation: rotation,
          scale: 0.5,
        });

        timeline.from(
          image,
          {
            x: () =>
              index % 2
                ? window.innerWidth + image.clientWidth * 4
                : -window.innerWidth - image.clientWidth * 4,
            y: () => window.innerHeight - image.clientHeight,
            rotation: index % 2 ? 200 : -200,
            scale: 4,
            opacity: 1,
            ease: "power4.out",
            duration: 1,
            delay: 0.15 * Math.floor(index / 2),
          },
          0
        );

        let rotationAngle = index * degree;
        timeline.to(
          image,
          {
            scale: 1,
            duration: 0,
          },
          0.15 * (imageSize / 2 - 1) + 1
        );

        timeline.to(
          image,
          {
            transformOrigin: "center 200vh",
            rotation:
              index > imageSize / 2 ? -degree * (imageSize - index) : rotationAngle,
            duration: 1,
            ease: "power1.out",
          },
          0.15 * (imageSize / 2 - 1) + 1
        );
      });

      let start = 0;
      let autoRotateTween: gsap.core.Tween;

      const startAutoRotate = () => {
        autoRotateTween = gsap.to(itemsRef.current, {
          rotation: "-=360",
          duration: 120,
          ease: "none",
          repeat: -1,
          overwrite: "auto",
          delay: 2
        });
      };

      // Start auto-rotation initially
      startAutoRotate();

      Draggable.create(itemsRef.current, {
        type: "rotation",
        trigger: containerRef.current, // Allow dragging anywhere on the screen
        onDragStart: function () {
          start = this.rotation;
          // Pause auto-rotation when user starts dragging
          if (autoRotateTween) autoRotateTween.kill();
          
          // Randomize card rotations slightly on drag start for a natural feel
          gsap.to(cardElements, {
            rotation: () => gsap.utils.random(-12, 12),
            duration: 0.5,
            ease: "back.out(1.5)"
          });
        },
        onDragEnd: function () {
          const rotation = this.rotation;
          const offset = rotation - start;
          const threshold = 5; // Sensitivity threshold in degrees

          let targetRotation = 0;

          // If dragged significantly but not enough to cross the halfway point naturally
          // We force a switch to the next/prev item to make it feel responsive
          if (Math.abs(offset) > threshold && Math.abs(offset) < degree / 2) {
            targetRotation = start + (offset > 0 ? degree : -degree);
          } else {
            // Otherwise snap to the nearest slot based on position
            targetRotation = Math.round(rotation / degree) * degree;
          }

          // Snap the carousel
          gsap.to(itemsRef.current, {
            rotation: targetRotation,
            duration: 0.5,
            ease: "power2.out",
            onComplete: startAutoRotate // Resume auto-rotation after snap
          });

          // Slight random movement then return to original state (0 rotation)
          gsap.to(cardElements, {
            rotation: () => gsap.utils.random(-5, 5),
            duration: 0.2,
            ease: "power1.out",
            onComplete: () => {
                gsap.to(cardElements, {
                    rotation: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            }
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [displayImages]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60] bg-[#0a0a0a] text-white overflow-hidden animate-in fade-in duration-500 touch-none">
        {/* Header */}
        <div className="absolute top-8 left-8 z-50 flex flex-col md:flex-row md:items-end gap-6 pointer-events-none max-w-6xl pr-24">
            <div className="flex flex-col items-start shrink-0">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2">
                    {title}
                </h2>
                <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-white text-black text-xs font-mono uppercase tracking-widest rounded-md">
                        {subtitle}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                        // DRAG TO EXPLORE
                    </span>
                </div>
            </div>
            <p className="text-sm text-stone-300 font-mono leading-relaxed max-w-md md:mb-1 bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-sm">
                {description}
            </p>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
        >
            <X className="w-6 h-6 text-white" />
        </button>

        {/* Styles */}
        <style>{`
            .gallery-center {
                height: 100vh;
                position: absolute;
                left: 50%;
                top: 28%;
                transform: translate(-50%);
                user-select: none;
            }
            .gallery-items {
                transform-origin: center 200vh;
                transform: rotate(0);
                user-select: none;
                display: flex;
            }
            .gallery-item {
                position: absolute;
                user-select: none;
                cursor: pointer;
                transform: translateX(-50%);
            }
            .gallery-card {
                display: block;
                width: 430px;
                height: 610px;
                color: #fff;
                user-select: none;
                border-radius: 17px;
                overflow: hidden;
                cursor: grab;
                position: relative;
                border: 10px solid #e5e5e5;
            }
            .gallery-image {
                height: 100%;
                width: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none;
            }
            @media screen and (max-height: 1000px) {
                .gallery-card {
                    width: 350px;
                    height: 497px;
                }
            }
            @media screen and (max-height: 800px) {
                .gallery-card {
                    width: 300px;
                    height: 400px;
                }
            }
        `}</style>
        
        <div className="gallery-center">
            <div ref={itemsRef} className="gallery-items">
                {displayImages.map((img, idx) => (
                    <div key={idx} className="gallery-item">
                        <div className="gallery-card">
                            <img className="gallery-image" src={img.url} alt={img.caption} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

const Life: React.FC = () => {
  const [selectedStack, setSelectedStack] = useState<HobbyType | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Group hobbies by type
  const hobbyStacks = {
    [HobbyType.HAND]: HOBBIES.filter(h => h.type === HobbyType.HAND),
    [HobbyType.PEN]: HOBBIES.filter(h => h.type === HobbyType.PEN),
    [HobbyType.ELECTRONICS]: HOBBIES.filter(h => h.type === HobbyType.ELECTRONICS),
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedHobby) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedHobby]);

  // Reset currentCardIndex when stack changes
  useEffect(() => {
    if (selectedStack) {
      setCurrentCardIndex(0);
    }
  }, [selectedStack]);

  const getIcon = (type: HobbyType) => {
    switch (type) {
        case HobbyType.HAND: return <Hand className="w-4 h-4" />;
        case HobbyType.PEN: return <PenTool className="w-4 h-4" />;
        case HobbyType.ELECTRONICS: return <Camera className="w-4 h-4" />;
    }
  };

  const handleStackClick = (type: HobbyType) => {
    if (type === HobbyType.HAND) {
        setSelectedStack(type);
    } else {
        // For Pen and Electronics, directly open the first (and only) item
        const hobby = hobbyStacks[type][0];
        if (hobby) {
            setSelectedHobby(hobby);
        }
    }
  };

  const handleBackToStacks = () => {
    setSelectedStack(null);
  };

  const handleNextCard = () => {
    if (!selectedStack) return;
    const totalCards = hobbyStacks[selectedStack].length;
    setCurrentCardIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrevCard = () => {
    if (!selectedStack) return;
    const totalCards = hobbyStacks[selectedStack].length;
    setCurrentCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <>
      {/* Outer Container */}
      <div ref={containerRef} className="relative h-[200vh]">
        
        {/* Sticky Container */}
        <div className="sticky top-6 h-screen flex items-center justify-center overflow-hidden">
            
            <div className="relative w-full h-[90vh] bg-card-night text-text-night rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/20 overflow-hidden transition-colors duration-500">
                {/* Dark Grid Background */}
                <div className="absolute inset-0 bg-grid-pattern-dark bg-[length:40px_40px] opacity-[0.1] pointer-events-none rounded-[2.5rem]" />

                {/* Title and Instructions */}
                <div className="absolute top-8 left-12 z-20">
                    <div className="font-mono text-accent-night text-sm mb-4">
                        // SYSTEM_STATUS: CREATIVE_OVERDRIVE
                    </div>
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-4">
                        02 // 5-9
                    </h2>
                    {selectedStack && (
                        <button
                            onClick={handleBackToStacks}
                            className="flex items-center gap-2 text-accent-night hover:text-white transition-colors font-mono text-sm group"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            BACK_TO_STACKS
                        </button>
                    )}
                    {!selectedStack && (
                        <div className="font-mono text-stone-500 text-[10px] flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent-night rounded-full animate-pulse"/>
                            SELECT A CATEGORY
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 w-full h-full flex items-center justify-center pt-32">
                    
                    {/* Three Categories View */}
                    {!selectedStack && (
                        <div className="flex gap-8 md:gap-16 items-center justify-center w-full px-4">
                            {Object.values(HobbyType).map((type, stackIndex) => (
                                <div
                                    key={type}
                                    className="relative cursor-pointer group transition-transform hover:scale-105 duration-300"
                                    onClick={() => handleStackClick(type)}
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${stackIndex * 0.15}s backwards`
                                    }}
                                >
                                    {/* Card/Stack Container */}
                                    <div className="relative w-48 md:w-64 aspect-[3/4]">
                                        {type === HobbyType.HAND ? (
                                            // Stack Effect for HAND
                                            hobbyStacks[type].map((hobby, cardIndex) => {
                                                const offset = cardIndex * 3;
                                                const rotation = cardIndex % 2 === 0 ? -2 : 2;
                                                return (
                                                    <div
                                                        key={hobby.id}
                                                        className="absolute inset-0 bg-stone-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 group-hover:border-accent-night"
                                                        style={{
                                                            transform: `translate(${offset}px, ${offset}px) rotate(${rotation}deg)`,
                                                            zIndex: cardIndex,
                                                        }}
                                                    >
                                                        {cardIndex === hobbyStacks[type].length - 1 && (
                                                            <div className="relative h-full overflow-hidden bg-black">
                                                                <img
                                                                    src={hobby.imageUrl}
                                                                    alt={hobby.title}
                                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            // Single Card for PEN and ELECTRONICS
                                            <div className="absolute inset-0 bg-stone-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 group-hover:border-accent-night">
                                                <div className="relative h-full overflow-hidden bg-black">
                                                    <img
                                                        src={hobbyStacks[type][0]?.imageUrl}
                                                        alt={type}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Label */}
                                    <div className="mt-6 text-center">
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <span className="p-2 rounded-lg bg-accent-night text-black">
                                                {getIcon(type)}
                                            </span>
                                        </div>
                                        <h3 className="font-mono uppercase tracking-widest text-sm text-white">
                                            {type}
                                        </h3>
                                        <p className="font-mono text-xs text-stone-500 mt-1">
                                            {type === HobbyType.HAND ? "2 Collections" : "View Gallery"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Spread Cards View (Only for HAND) */}
                    {selectedStack === HobbyType.HAND && (
                        <div className="relative w-full h-full flex items-center justify-center gap-8 md:gap-16 px-4">
                            {hobbyStacks[HobbyType.HAND].map((hobby, idx) => (
                                <div
                                    key={hobby.id}
                                    onClick={() => setSelectedHobby(hobby)}
                                    className="relative w-full max-w-sm aspect-[3/4] bg-stone-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col select-none transition-all duration-300 hover:scale-105 hover:border-accent-night cursor-pointer group"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s backwards`
                                    }}
                                >
                                    <div className="relative flex-grow overflow-hidden bg-black">
                                        <img
                                            src={hobby.imageUrl}
                                            alt={hobby.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                    </div>
                                    <div className="p-6 bg-card-night border-t border-white/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white">{hobby.title}</h3>
                                            <span className="text-[10px] font-mono border border-accent-night text-accent-night px-2 py-1 rounded">
                                                0{idx + 1}
                                            </span>
                                        </div>
                                        <p className="font-mono text-xs text-stone-400">
                                            {hobby.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Full Page Detail View */}
      {selectedHobby && (
        selectedHobby.title === "Latte Art" ? (
            <SpiralGallery 
                images={selectedHobby.gallery || []} 
                title={selectedHobby.title}
                subtitle={selectedHobby.type}
                description={selectedHobby.description}
                onClose={() => setSelectedHobby(null)} 
            />
        ) : selectedHobby.title === "Pottery" ? (
            <PotteryGallery 
                images={selectedHobby.gallery || []} 
                title={selectedHobby.title}
                subtitle={selectedHobby.type}
                description={selectedHobby.description}
                onClose={() => setSelectedHobby(null)} 
            />
        ) : (selectedHobby.type === HobbyType.PEN || selectedHobby.type === HobbyType.ELECTRONICS) ? (
            <SketchesGallery 
                images={selectedHobby.gallery || []} 
                title={selectedHobby.title}
                subtitle={selectedHobby.type}
                description={selectedHobby.description}
                onClose={() => setSelectedHobby(null)} 
            />
        ) : (
        <div className="fixed inset-0 z-50 bg-card-night overflow-y-auto animate-in slide-in-from-bottom duration-500">
            {/* Header / Nav */}
            <div className="sticky top-0 z-40 flex justify-between items-center p-6 md:p-8 bg-card-night/90 backdrop-blur border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSelectedHobby(null)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{selectedHobby.title}</h2>
                        <span className="text-xs font-mono text-accent-night">{selectedHobby.type}</span>
                    </div>
                </div>
                <div className="font-mono text-xs text-stone-500 hidden md:block">
                    // {selectedHobby.date}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6 md:p-12">
                {/* Hero Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            {selectedHobby.title}
                        </h1>
                        <p className="text-lg text-stone-300 leading-relaxed font-light border-l-2 border-accent-night pl-6">
                            {selectedHobby.description}
                        </p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video md:aspect-auto">
                        <img 
                            src={selectedHobby.imageUrl} 
                            alt={selectedHobby.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedHobby.gallery?.map((item, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden bg-stone-900 border border-white/5">
                            <img 
                                src={item.url} 
                                alt={item.caption}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <p className="font-mono text-xs text-white">
                                    <span className="text-accent-night mr-2">0{idx + 1}</span>
                                    {item.caption}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <Footer />
        </div>
        )
      )}
    </>
  );
};

export default Life;