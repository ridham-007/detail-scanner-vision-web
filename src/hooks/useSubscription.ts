import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface SubscriptionState {
  subscribed: boolean;
  tier: SubscriptionTier;
  productId: string | null;
  subscriptionEnd: string | null;
  cancelAtPeriodEnd: boolean;
  loading: boolean;
  error: string | null;
}

// Razorpay Plan IDs - USD pricing (Yearly only)
export const SUBSCRIPTION_PLANS = {
  pro: {
    planId: 'pro_yearly',
    amount: 14.99, // $14.99/year
    razorpayPlanId: 'plan_RyBotV05u0dtMH',
  },
  premium: {
    planId: 'premium_yearly',
    amount: 29.99, // $29.99/year
    razorpayPlanId: 'plan_RyBqWY2wYKtXMX',
  },
} as const;

// Tier limits
export const TIER_LIMITS = {
  free: {
    dailyScans: 5,
    historyDays: 7,
    personalizedInsights: false,
    adFree: false,
    familyAccounts: 0,
  },
  pro: {
    dailyScans: Infinity,
    historyDays: Infinity,
    personalizedInsights: true,
    adFree: true,
    familyAccounts: 0,
  },
  premium: {
    dailyScans: Infinity,
    historyDays: Infinity,
    personalizedInsights: true,
    adFree: true,
    familyAccounts: 5,
  },
} as const;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    tier: 'free',
    productId: null,
    subscriptionEnd: null,
    cancelAtPeriodEnd: false,
    loading: true,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setState(prev => ({ ...prev, subscribed: false, tier: 'free', cancelAtPeriodEnd: false, loading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setState({
        subscribed: data.subscribed,
        tier: data.tier as SubscriptionTier,
        productId: data.product_id,
        subscriptionEnd: data.subscription_end,
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error checking subscription:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to check subscription',
      }));
    }
  }, [user, session]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createSubscription = async (planId: string): Promise<void> => {
    if (!session) {
      throw new Error('Please sign in to subscribe');
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load payment gateway');
    }

    // Create subscription
    const { data, error } = await supabase.functions.invoke('razorpay-create-subscription', {
      body: { planId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (!data?.subscriptionId) throw new Error('Failed to create subscription');

    // Open Razorpay checkout for subscription
    return new Promise((resolve, reject) => {
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: 'EaterIQ',
        description: data.planName,
        prefill: {
          email: data.userEmail,
          name: data.userName,
        },
        theme: {
          color: '#22c55e',
        },
        handler: async (response: any) => {
          try {
            // For subscriptions, Razorpay automatically handles recurring payments
            // The webhook will update the subscription status
            // We just need to refresh the subscription status
            
            // Wait a moment for webhook to process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Refresh subscription status
            await checkSubscription();
            
            // Redirect to success page
            window.location.href = '/subscription-success';
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };

  // Legacy support - redirect to new function
  const createOrder = createSubscription;

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh subscription status every minute
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return {
    ...state,
    checkSubscription,
    createSubscription,
    createOrder, // Legacy support
    limits: TIER_LIMITS[state.tier],
  };
};
