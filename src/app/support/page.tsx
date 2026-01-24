import React from 'react';
import SupportPage from '@/views/SupportPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | EaterIQ',
  description: 'Get help and support.',
};

export default function Page() {
  return <SupportPage />;
}
