import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ScanStreakProps {
  productName?: string;
}

const ScanStreak: React.FC<ScanStreakProps> = ({ productName }) => {
  const [streak, setStreak] = useState(0);
  const [todayScans, setTodayScans] = useState(0);
  const [weeklyScans, setWeeklyScans] = useState(0);
  const [isNewStreak, setIsNewStreak] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    fetchStreakData();
  }, [user, productName]);

  const fetchStreakData = async () => {
    if (!user) return;

    try {
      // Get today's date range
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      
      // Get this week's date range
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toISOString();
      
      // Fetch recent scan history
      const { data: scanHistory, error } = await supabase
        .from('scan_history')
        .select('scanned_at')
        .eq('user_id', user.id)
        .order('scanned_at', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching scan history:', error);
        return;
      }

      if (!scanHistory || scanHistory.length === 0) {
        setStreak(0);
        setTodayScans(0);
        setWeeklyScans(0);
        return;
      }

      // Calculate today's scans
      const todayCount = scanHistory.filter(scan => 
        scan.scanned_at >= todayStart && scan.scanned_at <= todayEnd
      ).length;
      setTodayScans(todayCount);

      // Calculate weekly scans
      const weeklyCount = scanHistory.filter(scan => 
        scan.scanned_at >= weekStart
      ).length;
      setWeeklyScans(weeklyCount);

      // Calculate streak
      const currentStreak = calculateStreak(scanHistory.map(s => s.scanned_at));
      setStreak(currentStreak);

      // Check if this is a new milestone
      if (todayCount === 1 && currentStreak > 0) {
        setIsNewStreak(true);
        setTimeout(() => setIsNewStreak(false), 3000);
      }

    } catch (error) {
      console.error('Error in fetchStreakData:', error);
    }
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    const today = new Date();
    let streakCount = 0;
    let currentDate = new Date(today);
    
    // Group dates by day
    const scansByDay = new Set();
    dates.forEach(dateStr => {
      const date = new Date(dateStr);
      const dayKey = date.toDateString();
      scansByDay.add(dayKey);
    });

    // Count consecutive days
    while (true) {
      const dayKey = currentDate.toDateString();
      if (scansByDay.has(dayKey)) {
        streakCount++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streakCount;
  };

  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it up!";
    if (streak < 7) return `${streak} days strong! 🔥`;
    if (streak < 30) return `Amazing ${streak}-day streak! 🚀`;
    return `Incredible ${streak}-day streak! You're a scanning legend! 🏆`;
  };

  const getStreakColor = (streak: number): string => {
    if (streak === 0) return "text-gray-500";
    if (streak < 3) return "text-orange-600";
    if (streak < 7) return "text-yellow-600";
    if (streak < 30) return "text-green-600";
    return "text-purple-600";
  };

  if (!user) return null;

  return (
    <Card className={`w-full animate-fade-in ${isNewStreak ? 'ring-2 ring-orange-400 shadow-lg' : ''} transition-all duration-500`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${streak > 0 ? 'bg-orange-100 dark:bg-orange-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-600' : 'text-gray-500'}`} />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getStreakColor(streak)}`}>
                  {streak} {streak === 1 ? 'day' : 'days'}
                </span>
                {streak >= 7 && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Flame className="w-3 h-3 mr-1" />
                    Hot Streak!
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getStreakMessage(streak)}
              </p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{todayScans} today</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">{weeklyScans} this week</span>
            </div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {streak > 0 && streak < 30 && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Next milestone</span>
              <span>{streak < 7 ? '7 days' : '30 days'}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${streak < 7 ? (streak / 7) * 100 : ((streak - 7) / 23) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanStreak;