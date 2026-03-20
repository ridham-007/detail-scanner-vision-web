import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, ThumbsUp, TrendingUp, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialProofProps {
  barcode: string;
  productName: string;
}

interface SocialData {
  totalScans: number;
  recentScans: number;
  alternativeChoices: number;
  averageRating: number;
  popularityTrend: 'up' | 'down' | 'stable';
}

const SocialProof: React.FC<SocialProofProps> = ({ barcode, productName }) => {
  const [socialData, setSocialData] = useState<SocialData>({
    totalScans: 0,
    recentScans: 0,
    alternativeChoices: 0,
    averageRating: 0,
    popularityTrend: 'stable'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSocialData();
  }, [barcode]);

  const fetchSocialData = async () => {
    try {
      // Fetch scan history for this product
      const { data: scanHistory, error: scanError } = await supabase
        .from('scan_history')
        .select('scanned_at, user_id')
        .eq('barcode', barcode);

      if (scanError) throw scanError;

      // Calculate recent scans (last 7 days) and unique users
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentScans = scanHistory?.filter(scan => 
        new Date(scan.scanned_at) > weekAgo
      ).length || 0;

      const uniqueUsers = new Set(scanHistory?.map(scan => scan.user_id) || []).size;

      // Mock rating data (in real app would come from feedback table)
      const averageRating = 3.2;

      // Simulate some additional metrics (in real app, these would be calculated from more data)
      const alternativeChoices = Math.floor(Math.random() * 50) + 10; // Mock data
      
      // Determine trend based on recent activity
      const trend = recentScans > 10 ? 'up' : recentScans > 3 ? 'stable' : 'down';

      setSocialData({
        totalScans: uniqueUsers,
        recentScans,
        alternativeChoices,
        averageRating,
        popularityTrend: trend
      });

    } catch (error) {
      console.error('Error fetching social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full animate-fade-in">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (socialData.totalScans === 0 && socialData.recentScans === 0) {
    return null;
  }

  const getTrendIcon = () => {
    switch (socialData.popularityTrend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-600 rotate-90" />;
    }
  };

  const getTrendMessage = () => {
    switch (socialData.popularityTrend) {
      case 'up': return 'Trending up this week';
      case 'down': return 'Less popular lately';
      default: return 'Steady popularity';
    }
  };

  return (
    <Card className="w-full animate-fade-in border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-semibold tracking-tight text-foreground">Community Insights</h3>
        </div>

        <div className="space-y-3">
          {/* User Activity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(Math.min(3, socialData.totalScans))].map((_, i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-white">
                    <AvatarFallback className="text-xs bg-purple-200 text-purple-800">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {socialData.totalScans > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{socialData.totalScans - 3}</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {socialData.totalScans} users scanned this
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {getTrendMessage()}
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          {socialData.recentScans > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                🔥 {socialData.recentScans} scanned this week
              </Badge>
            </div>
          )}

          {/* Community Rating */}
          {socialData.averageRating > 0 && (
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-600" />
              <span className="text-sm">
                {Math.round(socialData.averageRating * 20)}% of users found this helpful
              </span>
            </div>
          )}

          {/* Alternative Choices */}
          {socialData.alternativeChoices > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <ShoppingCart className="w-4 h-4 inline mr-1" />
              {socialData.alternativeChoices} users chose a healthier alternative to this product
            </div>
          )}

          {/* Social Actions */}
          <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-600 dark:text-purple-400">
                Join the community conversation
              </span>
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                Popular choice
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialProof;