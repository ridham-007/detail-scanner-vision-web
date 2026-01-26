// app/quiz/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { supabase } from '@/integrations/supabase/client';
import QuizzesClient from '@/components/quiz/QuizzesClient';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Nutrition Quizzes - Test Your Food Knowledge | EaterIQ',
  description: 'Challenge yourself with fun and educational quizzes about nutrition, food safety, and healthy eating. Create quizzes and compete with food enthusiasts.',
  keywords: ['nutrition quiz', 'food quiz', 'healthy eating quiz', 'food safety quiz', 'nutrition knowledge test', 'food trivia', 'diet quiz'],
  alternates: {
    canonical: 'https://www.eateriq.com/quiz',
  },
  openGraph: {
    type: 'website',
    title: 'Nutrition Quizzes - Test Your Food Knowledge | EaterIQ',
    description: 'Challenge yourself with fun quizzes about nutrition, food safety, and healthy eating.',
    url: 'https://www.eateriq.com/quiz/',
    siteName: 'EaterIQ',
    images: [
      {
        url: '/og-quiz.png',
        width: 1200,
        height: 630,
        alt: 'EaterIQ Nutrition Quizzes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrition Quizzes - Test Your Food Knowledge | EaterIQ',
    description: 'Challenge yourself with fun quizzes about nutrition and healthy eating.',
    images: ['/og-quiz.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Fetch published quizzes for initial render
async function getPublishedQuizzes() {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, description, difficulty, created_at, creator_id, is_published, slug')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }

  return data || [];
}

// Fetch leaderboard for initial render
async function getLeaderboard() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, total_score, quizzes_completed')
    .order('total_score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data || [];
}

export default async function QuizPage() {
  // Parallel data fetching
  const [quizzes, leaderboard] = await Promise.all([
    getPublishedQuizzes(),
    getLeaderboard(),
  ]);

  // Structured Data - Quiz Collection
  const quizCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "EaterIQ Nutrition Quizzes",
    "description": "A collection of fun and educational quizzes about nutrition, food safety, and healthy eating.",
    "url": "https://www.eateriq.com/quiz/",
    "publisher": {
      "@type": "Organization",
      "name": "EaterIQ",
      "url": "https://www.eateriq.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.eateriq.com/eater-iq.png"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": quizzes.slice(0, 10).map((quiz, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Quiz",
          "name": quiz.title,
          "description": quiz.description,
          "url": `https://www.eateriq.com/quiz/${quiz.slug}/`,
          "educationalLevel": quiz.difficulty,
          "about": {
            "@type": "Thing",
            "name": "Nutrition"
          }
        }
      }))
    }
  };

  // Breadcrumb Schema
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
      }
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What topics do the nutrition quizzes cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our quizzes cover a wide range of topics including nutrition facts, food safety, healthy eating habits, dietary guidelines, food labels, vitamins and minerals, and more."
        }
      },
      {
        "@type": "Question",
        "name": "Can I create my own quiz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Registered users can create up to 2 custom quizzes per month. Simply sign in and click the 'Create Quiz' button to get started."
        }
      },
      {
        "@type": "Question",
        "name": "Are the quizzes free to play?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all quizzes on EaterIQ are completely free to play. You can test your nutrition knowledge without any cost."
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizCollectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Client Component for Interactive Functionality */}
      <QuizzesClient 
        initialQuizzes={quizzes} 
        initialLeaderboard={leaderboard} 
      />
    </>
  );
}