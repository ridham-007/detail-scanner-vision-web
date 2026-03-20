"use client";

import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateBlogPost } from '@/hooks/useBlogPosts';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import BlogEditor from '@/components/blog/BlogEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CreateBlogPost } from '@/types/Blog';

const CreateBlogPage = () => {
  const router = useRouter();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const createPost = useCreateBlogPost();

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isCheckingAdmin, router]);

  if (!isAdmin && !isCheckingAdmin) {
    return null;
  }


  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  

  const handleSave = async (data: CreateBlogPost) => {
    try {
      await createPost.mutateAsync(data);
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Failed to create blog post:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Link href="/admin/blogs">
          <Button variant="ghost" className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog Management
          </Button>
        </Link>
      </div>

      <div className="mb-8 rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-[rgb(var(--accent-soft))]/28 to-[rgb(var(--accent))]/10 px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
        <p className="inline-flex rounded-full border border-[rgb(var(--accent))]/20 bg-white/80 px-3 py-1 text-sm font-medium text-[rgb(var(--accent-foreground))]">Publishing</p>
        <h1 className="mb-2 mt-4 text-3xl font-semibold tracking-tight">Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Write and publish a new blog post with SEO optimization.
        </p>
      </div>

      <BlogEditor
        onSave={handleSave}
        isLoading={createPost.isPending}
      />
    </div>
  );
};

export default CreateBlogPage;
