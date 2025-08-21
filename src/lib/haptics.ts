/**
 * Haptic feedback utilities for web browsers
 * Supports iOS Safari, Chrome, and other modern browsers
 */

export type HapticPattern = number | readonly number[] | number[];

export interface HapticOptions {
  pattern?: HapticPattern;
  fallback?: () => void;
}

/**
 * Trigger haptic feedback if supported by the device/browser
 * Must be called from a user interaction event (click, touch, etc.)
 */
export const triggerHaptic = (options: HapticOptions = {}): boolean => {
  const { pattern = 100, fallback } = options;

  // Check if vibration API is supported
  if (!('vibrate' in navigator)) {
    fallback?.();
    return false;
  }

  try {
    // Trigger vibration
    navigator.vibrate(typeof pattern === 'number' ? pattern : [...pattern]);
    return true;
  } catch (error) {
    // Fallback for any errors
    fallback?.();
    return false;
  }
};

/**
 * Predefined haptic patterns for common interactions
 */
export const HapticPatterns = {
  light: 50,
  medium: 100,
  heavy: 200,
  success: [100, 50, 100],
  error: [200, 100, 200, 100, 200],
  notification: [50, 50, 50],
  click: 30,
  longPress: [100, 50, 100, 50, 200],
} as const;

/**
 * Convenience functions for common haptic feedback types
 */
export const haptics = {
  light: () => triggerHaptic({ pattern: HapticPatterns.light }),
  medium: () => triggerHaptic({ pattern: HapticPatterns.medium }),
  heavy: () => triggerHaptic({ pattern: HapticPatterns.heavy }),
  success: () => triggerHaptic({ pattern: HapticPatterns.success }),
  error: () => triggerHaptic({ pattern: HapticPatterns.error }),
  notification: () => triggerHaptic({ pattern: HapticPatterns.notification }),
  click: () => triggerHaptic({ pattern: HapticPatterns.click }),
  longPress: () => triggerHaptic({ pattern: HapticPatterns.longPress }),
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticsSupported = (): boolean => {
  return 'vibrate' in navigator;
};