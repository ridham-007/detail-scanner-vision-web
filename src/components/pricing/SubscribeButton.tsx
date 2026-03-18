// components/pricing/SubscribeButton.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, SUBSCRIPTION_PLANS } from '@/hooks/useSubscription';
import { toast } from 'sonner';

interface SubscribeButtonProps {
  planType: 'pro' | 'premium';
  planName: string;
  popular?: boolean;
}

export default function SubscribeButton({ planType, planName, popular = false }: SubscribeButtonProps) {
  const { user } = useAuth();
  const { tier, subscribed, loading, createSubscription } = useSubscription();
  const [processingPlan, setProcessingPlan] = useState(false);

  const isCurrentPlan = tier === planType && subscribed;

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setProcessingPlan(true);
    try {
      await createSubscription(SUBSCRIPTION_PLANS[planType].planId);
    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof Error && error.message !== 'Payment cancelled') {
        toast.error('Failed to process payment. Please try again.');
      }
    } finally {
      setProcessingPlan(false);
    }
  };

  if (isCurrentPlan) {
    return (
      <div className="relative">
        <Button variant="outline" className="w-full rounded-full border-orange-200/80 bg-white/90" disabled>
          Current Plan
        </Button>
      </div>
    );
  }

  return (
    <Button 
      className={`w-full rounded-full shadow-[var(--shadow-warm)] ${popular ? 'bg-primary hover:bg-primary/90' : ''}`}
      onClick={handleSubscribe}
      disabled={loading || processingPlan}
    >
      {processingPlan ? 'Processing...' : `Get ${planName}`}
    </Button>
  );
}
