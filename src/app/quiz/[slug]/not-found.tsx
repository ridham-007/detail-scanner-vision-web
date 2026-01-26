// app/quiz/[slug]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Quiz Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The quiz you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/quiz/">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz Hub
          </Button>
        </Link>
      </div>
    </div>
  );
}