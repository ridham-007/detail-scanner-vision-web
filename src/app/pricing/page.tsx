import React from 'react';
import PricingPage from '@/views/PricingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | EaterIQ',
  description: 'Pro plans and pricing.',
};

export default function Page() {
  return <PricingPage />;
}
