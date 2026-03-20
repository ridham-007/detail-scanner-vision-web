"use client";

import React from 'react';
import ScanHistory from '@/components/ScanHistory';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';

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
          <Breadcrumbs items={[{ label: 'Scan History' }]} />
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl  mb-4 font-bold leading-[1.02] tracking-tight text-foreground">
              Your Scan{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                History
              </span> 
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
