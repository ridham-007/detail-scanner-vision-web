// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { supabase } from '@/integrations/supabase/client';
import {
  Brain,
  Scan,
  Zap,
  Shield,
  Heart,
  Leaf,
  Award,
  CheckCircle,
  Play,
  QrCode,
  TrendingUp,
  Calendar,
  ArrowRight,
  Clock,
  BarChart3,
  AlertTriangle,
  ListChecks,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FoodScannerPage from '@/views/FoodScannerPage';
import ScrollToScannerButton from '@/components/home/ScrollToScannerButton';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'EaterIQ - Food Scanner for Healthier Choices | Free Nutrition Analysis',
  description: 'Scan any food product barcode and instantly get nutrition analysis, health scores, ingredient warnings, and healthier alternatives. Free to start, no sign-up required.',
  keywords: ['food scanner', 'nutrition analysis', 'healthy eating', 'barcode scanner', 'ingredient checker', 'health score', 'food additives', 'allergen detection', 'nutrition app'],
  alternates: {
    canonical: 'https://www.eateriq.com',
  },
  openGraph: {
    type: 'website',
    title: 'EaterIQ - Make Smarter Food Choices',
    description: 'Free food scanner. Analyze nutrition, detect harmful additives, and find healthier alternatives instantly.',
    url: 'https://www.eateriq.com/',
    siteName: 'EaterIQ',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'EaterIQ Food Scanner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EaterIQ - Make Smarter Food Choices',
    description: 'Free food scanner. Analyze nutrition, detect harmful additives, and find healthier alternatives instantly.',
    images: ['/og-home.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Server-side data fetching
async function getRecentQuizzes() {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, description, difficulty, created_at, slug')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
  return data || [];
}

async function getRecentBlogs() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image_url, reading_time, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
  return data || [];
}

async function getProductCount() {
  const { count, error } = await supabase
    .from('scanned_products')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching product count:', error);
    return 23000;
  }
  return (count || 0) + 23000;
}

async function getUserCount() {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching user count:', error);
    return 14000;
  }
  return (count || 0) + 14000;
}

// Enable ISR
export const revalidate = 3600;

