
// Analytics utility functions for Google Analytics and Amplitude
import * as amplitude from '@amplitude/analytics-browser';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-YK2C6Q3ZMW'; // Replace with your actual GA4 Measurement ID
export const AMPLITUDE_API_KEY = 'YOUR_AMPLITUDE_API_KEY'; // Replace with your actual Amplitude API key

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Initialize Amplitude
export const initAmplitude = () => {
  if (typeof window !== 'undefined') {
    amplitude.init(AMPLITUDE_API_KEY, {
      defaultTracking: {
        sessions: true,
        pageViews: true,
        formInteractions: true,
        fileDownloads: true,
      },
    });
  }
};

// Initialize all analytics
export const initAnalytics = () => {
  initGA();
  initAmplitude();
};

// Set user identity
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
    });
  }
  
  // Amplitude
  amplitude.setUserId(userId);
  if (userProperties) {
    const identifyObj = new amplitude.Identify();
    Object.entries(userProperties).forEach(([key, value]) => {
      identifyObj.setOnce(key, value);
    });
    amplitude.identify(identifyObj);
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
  
  // Amplitude (handled automatically by defaultTracking.pageViews)
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
    });
  }
  
  // Amplitude
  amplitude.track(eventName, parameters);
};

// Specific event tracking functions for EaterIQ
export const trackScanAttempt = () => {
  trackEvent('scan_attempt', {
    event_category: 'scanner',
    event_label: 'barcode_scan',
  });
};

export const trackScanSuccess = (productName?: string) => {
  trackEvent('scan_success', {
    event_category: 'scanner',
    event_label: 'barcode_scan_success',
    product_name: productName,
  });
};

export const trackScanError = (error: string) => {
  trackEvent('scan_error', {
    event_category: 'scanner',
    event_label: 'barcode_scan_error',
    error_message: error,
  });
};

export const trackProductView = (productName: string) => {
  trackEvent('view_item', {
    event_category: 'product',
    event_label: 'product_details_view',
    item_name: productName,
  });
};

export const trackCTAClick = (ctaName: string) => {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
  });
};
