import React from 'react';
import QuizPage from '@/views/QuizPage';
import { Metadata } from 'next';
import { supabase } from '@/integrations/supabase/client';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { slug } = await params;

  // Fetch data
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('title, description')
    .eq('slug', slug)
    .single();

  if (!quiz) {
    return {
      title: 'Quiz Not Found | EaterIQ',
    };
  }

  return {
    title: `${quiz.title} | EaterIQ Quiz`,
    description: quiz.description || `Take the ${quiz.title} quiz on EaterIQ.`,
    openGraph: {
      title: `${quiz.title} | EaterIQ Quiz`,
      description: quiz.description || undefined,
    },
  };
}

export default function Page() {
  return <QuizPage />;
}
