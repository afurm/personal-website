'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUser, 
  FaBriefcase, 
  FaCog, 
  FaGraduationCap, 
  FaEnvelope, 
  FaHome,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa';
import { useReducedMotion, useDevicePerformance } from '@/hooks/use-reduced-motion';

const navigationItems = [
  { href: '#hero', label: 'Home', icon: FaHome, section: 'hero' },
  { href: '#about', label: 'About', icon: FaUser, section: 'about' },
  { href: '#experience', label: 'Work', icon: FaBriefcase, section: 'experience' },
  { href: '#skills', label: 'Skills', icon: FaCog, section: 'skills' },
  { href: '#education', label: 'Education', icon: FaGraduationCap, section: 'education' },
  { href: '#contact', label: 'Contact', icon: FaEnvelope, section: 'contact' },
];

export function MobileBottomNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { isLowPowerMode } = useDevicePerformance();

  // Hide on non-homepage
  if (pathname !== '/') return null;

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Find active section
      const sections = navigationItems.map(item => item.section);
      let currentSection = 'hero';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (href: string, section: string) => {
    setActiveSection(section);
    setIsExpanded(false);
    
    // Haptic feedback for touch devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const visibleItems = isExpanded ? navigationItems : navigationItems.slice(0, 4);
  const hiddenCount = navigationItems.length - 4;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ 
        y: isVisible ? 0 : 100,
        transition: shouldReduceMotion 
          ? { duration: 0 }
          : { type: "spring", stiffness: 300, damping: 30 }
      }}
      className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
    >
      <motion.nav
        layout
        className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl px-2 py-3 mx-auto max-w-sm"
      >
        <div className="flex items-center justify-between">
          {/* Navigation Items */}
          <div className="flex items-center justify-around flex-1 gap-1">
            <AnimatePresence>
              {visibleItems.map((item, index) => {
                const isActive = activeSection === item.section;
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.section}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                    onClick={() => handleNavClick(item.href, item.section)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-h-[48px] min-w-[48px] ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs font-medium leading-none">
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Expand/Collapse Button */}
          {hiddenCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex flex-col items-center justify-center p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors min-h-[48px] min-w-[48px] ml-1"
              aria-label={isExpanded ? "Show less" : "Show more"}
            >
              {isExpanded ? (
                <>
                  <FaChevronDown className="w-3 h-3 mb-1" />
                  <span className="text-xs font-medium">Less</span>
                </>
              ) : (
                <>
                  <FaChevronUp className="w-3 h-3 mb-1" />
                  <span className="text-xs font-medium">More</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Expanded Additional Items */}
        <AnimatePresence>
          {isExpanded && hiddenCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-1 pt-3 mt-3 border-t border-border"
            >
              {navigationItems.slice(4).map((item) => {
                const isActive = activeSection === item.section;
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNavClick(item.href, item.section)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-h-[48px] min-w-[48px] ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs font-medium leading-none">
                      {item.label}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorExpanded"
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.div>
  );
}