import React from 'react';
import ScanHistory from '@/components/ScanHistory';
import SEOHead from '@/components/SEOHead';

const ScanHistoryPage = () => {
  return (
    <>
      <SEOHead
        title="Scan History | EaterIQ"
        description="View your product scan history and track your nutrition journey with EaterIQ."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent mb-4">
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