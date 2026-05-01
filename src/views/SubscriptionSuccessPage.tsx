"use client";

import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';

const SubscriptionSuccessPage = () => {
  const router = useRouter();
  const { checkSubscription, tier } = useSubscription();

  useEffect(() => {
    // Refresh subscription status
    checkSubscription();
  }, [checkSubscription]);

  return (
    <>
      <SEOHead 
        title="Subscription Activated - EaterIQ"
        description="Your EaterIQ subscription has been activated. Start scanning products with your new premium features."
        canonicalUrl="https://www.eateriq.com/subscription-success/"
      />
      <div className="bg-[radial-gradient(circle_at_top,rgba(var(--accent),0.14),transparent_28%),linear-gradient(180deg,rgb(var(--background)),rgba(var(--accent-soft),0.2))]">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Success' }]} />
          <div className="max-w-lg mx-auto text-center py-8">
            <Card className="rounded-[32px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[rgb(var(--accent-soft))]/60 text-[rgb(var(--accent-foreground))]">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl">Welcome to EaterIQ {tier === 'premium' ? 'Premium' : 'Pro'}!</CardTitle>
                <CardDescription className="text-lg">
                  Your subscription has been activated successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-[28px] border border-[rgb(var(--accent))]/15 bg-[rgb(var(--accent-soft))]/40 p-5">
                  <div className="flex items-center gap-2 justify-center text-primary mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">Your new features are ready</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Unlimited product scans</li>
                    <li>✓ Personalized health insights</li>
                    <li>✓ Full scan history</li>
                    <li>✓ Ad-free experience</li>
                    {tier === 'premium' && (
                      <>
                        <li>✓ Family accounts</li>
                        <li>✓ AI recommendations</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full rounded-full" 
                    onClick={() => router.push('/food-scanner')}
                  >
                    Start Scanning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-[rgb(var(--accent))]/20 bg-white/80"
                    onClick={() => router.push('/pricing')}
                  >
                    View Your Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </>
  );
};

export default SubscriptionSuccessPage;
