'use client';

import { useState, useEffect } from 'react';

interface HydratedTimeProps {
  time: string;
  fallback?: string;
  className?: string;
}

/**
 * Hydration-safe component for displaying timezone-dependent content.
 * Prevents "Text content does not match server-rendered HTML" errors
 * by showing a fallback during SSR and the actual time after hydration.
 */
export function HydratedTime({ time, fallback, className }: HydratedTimeProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // During SSR or before hydration, show fallback or nothing
  if (!hydrated) {
    return fallback ? (
      <span className={className} suppressHydrationWarning>
        {fallback}
      </span>
    ) : null;
  }

  // After hydration, show the actual time
  return <span className={className}>{time}</span>;
}

interface HydratedTimezoneDisplayProps {
  ukraineTime: string;
  clientTime: string;
  showTimezone?: boolean;
  className?: string;
}

/**
 * Display booking time with timezone info, hydration-safe
 */
export function HydratedTimezoneDisplay({ 
  ukraineTime, 
  clientTime, 
  showTimezone = true,
  className 
}: HydratedTimezoneDisplayProps) {
  const [hydrated, setHydrated] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    setHydrated(true);
    // Detect user timezone after hydration
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(tz);
    } catch {
      setUserTimezone('UTC');
    }
  }, []);

  // During SSR, show Ukraine time as fallback
  if (!hydrated) {
    return (
      <span className={className} suppressHydrationWarning>
        {ukraineTime} (Ukraine)
      </span>
    );
  }

  // After hydration, show client time with optional timezone
  return (
    <span className={className}>
      {clientTime}
      {showTimezone && userTimezone && (
        <span className="text-sm text-gray-500 ml-1">
          ({userTimezone.split('/').pop()})
        </span>
      )}
    </span>
  );
}
