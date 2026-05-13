// app/blog/[slug]/page.tsx
import React from 'react';
import Link from "next/link";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, ArrowRight, Scan, Brain, User, AlertTriangle } from 'lucide-react';
import ShareButton from '@/components/ui/share-button';
import Breadcrumbs from '@/components/Breadcrumbs';
import Image from 'next/image';
import '@/prose.css';

type Props = {
  params: Promise<{ slug: string }>;
};

// Fetch blog post data
async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(id, full_name, username, avatar_url)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data;
}

// Fetch related posts
async function getRelatedPosts(slug: string) {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image_url, reading_time, published_at')
    .eq('is_published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3);

  return data || [];
}

// Generate metadata (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | EaterIQ',
    };
  }

  const canonicalUrl = `https://www.eateriq.com/blog/${slug}/`;
  const authorName = post.author?.full_name || post.author?.username || 'EaterIQ Team';

  return {
    title: post.meta_title || `${post.title} | EaterIQ`,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
    alternates: {
      canonical: post.canonical_url || canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: post.og_title || post.title,
      description: post.og_description || post.excerpt || undefined,
      url: canonicalUrl,
      images: [
        {
          url: post.og_image || post.featured_image_url || '/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [`${authorName} from EaterIQ`],
      section: 'Food & Nutrition',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.twitter_title || post.title,
      description: post.twitter_description || post.excerpt || undefined,
      images: [post.twitter_image || post.featured_image_url || '/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Generate static paths for better performance
export async function generateStaticParams() {
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true);

  return (data || []).map((post) => ({
    slug: post.slug,
  }));
}

// Enable ISR - regenerate pages when data changes
export const revalidate = 3600; // Revalidate every hour

// Helper function
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Main Page Component (Server Component)
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  const [post, relatedPosts] = await Promise.all([
    getBlogPost(slug),
    getRelatedPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `https://www.eateriq.com/blog/${slug}/`;
  const authorName = post.author?.full_name || post.author?.username || 'EaterIQ Team';
  const authorDisplayName = `${authorName} from EaterIQ`;

  // JSON-LD Schema
  // const schemaData = {
  //   "@context": "https://schema.org",
  //   "@type": "BlogPosting",
  //   "headline": post.title,
  //   "description": post.excerpt,
  //   "image": post.featured_image_url,
  //   "author": {
  //     "@type": "Person",
  //     "name": authorName,
  //     "url": "https://www.eateriq.com/about/",
  //     "worksFor": {
  //       "@type": "Organization",
  //       "name": "EaterIQ",
  //       "url": "https://www.eateriq.com/"
  //     }
  //   },
  //   "publisher": {
  //     "@type": "Organization",
  //     "name": "EaterIQ",
  //     "logo": {
  //       "@type": "ImageObject",
  //       "url": "https://www.eateriq.com/eater-iq.png",
  //     },
  //   },
  //   "datePublished": post.published_at,
  //   "dateModified": post.updated_at,
  //   "mainEntityOfPage": {
  //     "@type": "WebPage",
  //     "@id": canonicalUrl,
  //   },
  // };

  // Breadcrumb Schema
  // const breadcrumbSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "BreadcrumbList",
  //   "itemListElement": [
  //     {
  //       "@type": "ListItem",
  //       "position": 1,
  //       "name": "Home",
  //       "item": "https://www.eateriq.com/",
  //     },
  //     {
  //       "@type": "ListItem",
  //       "position": 2,
  //       "name": "Blog",
  //       "item": "https://www.eateriq.com/blog/",
  //     },
  //     {
  //       "@type": "ListItem",
  //       "position": 3,
  //       "name": post.title,
  //       "item": canonicalUrl,
  //     },
  //   ],
  // };

  return (
    <>
      {/* JSON-LD Structured Data */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      /> */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      /> */}

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs 
          items={[
            { label: 'Blog', path: '/blog' },
            { label: post.title }
          ]} 
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            <header className="mb-8 rounded-[32px] border border-white/60 bg-white/82 px-6 py-8 shadow-product backdrop-blur-sm">
              <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                {post.title}
              </h1>

              {/* Author and Meta Info */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-muted-foreground">

                {/* Date */}
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={post.published_at || post.created_at}>
                    {formatDate(post.published_at || post.created_at)}
                  </time>
                </div>

                {/* Reading Time */}
                {post.reading_time && (
                  <>
                    <span className="hidden sm:block text-muted-foreground">•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <span>{post.reading_time} min read</span>
                    </div>
                  </>
                )}

                {/* Share Button */}
                <ShareButton title={post.title} excerpt={post.excerpt || ""} />
              </div>

              {post.featured_image_url && (
                <figure className="mb-2 aspect-[16/9] relative overflow-hidden rounded-[24px] border border-white/70 shadow-product">
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </figure>
              )}
            </header>

            {/* Blog Content */}
            <div className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-product md:p-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 border-t pt-8">
              {/* Author Box */}
                            {/* Published Info & Share */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <p className="text-muted-foreground">
                  Written by <span className="font-medium text-foreground">{authorDisplayName}</span>
                  {' '}on{' '}
                  <time dateTime={post.published_at || post.created_at}>
                    {formatDate(post.published_at || post.created_at)}
                  </time>
                </p>
                <div></div>

                <ShareButton title={post.title} excerpt={post.excerpt || ""} variant="default" />
              </div>

              {/* Medical Disclaimer - After Content (Detailed) */}
              <div className="mb-8 rounded-[24px] border border-orange-100/80 bg-orange-50/60 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 h-7 w-7 flex-shrink-0 text-primary" aria-hidden="true" />
                  <div className='flex flex-col gap-1'>
                    <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                      Medical & Nutritional Disclaimer
                    </span>
                    <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                      <p>
                        The information provided in this article is for general informational and educational purposes only. 
                        It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
                      </p>
                      <p>
                        <strong>Always seek the advice of your physician, dietitian, or other qualified health provider</strong> with 
                        any questions you may have regarding a medical condition, dietary changes, or nutritional needs. 
                        Never disregard professional medical advice or delay seeking it because of something you have read on EaterIQ.
                      </p>
                      <p>
                        EaterIQ does not recommend or endorse any specific tests, physicians, products, procedures, opinions, 
                        or other information that may be mentioned in our articles. Reliance on any information provided by 
                        EaterIQ is solely at your own risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="rounded-[28px] flex flex-col border border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] p-6 shadow-product">
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                  Ready to make healthier food choices?
                </span>
                <p className="text-muted-foreground text-sm mb-4">
                  Use our free food scanner to analyze any product instantly and get personalized health insights.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/food-scanner/">
                    <Button size="sm" className="rounded-full bg-primary shadow-[var(--shadow-warm)] hover:bg-primary/90">
                      <Scan className="h-4 w-4 mr-2" aria-hidden="true" />
                      Try Food Scanner
                    </Button>
                  </Link>
                  <Link href="/quiz/">
                    <Button size="sm" variant="outline" className="rounded-full border-orange-200/80 bg-white/90">
                      <Brain className="h-4 w-4 mr-2" aria-hidden="true" />
                      Take a Quiz
                    </Button>
                  </Link>
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Card */}
              {/* <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    {post.author?.avatar_url ? (
                      <img
                        src={post.author.avatar_url}
                        alt={authorName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{authorName}</p>
                      <p className="text-xs text-muted-foreground">from EaterIQ</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Helping you make informed food choices with science-based nutrition insights.
                  </p>
                </CardContent>
              </Card> */}

              {/* Quick Links */}
              <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Links</CardTitle>
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
                  <Link href="/blog/" className="block text-sm text-muted-foreground hover:text-primary">
                    → All Articles
                  </Link>
                </CardContent>
              </Card>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}/`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          {relatedPost.featured_image_url && (
                            <div className="h-16 w-16 relative flex-shrink-0 overflow-hidden rounded-[16px] border border-white/70">
                              <Image
                                src={relatedPost.featured_image_url}
                                alt={relatedPost.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-lg font-semibold tracking-tight group-hover:text-primary line-clamp-2">
                              {relatedPost.title}
                            </span>
                            {relatedPost.reading_time && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {relatedPost.reading_time} min read
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* CTA Card */}
              <Card className="rounded-[28px] border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] shadow-product">
                <CardContent className="pt-6">
                  <span className="text-xl font-semibold tracking-tight text-foreground mb-4">Try EaterIQ Free</span>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan any food product and get instant health insights.
                  </p>
                  <Link href="/food-scanner/">
                    <Button size="sm" className="w-full rounded-full bg-primary shadow-[var(--shadow-warm)] hover:bg-primary/90">
                      <Scan className="h-4 w-4 mr-2" aria-hidden="true" />
                      Start Scanning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        {/* More Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t" aria-labelledby="more-articles-heading">
            <div className="flex items-center justify-between mb-8">
              <span id="more-articles-heading" className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                More Articles
              </span>
              <Link href="/blog/">
                <Button variant="outline" size="sm" className="rounded-full border-orange-200/80 bg-white/90">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="overflow-hidden rounded-[28px] border border-white/70 bg-white/88 shadow-product">
                  {relatedPost.featured_image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      {relatedPost.reading_time && (
                        <>
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          <span>{relatedPost.reading_time} min read</span>
                        </>
                      )}
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-foreground mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.slug}/`} className="hover:text-primary">
                        {relatedPost.title}
                      </Link>
                    </span>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
