import React from 'react';
import ScanHistoryPage from '@/pages/ScanHistoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan History | EaterIQ',
  description: 'View your scan history.',
};

export default function Page() {
  return <ScanHistoryPage />;
}
