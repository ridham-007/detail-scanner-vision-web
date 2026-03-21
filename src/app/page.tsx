// app/page.tsx
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";
import dynamic from "next/dynamic";

const FoodScannerPage = dynamic(() => import("@/views/FoodScannerPage"), {
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-[32px] animate-pulse font-medium text-muted-foreground">
      Initializing scanner...
    </div>
  ),
});

const HealthCalculators = dynamic(
  () => import("@/components/HealthCalculators"),
  {
    loading: () => (
      <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-[32px] animate-pulse">
        Loading health tools...
      </div>
    ),
  },
);

const ScrollToScannerButton = dynamic(
  () => import("@/components/home/ScrollToScannerButton"),
);

// Static metadata for SEO
export const metadata: Metadata = {
  title:
    "EaterIQ - Food Scanner for Healthier Choices | Free Nutrition Analysis",
  description:
    "Scan any food product barcode and instantly get nutrition analysis, health scores, ingredient warnings, and healthier alternatives. Free to start, no sign-up required.",
  keywords: [
    "food scanner",
    "nutrition analysis",
    "healthy eating",
    "barcode scanner",
    "ingredient checker",
    "health score",
    "food additives",
    "allergen detection",
    "nutrition app",
  ],
  alternates: {
    canonical: "https://www.eateriq.com",
  },
  openGraph: {
    type: "website",
    title: "EaterIQ - Make Smarter Food Choices",
    description:
      "Free food scanner. Analyze nutrition, detect harmful additives, and find healthier alternatives instantly.",
    url: "https://www.eateriq.com/",
    siteName: "EaterIQ",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "EaterIQ Food Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EaterIQ - Make Smarter Food Choices",
    description:
      "Free food scanner. Analyze nutrition, detect harmful additives, and find healthier alternatives instantly.",
    images: ["/og-home.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Server-side data fetching
async function getRecentQuizzes() {
  const { data, error } = await supabase
    .from("quizzes")
    .select("id, title, description, difficulty, created_at, slug")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching quizzes:", JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
}

async function getRecentBlogs() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, featured_image_url, reading_time, published_at",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching blogs:", JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
}

async function getProductCount() {
  const { count, error } = await supabase
    .from("scanned_products")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  if (error) {
    console.error(
      "Error fetching product count:",
      JSON.stringify(error, null, 2),
    );
    return 23000;
  }
  return (count || 0) + 23000;
}

async function getUserCount() {
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching user count:", JSON.stringify(error, null, 2));
    return 14000;
  }
  return (count || 0) + 14000;
}

// Enable ISR
export const revalidate = 3600;

// Helper functions
function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "hard":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [recentQuizzes, recentBlogs, productCount, userCount] =
    await Promise.all([
      getRecentQuizzes(),
      getRecentBlogs(),
      getProductCount(),
      getUserCount(),
    ]);

  // Structured data schemas
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "EaterIQ",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web Browser, iOS, Android",
    description:
      "Food scanner that analyzes nutrition, ingredients, and additives to help you make healthier food choices.",
    url: "https://www.eateriq.com",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with optional premium upgrades",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: userCount,
    },
    publisher: {
      "@type": "Organization",
      name: "EaterIQ",
      url: "https://www.eateriq.com",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EaterIQ",
    url: "https://www.eateriq.com",
    logo: "https://www.eateriq.com/eater-iq.png",
    sameAs: [
      "https://apps.apple.com/sg/app/eateriq/id6757137222",
      "https://play.google.com/store/apps/details?id=com.eateriq",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@eateriq.com",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Use EaterIQ Food Scanner",
    description:
      "Three simple steps to make informed food choices with EaterIQ",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Scan Barcode",
        text: "Use your camera to scan any product barcode, or search by name in our database of millions of products.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Get Analysis",
        text: "Our system analyzes ingredients, nutrition facts, additives, and allergens to calculate a comprehensive health score.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Get Insights",
        text: "Receive personalized health insights, ingredient warnings, and recommendations for healthier alternatives.",
      },
    ],
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
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-10"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="
  grid 
  grid-cols-1 
  lg:grid-cols-2 
  gap-6 sm:gap-8 lg:gap-10
  items-center
