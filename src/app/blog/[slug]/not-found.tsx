// app/blog/[slug]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(var(--accent),0.14),transparent_28%),linear-gradient(180deg,rgb(var(--background)),rgba(var(--accent-soft),0.18))] px-4 py-16">
      <div className="max-w-xl rounded-[32px] border border-white/70 bg-white/95 p-8 text-center shadow-[var(--shadow-soft)]">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight">Blog Post Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The article you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/blog/">
          <Button className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Articles
          </Button>
        </Link>
      </div>
    </div>
  );
}
