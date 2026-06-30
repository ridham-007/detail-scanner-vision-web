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
  Info,
  Activity,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";
import dynamic from "next/dynamic";
import ScrollToScannerButton from "@/components/home/ScrollToScannerButton";
import FoodScannerClient from "@/components/scanner/FoodScannerClient";

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

// Static metadata for SEO
export const metadata: Metadata = {
  title: "EaterIQ: Food Barcode Scanner - Food Ingredient",
  description:
    "Use EaterIQ food scanner to scan barcodes, check ingredients, and analyze nutrition now. Ultimate food barcode scanner and ingredient checker for smarter eating.",
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
    title: "EaterIQ: Food Barcode Scanner - Food Ingredient",
    description:
      "Use EaterIQ food scanner to scan barcodes, check ingredients, and analyze nutrition now. Ultimate food barcode scanner and ingredient checker for smarter eating.",
    url: "https://www.eateriq.com/",
    siteName: "EaterIQ",
    images: [
      {
        url: "/og-home.webp",
        width: 1200,
        height: 630,
        alt: "EaterIQ Food Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EaterIQ: Food Barcode Scanner - Food Ingredient",
    description:
      "Use EaterIQ food scanner to scan barcodes, check ingredients, and analyze nutrition now. Ultimate food barcode scanner and ingredient checker for smarter eating.",
    images: ["/og-home.webp"],
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
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
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
  // const webAppSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "WebApplication",
  //   name: "EaterIQ",
  //   applicationCategory: "HealthApplication",
  //   operatingSystem: "Web Browser, iOS, Android",
  //   description:
  //     "Food scanner that analyzes nutrition, ingredients, and additives to help you make healthier food choices.",
  //   url: "https://www.eateriq.com/",
  //   offers: {
  //     "@type": "Offer",
  //     price: "0",
  //     priceCurrency: "USD",
  //     description: "Free tier with optional premium upgrades",
  //   },
  //   aggregateRating: {
  //     "@type": "AggregateRating",
  //     ratingValue: "4.8",
  //     ratingCount: userCount,
  //   },
  //   publisher: {
  //     "@type": "Organization",
  //     name: "EaterIQ",
  //     url: "https://www.eateriq.com/",
  //   },
  // };

  // const organizationSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "Organization",
  //   name: "EaterIQ",
  //   url: "https://www.eateriq.com/",
  //   logo: "https://www.eateriq.com/eater-iq.png",
  //   sameAs: [
  //     "https://apps.apple.com/sg/app/eateriq/id6757137222",
  //     "https://play.google.com/store/apps/details?id=com.eateriq",
  //   ],
  //   contactPoint: {
  //     "@type": "ContactPoint",
  //     contactType: "customer service",
  //     email: "hello@eateriq.com",
  //   },
  // };

  // const howToSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "HowTo",
  //   name: "How to Use EaterIQ Food Scanner",
  //   description:
  //     "Three simple steps to make informed food choices with EaterIQ",
  //   step: [
  //     {
  //       "@type": "HowToStep",
  //       position: 1,
  //       name: "Scan Barcode",
  //       text: "Use your camera to scan any product barcode, or search by name in our database of millions of products.",
  //     },
  //     {
  //       "@type": "HowToStep",
  //       position: 2,
  //       name: "Get Analysis",
  //       text: "Our system analyzes ingredients, nutrition facts, additives, and allergens to calculate a comprehensive health score.",
  //     },
  //     {
  //       "@type": "HowToStep",
  //       position: 3,
  //       name: "Get Insights",
  //       text: "Receive personalized health insights, ingredient warnings, and recommendations for healthier alternatives.",
  //     },
  //   ],
  // };

  return (
    <>
      {/* Structured Data */}
      {/* <script
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
      /> */}
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-10 lg:py-16"
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
            <div className="order-1 flex flex-col justify-center rounded-[32px] border border-white/60 bg-white/78 px-5 py-7 text-center sm:px-6 md:px-8 md:py-10 lg:text-left min-h-[520px]">
              <div className="mb-5 inline-flex items-center gap-2 self-center rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 lg:self-start">
                <Sparkles className="h-4 w-4" />
                Fresh scans, smarter food choices
              </div>
              <h1
                id="hero-heading"
                className="mb-4 text-2xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
              >
                Smart Health Insights for Every Food Barcode Scan
              </h1>

              <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0">
                EaterIQ transforms complex food labels into simple, actionable
                guidance so you can understand ingredients, nutrition, and make
                better choices in seconds.
              </p>

              {/* CTA - Client Component for scroll */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <ScrollToScannerButton />
              </div>

              {/* Trust Badges */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <div className="flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-sm text-orange-900">
                  <span>Simple</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-sm text-orange-900">
                  <span>Fast</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-sm text-orange-900">
                  <span>Built for everyday decisions</span>
                </div>
              </div>

              {/* App Store Badges */}
              <div className="flex items-center gap-3 sm:flex-row sm:gap-4 sm:justify-center lg:justify-start">
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
                    priority
                    className="h-auto w-[150px] sm:w-[160px]"
                    unoptimized
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
                    priority
                    className="h-auto w-[150px] sm:w-[160px]"
                    unoptimized
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
                    priority
                    className="object-contain scale-[1.35]"
                    sizes="(max-width: 768px) 260px, 290px"
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
                      <span className="text-sm font-bold text-foreground block min-w-[60px]">
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
                      <span className="text-sm font-bold text-foreground block min-w-[60px]">
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

      <FoodScannerClient />

      <HealthCalculators />

      {/* Recent Quizzes Section */}
      {recentQuizzes && recentQuizzes.length > 0 && (
        <section
          id="quizzes"
          className="py-12"
          aria-labelledby="quizzes-heading"
        >
          <div className="container mx-auto px-4">
            <header className="mb-12 text-center">
              <p
                id="quizzes-heading"
                className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4"
              >
                Test Your Food Knowledge
              </p>
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
                        className={`${getDifficultyColor(quiz.difficulty)} text-xs hover:text-gray-200`}
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
          className="py-4 sm:py-12"
          aria-labelledby="blog-heading"
        >
          <div className="container mx-auto px-4">
            <header className="mb-12 text-center">
              <p
                id="blog-heading"
                className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4"
              >
                Nutrition Insights &amp; Tips
              </p>
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

                    <p className="text-xl font-semibold tracking-tight text-foreground mb-2 line-clamp-2">
                      <Link
                        href={`/blog/${blog.slug}/`}
                        className="hover:text-primary"
                      >
                        {blog.title}
                      </Link>
                    </p>

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
