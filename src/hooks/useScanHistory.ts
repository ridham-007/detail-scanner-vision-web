import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

export interface ScanHistoryItem {
  id: string;
  barcode: string;
  product_name: string;
  health_score: number | null;
  scanned_at: string;
  scan_location: string | null;
  notes: string | null;
}


export const useScanHistory = () => {
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { tier } = useSubscription();

  const fetchScanHistory = async (limit?: number) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const effectiveLimit =
        typeof limit === 'number'
          ? limit
          : tier === 'free'
          ? 10
          : 100;

      const { data, error, count } = await supabase
        .from('scan_history')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('scanned_at', { ascending: false })
        .limit(effectiveLimit);

      if (error) {
        throw error;
      }

      if (data) {
        // Deduplicate by barcode, keeping only the first (latest) occurrence
        const uniqueHistory = data.reduce((acc: ScanHistoryItem[], current) => {
          const isDuplicate = acc.some(item => item.barcode === current.barcode);
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);
        setScanHistory(uniqueHistory);
      } else {
        setScanHistory([]);
      }
      
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (err) {
      console.error('Error fetching scan history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch scan history');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScanHistoryItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setScanHistory(prev => prev.filter(item => item.id !== id));
      setTotalCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error deleting scan history item:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const clearAllHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setScanHistory([]);
      setTotalCount(0);
    } catch (err) {
      console.error('Error clearing scan history:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  };

  const getStatsFromHistory = () => {
    const totalScans = totalCount;
    const averageHealthScore = scanHistory.length > 0 
      ? scanHistory.reduce((sum, item) => sum + (item.health_score || 0), 0) / scanHistory.length
      : 0;
    
    const recentScans = scanHistory.filter(item => {
      const scanDate = new Date(item.scanned_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return scanDate >= weekAgo;
    }).length;

    return {
      totalScans,
      averageHealthScore: Math.round(averageHealthScore * 10) / 10,
      recentScans
    };
  };

  useEffect(() => {
    if (user) {
      fetchScanHistory();
    } else {
      setScanHistory([]);
    }
  }, [user, tier]);

  return {
    scanHistory,
    isLoading,
    error,
    fetchScanHistory,
    deleteScanHistoryItem,
    clearAllHistory,
    stats: getStatsFromHistory()
  };
};