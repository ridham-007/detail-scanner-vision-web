// app/quiz/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import QuizPlayClient from '@/components/quiz/QuizPlayClient';

type Props = {
  params: Promise<{ slug: string }>;
};

// Fetch quiz data
async function getQuizData(slug: string) {
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title, description, difficulty, creator_id, slug, is_published')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (quizError || !quiz) return null;

  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, question_text, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, question_order')
    .eq('quiz_id', quiz.id)
    .order('question_order');

  if (questionsError) return null;

  return { quiz, questions: questions || [] };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getQuizData(slug);

  if (!data) {
    return {
      title: 'Quiz Not Found | EaterIQ',
      description: 'The quiz you are looking for could not be found.',
    };
  }

  const { quiz } = data;
  const canonicalUrl = `https://www.eateriq.com/quiz/${slug}`;

  return {
    title: `${quiz.title} - Nutrition Quiz | EaterIQ`,
    description: quiz.description || `Test your knowledge with this ${quiz.difficulty} difficulty nutrition quiz. Challenge yourself and learn about food and healthy eating.`,
    keywords: ['nutrition quiz', 'food quiz', `${quiz.difficulty} quiz`, quiz.title, 'health knowledge test', 'food trivia'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      title: `${quiz.title} - Nutrition Quiz | EaterIQ`,
      description: quiz.description || `Challenge yourself with this ${quiz.difficulty} nutrition quiz!`,
      url: canonicalUrl,
      siteName: 'EaterIQ',
      images: [
        {
          url: '/og-quiz.png',
          width: 1200,
          height: 630,
          alt: `${quiz.title} Quiz`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${quiz.title} - Nutrition Quiz | EaterIQ`,
      description: quiz.description || `Challenge yourself with this ${quiz.difficulty} nutrition quiz!`,
      images: ['/og-quiz.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Generate static paths for published quizzes
export async function generateStaticParams() {
  const { data } = await supabase
    .from('quizzes')
    .select('slug')
    .eq('is_published', true)
    .limit(100);

  return (data || []).map((quiz) => ({
    slug: quiz.slug,
  }));
}

export default async function QuizPlayPage({ params }: Props) {
  const { slug } = await params;
  const data = await getQuizData(slug);

  if (!data || data.questions.length === 0) {
    notFound();
  }

  const { quiz, questions } = data;
  const canonicalUrl = `https://www.eateriq.com/quiz/${slug}`;

  // Quiz structured data
  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": quiz.title,
    "description": quiz.description || `A ${quiz.difficulty} difficulty nutrition quiz`,
    "url": canonicalUrl,
    "educationalLevel": quiz.difficulty,
    "numberOfQuestions": questions.length,
    "timeRequired": `PT${questions.length * 30}S`,
    "about": {
      "@type": "Thing",
      "name": "Nutrition and Food Knowledge"
    },
    "provider": {
      "@type": "Organization",
      "name": "EaterIQ",
      "url": "https://www.eateriq.com"
    },
    "hasPart": questions.slice(0, 5).map((q, index) => ({
      "@type": "Question",
      "position": index + 1,
      "text": q.question_text,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.correct_answer
      }
    }))
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.eateriq.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Quiz Hub",
        "item": "https://www.eateriq.com/quiz/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": quiz.title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Client Component for Interactive Quiz */}
      <QuizPlayClient 
        initialQuiz={quiz} 
        initialQuestions={questions} 
      />
    </>
  );
}