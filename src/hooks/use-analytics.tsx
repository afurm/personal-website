'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { 
  trackPageView, 
  trackEngagement, 
  trackReturnVisitor,
  trackPerformance 
} from '@/lib/analytics';

// Hook for tracking page views and basic analytics
export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href, document.title);
    
    // Track return visitor status
    trackReturnVisitor();
    
    // Start session tracking
    trackEngagement.sessionStart();
    
    // Track page load performance
    if ('performance' in window && 'navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        if (loadTime > 0) {
          trackPerformance.pageLoadTime(loadTime);
        }
      }
    }

    // Cleanup function to track session end
    return () => {
      trackEngagement.sessionEnd();
    };
  }, [pathname]);
}

// Hook for tracking scroll depth
export function useScrollTracking() {
  const trackScrollDepth = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    // Track at 25%, 50%, 75%, and 100% scroll depths
    const milestones = [25, 50, 75, 100];
    const sessionKey = `scroll_${scrollPercent}`;
    
    for (const milestone of milestones) {
      if (scrollPercent >= milestone && !sessionStorage.getItem(`tracked_scroll_${milestone}`)) {
        trackEngagement.scrollDepth(milestone);
        sessionStorage.setItem(`tracked_scroll_${milestone}`, 'true');
        break;
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      trackScrollDepth();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);
}

// Hook for tracking time on page
export function useTimeTracking() {
  useEffect(() => {
    const startTime = Date.now();
    
    // Track time milestones
    const timeouts: NodeJS.Timeout[] = [];
    
    // Track 30 seconds, 1 minute, 2 minutes, 5 minutes
    const milestones = [30, 60, 120, 300]; // in seconds
    
    milestones.forEach(seconds => {
      const timeout = setTimeout(() => {
        trackEngagement.timeOnPage(seconds);
      }, seconds * 1000);
      timeouts.push(timeout);
    });
    
    return () => {
      // Clear all timeouts
      timeouts.forEach(timeout => clearTimeout(timeout));
      
      // Track final time on page
      const finalTime = Math.round((Date.now() - startTime) / 1000);
      if (finalTime > 5) { // Only track if more than 5 seconds
        trackEngagement.timeOnPage(finalTime);
      }
    };
  }, []);
}

// Hook for tracking Core Web Vitals
export function useWebVitals() {
  useEffect(() => {
    // Only track in production and if the API is available
    if (process.env.NODE_ENV !== 'production') return;
    
    const trackWebVital = (name: string, value: number) => {
      trackPerformance.webVitals(name, value);
    };

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Track CLS after 5 seconds
      setTimeout(() => {
        trackWebVital('CLS', clsValue);
        observer.disconnect();
      }, 5000);
    } catch (error) {
      // PerformanceObserver not supported
    }

    // Track LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          trackWebVital('LCP', lastEntry.startTime);
          lcpObserver.disconnect();
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      // Not supported
    }

    // Track FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          trackWebVital('FID', fid);
        }
        fidObserver.disconnect();
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      // Not supported
    }

    return () => {
      try {
        observer.disconnect();
      } catch (error) {
        // Observer might already be disconnected
      }
    };
  }, []);
}

// Hook for tracking errors
export function useErrorTracking() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('JavaScript error:', event.error);
      // Track error but don't send sensitive information
      const errorMessage = event.error?.message || 'Unknown error';
      const filename = event.filename ? event.filename.split('/').pop() : 'unknown';
      
      import('@/lib/analytics').then(({ trackError }) => {
        trackError(errorMessage, filename);
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      import('@/lib/analytics').then(({ trackError }) => {
        trackError('Unhandled Promise Rejection', 'promise');
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}
