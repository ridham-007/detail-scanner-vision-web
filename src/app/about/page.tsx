import React from 'react';
import AboutPage from '@/views/AboutPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | EaterIQ',
  description: 'Learn more about EaterIQ.',
};

export default function Page() {
  return <AboutPage />;
}
