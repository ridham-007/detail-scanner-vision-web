import React from 'react';
import EditBlogPage from '@/pages/admin/EditBlogPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Blog Post | EaterIQ Admin',
  description: 'Edit existing blog post',
};

export default function Page() {
  return <EditBlogPage />;
}
