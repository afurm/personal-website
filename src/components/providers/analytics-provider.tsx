'use client';

import { useAnalytics, useScrollTracking, useTimeTracking, useWebVitals, useErrorTracking } from '@/hooks/use-analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Initialize all analytics tracking
  useAnalytics();
  useScrollTracking();
  useTimeTracking();
  useWebVitals();
  useErrorTracking();

  return <>{children}</>;
}
