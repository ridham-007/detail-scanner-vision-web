import React from 'react';
import ContributionsPage from '@/views/ContributionsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Contributions | EaterIQ',
  description:
    'View your contributions on EaterIQ, track product submissions, rewards, and contributor stats.',
};

export default function Page() {
  return <ContributionsPage />;
}
