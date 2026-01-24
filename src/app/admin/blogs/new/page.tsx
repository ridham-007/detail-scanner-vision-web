import React from 'react';
import CreateBlogPage from '@/views/admin/CreateBlogPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Blog Post | EaterIQ Admin',
  description: 'Create a new blog post',
};

export default function Page() {
  return <CreateBlogPage />;
}
