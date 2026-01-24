import React from 'react';
import BlogListPage from '@/pages/BlogListPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nutrition Blog | EaterIQ',
  description: 'Expert nutrition advice and healthy eating tips.',
};

export default function Page() {
  return <BlogListPage />;
}
