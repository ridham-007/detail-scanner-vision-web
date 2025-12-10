import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription, TIER_LIMITS } from '@/hooks/useSubscription';

const DAILY_SCAN_KEY = 'eateriq_daily_scans';
const LAST_RESET_KEY = 'eateriq_last_reset';

interface DailyScanData {
  count: number;
  date: string;
}

export const useDailyScans = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [scansUsed, setScansUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const maxScans = TIER_LIMITS[tier].dailyScans;
  const scansRemaining = maxScans === Infinity ? Infinity : Math.max(0, maxScans - scansUsed);
  const canScan = tier !== 'free' || scansRemaining > 0;

  // Get today's date string
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Load scan count from local storage or database
  useEffect(() => {
    const loadScans = async () => {
      const today = getTodayString();
      
      if (user) {
        // For logged-in users, check database
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const { count, error } = await supabase
          .from('scan_history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('scanned_at', todayStart.toISOString());

        if (!error && count !== null) {
          setScansUsed(count);
        }
      } else {
        // For guests, use local storage
        const stored = localStorage.getItem(DAILY_SCAN_KEY);
        const lastReset = localStorage.getItem(LAST_RESET_KEY);

        if (stored && lastReset === today) {
          setScansUsed(parseInt(stored, 10));
        } else {
          // New day, reset count
          localStorage.setItem(DAILY_SCAN_KEY, '0');
          localStorage.setItem(LAST_RESET_KEY, today);
          setScansUsed(0);
        }
      }
      setLoading(false);
    };

    loadScans();
  }, [user]);

  const incrementScan = () => {
    const newCount = scansUsed + 1;
    setScansUsed(newCount);
    
    if (!user) {
      // Update local storage for guests
      localStorage.setItem(DAILY_SCAN_KEY, newCount.toString());
      localStorage.setItem(LAST_RESET_KEY, getTodayString());
    }
  };

  return {
    scansUsed,
    scansRemaining,
    maxScans,
    canScan,
    incrementScan,
    loading,
    isUnlimited: maxScans === Infinity,
  };
};
