
// Analytics utility functions for Google Analytics and Amplitude
import * as amplitude from '@amplitude/analytics-browser';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-YK2C6Q3ZMW'; // Replace with your actual GA4 Measurement ID
export const AMPLITUDE_API_KEY = ''; // Will be configured by user or via environment

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Initialize Amplitude with configurable API key
export const initAmplitude = (apiKey?: string) => {
  const amplitudeKey = apiKey || AMPLITUDE_API_KEY || localStorage.getItem('amplitude_api_key');
  
  if (typeof window !== 'undefined' && amplitudeKey && amplitudeKey.trim()) {
    try {
      amplitude.init(amplitudeKey, {
        defaultTracking: {
          sessions: true,
          pageViews: true,
          formInteractions: true,
          fileDownloads: true,
        },
      });
    } catch (error) {
      console.warn('Failed to initialize Amplitude:', error);
    }
  }
};

// Initialize all analytics with configurable API keys
export const initAnalytics = (amplitudeApiKey?: string) => {
  initGA();
  initAmplitude(amplitudeApiKey);
};

// Reinitialize Amplitude with new API key
export const reinitializeAmplitude = (apiKey: string) => {
  if (apiKey) {
    localStorage.setItem('amplitude_api_key', apiKey);
    initAmplitude(apiKey);
  }
};

// Set user identity
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
    });
  }
  
  // Amplitude - only if initialized
  try {
    amplitude.setUserId(userId);
    if (userProperties) {
      const identifyObj = new amplitude.Identify();
      Object.entries(userProperties).forEach(([key, value]) => {
        identifyObj.setOnce(key, value);
      });
      amplitude.identify(identifyObj);
    }
  } catch (error) {
    // Amplitude not initialized, skip silently
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
  
  // Amplitude - only if initialized
  try {
    amplitude.track(eventName, parameters);
  } catch (error) {
    // Amplitude not initialized, skip silently
  }
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
