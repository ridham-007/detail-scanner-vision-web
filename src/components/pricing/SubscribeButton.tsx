"use client";

// components/pricing/SubscribeButton.tsx

import React, { useState } from 'react';
import {
  Scan,
  TrendingUp,
  Swords,
  AlertTriangle,
  Trophy,
  Calculator,
  Heart,
  Ban,
  Star,
  Check,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ── Plans ─────────────────────────────────────────────────────────────────────
const NEW_PLANS = {
  monthly: {
    planId: 'pro_monthly',
    razorpayPlanId: 'plan_SScmVPb0bTd8vZ',
    amount: 2.99,
    display: '$2.99',
    period: 'month',
  },
  yearly: {
    planId: 'pro_yearly',
    razorpayPlanId: 'plan_SSclqfflKDBytG',
    amount: 14.99,
    display: '$14.99',
    period: 'year',
  },
} as const;

const SAVINGS_PERCENT = 58;
const MONTHLY_EQUIV = (NEW_PLANS.yearly.amount / 12).toFixed(2); // $1.25

const PRO_FEATURES = [
  { icon: Scan, label: 'Unlimited product scans' },
  { icon: TrendingUp, label: 'Full nutrition breakdown & allergen flags' },
  { icon: Swords, label: 'Food Battle — compare any two products' },
  { icon: AlertTriangle, label: 'Exact ingredient flagging from your preferences' },
  { icon: Trophy, label: 'Unlimited quizzes + create your own' },
  { icon: Calculator, label: 'Detailed health calculator analysis' },
  { icon: Heart, label: 'Unlimited favourites & full scan history' },
  { icon: Ban, label: 'Ad-free experience' },
];

export default function SubscribeButton() {
  const { user, session } = useAuth();
  // ✅ FIX: Only destructure what we need — do NOT use `loading` on the button.
  // `loading` from useSubscription is true on mount while it checks subscription
  // status, which caused the button to always show "Processing..." on page load
  // and on every navigation. We only use `tier` and `subscribed` (which are safe
  // to read — they default to 'free' / false until the check completes).
  const { tier, subscribed, checkSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  // ✅ FIX: `processing` is the ONLY state that controls the button spinner.
  // It is false by default and only set true when the user actually clicks.
  const [processing, setProcessing] = useState(false);

  const selectedPlan = NEW_PLANS[billingCycle];
  const isCurrentPlan = tier === 'pro' && subscribed;

  const handleSubscribe = async () => {
    if (!user || !session) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setProcessing(true); // ← only set here, on real user click
    try {
      // 1. Load Razorpay script
      const loaded = await new Promise<boolean>((resolve) => {
        if (window.Razorpay) { resolve(true); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });
      if (!loaded) throw new Error('Failed to load payment gateway');

      // 2. Call Supabase edge function
      const { data, error } = await supabase.functions.invoke('razorpay-create-subscription', {
        body: {
          planId: selectedPlan.planId,
          razorpayPlanId: selectedPlan.razorpayPlanId,
        },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      if (!data?.subscriptionId) throw new Error('Failed to create subscription');

      // 3. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const options = {
          key: data.keyId,
          subscription_id: data.subscriptionId,
          name: 'EaterIQ',
          description: data.planName ?? `EaterIQ Pro — ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`,
          prefill: { email: data.userEmail ?? '', name: data.userName ?? '' },
          theme: { color: '#f97316' },
          handler: async () => {
            try {
              await new Promise(r => setTimeout(r, 2000));
              await checkSubscription();
              window.location.href = '/subscription-success';
              resolve();
            } catch (err) { reject(err); }
          },
          modal: {
            // ✅ FIX: Reset processing when user dismisses Razorpay modal
            ondismiss: () => {
              setProcessing(false);
              reject(new Error('Payment cancelled'));
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      });

    } catch (err) {
      if (err instanceof Error && err.message !== 'Payment cancelled') {
        console.error('Payment error:', err);
        toast.error('Failed to process payment. Please try again.');
      }
    } finally {
      // ✅ FIX: Always reset processing in finally so button never gets stuck
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-sm">

        {/* ── Card header ────────────────────────────────────────────── */}
        <div className="bg-orange-50 px-6 pt-8 pb-6 text-center border-b border-orange-100">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
            <Star className="w-7 h-7 text-white" fill="white" aria-hidden="true" />
          </div>
          <div className="flex justify-center mb-3">
            <Badge className="rounded-full border border-orange-200 bg-white text-orange-700 px-3 py-1 text-xs font-medium gap-1.5 inline-flex items-center">
              <Zap className="w-3 h-3" />
              Most Popular
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">EaterIQ Pro</h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Make smarter food choices with advanced nutrition insights
          </p>
        </div>

        {/* ── Features ───────────────────────────────────────────────── */}
        <div className="px-5 sm:px-8 py-5 border-b border-orange-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {PRO_FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <span className="text-sm text-gray-700 flex-1">{label}</span>
                <Check className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Billing toggle + CTA ───────────────────────────────────── */}
        <div className="px-5 sm:px-8 py-6 space-y-3">

          {/* Yearly */}
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${billingCycle === 'yearly'
                ? 'border-primary bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${billingCycle === 'yearly' ? 'border-primary' : 'border-gray-300'
                }`}>
                {billingCycle === 'yearly' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">Yearly</span>
                  <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                    SAVE {SAVINGS_PERCENT}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">${MONTHLY_EQUIV}/month</p>
              </div>
            </div>
            <div className="text-right ml-2 flex-shrink-0">
              <span className={`text-lg sm:text-xl font-bold ${billingCycle === 'yearly' ? 'text-primary' : 'text-gray-800'
                }`}>
                {NEW_PLANS.yearly.display}
              </span>
              <p className="text-xs text-gray-400">/year</p>
            </div>
          </button>

          {/* Monthly */}
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${billingCycle === 'monthly'
                ? 'border-primary bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${billingCycle === 'monthly' ? 'border-primary' : 'border-gray-300'
                }`}>
                {billingCycle === 'monthly' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <span className="font-semibold text-sm text-gray-900">Monthly</span>
                <p className="text-xs text-gray-400 mt-0.5">Billed monthly</p>
              </div>
            </div>
            <div className="text-right ml-2 flex-shrink-0">
              <span className={`text-lg sm:text-xl font-bold ${billingCycle === 'monthly' ? 'text-primary' : 'text-gray-800'
                }`}>
                {NEW_PLANS.monthly.display}
              </span>
              <p className="text-xs text-gray-400">/month</p>
            </div>
          </button>

          {/* CTA Button */}
          <div className="pt-1">
            {isCurrentPlan ? (
              <Button
                variant="outline"
                className="w-full rounded-full h-12 border-orange-200 text-primary font-semibold"
                disabled
              >
                ✓ Current Plan
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubscribe}
                disabled={processing} // ✅ ONLY disabled when user clicked & payment is open
                className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-sm transition-all active:scale-[0.98]"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" fill="currentColor" />
                    Get Pro · {selectedPlan.display}/{selectedPlan.period}
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 pt-1">
            Cancel anytime · 7-day money-back guarantee
          </p>

        </div>
      </div>
    </div>
  );
}