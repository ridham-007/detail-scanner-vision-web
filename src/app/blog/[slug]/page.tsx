import React from 'react';
import BlogPostPage from '@/views/BlogPostPage';
import { Metadata } from 'next';
import { supabase } from '@/integrations/supabase/client';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch data
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, featured_image_url, og_image')
    .eq('slug', slug)
    .single();

  if (!post) {
    return {
      title: 'Blog Post Not Found | EaterIQ',
    };
  }

  return {
    title: post.meta_title || `${post.title} | EaterIQ`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: [post.og_image || post.featured_image_url || '/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: [post.og_image || post.featured_image_url || '/og-image.png'],
    },
  };
}

export default function Page() {
  return <BlogPostPage />;
}