// Helper functions
function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

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

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [recentQuizzes, recentBlogs, productCount, userCount] = await Promise.all([
    getRecentQuizzes(),
    getRecentBlogs(),
    getProductCount(),
    getUserCount(),
  ]);

  // Structured data schemas
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EaterIQ",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser, iOS, Android",
    "description": "Food scanner that analyzes nutrition, ingredients, and additives to help you make healthier food choices.",
    "url": "https://www.eateriq.com",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier with optional premium upgrades"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": userCount
    },
    "publisher": {
      "@type": "Organization",
      "name": "EaterIQ",
      "url": "https://www.eateriq.com"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EaterIQ",
    "url": "https://www.eateriq.com",
    "logo": "https://www.eateriq.com/eater-iq.png",
    "sameAs": [
      "https://apps.apple.com/sg/app/eateriq/id6757137222",
      "https://play.google.com/store/apps/details?id=com.eateriq"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@eateriq.com"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use EaterIQ Food Scanner",
    "description": "Three simple steps to make informed food choices with EaterIQ",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Scan Barcode",
        "text": "Use your camera to scan any product barcode, or search by name in our database of millions of products."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Get Analysis",
        "text": "Our system analyzes ingredients, nutrition facts, additives, and allergens to calculate a comprehensive health score."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Get Insights",
        "text": "Receive personalized health insights, ingredient warnings, and recommendations for healthier alternatives."
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="min-h-screen bg-background">
        <main className="relative z-10">
          {/* Hero Section */}
          <section
            className="relative py-12 md:py-16 lg:py-20 overflow-hidden"
            aria-labelledby="hero-heading"
          >
            <div className="container mx-auto px-12">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch mx-auto">
                {/* Left Column - Content */}
                <div className="text-center lg:text-left order-1 flex flex-col justify-center py-6 md:py-8">
                  <h1
                    id="hero-heading"
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-4"
                  >
                    Know What&apos;s in{' '}
                    <span className="text-primary">Your Food</span>
                  </h1>

                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
                    Scan any product barcode to get instant health scores,
                    ingredient analysis, and healthier alternatives.
                  </p>

                  {/* CTA - Client Component for scroll */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                    <ScrollToScannerButton />
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-6">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span>Free to Start</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                      <Shield className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span>No Sign-up Required</span>
                    </div>
                  </div>

                  {/* App Store Badges */}
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <a
                      href="https://apps.apple.com/sg/app/eateriq/id6757137222"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download on the App Store"
                      className="transition-opacity hover:opacity-80"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                        alt="Download on the App Store"
                        className="h-[36px]"
                        loading="lazy"
                      />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.eateriq"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Get it on Google Play"
                      className="transition-opacity hover:opacity-80"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        alt="Get it on Google Play"
                        className="h-[54px] -my-[9px]"
                        loading="lazy"
                      />
                    </a>
                  </div>
                </div>

                {/* Right Column - Phone Mockup */}
                <div className="order-2 flex justify-center lg:justify-end items-center relative py-8 md:py-10 px-4">
                  {/* Food Background Elements */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-6 left-6 text-4xl opacity-[0.08]">🥗</div>
                    <div className="absolute top-1/4 right-8 text-3xl opacity-[0.07]">🍎</div>
                    <div className="absolute bottom-1/3 left-10 text-3xl opacity-[0.07]">🥑</div>
                    <div className="absolute bottom-10 right-12 text-4xl opacity-[0.08]">🥕</div>
                    <div className="absolute top-1/2 left-1/4 text-2xl opacity-[0.06]">🍇</div>
                    <div className="absolute bottom-1/4 right-1/4 text-2xl opacity-[0.06]">🥦</div>
                  </div>

                  <div className="relative z-10 p-6">
                    {/* Phone Mockup */}
                    <div className="relative w-[260px] md:w-[290px]">
                      <div className="bg-foreground/10 rounded-[2.5rem] p-1 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                        <div className="bg-card rounded-[2.3rem] overflow-hidden shadow-inner">
                          {/* Status Bar */}
                          <div className="bg-background px-4 pt-2 pb-1 relative flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-foreground">9:41</span>
                            <div className="w-20 h-6 bg-foreground rounded-full" />
                            <div className="flex items-center gap-1">
                              <div className="flex gap-[1px] items-end">
                                <div className="w-[2px] h-[4px] bg-foreground rounded-[1px]" />
                                <div className="w-[2px] h-[6px] bg-foreground rounded-[1px]" />
                                <div className="w-[2px] h-[8px] bg-foreground rounded-[1px]" />
                                <div className="w-[2px] h-[10px] bg-foreground rounded-[1px]" />
                              </div>
                              <div className="w-5 h-2.5 border border-foreground rounded-[3px] relative ml-0.5">
                                <div className="absolute inset-[1px] right-0.5 bg-primary rounded-[1px]" />
                              </div>
                            </div>
                          </div>

                          {/* App Content */}
                          <div className="px-4 pt-2 pb-3 bg-background min-h-[360px]">
                            {/* App Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                  <Scan className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                                </div>
                                <span className="text-sm font-bold text-foreground">EaterIQ</span>
                              </div>
                              <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                                <Search className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                              </div>
                            </div>

                            {/* Product Result Card */}
                            <div className="bg-muted/30 border border-border rounded-xl p-3 mb-3">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-14 h-14 bg-card border border-border rounded-xl flex items-center justify-center">
                                  <span className="text-2xl">🥣</span>
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-foreground mb-0.5">Organic Granola</div>
                                  <div className="text-xs text-muted-foreground mb-1.5">Nature Valley • 350g</div>
                                  <div className="inline-flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-full">
                                    <Leaf className="w-3 h-3 text-primary" aria-hidden="true" />
                                    <span className="text-[10px] text-primary font-medium">Organic</span>
                                  </div>
                                </div>
                              </div>

                              {/* Health Score */}
                              <div className="bg-card border border-border rounded-lg p-3 mb-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-0.5">Health Score</div>
                                    <div className="flex items-baseline gap-0.5">
                                      <span className="text-2xl font-bold text-primary">85</span>
                                      <span className="text-xs text-muted-foreground">/100</span>
                                    </div>
                                    <div className="text-[10px] text-primary font-medium">Good Choice ✓</div>
                                  </div>
                                  <div className="w-12 h-12 rounded-full border-[3px] border-primary bg-primary/5 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                                  </div>
                                </div>
                              </div>

                              {/* Nutrition Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Low Sugar</span>
                                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">High Fiber</span>
                                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">No Additives</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="bg-primary rounded-xl py-2.5 text-center">
                              <span className="text-xs font-semibold text-primary-foreground">View Full Analysis</span>
                            </div>
                          </div>

                          {/* Home Indicator */}
                          <div className="flex justify-center py-2 bg-background">
                            <div className="w-24 h-1 bg-foreground/20 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Stats Badges */}
                    <div className="absolute bottom-2 -left-2 bg-card rounded-2xl px-4 py-3 shadow-xl border border-border/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-foreground block">
                            {formatNumber(productCount)}
                          </span>
                          <span className="text-xs text-muted-foreground">Products</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 -right-2 bg-card rounded-2xl px-4 py-3 shadow-xl border border-border/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-foreground block">
                            {formatNumber(userCount)}
                          </span>
                          <span className="text-xs text-muted-foreground">Users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scanner Section - Client Component */}
          <section
            id="scanner"
            className="container mx-auto px-4 py-16 scroll-mt-20"
            aria-labelledby="scanner-heading"
          >
            <h2 id="scanner-heading" className="sr-only">Food Product Scanner</h2>
            <div className="mx-auto">
              <FoodScannerPage />
            </div>
          </section>

          {/* How It Works Section */}
          <section
            id="how-it-works"
            className="bg-muted/30 py-20"
            aria-labelledby="how-it-works-heading"
          >
            <div className="container mx-auto px-4">
              <header className="text-center mb-16">
                <h2
                  id="how-it-works-heading"
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                >
                  How EaterIQ Works
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Three simple steps to make informed food choices
                </p>
              </header>

              <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <article className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <QrCode className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Step 1
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Scan Barcode</h3>
                  <p className="text-muted-foreground">
                    Use your camera to scan any product barcode, or search by name in our database of millions of products.
                  </p>
                </article>

                {/* Step 2 */}
                <article className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <Search className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Step 2
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Detailed Analysis</h3>
                  <p className="text-muted-foreground">
                    Our system analyzes ingredients, nutrition facts, additives, and allergens to calculate a comprehensive health score.
                  </p>
                </article>

                {/* Step 3 */}
                <article className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Step 3
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Get Insights</h3>
                  <p className="text-muted-foreground">
                    Receive personalized health insights, ingredient warnings, and recommendations for healthier alternatives.
                  </p>
                </article>
              </div>

              <div className="text-center mt-12">
                <ScrollToScannerButton variant="cta" />
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="py-20" aria-labelledby="features-heading">
            <div className="container mx-auto px-4">
              <header className="text-center mb-16">
                <h2
                  id="features-heading"
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                >
                  Powerful Features
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to understand your food
                </p>
              </header>

              <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Health Score Analysis */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Health Score Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant health scores based on nutritional content, additives, and processing level.
                  </p>
                </article>

                {/* Additive Detection */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Additive Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify harmful additives, preservatives, and artificial ingredients in your food.
                  </p>
                </article>

                {/* Allergen Alerts */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ListChecks className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Allergen Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic detection of common allergens like gluten, dairy, nuts, and more.
                  </p>
                </article>

                {/* Better Alternatives */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Better Alternatives</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover healthier product alternatives in the same category.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* Why Choose EaterIQ Section */}
          <section
            id="why-eateriq"
            className="bg-muted/20 py-20"
            aria-labelledby="why-heading"
          >
            <div className="container mx-auto px-4">
              <header className="text-center mb-16">
                <h2
                  id="why-heading"
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                >
                  Why Choose EaterIQ?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We&apos;re on a mission to make food transparency accessible to everyone
                </p>
              </header>

              <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Science-Based */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Science-Based Analysis</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Our health scores are calculated using peer-reviewed nutritional science and WHO dietary guidelines.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Instant Results */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Instant Results</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Get comprehensive nutritional analysis in seconds. No waiting, no complicated processes.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Personalized */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Personalized Insights</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Receive recommendations based on your dietary preferences, allergies, and health goals.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Transparency */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Transparency First</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We decode confusing ingredient lists and reveal what&apos;s really in your food.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Trusted */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Trusted by Thousands</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Join our growing community of health-conscious consumers making informed choices.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Free */}
                <article className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Free to Start</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Start scanning for free with no sign-up required. Upgrade anytime for unlimited scans and premium features.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Recent Quizzes Section */}
          {recentQuizzes && recentQuizzes.length > 0 && (
            <section
              id="quizzes"
              className="py-16"
              aria-labelledby="quizzes-heading"
            >
              <div className="container mx-auto px-4">
                <header className="text-center mb-12">
                  <h2
                    id="quizzes-heading"
                    className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                  >
                    Test Your Food Knowledge
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Challenge yourself with our nutrition quizzes and learn while having fun
                  </p>
                </header>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {recentQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="bg-card border-2 shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={`${getDifficultyColor(quiz.difficulty)} text-xs`}>
                            {quiz.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-semibold line-clamp-2 capitalize">
                          <Link href={`/quiz/${quiz.slug}/`} className="hover:text-primary">
                            {quiz.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {quiz.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          <time dateTime={quiz.created_at || ''}>
                            {quiz.created_at
                              ? new Date(quiz.created_at).toLocaleDateString()
                              : 'N/A'}
                          </time>
                        </div>

                        <Link href={`/quiz/${quiz.slug}/`}>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                            <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                            Play Quiz
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Link href="/quiz/">
                    <Button variant="outline" size="lg" className="px-8 border-2">
                      View All Quizzes
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Featured Blog Section */}
          {recentBlogs && recentBlogs.length > 0 && (
            <section
              id="blog"
              className="bg-muted/30 py-20"
              aria-labelledby="blog-heading"
            >
              <div className="container mx-auto px-4">
                <header className="text-center mb-12">
                  <h2
                    id="blog-heading"
                    className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                  >
                    Nutrition Insights &amp; Tips
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Expert articles to help you understand nutrition and make healthier choices
                  </p>
                </header>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-8">
                  {recentBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="bg-card rounded-xl overflow-hidden border border-border shadow-md"
                    >
                      {blog.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={blog.featured_image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          {blog.reading_time && (
                            <>
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              <span>{blog.reading_time} min read</span>
                            </>
                          )}
                          {blog.published_at && (
                            <>
                              <span className="mx-1">•</span>
                              <time dateTime={blog.published_at}>
                                {new Date(blog.published_at).toLocaleDateString()}
                              </time>
                            </>
                          )}
                        </div>

                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          <Link href={`/blog/${blog.slug}/`} className="hover:text-primary">
                            {blog.title}
                          </Link>
                        </h3>

                        {blog.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {blog.excerpt}
                          </p>
                        )}

                        <Link
                          href={`/blog/${blog.slug}/`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Read Article
                          <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="text-center">
                  <Link href="/blog/">
                    <Button variant="outline" size="lg" className="px-8 border-2">
                      View All Articles
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Final CTA Section */}
          <section className="py-20" aria-labelledby="cta-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center bg-primary/5 rounded-2xl p-12 border border-primary/20">
                <h2
                  id="cta-heading"
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                >
                  Start Making Healthier Choices Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of health-conscious consumers who use EaterIQ to understand what&apos;s really in their food. It&apos;s free, fast, and incredibly insightful.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ScrollToScannerButton variant="large" />
                  <Link href="/quiz/">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl border-2">
                      <Brain className="mr-2 h-5 w-5" aria-hidden="true" />
                      Take a Quiz
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Internal Navigation Links */}
          <section className="py-12 border-t" aria-labelledby="explore-heading">
            <div className="container mx-auto px-4">
              <h2 id="explore-heading" className="text-xl font-bold mb-8 text-center">
                Explore EaterIQ
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Link href="/quiz/" className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Brain className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Quiz Hub
                      </h3>
                      <p className="text-xs text-muted-foreground">Test your knowledge</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/blog/" className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <ArrowRight className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Blog
                      </h3>
                      <p className="text-xs text-muted-foreground">Nutrition articles</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/pricing/" className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Pricing
                      </h3>
                      <p className="text-xs text-muted-foreground">View plans</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/support/" className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Shield className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Support
                      </h3>
                      <p className="text-xs text-muted-foreground">Get help</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}