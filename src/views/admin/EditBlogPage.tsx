"use client";

import React, { useEffect, useState } from 'react';

import { useBlogPostById, useUpdateBlogPost } from '@/hooks/useBlogPosts';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import BlogEditor from '@/components/blog/BlogEditor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CreateBlogPost } from '@/types/Blog';

const EditBlogPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: post, isLoading, error } = useBlogPostById(id!);
  const updatePost = useUpdateBlogPost();

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
    if (!id) return;
    
    try {
      await updatePost.mutateAsync({ id, postData: data });
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Failed to update blog post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-1/2 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Alert variant="destructive" className="rounded-2xl border-rose-200 bg-rose-50 text-rose-900">
          <AlertDescription>
            Blog post not found or failed to load. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <h1 className="mb-2 mt-4 text-3xl font-semibold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground">
          Update your blog post content and SEO settings.
        </p>
      </div>

      <BlogEditor
        initialData={post}
        onSave={handleSave}
        isLoading={updatePost.isPending}
      />
    </div>
  );
};

export default EditBlogPage;
