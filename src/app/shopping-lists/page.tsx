import React from 'react';
import ShoppingListsPage from '@/views/ShoppingListsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Lists | EaterIQ',
  description: 'Manage your shopping lists.',
};

export default function Page() {
  return <ShoppingListsPage />;
}
