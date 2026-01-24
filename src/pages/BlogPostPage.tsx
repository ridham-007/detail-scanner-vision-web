"use client";

"use client";

import React from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, ArrowLeft, Share2, ArrowRight, Scan, Brain, BookOpen } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';

const BlogPostPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: post, isLoading, error } = useBlogPost(slug);
  const { toast } = useToast();

  // Fetch related posts
  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image_url, reading_time, published_at')
        .eq('is_published', true)
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed, ignore
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Blog post link copied to clipboard.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Blog post not found or failed to load. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Link href="/blog/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image_url,
    "author": {
      "@type": "Person",
      "name": post.author?.full_name || post.author?.username || "EaterIQ Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EaterIQ",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/eater-iq.png`
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <>
      <SEOHead
        title={post.meta_title || `${post.title} | EaterIQ Blog`}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords}
        ogTitle={post.og_title || post.title}
        ogDescription={post.og_description || post.excerpt}
        ogImage={post.og_image || post.featured_image_url}
        twitterTitle={post.twitter_title || post.title}
        twitterDescription={post.twitter_description || post.excerpt}
        twitterImage={post.twitter_image || post.featured_image_url}
        canonicalUrl={post.canonical_url || `https://www.eateriq.com/blog/${post.slug}/`}
        articleData={{
          publishedTime: post.published_at,
          modifiedTime: post.updated_at,
          author: post.author?.full_name || post.author?.username || "EaterIQ Team",
          section: "Food & Nutrition"
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog/" className="hover:text-primary">Blog</Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
                
                {post.reading_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time} min read</span>
                  </div>
                )}
                
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {post.featured_image_url && (
                <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </header>

            <div 
              className="blog-content-loaded prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-muted-foreground">
                  Published on {formatDate(post.published_at || post.created_at)}
                </p>
                
                <Button onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
              </div>

              {/* Internal Links CTA */}
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-foreground mb-3">Ready to make healthier food choices?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Use our free food scanner to analyze any product instantly.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/#scanner">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Scan className="h-4 w-4 mr-2" />
                      Try Food Scanner
                    </Button>
                  </Link>
                  <Link href="/quiz/">
                    <Button size="sm" variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
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
              {/* Quick Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/" className="block text-sm text-muted-foreground hover:text-primary">
                    → Home
                  </Link>
                  <Link href="/#scanner" className="block text-sm text-muted-foreground hover:text-primary">
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
              {relatedPosts && relatedPosts.length > 0 && (
                <Card>
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
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={relatedPost.featured_image_url}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
                              {relatedPost.title}
                            </h4>
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

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Try EaterIQ Free</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan any food product and get instant health insights.
                  </p>
                  <Link href="/#scanner">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                      <Scan className="h-4 w-4 mr-2" />
                      Start Scanning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        {/* More Articles Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t" aria-labelledby="more-articles-heading">
            <div className="flex items-center justify-between mb-8">
              <h2 id="more-articles-heading" className="text-2xl font-bold text-foreground">
                More Articles
              </h2>
              <Link href="/blog/">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-card rounded-xl overflow-hidden border shadow-sm">
                  {relatedPost.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      {relatedPost.reading_time && (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>{relatedPost.reading_time} min read</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.slug}/`} className="hover:text-primary">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
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
};

export default BlogPostPage;
