
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogPost, useUpdateBlogPost } from '@/hooks/useBlogPosts';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import BlogEditor from '@/components/blog/BlogEditor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { CreateBlogPost } from '@/types/Blog';

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: post, isLoading, error } = useBlogPost(id!);
  const updatePost = useUpdateBlogPost();

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

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleSave = async (data: CreateBlogPost) => {
    if (!id) return;
    
    try {
      await updatePost.mutateAsync({ id, postData: data });
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Failed to update blog post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Blog post not found or failed to load. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/admin/blogs">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog Management
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Blog Post</h1>
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
