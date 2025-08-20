'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check user's motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(motionQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches);
    };

    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
}

export function useDevicePerformance() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileDevice);
    };

    // Check for low power mode indicators
    const checkLowPowerMode = () => {
      // Check for battery API (limited support)
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setIsLowPowerMode(battery.charging === false && battery.level < 0.2);
        });
      }

      // Check for connection type (for data saving)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const slowConnections = ['slow-2g', '2g', '3g'];
        if (slowConnections.includes(connection.effectiveType)) {
          setIsLowPowerMode(true);
        }
      }

      // Check for reduced motion as a proxy for performance preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        setIsLowPowerMode(true);
      }

      // Check device memory (if available)
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        if (memory <= 2) { // 2GB or less
          setIsLowPowerMode(true);
        }
      }
    };

    checkMobile();
    checkLowPowerMode();
  }, []);

  return { isLowPowerMode, isMobile };
}