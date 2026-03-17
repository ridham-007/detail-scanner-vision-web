import React from 'react';
import { Metadata } from 'next';
import Favorites from '../../components/Favorites';

export const metadata: Metadata = {
  title: 'My Favorites | EaterIQ',
  description:
    'View your favorites product on EaterIQ, track product submissions, rewards, and contributor stats.',
};

export default function Page() {
  return <Favorites />;
}