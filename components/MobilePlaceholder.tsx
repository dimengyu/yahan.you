import React from 'react';
import { Monitor } from 'lucide-react';

const MobilePlaceholder: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-8">
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping" />
            <div className="absolute inset-0 border-2 border-white/40 rounded-full animate-pulse delay-75" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Monitor className="w-10 h-10 text-white" />
            </div>
        </div>
        
        <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter">
                DESKTOP EXPERIENCE
            </h1>
            <div className="h-px w-24 bg-white/20 mx-auto" />
            <p className="font-mono text-sm text-stone-400 leading-relaxed">
                // SYSTEM_NOTICE<br/>
                This portfolio is designed for a cinematic desktop experience. Please view on a larger screen.
            </p>
            <p className="font-mono text-xs text-stone-600 mt-8 animate-pulse">
                MOBILE_OPTIMIZATION_IN_PROGRESS...
            </p>
        </div>
      </div>
    </div>
  );
};

export default MobilePlaceholder;
