"use client";

import React, { useEffect } from 'react';
import { useBlogPosts, useDeleteBlogPost } from '@/hooks/useBlogPosts';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types/Blog';

const AdminBlogsPage = () => {
  const router = useRouter();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: posts, isLoading, error } = useBlogPosts(true); // Include unpublished posts
  const deletePost = useDeleteBlogPost();

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

  const handleDelete = async (post: BlogPost) => {
    await deletePost.mutateAsync(post.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const publishedPosts = posts?.filter(post => post.is_published) || [];
  const draftPosts = posts?.filter(post => !post.is_published) || [];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-[rgb(var(--accent-soft))]/28 to-[rgb(var(--accent))]/10 px-6 py-7 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:justify-between sm:px-8">
        <div>
          <p className="inline-flex rounded-full border border-[rgb(var(--accent))]/20 bg-white/80 px-3 py-1 text-sm font-medium text-[rgb(var(--accent-foreground))]">Admin workspace</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">Manage your blog posts and content</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 rounded-2xl border-rose-200 bg-rose-50 text-rose-900">
          <AlertDescription>
            Failed to load blog posts. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Published Posts */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Published Posts ({publishedPosts.length})
          </h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : publishedPosts.length > 0 ? (
            <div className="space-y-4">
              {publishedPosts.map((post) => (
                <Card key={post.id} className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                          {post.reading_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.reading_time} min
                            </span>
                          )}
                        </div>
                        <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">Published</Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="rounded-full border-[rgb(var(--accent))]/20 bg-white/80">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/blogs/edit/${post.id}`}>
                        <Button variant="outline" size="sm" className="rounded-full border-[rgb(var(--accent))]/20 bg-white/80">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full border-rose-200 bg-white text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
              <CardContent className="p-8 text-center">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No published posts yet</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Draft Posts */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Draft Posts ({draftPosts.length})
          </h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : draftPosts.length > 0 ? (
            <div className="space-y-4">
              {draftPosts.map((post) => (
                <Card key={post.id} className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.created_at)}
                          </span>
                          {post.reading_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.reading_time} min
                            </span>
                          )}
                        </div>
                        <Badge className="rounded-full border border-[rgb(var(--accent))]/15 bg-[rgb(var(--accent-soft))]/45 text-[rgb(var(--accent-foreground))]">Draft</Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/admin/blogs/edit/${post.id}`}>
                        <Button variant="outline" size="sm" className="rounded-full border-[rgb(var(--accent))]/20 bg-white/80">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full border-rose-200 bg-white text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the draft "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
              <CardContent className="p-8 text-center">
                <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No draft posts</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
