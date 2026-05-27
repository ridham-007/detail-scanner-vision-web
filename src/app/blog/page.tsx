// app/blog/page.tsx
import React from 'react';
import Link from "next/link";
import { Metadata } from 'next';
import { supabase } from '@/integrations/supabase/client';
import BlogSearch from '@/components/blog/BlogSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Scan, Brain, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/Blog';
import Breadcrumbs from '@/components/Breadcrumbs';

// Static metadata for blog listing page
export const metadata: Metadata = {
  title: 'Nutrition Blog - Expert Food & Health Articles | EaterIQ',
  description: 'Discover expert articles on food, nutrition, and healthy eating. Learn to read food labels, understand additives, and improve your diet.',
  keywords: ['nutrition blog', 'food articles', 'healthy eating tips', 'food labels', 'nutrition facts', 'dietary advice', 'healthy recipes', 'food additives'],
  alternates: {
    canonical: 'https://www.eateriq.com/blog',
  },
  openGraph: {
    type: 'website',
    title: 'Nutrition Blog - Expert Food & Health Articles | EaterIQ',
    description: 'Discover expert articles about food, nutrition, healthy eating, and making informed food choices.',
    url: 'https://www.eateriq.com/blog/',
    siteName: 'EaterIQ',
    images: [
      {
        url: '/og-blog.png', // Create a specific OG image for blog
        width: 1200,
        height: 630,
        alt: 'EaterIQ Nutrition Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrition Blog - Expert Food & Health Articles | EaterIQ',
    description: 'Discover expert articles about food, nutrition, healthy eating, and making informed food choices.',
    images: ['/og-blog.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Fetch all published blog posts
async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image_url,
      reading_time,
      published_at,
      created_at,
      author:profiles(id, full_name, username, avatar_url)
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

// Main Blog List Page (Server Component)
export default async function BlogListPage() {
  const posts = await getBlogPosts() as BlogPost[];

  // Structured data for blog listing
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "EaterIQ Blog",
    "description": "Expert articles about food, nutrition, healthy eating, and making informed food choices.",
    "url": "https://www.eateriq.com/blog/",
    "publisher": {
      "@type": "Organization",
      "name": "EaterIQ",
      "url": "https://www.eateriq.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.eateriq.com/eater-iq.png"
      }
    },
    "blogPost": posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://www.eateriq.com/blog/${post.slug}/`,
      "image": post.featured_image_url,
      "datePublished": post.published_at,
      "author": {
        "@type": "Person",
        "name": post.author?.full_name || post.author?.username || "EaterIQ Team"
      }
    }))
  };

  // Breadcrumb schema
  // const breadcrumbSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "BreadcrumbList",
  //   "itemListElement": [
  //     {
  //       "@type": "ListItem",
  //       "position": 1,
  //       "name": "Home",
  //       "item": "https://www.eateriq.com/"
  //     },
  //     {
  //       "@type": "ListItem",
  //       "position": 2,
  //       "name": "Blog",
  //       "item": "https://www.eateriq.com/blog/"
  //     }
  //   ]
  // };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      /> */}
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        {/* Header */}
        <header className="mb-12 pt-4 pb-2 text-center">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Nutrition Insights & Tips</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-4xl sm:text-5xl font-bold leading-[1.02] tracking-tight text-foreground">
            Nutrition{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Insights & Tips
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Expert articles to help you understand food labels, nutrition facts, and make healthier choices for you and your family.
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Client Component for Search + Filtering */}
            <BlogSearch posts={posts} />
          </div>

          {/* Sidebar - Fully Server Rendered */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Links */}
              <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Explore EaterIQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/" className="block text-sm text-muted-foreground hover:text-primary">
                    → Home
                  </Link>
                  <Link href="/food-scanner/" className="block text-sm text-muted-foreground hover:text-primary">
                    → Food Scanner
                  </Link>
                  <Link href="/quiz/" className="block text-sm text-muted-foreground hover:text-primary">
                    → Nutrition Quizzes
                  </Link>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] shadow-product">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-[var(--shadow-soft)]">
                    <Scan className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-2xl md:text-2xl font-bold tracking-tight text-foreground mb-2">Try Our Food Scanner</span>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan any product barcode and get instant health analysis.
                  </p>
                  <Link href="/food-scanner">
                    <Button size="sm" className="w-full rounded-full bg-primary shadow-[var(--shadow-warm)] hover:bg-primary/90">
                      Start Scanning Free
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 shadow-[var(--shadow-soft)]">
                    <Brain className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
                  </div>
                  <span className="text-2xl md:text-2xl font-bold tracking-tight text-foreground mb-2">Test Your Knowledge</span>
                  <p className="text-sm text-muted-foreground mb-4">
                    Challenge yourself with our nutrition quizzes.
                  </p>
                  <Link href="/quiz/">
                    <Button size="sm" variant="outline" className="w-full rounded-full border-orange-200/80 bg-white/90">
                      Take a Quiz
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">About EaterIQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    EaterIQ is a free food scanner that helps you understand what's in your food.
                    Scan any barcode to get instant health scores, ingredient analysis, and personalized recommendations.
                  </p>
                  <div className="mt-4">
                    <Link href="/" className="text-sm font-medium text-primary hover:underline">
                      Learn more about EaterIQ →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
