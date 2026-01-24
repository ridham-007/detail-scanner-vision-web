import React from 'react';
import FoodScannerPage from '@/views/FoodScannerPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Food Scanner | EaterIQ',
  description: 'Scan food barcodes to analyze ingredients and health scores.',
};

export default function Page() {
  return <FoodScannerPage />;
}
