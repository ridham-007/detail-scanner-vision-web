import React from 'react';
import QuizzesPage from '@/pages/QuizzesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nutrition Quizzes | EaterIQ',
  description: 'Test your food knowledge with our interactive quizzes.',
};

export default function Page() {
  return <QuizzesPage />;
}
