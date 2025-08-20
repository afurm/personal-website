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
import { trackMobile } from '@/lib/analytics';

const navigationItems = [
  { href: '#hero', label: 'Home', icon: FaHome, section: 'hero' },
  { href: '#about', label: 'About', icon: FaUser, section: 'about' },
  { href: '#experience', label: 'Work', icon: FaBriefcase, section: 'experience' },
  { href: '#skills', label: 'Skills', icon: FaCog, section: 'skills' },
  { href: '#education', label: 'Education', icon: FaGraduationCap, section: 'education' },
  { href: '#contact', label: 'Contact', icon: FaEnvelope, section: 'contact' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  
  // Hide on non-homepage - must be before any other hooks
  if (pathname !== '/') return null;

  const [activeSection, setActiveSection] = useState('hero');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { isLowPowerMode } = useDevicePerformance();

  // Robust section detection function
  const detectActiveSection = () => {
    // Ensure we're on the client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'hero';
    }

    const sections = navigationItems.map(item => item.section);
    let currentSection = 'hero';

    // Get all sections and their positions
    const sectionElements = sections.map(section => ({
      section,
      element: document.getElementById(section),
    })).filter(item => item.element);

    if (sectionElements.length === 0) return currentSection;

    const scrollOffset = 150; // Account for header height
    const scrollY = window.scrollY;

    // Simple approach: find the section whose top is closest to the scroll position
    let closestSection = 'hero';
    let minDistance = Infinity;

    for (const { section, element } of sectionElements) {
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = scrollY + rect.top;
        const distance = Math.abs(scrollY + scrollOffset - elementTop);

        // If this section is closer to our scroll position
        if (distance < minDistance && rect.top <= scrollOffset) {
          minDistance = distance;
          closestSection = section;
        }
      }
    }

    // Debug logging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Section detection:', {
        currentSection: closestSection,
        scrollY: scrollY,
        scrollOffset,
        sectionElements: sectionElements.map(({ section, element }) => ({
          section,
          rect: element?.getBoundingClientRect(),
          elementTop: element ? scrollY + element.getBoundingClientRect().top : null,
          distance: element ? Math.abs(scrollY + scrollOffset - (scrollY + element.getBoundingClientRect().top)) : null
        }))
      });
    }

    return closestSection;
  };

  // Track active section based on scroll position
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show/hide based on scroll direction with improved logic
          const scrollDifference = currentScrollY - lastScrollY;
          const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
          
          if (Math.abs(scrollDifference) > scrollThreshold) {
            if (scrollDifference > 0 && currentScrollY > 200) {
              // Scrolling DOWN and past initial threshold - hide navigation
              setIsVisible(false);
            } else if (scrollDifference < 0 || currentScrollY <= 100) {
              // Scrolling UP or near top - show navigation
              setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
          }

          // Update active section
          const newActiveSection = detectActiveSection();
          setActiveSection(newActiveSection);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run on mount to set initial section
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Initial section detection on mount with delay
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      const newActiveSection = detectActiveSection();
      setActiveSection(newActiveSection);
    }, 200); // Longer delay to ensure all sections are rendered

    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (href: string, section: string) => {
    setActiveSection(section);
    setIsExpanded(false);
    
    // Track mobile navigation
    trackMobile.mobileNavigation('navigate');
    
    // Haptic feedback for touch devices (client-side only)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
      trackMobile.hapticFeedback('navigation');
    }
    
    // Smooth scroll to section (client-side only)
    if (typeof document !== 'undefined') {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const visibleItems = navigationItems.slice(0, 4);
  const hiddenItems = navigationItems.slice(4);
  const hiddenCount = hiddenItems.length;

  return (
    <>
      {/* Backdrop for closing expanded menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] md:hidden"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100 }}
        animate={{ 
          y: isVisible ? 0 : 100,
          transition: shouldReduceMotion 
            ? { duration: 0 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }}
        className="fixed bottom-4 left-4 right-4 z-[100] md:hidden"
      >
      <motion.nav
        layout
        className="glass-light rounded-2xl shadow-glass-lg px-2 py-3 mx-auto max-w-sm"
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
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-glass' 
                        : 'text-muted-foreground hover:text-foreground hover:glass-medium'
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
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white dark:bg-black rounded-full"
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
              onClick={() => {
                setIsExpanded(!isExpanded);
                // Haptic feedback (client-side only)
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  navigator.vibrate(5);
                }
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl text-muted-foreground hover:text-foreground hover:glass-medium transition-all duration-200 min-h-[48px] min-w-[48px] ml-1"
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
              className="flex items-center justify-center gap-1 pt-3 mt-3 border-t border-white/20 dark:border-white/10"
            >
              {hiddenItems.map((item) => {
                const isActive = activeSection === item.section;
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      handleNavClick(item.href, item.section);
                      setIsExpanded(false); // Auto-collapse when navigating
                    }}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-h-[48px] min-w-[48px] ${
                      isActive 
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-glass' 
                        : 'text-muted-foreground hover:text-foreground hover:glass-medium'
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
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white dark:bg-black rounded-full"
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
    </>
  );
}