import React from 'react';
import SubscriptionSuccessPage from '@/pages/SubscriptionSuccessPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription Successful | EaterIQ',
  description: 'Thank you for subscribing!',
};

export default function Page() {
  return <SubscriptionSuccessPage />;
}
