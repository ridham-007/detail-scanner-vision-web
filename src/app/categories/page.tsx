import React from 'react';
import CategoriesPage from '@/views/CategoriesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | EaterIQ',
  description: 'Browse food categories.',
};

export default function Page() {
  return <CategoriesPage />;
}
