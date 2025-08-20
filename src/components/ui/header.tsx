'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { ShareButton } from './share-button';
import { Menu, X, Sun, Moon, Share2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const pathname = usePathname();

  // Check if we're on the homepage
  const isHomePage = pathname === '/';

  // Function to get the correct link path
  const getNavLink = (section: string) => {
    return isHomePage ? `#${section}` : `/#${section}`;
  };

  // useEffect for mounting and scroll detection
  React.useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Floating Navigation - Hidden on Mobile */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ 
          y: isScrolled ? 16 : 0,
          scale: isScrolled ? 0.95 : 1,
        }}
        transition={{ 
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="fixed top-0 inset-x-0 z-50 w-full"
      >
        <div className={`container mx-auto transition-all duration-300 ${
          isScrolled 
            ? 'rounded-2xl glass-light shadow-glass-lg' 
            : 'rounded-none border-transparent bg-transparent backdrop-blur-none'
        }`}>
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <motion.div
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href="/" 
                className="font-bold text-lg md:text-xl text-foreground hover:text-accent-blue transition-all duration-300"
              >
                <span className="hidden sm:inline">Andrii Furmanets</span>
                <span className="sm:hidden">AF</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: getNavLink('about'), label: 'About' },
                { href: getNavLink('experience'), label: 'Experience' },
                { href: getNavLink('skills'), label: 'Skills' },
                { href: getNavLink('education'), label: 'Education' },
                { href: '/blogs', label: 'Blog' },
                { href: getNavLink('contact'), label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-accent-blue opacity-0 group-hover:opacity-100"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-4">
              <ShareButton 
                title="Andrii Furmanets - Senior Full-Stack Developer"
                text="Check out my portfolio and latest projects!"
                variant="icon"
              />
              <ThemeToggle />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={getNavLink('contact')}
                  className="glass-button inline-flex h-10 items-center justify-center rounded-full bg-black dark:bg-white px-6 text-sm font-semibold text-white dark:text-black shadow-glass transition-all duration-300 hover:shadow-glass-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Contact Me
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="md:hidden flex items-center justify-center p-3 rounded-xl glass min-h-[44px] min-w-[44px] will-change-transform"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              style={{ 
                transition: 'transform 0.15s ease-out',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="container mx-auto px-4">
            <motion.div
              className="h-0.5 bg-muted/30 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: isScrolled ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="h-full bg-accent-blue rounded-full"
                style={{
                  scaleX: mounted ? scrollY / (document.documentElement.scrollHeight - window.innerHeight) : 0,
                  transformOrigin: '0%',
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu - modern overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden mobile-menu-optimized"
              onClick={toggleMenu}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: '-100%', scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: '-100%', scale: 0.95 }}
              transition={{ 
                type: 'tween',
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="fixed top-4 left-4 right-4 glass-light rounded-2xl shadow-glass-lg z-[9999] md:hidden mobile-menu-optimized"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6">
                <span className="font-bold text-lg">Navigation</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl glass hover:glass-medium transition-all duration-200"
                  onClick={toggleMenu}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <motion.nav 
                className="px-6 pb-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {[
                  { href: getNavLink('about'), label: 'About' },
                  { href: getNavLink('experience'), label: 'Experience' },
                  { href: getNavLink('skills'), label: 'Skills' },
                  { href: getNavLink('education'), label: 'Education' },
                  { href: '/blogs', label: 'Blog' },
                  { href: getNavLink('contact'), label: 'Contact' },
                ].map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="block py-3 px-4 rounded-xl text-lg font-medium text-foreground/80 hover:text-foreground hover:glass-medium transition-colors duration-150"
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}

                {/* Theme Toggle and Share */}
                <div className="pt-4 flex justify-center gap-4">
                  {/* Custom Share Button for Mobile Menu */}
                  <MobileMenuShareButton />
                  <ThemeToggle />
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                  <Link
                    href={getNavLink('contact')}
                    className="glass-button w-full flex items-center justify-center rounded-xl bg-black dark:bg-white px-6 py-3 text-base font-semibold text-white dark:text-black shadow-glass transition-all duration-200 hover:shadow-glass-lg"
                    onClick={toggleMenu}
                  >
                    Get In Touch
                  </Link>
                </div>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Custom Share Button for Mobile Menu to match theme toggle style
function MobileMenuShareButton() {
  const [isSharing, setIsSharing] = React.useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    const shareData = {
      title: "Andrii Furmanets - Senior Full-Stack Developer",
      text: "Check out my portfolio and latest projects!",
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.url);
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
      onClick={handleShare}
      disabled={isSharing}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-button group relative inline-flex h-10 w-10 items-center justify-center rounded-full glass transition-shadow duration-100 hover:shadow-glass focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Share"
    >
      <motion.div
        animate={{ rotate: isSharing ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Share2 className="h-5 w-5 text-foreground/80" />
      </motion.div>
    </motion.button>
  );
}
