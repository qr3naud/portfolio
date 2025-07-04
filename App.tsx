'use client';

import { useEffect, useState, useRef } from 'react';
import { ChladniBackground } from './components/ChladniBackground';
import { Section } from './components/Section';
import { RotatingText } from './components/RotatingText';
import { motion } from 'framer-motion';

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.getElementById('scroll-container');
      if (!scrollContainer) return;

      const scrollLeft = scrollContainer.scrollLeft;
      const sectionWidth = window.innerWidth;
      const newSection = Math.round(scrollLeft / sectionWidth);
      
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    };

    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [currentSection]);

  // Enhanced touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const scrollContainer = document.getElementById('scroll-container');
      if (scrollContainer) {
        if (deltaX > 0 && currentSection < sections.length - 1) {
          // Swipe left - go to next section
          scrollContainer.scrollTo({
            left: (currentSection + 1) * window.innerWidth,
            behavior: 'smooth'
          });
        } else if (deltaX < 0 && currentSection > 0) {
          // Swipe right - go to previous section
          scrollContainer.scrollTo({
            left: (currentSection - 1) * window.innerWidth,
            behavior: 'smooth'
          });
        }
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const sections = [
    {
      type: 'hero',
      title: "I vibe at any frequency.",
      content: "I help startups scale — at the intersection of code, design, and GTM.",
      isHero: true
    },
    {
      type: 'growth',
      title: "Growth",
      subtitle: "I drive growth through systems thinking.",
      content: "From building automations to improving funnels, I craft growth loops that compound over time — pairing sharp GTM execution with product thinking."
    },
    {
      type: 'code',
      title: "Code",
      subtitle: "I write code to unblock ideas.",
      content: "Comfortable across JS, Python, and AI tools — I prototype fast, automate where it matters, and speak dev fluently to bridge business and tech."
    },
    {
      type: 'design',
      title: "Design",
      subtitle: "I design experiences that feel intentional.",
      content: "With a background in strategic design, I create products that resonate — from UX flows to messaging and storytelling."
    },
    {
      type: 'cta',
      title: "Let's work together.",
      content: "If you're building in AI, productivity, or SaaS — let's talk.",
      isCTA: true
    }
  ];

  const roleTexts = [
    "I could be your GTM Engineer.",
    "I could be your Design Strategist.", 
    "I could be your Chief of Staff.",  
    "I could be your Product Designer."
  ];

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Chladni Background */}
      <ChladniBackground patternIndex={currentSection} />
      
      {/* Scroll Container */}
      <div
        id="scroll-container"
        className="flex w-full h-full overflow-x-auto overflow-y-hidden"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {sections.map((section, index) => (
          <Section key={index} className="scroll-snap-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 sm:space-y-8"
            >
              {section.isHero ? (
                // Hero Section
                <>
                  <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 leading-tight px-2 sm:px-0">
                      {section.title}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
                      {section.content}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-500 uppercase tracking-wider">
                    Quentin Renaud
                  </div>
                </>
              ) : section.isCTA ? (
                // CTA Section
                <>
                  <div className="space-y-6 sm:space-y-8">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 px-2 sm:px-0">
                      {section.title}
                    </h2>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 min-h-[1.5em] sm:min-h-[2em] flex items-center justify-center px-4 sm:px-0">
                        <RotatingText 
                          texts={roleTexts}
                          interval={2500}
                        />
                      </div>
                      
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
                        {section.content}
                      </p>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <button
                        onClick={() => window.open('mailto:reno.quentin@gmail.com', '_blank')}
                        className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-full transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg text-base sm:text-lg md:text-xl font-medium"
                      >
                        <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                          Let's connect
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-lg sm:text-xl"
                          >
                            →
                          </motion.span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </motion.div>
                  </div>
                </>
              ) : (
                // Regular Sections
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-xs sm:text-sm md:text-base text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 leading-tight px-2 sm:px-0">
                      {section.subtitle}
                    </h2>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                    {section.content}
                  </p>
                </div>
              )}
            </motion.div>
          </Section>
        ))}
      </div>

      {/* Enhanced Navigation Dots with better touch targets */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const scrollContainer = document.getElementById('scroll-container');
              if (scrollContainer) {
                scrollContainer.scrollTo({
                  left: index * window.innerWidth,
                  behavior: 'smooth'
                });
              }
            }}
            className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSection
                ? 'bg-gray-900 scale-125'
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            style={{ minWidth: '16px', minHeight: '16px' }} // Ensure minimum touch target
          />
        ))}
      </div>

      {/* Mobile-optimized Scroll Hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: currentSection === 0 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-6 sm:bottom-8 right-4 sm:right-8 text-gray-500 text-xs sm:text-sm flex items-center space-x-2 pointer-events-none"
      >
        <span className="hidden sm:inline">Scroll horizontally</span>
        <span className="sm:hidden">Swipe</span>
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400"
        >
          →
        </motion.div>
      </motion.div>

      {/* Frequency Indicator with mobile optimization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed top-4 sm:top-8 left-4 sm:left-8 text-xs text-gray-400 font-mono pointer-events-none"
      >
        FREQ: {String(currentSection + 1).padStart(2, '0')}/05
      </motion.div>
    </div>
  );
}