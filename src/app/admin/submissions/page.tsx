import React from 'react';
import ProductSubmissionsPage from '@/views/admin/ProductSubmissionsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Submissions | EaterIQ Admin',
  description: 'Manage product submissions.',
};

export default function Page() {
  return <ProductSubmissionsPage />;
}
