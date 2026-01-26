// components/blog/BlogCard.tsx
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image_url?: string;
  reading_time?: number;
  published_at?: string;
  created_at: string;
  author?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  const authorName = post.author?.full_name || post.author?.username || 'EaterIQ Team';
  const publishDate = post.published_at || post.created_at;

  return (
    <article>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        <Link href={`/blog/${post.slug}/`} className="block">
          {post.featured_image_url && (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.featured_image_url}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </Link>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              <time dateTime={publishDate}>{formatDate(publishDate)}</time>
            </div>
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
          </div>
          
          <h2 className="font-semibold text-lg mb-2 line-clamp-2">
            <Link 
              href={`/blog/${post.slug}/`} 
              className="hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              By {authorName}
            </span>
            <Link 
              href={`/blog/${post.slug}/`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Read more →
            </Link>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}