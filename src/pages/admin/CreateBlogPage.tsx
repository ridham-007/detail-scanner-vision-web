"use client";

import React, { useState } from 'react';
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

  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isCheckingAdmin, router]);

  if (!isAdmin && !isCheckingAdmin) {
    return null;
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/blogs">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog Management
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Blog Post</h1>
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
