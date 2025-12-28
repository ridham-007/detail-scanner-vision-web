import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface SubscriptionState {
  subscribed: boolean;
  tier: SubscriptionTier;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  error: string | null;
}

// Plan IDs for Razorpay
export const SUBSCRIPTION_PLANS = {
  pro: {
    monthly: 'pro_monthly',
    yearly: 'pro_yearly',
    monthlyAmount: 399, // ₹399
    yearlyAmount: 3199, // ₹3199
  },
  premium: {
    monthly: 'premium_monthly',
    yearly: 'premium_yearly',
    monthlyAmount: 799, // ₹799
    yearlyAmount: 6399, // ₹6399
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
    loading: true,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setState(prev => ({ ...prev, subscribed: false, tier: 'free', loading: false }));
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

  const createOrder = async (planId: string): Promise<void> => {
    if (!session) {
      throw new Error('Please sign in to subscribe');
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load payment gateway');
    }

    // Create order
    const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
      body: { planId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (!data?.orderId) throw new Error('Failed to create order');

    // Open Razorpay checkout
    return new Promise((resolve, reject) => {
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'EaterIQ',
        description: data.planName,
        order_id: data.orderId,
        prefill: {
          email: data.userEmail,
          name: data.userName,
        },
        theme: {
          color: '#22c55e',
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              },
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            if (verifyError) throw verifyError;
            if (!verifyData?.success) throw new Error('Payment verification failed');

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
    createOrder,
    limits: TIER_LIMITS[state.tier],
  };
};
