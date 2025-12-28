import React from 'react';
import { ArrowUpRight, Copy, Check } from 'lucide-react';

interface FooterProps {
  theme?: 'day' | 'night';
}

const Footer: React.FC<FooterProps> = ({ theme = 'night' }) => {
  const [copied, setCopied] = React.useState(false);
  const currentYear = new Date().getFullYear();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('yyou@mkskstudios.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SOCIALS = [
    { label: 'Email', value: 'yyou@mkskstudios.com', href: 'mailto:yyou@mkskstudios.com', isCopy: true },
    { label: 'LinkedIn', value: 'Profile', href: 'https://www.linkedin.com/in/yahan-you-7b1a20192/', isExternal: true },
    { label: 'MKSK', value: 'Team Page', href: 'https://mkskstudios.com/team/yahan-you', isExternal: true },
  ];

  const isDay = theme === 'day';

  return (
    <footer className={`relative w-full py-12 px-6 md:py-24 md:px-16 font-mono text-sm z-10 ${isDay ? 'text-stone-600' : 'text-stone-300 mix-blend-screen'}`}>
      <div className="container mx-auto max-w-[95rem]">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-32">
          {/* Label Column */}
          <div className="md:col-span-3 lg:col-span-2">
            <span className={`italic font-serif text-lg ${isDay ? 'text-stone-500' : 'text-stone-400'}`}>Contact</span>
          </div>

          {/* Links Column */}
          <div className="md:col-span-9 lg:col-span-10 flex flex-col gap-8">
            {SOCIALS.map((social, idx) => (
              <div key={idx} className="group flex items-end justify-between gap-4">
                
                {/* Left Side: Label */}
                <span className={`${isDay ? 'text-stone-600 group-hover:text-accent-day' : 'text-stone-300 group-hover:text-accent-night'} transition-colors duration-300 whitespace-nowrap`}>
                  {social.label}
                </span>

                {/* Line - Flex grow to fill space */}
                <div className={`flex-grow mb-1.5 h-[1px] ${isDay ? 'bg-black/10 group-hover:bg-accent-day/50' : 'bg-white/10 group-hover:bg-accent-night/50'} transition-colors duration-500`}></div>

                {/* Right Side: Value/Icon */}
                {social.isCopy ? (
                   <button 
                    onClick={handleCopyEmail}
                    className={`flex items-center gap-2 ${isDay ? 'hover:text-black' : 'hover:text-white'} transition-colors whitespace-nowrap`}
                   >
                     <span className={`hidden sm:inline ${isDay ? 'text-stone-500 hover:text-black' : 'text-stone-400 hover:text-white'} transition-colors`}>{social.value}</span>
                     {copied ? <Check className={`w-4 h-4 ${isDay ? 'text-accent-day' : 'text-accent-night'}`} /> : <Copy className="w-4 h-4" />}
                   </button>
                ) : (
                   <a 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 ${isDay ? 'hover:text-black' : 'hover:text-white'} transition-colors whitespace-nowrap`}
                   >
                     <span className={`hidden sm:inline ${isDay ? 'text-stone-500 hover:text-black' : 'text-stone-400 hover:text-white'} transition-colors`}>{social.value}</span>
                     {social.isExternal && <ArrowUpRight className="w-4 h-4" />}
                   </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <p className={`italic font-light text-base md:text-lg ${isDay ? 'text-stone-500' : 'text-stone-400'}`}>
                    "Sustainability: Because Mars has terrible landscaping."
                </p>
                <span className={`text-xs tracking-wider whitespace-nowrap ${isDay ? 'text-stone-500' : 'text-stone-500'}`}>
                    &copy; {currentYear} YAHAN.YOU
                </span>
            </div>
            
            <div className={`border-t pt-8 flex justify-center ${isDay ? 'border-black/10' : 'border-white/10'}`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${isDay ? 'text-stone-500' : 'text-stone-400'}`}>
                    made with ❤️ by Mengyu
                </span>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;