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
  FaChevronDown,
  FaBlog,
  FaShare,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useReducedMotion, useDevicePerformance } from '@/hooks/use-reduced-motion';
import { trackMobile } from '@/lib/analytics';
import { useTheme } from 'next-themes';
import { ShareButton } from './share-button';

const getNavigationItems = (pathname: string) => {
  const isHomePage = pathname === '/';
  const getNavLink = (section: string) => {
    return isHomePage ? `#${section}` : `/#${section}`;
  };

  return [
    { href: isHomePage ? '#hero' : '/', label: 'Home', icon: FaHome, section: 'hero' },
    { href: getNavLink('about'), label: 'About', icon: FaUser, section: 'about' },
    { href: getNavLink('experience'), label: 'Work', icon: FaBriefcase, section: 'experience' },
    { href: getNavLink('skills'), label: 'Skills', icon: FaCog, section: 'skills' },
    { href: '/blogs', label: 'Blog', icon: FaBlog, section: 'blog' },
    { href: getNavLink('education'), label: 'Education', icon: FaGraduationCap, section: 'education' },
    { href: getNavLink('contact'), label: 'Contact', icon: FaEnvelope, section: 'contact' },
  ];
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const navigationItems = getNavigationItems(pathname);

  const [activeSection, setActiveSection] = useState(() => {
    if (pathname.startsWith('/blogs')) return 'blog';
    return 'hero';
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { isLowPowerMode } = useDevicePerformance();

  // Robust section detection function
  const detectActiveSection = () => {
    // Ensure we're on the client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      if (pathname.startsWith('/blogs')) return 'blog';
      return 'hero';
    }

    // Handle blog pages
    if (pathname.startsWith('/blogs')) {
      return 'blog';
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

  // Auto-hide navigation after 2 seconds of inactivity
  const resetHideTimer = () => {
    // Clear existing timer
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    
    // Show navigation
    setIsVisible(true);
    
    // Set new timer to hide after 2 seconds
    const newTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    
    setHideTimer(newTimer);
  };

  // Track active section based on scroll position
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Update active section
          const newActiveSection = detectActiveSection();
          setActiveSection(newActiveSection);
          
          // Reset hide timer on scroll (user activity)
          resetHideTimer();
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run on mount to set initial section
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideTimer]);

  // Handle touch/interaction events to show navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUserInteraction = () => {
      resetHideTimer();
    };

    // Listen for various user interaction events
    const events = ['touchstart', 'touchmove', 'mousedown', 'mousemove', 'keydown'];
    
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    // Initialize timer on mount
    resetHideTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [hideTimer]);

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
    
    // Reset hide timer on navigation (user activity)
    resetHideTimer();
    
    // Track mobile navigation
    trackMobile.mobileNavigation('navigate');
    
    // Haptic feedback for touch devices (client-side only)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
      trackMobile.hapticFeedback('navigation');
    }
    
    // Handle different navigation types
    if (href.startsWith('#') && typeof document !== 'undefined') {
      // Same page section navigation
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (href.startsWith('/')) {
      // Different page navigation - let Next.js handle it
      // The Link component will handle the navigation
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
        className="glass-light rounded-2xl shadow-glass-lg px-3 py-4 mx-auto max-w-sm"
      >
        <div className="flex items-center justify-between">
          {/* Navigation Items */}
          <div className="flex items-center justify-around flex-1 gap-2">
            <AnimatePresence>
              {visibleItems.map((item, index) => {
                const isActive = activeSection === item.section;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.section}
                    href={item.href}
                    onClick={() => handleNavClick(item.href, item.section)}
                  >
                    <motion.div
                      layout={!shouldReduceMotion}
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                      animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                      exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 min-h-[56px] min-w-[56px] touch-manipulation ${
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
                    </motion.div>
                  </Link>
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
                // Reset hide timer on interaction
                resetHideTimer();
                // Haptic feedback (client-side only)
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  navigator.vibrate(5);
                }
              }}
              className="flex flex-col items-center justify-center p-4 rounded-xl text-muted-foreground hover:text-foreground hover:glass-medium transition-all duration-200 min-h-[56px] min-w-[56px] ml-2 touch-manipulation"
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
              className="flex items-center justify-center gap-2 pt-3 mt-3 border-t border-white/20 dark:border-white/10"
            >
              {hiddenItems.map((item) => {
                const isActive = activeSection === item.section;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.section}
                    href={item.href}
                    onClick={() => {
                      handleNavClick(item.href, item.section);
                      setIsExpanded(false); // Auto-collapse when navigating
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileTap={{ scale: 0.9 }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 min-h-[56px] min-w-[56px] touch-manipulation ${
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
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Controls - Theme Toggle, Share, Contact CTA - Only show when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center justify-center gap-2 pt-3 mt-3 border-t border-white/20 dark:border-white/10"
            >
              {/* Theme Toggle */}
              <ThemeToggleButton />
              
              {/* Share Button */}
              <ShareButtonMobile />
              
              {/* Contact CTA */}
              <Link
                href={pathname === '/' ? '#contact' : '/#contact'}
                className="relative flex flex-col items-center justify-center p-4 rounded-xl text-muted-foreground hover:text-foreground hover:glass-medium transition-all duration-200 min-h-[56px] min-w-[56px] touch-manipulation"
              >
                <FaEnvelope className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium leading-none">
                  Contact
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      </motion.div>
    </>
  );
}

// Theme Toggle Component for Mobile Nav
function ThemeToggleButton() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative flex flex-col items-center justify-center p-4 rounded-xl min-h-[56px] min-w-[56px] text-muted-foreground">
        <FaSun className="w-4 h-4 mb-1" />
        <span className="text-xs font-medium leading-none">Theme</span>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative flex flex-col items-center justify-center p-4 rounded-xl text-muted-foreground hover:text-foreground hover:glass-medium transition-all duration-200 min-h-[56px] min-w-[56px] touch-manipulation"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <FaMoon className="w-4 h-4 mb-1" />
      ) : (
        <FaSun className="w-4 h-4 mb-1" />
      )}
      <span className="text-xs font-medium leading-none">
        Theme
      </span>
    </motion.button>
  );
}

// Share Button Component for Mobile Nav
function ShareButtonMobile() {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    const shareData = {
      title: "Andrii Furmanets - Senior Full-Stack Developer",
      text: "Check out my portfolio and latest projects!",
      url: window.location.href,
    };

    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
      }
    } catch (err) {
      console.log('Error sharing:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      disabled={isSharing}
      className="relative flex flex-col items-center justify-center p-4 rounded-xl text-muted-foreground hover:text-foreground hover:glass-medium transition-all duration-200 min-h-[56px] min-w-[56px] touch-manipulation"
      aria-label="Share this page"
    >
      <FaShare className="w-4 h-4 mb-1" />
      <span className="text-xs font-medium leading-none">
        Share
      </span>
    </motion.button>
  );
}