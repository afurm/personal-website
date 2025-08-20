'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex h-10 w-20 items-center justify-center rounded-full glass p-1">
        <div className="h-8 w-8 rounded-full glass shadow-glass" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="glass-button group relative inline-flex h-10 w-20 items-center rounded-full glass p-1 transition-shadow duration-100 hover:shadow-glass focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      {/* Track background */}
      <motion.div
        className="absolute inset-1 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-accent-blue to-primary"
        animate={{
          opacity: 1,
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Sliding toggle */}
      <motion.div
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full glass-light shadow-glass"
        animate={{
          x: isDark ? 44 : 0,
        }}
        transition={{
          type: 'tween',
          duration: 0.1,
          ease: 'easeOut'
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.svg
              key="moon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.08 }}
              className="h-4 w-4 text-accent-blue"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.08 }}
              className="h-4 w-4 text-orange-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
