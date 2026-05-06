"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackPageView } from "@/utils/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const query =
      typeof window !== "undefined" ? window.location.search : "";
    const url = query ? `${pathname}${query}` : pathname;
    trackPageView(url);
  }, [pathname]);

  return (
    <>
      {children}
    </>
  );
}
