import React from 'react';
import DeleteAccountPage from '@/pages/DeleteAccountPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete Account | EaterIQ',
  description: 'Delete your account.',
};

export default function Page() {
  return <DeleteAccountPage />;
}
