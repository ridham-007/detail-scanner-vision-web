import React from 'react';
import TermsPage from '@/pages/TermsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | EaterIQ',
  description: 'Read our terms of service.',
};

export default function Page() {
  return <TermsPage />;
}
