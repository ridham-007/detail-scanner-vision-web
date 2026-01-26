// app/blog/[slug]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The article you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/blog/">
        <Button>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Articles
        </Button>
      </Link>
    </div>
  );
}