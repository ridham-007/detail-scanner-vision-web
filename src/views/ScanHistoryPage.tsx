"use client";

// app/history/page.tsx  (or wherever this page lives)

import React from 'react';
import ScanHistory from '@/components/ScanHistory';
import SEOHead from '@/components/SEOHead';

const ScanHistoryPage = () => {
  return (
    <>
      <SEOHead
        title="Scan History | EaterIQ"
        description="View your product scan history and track your nutrition journey with EaterIQ."
        canonicalUrl="https://www.eateriq.com/history/"
      />
      {/* ✅ FIX: No min-h-screen, no extra wrappers — layout handles the shell */}
      <ScanHistory />
    </>
  );
};

export default ScanHistoryPage;