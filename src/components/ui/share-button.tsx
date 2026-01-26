// components/ShareButton.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  excerpt?: string;
  variant?: 'ghost' | 'default';
}

export default function ShareButton({ title, excerpt, variant = 'ghost' }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url,
        });
      } catch {
        // Share cancelled or failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Blog post link copied to clipboard.',
      });
    }
  };

  return (
    <Button variant={variant} size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
      Share{variant === 'default' ? ' Article' : ''}
    </Button>
  );
}