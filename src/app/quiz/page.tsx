// app/quiz/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Trophy, 
  Target, 
  Scan, 
  BookOpen, 
  ArrowRight,
  Play,
  Calendar,
  Users,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QuizHubClient from '@/components/quiz/QuizzesClient';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Nutrition Quizzes - Test Your Food Knowledge | EaterIQ',
  description: 'Challenge yourself with fun and educational quizzes about nutrition, food safety, and healthy eating. Create quizzes and compete with food enthusiasts.',
  keywords: ['nutrition quiz', 'food quiz', 'healthy eating quiz', 'food safety quiz', 'nutrition knowledge test', 'food trivia', 'diet quiz'],
  alternates: {
    canonical: 'https://www.eateriq.com/quiz/',
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

// Fetch published quizzes
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

// // Fetch leaderboard
// async function getLeaderboard() {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('id, full_name, total_score, quizzes_completed')
//     .order('total_score', { ascending: false })
//     .limit(10);

//   if (error) {
//     console.error('Error fetching leaderboard:', error);
//     return [];
//   }

//   return data || [];
// }

// Generate static params for all quiz pages
export async function generateStaticParams() {
  const { data } = await supabase
    .from('quizzes')
    .select('slug')
    .eq('is_published', true);

  return (data || []).map((quiz) => ({
    slug: quiz.slug,
  }));
}

// Enable ISR
export const revalidate = 3600;

// Helper function
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function QuizPage() {
  const [quizzes] = await Promise.all([
    getPublishedQuizzes(),
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
      },
      {
        "@type": "Question",
        "name": "How do I track my quiz progress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After completing each quiz, you'll see your score and detailed explanations for each answer. Create an account to track your progress over time and compete on the leaderboard."
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

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium" aria-current="page">Quiz Hub</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <header className="mb-12 text-center">
            <Badge className="mb-4" variant="secondary">
              <Brain className="w-3 h-3 mr-1" aria-hidden="true" />
              {quizzes.length}+ Quizzes Available
            </Badge>
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Quiz Hub
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Challenge yourself with fun and educational nutrition quizzes. 
              Test your food knowledge, learn new facts, and compete with others!
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>{quizzes.length} Quizzes</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>1000+ Players</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>Global Leaderboard</span>
              </div>
            </div>

            {/* Client Component for Create Quiz Button */}
            <QuizHubClient />
          </header>

          {/* All Quizzes Section */}
          <section className="mb-16" aria-labelledby="all-quizzes-heading">
            <div className="mb-8 flex gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="all-quizzes-heading" className="flex items-center gap-2 text-2xl font-bold">
                <Brain className="w-6 h-6 text-primary" aria-hidden="true" />
                All Quizzes
              </h2>
              <Badge variant="outline">{quizzes.length} Total</Badge>
            </div>

            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <article key={quiz.id}>
                      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                      <CardHeader className="min-h-[120px] pb-3 sm:min-h-[140px]">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={`${getDifficultyColor(quiz.difficulty)} text-xs`}>
                            {quiz.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="min-h-[48px] text-lg font-semibold capitalize leading-relaxed line-clamp-2 sm:min-h-[52px]">
                          <Link 
                            href={`/quiz/${quiz.slug}/`}
                            className="hover:text-primary transition-colors"
                          >
                            {quiz.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col pt-0">
                        {quiz.description && (
                          <p className="mb-4 min-h-[40px] text-sm text-muted-foreground sm:min-h-[44px]">
                            {quiz.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          <time dateTime={quiz.created_at || ''}>
                            {quiz.created_at ? formatDate(quiz.created_at) : 'N/A'}
                          </time>
                        </div>

                        <Link href={`/quiz/${quiz.slug}/`} className="mt-auto">
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                            Play Quiz
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2">No quizzes available yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to create a nutrition quiz!
                </p>
              </div>
            )}
          </section>

          {/* Leaderboard Section */}
          {/* {leaderboard.length > 0 && (
            <section className="mb-16" aria-labelledby="leaderboard-heading">
              <div className="flex items-center justify-between mb-8">
                <h2 id="leaderboard-heading" className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" aria-hidden="true" />
                  Top Players
                </h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4 font-semibold">Rank</th>
                          <th className="text-left py-3 px-4 font-semibold">Player</th>
                          <th className="text-center py-3 px-4 font-semibold">Score</th>
                          <th className="text-center py-3 px-4 font-semibold">Quizzes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((player, index) => (
                          <tr key={player.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {index === 0 && <span className="text-xl">🥇</span>}
                                {index === 1 && <span className="text-xl">🥈</span>}
                                {index === 2 && <span className="text-xl">🥉</span>}
                                {index > 2 && <span className="text-muted-foreground font-medium">#{index + 1}</span>}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium">
                                {player.full_name || 'Anonymous Player'}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className="font-bold text-primary">
                                {player.total_score?.toLocaleString() || 0}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className="text-muted-foreground">
                                {player.quizzes_completed || 0}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          )} */}

          {/* How It Works Section */}
          <section className="mb-16 rounded-2xl bg-muted/30 py-10 sm:py-12" aria-labelledby="how-it-works-heading">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <h2 id="how-it-works-heading" className="text-2xl font-bold mb-8 text-center">
                How Quiz Hub Works
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose a Quiz</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse through our collection of nutrition quizzes. Filter by difficulty level to find the perfect challenge.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Answer Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge with multiple-choice questions. Each quiz has 10 questions covering various nutrition topics.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Learn &amp; Compete</h3>
                  <p className="text-sm text-muted-foreground">
                    See detailed explanations for each answer, track your progress, and climb the global leaderboard.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quiz Categories/Topics */}
          <section className="mb-16" aria-labelledby="topics-heading">
            <h2 id="topics-heading" className="text-2xl font-bold mb-8 text-center">
              Quiz Topics We Cover
            </h2>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Nutrition Basics</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Food Safety</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Vitamins &amp; Minerals</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Healthy Eating</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Diet &amp; Weight</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Food Labels</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Superfoods</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">Myths vs Facts</span>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <details className="group border rounded-lg" open>
                <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
                  What topics do the nutrition quizzes cover?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-muted-foreground">
                  Our quizzes cover a wide range of topics including nutrition basics, food safety, 
                  healthy eating habits, dietary guidelines, food labels, vitamins and minerals, 
                  superfoods, diet myths, and much more. We regularly add new quizzes to keep the content fresh and educational.
                </div>
              </details>

              <details className="group border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
                  Can I create my own quiz?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-muted-foreground">
                  Yes! Registered users can create up to 2 custom quizzes per month. Simply sign in 
                  and click the &quot;Create Quiz&quot; button to get started.
                </div>
              </details>

              <details className="group border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
                  Are the quizzes free to play?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-muted-foreground">
                  Yes, all quizzes on EaterIQ are completely free to play. You can test your nutrition 
                  knowledge without any cost. Create a free account to track your progress and appear 
                  on the leaderboard.
                </div>
              </details>

              <details className="group border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
                  How do I track my quiz progress?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-muted-foreground">
                  After completing each quiz, you&apos;ll see your score and detailed explanations for 
                  each answer. Create a free account to save your scores, track your progress over time, 
                  and compete on the global leaderboard.
                </div>
              </details>

              <details className="group border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
                  What difficulty levels are available?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-muted-foreground">
                  We offer three difficulty levels: Easy (great for beginners), Medium (for those with 
                  some nutrition knowledge), and Hard (for nutrition experts). Choose the level that 
                  matches your expertise or challenge yourself with harder quizzes!
                </div>
              </details>

              <details className="group border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
                  How many questions are in each quiz?
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-muted-foreground">
                  Each quiz contains 10 multiple-choice questions. You&apos;ll receive immediate feedback 
                  after each question, and a comprehensive summary with explanations at the end.
                </div>
              </details>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-16 text-center bg-muted/30 rounded-2xl p-8">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Start with any quiz above or try our food scanner to learn more about the products you eat every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#scanner">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Scan className="w-4 h-4 mr-2" aria-hidden="true" />
                  Try Food Scanner
                </Button>
              </Link>
              <Link href="/blog/">
                <Button size="lg" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
                  Read Nutrition Articles
                </Button>
              </Link>
            </div>
          </section>

          {/* Related Links */}
          <section aria-labelledby="explore-heading">
            <h2 id="explore-heading" className="text-xl font-bold mb-6 text-center">
              Explore More
            </h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Link href="/#scanner" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Scan className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Food Scanner
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Scan products for nutrition info
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/blog/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-accent/20">
                      <BookOpen className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Nutrition Blog
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Expert health articles
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/pricing/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-secondary/20">
                      <Target className="h-5 w-5 text-secondary-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Pricing Plans
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Unlock premium features
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
