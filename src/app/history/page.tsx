import React from 'react';
import ScanHistoryPage from '@/views/ScanHistoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan History | EaterIQ',
  description: 'View your scan history.',
};

export default function Page() {
  return <ScanHistoryPage />;
}