"
          >
            {/* Left Column - Content */}
            <div className="order-1 flex flex-col justify-center rounded-[32px] border border-white/60 bg-white/78 px-5 py-7 text-center sm:px-6 md:px-8 md:py-10 lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 self-center rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 lg:self-start">
                <Sparkles className="h-4 w-4" />
                Fresh scans, smarter food choices
              </div>
              <h1
                id="hero-heading"
                className="mb-4 text-2xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
              >
                Bright health guidance for every barcode in your kitchen.
              </h1>

              <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0">
                EaterIQ turns food labels into warm, practical guidance with
                health scores, ingredient analysis, and healthier alternatives
                in seconds.
              </p>

              {/* CTA - Client Component for scroll */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <ScrollToScannerButton />
              </div>

              {/* Trust Badges */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <div className="flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-sm text-orange-900">
                  <CheckCircle
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  <span>Free to Start</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-sm text-orange-900">
                  <Shield
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  <span>No Sign-up Required</span>
                </div>
              </div>

              {/* App Store Badges */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 sm:justify-center lg:justify-start">
                <a
                  href="https://apps.apple.com/sg/app/eateriq/id6757137222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/appstore.webp"
                    alt="Download on the App Store"
                    width={160}
                    height={50}
                    className="h-auto w-[150px] sm:w-[160px]"
                    priority
                  />
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.eateriq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/googleplay.webp"
                    alt="Get it on Google Play"
                    width={160}
                    height={50}
                    className="h-auto w-[150px] sm:w-[160px]"
                    priority
                  />
                </a>
              </div>
            </div>

            {/* Right Column - Phone Mockup */}
            <div className="relative order-2 flex items-center justify-center px-2 py-4 sm:px-4 sm:py-8 md:py-10 lg:justify-end">
              {/* Food Background Elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08] text-3xl">
                <span className="absolute top-6 left-6">🥗</span>
                <span className="absolute top-1/4 right-8">🍎</span>
                <span className="absolute bottom-1/3 left-10">🥑</span>
                <span className="absolute bottom-10 right-12">🥕</span>
              </div>

              <div className="relative z-10 rounded-[32px] border border-white/60 bg-white/45 p-3 shadow-product backdrop-blur-sm sm:rounded-[36px] sm:p-6">
                {/* Phone Mockup */}
<div
  className="
    relative 
    w-[210px] 
    xs:w-[240px]
    sm:w-[260px] 
    md:w-[290px]
    max-w-full
    aspect-[9/16]
  "
>
  <Image
    src="/hero-image.webp"
    alt="App preview"
    fill
    className="object-contain scale-[1.35]"
    unoptimized
  />
</div>

                {/* Floating Stats Badges */}
                <div
                  className="
  absolute 
  -bottom-2 left-0 
  scale-[0.78] rounded-2xl border border-border/50 bg-card px-4 py-3 shadow-xl
  sm:bottom-4 sm:-left-2 sm:scale-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BarChart3
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground block">
                        {formatNumber(productCount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Products
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-1 top-0 scale-[0.82] rounded-2xl border border-border/50 bg-card px-4 py-3 shadow-xl sm:top-2 sm:-right-2 sm:scale-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground block">
                        {formatNumber(userCount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Users
                      </span>
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
        className="container mx-auto scroll-mt-20 px-4 py-12 sm:py-16"
        aria-labelledby="scanner-heading"
      >
        <div className="mx-auto rounded-[32px] border border-white/60 bg-white/78 p-2 sm:p-3 md:p-5">
          <FoodScannerPage />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-14"
        aria-labelledby="how-it-works-heading"
      >
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center sm:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-orange-800 shadow-[var(--shadow-soft)]">
              <QrCode className="h-4 w-4" />
              Simple from first scan to insight
            </div>
            <h2
              id="how-it-works-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4"
            >
              How EaterIQ Works
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Three simple steps to make informed food choices
            </p>
          </header>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* Step 1 */}
            <article className="relative rounded-[28px] border border-white/65 bg-white/82 px-6 pb-8 pt-10 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50">
                <QrCode className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/70 bg-white px-3 py-1 text-xs font-bold text-primary shadow-[var(--shadow-soft)]">
                Step 1
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                Scan Barcode
              </h3>
              <p className="text-muted-foreground">
                Use your camera to scan any product barcode, or search by name
                in our database of millions of products.
              </p>
            </article>

            {/* Step 2 */}
            <article className="relative rounded-[28px] border border-white/65 bg-white/82 px-6 pb-8 pt-10 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50">
                <Search className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/70 bg-white px-3 py-1 text-xs font-bold text-primary shadow-[var(--shadow-soft)]">
                Step 2
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                Detailed Analysis
              </h3>
              <p className="text-muted-foreground">
                Our system analyzes ingredients, nutrition facts, additives, and
                allergens to calculate a comprehensive health score.
              </p>
            </article>

            {/* Step 3 */}
            <article className="relative rounded-[28px] border border-white/65 bg-white/82 px-6 pb-8 pt-10 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50">
                <TrendingUp
                  className="h-8 w-8 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/70 bg-white px-3 py-1 text-xs font-bold text-primary shadow-[var(--shadow-soft)]">
                Step 3
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                Get Insights
              </h3>
              <p className="text-muted-foreground">
                Receive personalized health insights, ingredient warnings, and
                recommendations for healthier alternatives.
              </p>
            </article>
          </div>

          <div className="text-center mt-12">
            <ScrollToScannerButton variant="cta" />
          </div>
        </div>
      </section>

      <HealthCalculators />

      {/* Key Features Section */}

      {/* Why Choose EaterIQ Section */}
      <section
        id="why-eateriq"
        className="py-14 sm:py-20"
        aria-labelledby="why-heading"
      >
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center sm:mb-16">
            <h2
              id="why-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4"
            >
              Why Choose EaterIQ?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              We&apos;re on a mission to make food transparency accessible to
              everyone
            </p>
          </header>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Science-Based */}
            <article className="rounded-[26px] border border-white/65 bg-white/82 p-6 shadow-product">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                    Science-Based Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our health scores are calculated using peer-reviewed
                    nutritional science and WHO dietary guidelines.
                  </p>
                </div>
              </div>
            </article>

            {/* Instant Results */}
            <article className="rounded-[26px] border border-white/65 bg-white/82 p-6 shadow-product">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                    Instant Results
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get comprehensive nutritional analysis in seconds. No
                    waiting, no complicated processes.
                  </p>
                </div>
              </div>
            </article>

            {/* Personalized */}
            <article className="rounded-[26px] border border-white/65 bg-white/82 p-6 shadow-product">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                    Personalized Insights
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Receive recommendations based on your dietary preferences,
                    allergies, and health goals.
                  </p>
                </div>
              </div>
            </article>

            {/* Transparency */}
            <article className="rounded-[26px] border border-white/65 bg-white/82 p-6 shadow-product">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                    Transparency First
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We decode confusing ingredient lists and reveal what&apos;s
                    really in your food.
                  </p>
                </div>
              </div>
            </article>

            {/* Trusted */}
            <article className="rounded-[26px] border border-white/65 bg-white/82 p-6 shadow-product">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <Award className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                    Trusted by Thousands
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Join our growing community of health-conscious consumers
                    making informed choices.
                  </p>
                </div>
              </div>
            </article>

            {/* Free */}
            <article className="rounded-[26px] border border-white/65 bg-white/82 p-6 shadow-product">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <CheckCircle
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                    Free to Start
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start scanning for free with no sign-up required. Upgrade
                    anytime for unlimited scans and premium features.
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
            <header className="mb-12 text-center">
              <h2
                id="quizzes-heading"
                className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4"
              >
                Test Your Food Knowledge
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                Challenge yourself with our nutrition quizzes and learn while
                having fun
              </p>
            </header>

            <div className="mx-auto mb-8 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="flex h-full flex-col rounded-[26px] border-white/65 bg-white/82 shadow-product"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${getDifficultyColor(quiz.difficulty)} text-xs`}
                      >
                        {quiz.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold line-clamp-2 capitalize">
                      <Link
                        href={`/quiz/${quiz.slug}/`}
                        className="hover:text-primary"
                      >
                        {quiz.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0 flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {quiz.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      <time dateTime={quiz.created_at || ""}>
                        {quiz.created_at
                          ? new Date(quiz.created_at).toLocaleDateString()
                          : "N/A"}
                      </time>
                    </div>

                    <div className="mt-auto">
                      <Link href={`/quiz/${quiz.slug}/`}>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                          Play Quiz
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/quiz/">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-2 border-orange-200/70 bg-white/82 px-8"
                >
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
          className="py-14 sm:py-20"
          aria-labelledby="blog-heading"
        >
          <div className="container mx-auto px-4">
            <header className="mb-12 text-center">
              <h2
                id="blog-heading"
                className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4"
              >
                Nutrition Insights &amp; Tips
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                Expert articles to help you understand nutrition and make
                healthier choices
              </p>
            </header>

            <div className="mx-auto mb-8 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
              {recentBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="overflow-hidden rounded-[28px] border border-white/65 bg-white/84 shadow-product"
                >
                  {blog.featured_image_url && (
                    <div className="aspect-[16/9] w-full relative overflow-hidden">
                      <Image
                        src={blog.featured_image_url}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

                    <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2 line-clamp-2">
                      <Link
                        href={`/blog/${blog.slug}/`}
                        className="hover:text-primary"
                      >
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
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-2 border-orange-200/70 bg-white/82 px-8"
                >
                  View All Articles
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* </div> */}
    </>
  );
}
