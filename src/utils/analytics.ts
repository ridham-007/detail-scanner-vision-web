// Analytics utility functions for Google Analytics and Amplitude
import * as amplitude from "@amplitude/analytics-browser";

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer: Record<string, unknown>[];
  }
}

export const GA_MEASUREMENT_ID = "G-YK2C6Q3ZMW";
export const AMPLITUDE_API_KEY =
  process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || "";

const COOKIE_CONSENT_KEY = "eateriq_cookie_consent";

// Check if user has given analytics consent
export const hasAnalyticsConsent = (): boolean => {
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) return false;
    const parsed = JSON.parse(consent);
    return parsed.analytics === true;
  } catch {
    return false;
  }
};

// Check if user has given marketing consent
export const hasMarketingConsent = (): boolean => {
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) return false;
    const parsed = JSON.parse(consent);
    return parsed.marketing === true;
  } catch {
    return false;
  }
};

// Initialize Google Analytics with consent mode
export const initGA = () => {
  if (typeof window === "undefined") return;

  // Set default consent to denied
  if (window.gtag) {
    window.gtag("consent", "default", {
      analytics_storage: hasAnalyticsConsent() ? "granted" : "denied",
      ad_storage: hasMarketingConsent() ? "granted" : "denied",
    });

    // Only configure if consent is granted
    if (hasAnalyticsConsent()) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }
};

// Initialize Amplitude with consent check
export const initAmplitude = () => {
  if (typeof window === "undefined") return;
  if (!AMPLITUDE_API_KEY || !AMPLITUDE_API_KEY.trim()) return;
  if (!hasAnalyticsConsent()) return;

  try {
    amplitude.init(AMPLITUDE_API_KEY, {
      defaultTracking: {
        sessions: true,
        pageViews: true,
        formInteractions: true,
        fileDownloads: true,
      },
    });
  } catch (error) {
    console.warn("Failed to initialize Amplitude:", error);
  }
};

// Initialize all analytics (respects consent)
export const initAnalytics = () => {
  initGA();
  initAmplitude();
};

// Update consent and reinitialize analytics if needed
export const updateAnalyticsConsent = (
  analyticsConsent: boolean,
  marketingConsent: boolean,
) => {
  if (typeof window === "undefined") return;

  // Update Google Analytics consent
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: analyticsConsent ? "granted" : "denied",
      ad_storage: marketingConsent ? "granted" : "denied",
    });

    // Initialize GA if consent just granted
    if (analyticsConsent) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }

  // Initialize Amplitude if consent just granted
  if (analyticsConsent && AMPLITUDE_API_KEY && AMPLITUDE_API_KEY.trim()) {
    try {
      amplitude.init(AMPLITUDE_API_KEY, {
        defaultTracking: {
          sessions: true,
          pageViews: true,
          formInteractions: true,
          fileDownloads: true,
        },
      });
    } catch (error) {
      // Already initialized, ignore
    }
  }

  // Disable Amplitude if consent revoked
  if (!analyticsConsent) {
    try {
      amplitude.setOptOut(true);
    } catch {
      // Not initialized, ignore
    }
  } else {
    try {
      amplitude.setOptOut(false);
    } catch {
      // Not initialized, ignore
    }
  }
};

// Set user identity (only if consent granted)
export const identifyUser = (
  userId: string,
  userProperties?: Record<string, unknown>,
) => {
  if (!hasAnalyticsConsent()) return;

  // Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      user_id: userId,
    });
  }

  // Amplitude
  try {
    amplitude.setUserId(userId);
    if (userProperties) {
      const identifyObj = new amplitude.Identify();
      Object.entries(userProperties).forEach(([key, value]) => {
        identifyObj.setOnce(key, value as string | number | boolean);
      });
      amplitude.identify(identifyObj);
    }
  } catch (error) {
    // Amplitude not initialized, skip silently
  }
};

// Track page views (only if consent granted)
export const trackPageView = (url: string, title?: string) => {
  if (!hasAnalyticsConsent()) return;

  // Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }

  // Amplitude (handled automatically by defaultTracking.pageViews)
};

// Track custom events (only if consent granted)
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>,
) => {
  if (!hasAnalyticsConsent()) return;

  // Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...parameters,
    });
  }

  // Amplitude
  try {
    amplitude.track(eventName, parameters);
  } catch (error) {
    // Amplitude not initialized, skip silently
  }
};

// Specific event tracking functions for EaterIQ
export const trackScanAttempt = () => {
  trackEvent("scan_attempt", {
    event_category: "scanner",
    event_label: "barcode_scan",
  });
};

export const trackScanSuccess = (productName?: string) => {
  trackEvent("scan_success", {
    event_category: "scanner",
    event_label: "barcode_scan_success",
    product_name: productName,
  });
};

export const trackScanError = (error: string) => {
  trackEvent("scan_error", {
    event_category: "scanner",
    event_label: "barcode_scan_error",
    error_message: error,
  });
};

export const trackProductView = (productName: string) => {
  trackEvent("view_item", {
    event_category: "product",
    event_label: "product_details_view",
    item_name: productName,
  });
};

export const trackCTAClick = (ctaName: string) => {
  trackEvent("cta_click", {
    event_category: "engagement",
    event_label: ctaName,
  });
};
