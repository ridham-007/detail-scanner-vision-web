// app/blog/error.tsx
"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          Failed to load blog posts. Please try again.
        </AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={reset}
          className="mt-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </Alert>
    </div>
  );
}