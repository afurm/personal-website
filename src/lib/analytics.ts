// Analytics utility for tracking success metrics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Track custom events
export const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-KW5Y7L8XYV', {
      page_title: title,
      page_location: url,
    });
  }
};

// Track user engagement metrics
export const trackEngagement = {
  // Track session duration
  sessionStart: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('session_start', Date.now().toString());
    }
  },

  sessionEnd: () => {
    if (typeof window !== 'undefined') {
      const startTime = sessionStorage.getItem('session_start');
      if (startTime) {
        const duration = Date.now() - parseInt(startTime);
        trackEvent({
          action: 'session_duration',
          category: 'engagement',
          value: Math.round(duration / 1000), // in seconds
        });
        sessionStorage.removeItem('session_start');
      }
    }
  },

  // Track scroll depth
  scrollDepth: (percentage: number) => {
    trackEvent({
      action: 'scroll_depth',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
    });
  },

  // Track time on page
  timeOnPage: (seconds: number) => {
    trackEvent({
      action: 'time_on_page',
      category: 'engagement',
      value: seconds,
    });
  },
};

// Track business metrics
export const trackBusiness = {
  // Contact form interactions
  contactFormView: () => {
    trackEvent({
      action: 'view',
      category: 'contact_form',
      label: 'contact_section_viewed',
    });
  },

  contactFormSubmit: () => {
    trackEvent({
      action: 'submit',
      category: 'contact_form',
      label: 'contact_form_submitted',
    });
  },

  // Profile clicks
  githubClick: () => {
    trackEvent({
      action: 'click',
      category: 'external_link',
      label: 'github_profile',
    });
  },

  linkedinClick: () => {
    trackEvent({
      action: 'click',
      category: 'external_link',
      label: 'linkedin_profile',
    });
  },

  resumeDownload: () => {
    trackEvent({
      action: 'download',
      category: 'resume',
      label: 'pdf_download',
    });
  },

  // Blog engagement
  blogPostView: (postTitle: string) => {
    trackEvent({
      action: 'view',
      category: 'blog',
      label: postTitle,
    });
  },

  blogPostShare: (postTitle: string, platform: string) => {
    trackEvent({
      action: 'share',
      category: 'blog',
      label: `${postTitle} - ${platform}`,
    });
  },
};

// Track mobile-specific metrics
export const trackMobile = {
  // Mobile usability
  mobileNavigation: (action: 'open' | 'close' | 'navigate') => {
    trackEvent({
      action,
      category: 'mobile_navigation',
      label: `mobile_nav_${action}`,
    });
  },

  pullToRefresh: () => {
    trackEvent({
      action: 'pull_to_refresh',
      category: 'mobile_interaction',
      label: 'blog_refresh',
    });
  },

  hapticFeedback: (context: string) => {
    trackEvent({
      action: 'haptic_feedback',
      category: 'mobile_interaction',
      label: context,
    });
  },
};

// Performance tracking
export const trackPerformance = {
  // Core Web Vitals
  webVitals: (name: string, value: number) => {
    trackEvent({
      action: name,
      category: 'web_vitals',
      value: Math.round(value),
    });
  },

  // Loading performance
  pageLoadTime: (loadTime: number) => {
    trackEvent({
      action: 'page_load_time',
      category: 'performance',
      value: Math.round(loadTime),
    });
  },

  // Resource loading
  imageLoad: (imageName: string, loadTime: number) => {
    trackEvent({
      action: 'image_load_time',
      category: 'performance',
      label: imageName,
      value: Math.round(loadTime),
    });
  },
};

// Utility to track return visitors
export const trackReturnVisitor = () => {
  if (typeof window !== 'undefined') {
    const hasVisited = localStorage.getItem('has_visited');
    
    if (hasVisited) {
      trackEvent({
        action: 'return_visit',
        category: 'user_behavior',
        label: 'returning_visitor',
      });
    } else {
      localStorage.setItem('has_visited', 'true');
      trackEvent({
        action: 'first_visit',
        category: 'user_behavior',
        label: 'new_visitor',
      });
    }
  }
};

// A/B testing utilities
export const trackABTest = (testName: string, variant: string) => {
  trackEvent({
    action: 'ab_test',
    category: 'experimentation',
    label: `${testName}_${variant}`,
  });
};

// Error tracking
export const trackError = (error: string, context?: string) => {
  trackEvent({
    action: 'error',
    category: 'javascript_error',
    label: context ? `${context}: ${error}` : error,
  });
};
