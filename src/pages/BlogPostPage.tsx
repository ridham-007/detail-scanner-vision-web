
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug!);
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
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
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords}
        ogTitle={post.og_title || post.title}
        ogDescription={post.og_description || post.excerpt}
        ogImage={post.og_image || post.featured_image_url}
        twitterTitle={post.twitter_title || post.title}
        twitterDescription={post.twitter_description || post.excerpt}
        twitterImage={post.twitter_image || post.featured_image_url}
        canonicalUrl={post.canonical_url}
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

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
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
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        <div 
          className="blog-content-loaded prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Published on {formatDate(post.published_at || post.created_at)}
            </p>
            
            <Button onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div>
        </footer>
      </article>
    </>
  );
};

export default BlogPostPage;
