'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollProgressProps {
  variant?: 'linear' | 'circular';
  className?: string;
}

export function ScrollProgress({ variant = 'linear', className = '' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setProgress(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 20; // radius = 20

    return (
      <motion.div
        className={`fixed bottom-8 right-8 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative w-12 h-12">
          {/* Background circle */}
          <svg
            className="absolute inset-0 transform -rotate-90"
            width="48"
            height="48"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="hsl(var(--border))"
              strokeWidth="3"
              fill="none"
              opacity="0.3"
            />
          </svg>
          
          {/* Progress circle */}
          <svg
            className="absolute inset-0 transform -rotate-90"
            width="48"
            height="48"
            viewBox="0 0 48 48"
          >
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{
                strokeDashoffset: useTransform(
                  scrollYProgress,
                  [0, 1],
                  [circumference, 0]
                ),
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent-blue))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-xs font-semibold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {progress}%
            </motion.span>
          </div>
          
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-full -z-10" />
        </div>
      </motion.div>
    );
  }

  // Linear variant (enhanced version of existing)
  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 h-1 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="h-full bg-gradient-to-r from-border/20 to-border/20">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent-blue to-primary bg-[length:200%_100%] animate-gradient-x"
          style={{
            scaleX: scrollYProgress,
            transformOrigin: '0%',
          }}
        />
      </div>
    </motion.div>
  );
}