import React, { useState } from 'react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import BlogCard from '@/components/blog/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Search, Scan, Brain, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

const BlogListPage = () => {
  const { data: posts, isLoading, error } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Structured data for blog listing
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "EaterIQ Blog",
    "description": "Expert articles about food, nutrition, healthy eating, and making informed food choices.",
    "url": "https://www.eateriq.com/blog/",
    "publisher": {
      "@type": "Organization",
      "name": "EaterIQ",
      "url": "https://www.eateriq.com"
    }
  };

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
        title="Nutrition Blog - Expert Food & Health Articles | EaterIQ"
        description="Discover expert articles about food, nutrition, healthy eating, and making informed food choices. Learn how to read food labels, understand additives, and improve your diet."
        keywords="nutrition blog, food articles, healthy eating tips, food labels, nutrition facts, dietary advice, healthy recipes, food additives"
        canonicalUrl="https://www.eateriq.com/blog/"
        structuredData={blogListSchema}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">Home</Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">Blog</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Nutrition Insights & Tips
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert articles to help you understand food labels, nutrition facts, and make healthier choices for you and your family.
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Explore EaterIQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/" className="block text-sm text-muted-foreground hover:text-primary">
                    → Home
                  </Link>
                  <Link to="/#scanner" className="block text-sm text-muted-foreground hover:text-primary">
                    → Food Scanner
                  </Link>
                  <Link to="/quiz/" className="block text-sm text-muted-foreground hover:text-primary">
                    → Nutrition Quizzes
                  </Link>
                  <Link to="/categories/" className="block text-sm text-muted-foreground hover:text-primary">
                    → Browse Categories
                  </Link>
                </CardContent>
              </Card>

              {/* CTA Card - Scanner */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                    <Scan className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Try Our Food Scanner</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan any product barcode and get instant AI-powered health analysis.
                  </p>
                  <Link to="/#scanner">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                      Start Scanning Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* CTA Card - Quiz */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-xl mb-4">
                    <Brain className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Test Your Knowledge</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Challenge yourself with our AI-generated nutrition quizzes.
                  </p>
                  <Link to="/quiz/">
                    <Button size="sm" variant="outline" className="w-full">
                      Take a Quiz
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">About EaterIQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    EaterIQ is a free AI-powered food scanner that helps you understand what's in your food. 
                    Scan any barcode to get instant health scores, ingredient analysis, and personalized recommendations.
                  </p>
                  <div className="mt-4">
                    <Link to="/" className="text-sm font-medium text-primary hover:underline">
                      Learn more about EaterIQ →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogListPage;
