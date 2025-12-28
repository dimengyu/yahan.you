import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Life from './components/Life';
import About from './components/About';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { NAV_LINKS } from './constants';
import { useImagePreloader } from './hooks/useImagePreloader';

const App: React.FC = () => {
  useImagePreloader();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [theme, setTheme] = useState<'day' | 'night'>('day');

  useEffect(() => {
    // Fade in animation for the whole app
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('opacity-0', 'transition-opacity', 'duration-1000');
      requestAnimationFrame(() => {
        root.classList.remove('opacity-0');
      });
    }

    const handleScroll = () => {
      // Scrollspy logic
      const sections = NAV_LINKS.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2.5;

      let currentId = 'home';
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition) {
          currentId = section.id;
        }
      }
      
      setActiveSection(currentId);

      // Determine Theme based on section
      // Switch to night mode when approaching Life section
      const lifeSection = document.getElementById('5-9');
      if (lifeSection) {
          const rect = lifeSection.getBoundingClientRect();
          // If life section is coming into view (e.g., top is near viewport center)
          if (rect.top < window.innerHeight / 1.5) {
              setTheme('night');
          } else {
              setTheme('day');
          }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <Navigation activeSection={activeSection} theme={theme} />
      
      {/* Fixed Background Layer */}
      <div 
        className={`fixed inset-0 -z-10 transition-colors duration-[1500ms] ease-in-out ${
          theme === 'day' ? 'bg-bg-day-main' : 'bg-bg-night-main'
        }`}
      />

      {/* Main Content - Sections as Cards */}
      <main className="container mx-auto max-w-[95rem] py-16 px-4 md:px-8 space-y-16">
        
        <section id="home" className="scroll-mt-32">
          <Hero />
        </section>

        <section id="9-5" className="scroll-mt-32">
          <Projects />
        </section>

        <section id="5-9" className="scroll-mt-32">
          <Life />
        </section>
        
        <section id="about" className="scroll-mt-32">
          <About />
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default App;