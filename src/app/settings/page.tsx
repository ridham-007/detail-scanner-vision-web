import React from 'react';
import { Metadata } from 'next';
import UserSettingsPage from '@/views/UserSettingsPage';

export const metadata: Metadata = {
  title: 'User Settings | EaterIQ',
  description: 'View and update your user settings.',
};

export default function Page() {
  return <UserSettingsPage />;
}
