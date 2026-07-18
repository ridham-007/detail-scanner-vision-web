"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { updatePageSEO } from "@/utils/seo";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );

    // Set proper SEO for 404 page
    updatePageSEO({
      title: "Page Not Found - EaterIQ",
      description: "The page you're looking for doesn't exist. Return to EaterIQ homepage to continue exploring smart food intelligence.",
      keywords: "404, page not found, EaterIQ, error",
      canonicalUrl: "https://www.eateriq.com/404/",
    });

    // Add noindex meta for 404 pages
    const noindexMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (noindexMeta) {
      noindexMeta.setAttribute('content', 'noindex, nofollow');
    }

    return () => {
      // Restore default robots meta on unmount
      if (noindexMeta) {
        noindexMeta.setAttribute('content', 'index, follow');
      }
    };
  }, [pathname]);

  return (
    <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(var(--accent),0.14),transparent_28%),linear-gradient(180deg,rgb(var(--background)),rgba(var(--accent-soft),0.18))] px-4 py-16">
      <div className="max-w-md rounded-[32px] border border-white/70 bg-white/95 p-8 text-center shadow-[var(--shadow-soft)]">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="rounded-full border-[rgb(var(--accent))]/20 bg-white/80">
            <Link href="/">
              <Search className="h-4 w-4 mr-2" />
              Scan a Product
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Looking for something specific?{" "}
          <Link href="/support" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
