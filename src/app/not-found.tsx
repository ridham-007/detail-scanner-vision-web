import React from 'react';
import NotFound from '@/views/NotFound';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | EaterIQ',
  description: 'The page you are looking for does not exist.',
};

export default function NotFoundPage() {
  return <NotFound />;
}
