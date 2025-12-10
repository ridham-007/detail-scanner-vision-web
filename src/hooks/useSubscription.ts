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

// Price IDs for different plans
export const SUBSCRIPTION_PRICES = {
  pro: {
    monthly: 'price_1Scex42UUU7zlEiUT01DrADK',
    yearly: 'price_1Scexy2UUU7zlEiUApsogI1s',
    monthlyAmount: 499,
    yearlyAmount: 3999,
  },
  premium: {
    monthly: 'price_1Scexi2UUU7zlEiU1ebSF4ZL',
    yearly: 'price_1SceyH2UUU7zlEiU0gNX0oO3',
    monthlyAmount: 999,
    yearlyAmount: 7999,
  },
} as const;

// Product IDs mapping
export const PRODUCT_IDS = {
  pro_monthly: 'prod_TZoa3HJibmfYUl',
  pro_yearly: 'prod_TZobqr5P0RqRhe',
  premium_monthly: 'prod_TZoa78p3QSJfPH',
  premium_yearly: 'prod_TZobwol5fO2stX',
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

  const createCheckout = async (priceId: string) => {
    if (!session) {
      throw new Error('Please sign in to subscribe');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
    return data;
  };

  const openCustomerPortal = async () => {
    if (!session) {
      throw new Error('Please sign in to manage subscription');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
    return data;
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
    createCheckout,
    openCustomerPortal,
    limits: TIER_LIMITS[state.tier],
  };
};
