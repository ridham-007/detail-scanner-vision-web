import React from 'react';
import PrivacyPage from '@/views/PrivacyPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | EaterIQ',
  description: 'Read our privacy policy.',
};

export default function Page() {
  return <PrivacyPage />;
}
