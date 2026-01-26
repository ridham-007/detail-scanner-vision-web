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
      
      <div className="min-h-screen dark:bg-[#1E2836]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Your Scan History
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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