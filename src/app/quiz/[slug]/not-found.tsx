// app/quiz/[slug]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,rgba(var(--accent),0.14),transparent_28%),linear-gradient(180deg,rgb(var(--background)),rgba(var(--accent-soft),0.18))]">
      <div className="container mx-auto max-w-md px-4 py-16">
        <div className="rounded-[32px] border border-white/70 bg-white/95 p-8 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[rgb(var(--accent-soft))]/55 text-[rgb(var(--accent-foreground))]">
            <Brain className="h-10 w-10" />
          </div>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight">Quiz Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The quiz you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/quiz/">
            <Button className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quiz Hub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
