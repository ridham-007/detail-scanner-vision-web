import React from 'react';
import AuthPage from '@/views/AuthPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | EaterIQ',
  description: 'Sign in to your account.',
};

export default function Page() {
  return <AuthPage />;
}
