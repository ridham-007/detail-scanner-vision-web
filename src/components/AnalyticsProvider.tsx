"use client";

import { useEffect } from "react";
import Script from "next/script";
import { initAnalytics, GA_MEASUREMENT_ID } from "@/utils/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure gtag is defined before initializing (for safety)
    if (typeof window !== "undefined" && !window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: any[]) {
        window.dataLayer.push(args);
      };
    }
    
    // Initialize analytics on mount
    initAnalytics();
  }, []);

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // Default consent is handled in initAnalytics
        `}
      </Script>
      {children}
    </>
  );
}
