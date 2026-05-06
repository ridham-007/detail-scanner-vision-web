"use client";

import { useEffect } from "react";
import Script from "next/script";
import { initAnalytics } from "@/utils/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <>
      {children}
    </>
  );
}
