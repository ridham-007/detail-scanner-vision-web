import React from 'react';
import AdminNotificationsPage from '@/pages/admin/AdminNotificationsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Notifications | EaterIQ Admin',
  description: 'View admin notifications.',
};

export default function Page() {
  return <AdminNotificationsPage />;
}
