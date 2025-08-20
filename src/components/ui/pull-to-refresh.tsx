'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { trackMobile } from '@/lib/analytics';

interface PullToRefreshProps {
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
  children: React.ReactNode;
}

export function PullToRefresh({ 
  onRefresh, 
  threshold = 80, 
  children 
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldShowRefresh, setShouldShowRefresh] = useState(false);
  const startYRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if scrolled to top
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null || window.scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0) {
        // Prevent default scroll behavior
        e.preventDefault();
        
        // Apply resistance to pull distance
        const resistanceFactor = 0.5;
        const adjustedDistance = distance * resistanceFactor;
        
        setPullDistance(Math.min(adjustedDistance, threshold * 1.5));
        setShouldShowRefresh(adjustedDistance >= threshold);
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && onRefresh && !isRefreshing) {
        setIsRefreshing(true);
        setShouldShowRefresh(true);
        
        // Track pull-to-refresh usage
        trackMobile.pullToRefresh();
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
          trackMobile.hapticFeedback('pull_to_refresh');
        }
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setTimeout(() => {
            setShouldShowRefresh(false);
            setPullDistance(0);
          }, 500);
        }
      } else {
        setPullDistance(0);
        setShouldShowRefresh(false);
      }
      
      startYRef.current = null;
    };

    // Add passive: false for touchmove to allow preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, threshold, onRefresh, isRefreshing]);

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const scale = 0.8 + (0.2 * refreshProgress);
  const opacity = Math.min(refreshProgress * 2, 1);

  return (
    <div className="relative">
      {/* Pull indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ 
              opacity: opacity,
              y: Math.min(pullDistance * 0.3, 30),
              transition: shouldReduceMotion ? { duration: 0 } : { type: 'spring', damping: 20 }
            }}
            exit={{ 
              opacity: 0, 
              y: -50,
              transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-card/95 backdrop-blur-xl border border-border rounded-full p-3 shadow-lg"
          >
            <motion.div
              animate={
                shouldReduceMotion 
                  ? {} 
                  : isRefreshing 
                    ? { rotate: 360 } 
                    : { rotate: refreshProgress * 360 }
              }
              transition={
                shouldReduceMotion 
                  ? {}
                  : isRefreshing 
                    ? { duration: 1, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.2 }
              }
              style={{ scale }}
            >
              <RefreshCcw 
                className={`w-5 h-5 ${
                  shouldShowRefresh || isRefreshing 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        style={{
          transform: shouldReduceMotion 
            ? 'none'
            : `translateY(${Math.min(pullDistance * 0.3, 20)}px)`
        }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {children}
      </motion.div>
    </div>
  );
}