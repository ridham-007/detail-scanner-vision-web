
import React from 'react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import BlogCard from '@/components/blog/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';

const BlogListPage = () => {
  const { data: posts, isLoading, error } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load blog posts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Blog - EaterIQ"
        description="Discover the latest insights about food, nutrition, and healthy eating from EaterIQ experts."
        keywords="food blog, nutrition, healthy eating, food insights"
        canonicalUrl="https://www.eateriq.com/blog/"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8" />
            EaterIQ Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest insights about food, nutrition, and healthy eating from our experts.
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new content!'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogListPage;
