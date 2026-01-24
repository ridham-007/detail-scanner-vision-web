import React from 'react';
import AdminBlogsPage from '@/views/admin/AdminBlogsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Management | EaterIQ Admin',
  description: 'Manage blog posts for EaterIQ',
};

export default function Page() {
  return <AdminBlogsPage />;
}
