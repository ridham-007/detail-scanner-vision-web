// components/home/ScrollToScannerButton.tsx
"use client";

import React from 'react';
import { Scan, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackCTAClick } from '@/utils/analytics';

interface ScrollToScannerButtonProps {
  variant?: 'default' | 'cta' | 'large';
}

export default function ScrollToScannerButton({ variant = 'default' }: ScrollToScannerButtonProps) {
  const scrollToScanner = () => {
    trackCTAClick('scroll_to_scanner');
    document.getElementById('scanner')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (variant === 'large') {
    return (
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg"
        onClick={scrollToScanner}
      >
        <Scan className="mr-2 h-5 w-5" aria-hidden="true" />
        Scan Your First Product
      </Button>
    );
  }

  if (variant === 'cta') {
    return (
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
        onClick={scrollToScanner}
      >
        Try It Now - It&apos;s Free
        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base font-semibold rounded-xl"
      onClick={scrollToScanner}
    >
      <Scan className="mr-2 h-5 w-5" aria-hidden="true" />
      Try It Free
    </Button>
  );
}