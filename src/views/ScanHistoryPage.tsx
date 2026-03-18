"use client";

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
      
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 rounded-[32px] border border-white/60 bg-white/82 px-6 py-10 text-center shadow-product backdrop-blur-sm">
            <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground">
              Your Scan History
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Track your scanned products and monitor your nutrition journey over time.
            </p>
          </div>
          
          <ScanHistory />
        </div>
      </div>
    </>
  );
};

export default ScanHistoryPage;
