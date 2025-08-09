import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Trophy, Star, Target, Heart, Leaf, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: UserStats) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface UserStats {
  totalScans: number;
  healthyScans: number;
  streak: number;
  uniqueProducts: number;
  organicProducts: number;
  lowSodiumProducts: number;
}

const AchievementSystem: React.FC<{ productData?: any }> = ({ productData }) => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalScans: 0,
    healthyScans: 0,
    streak: 0,
    uniqueProducts: 0,
    organicProducts: 0,
    lowSodiumProducts: 0
  });
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const { user } = useAuth();

  const achievements: Achievement[] = [
    {
      id: 'first_scan',
      title: 'Getting Started',
      description: 'Scan your first product',
      icon: <Target className="w-6 h-6" />,
      condition: (stats) => stats.totalScans >= 1,
      rarity: 'common',
      points: 10
    },
    {
      id: 'health_conscious',
      title: 'Health Conscious',
      description: 'Scan 10 healthy products (score ≥ 70)',
      icon: <Heart className="w-6 h-6" />,
      condition: (stats) => stats.healthyScans >= 10,
      rarity: 'rare',
      points: 50
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 7-day scanning streak',
      icon: <Trophy className="w-6 h-6" />,
      condition: (stats) => stats.streak >= 7,
      rarity: 'epic',
      points: 100
    },
    {
      id: 'product_explorer',
      title: 'Product Explorer',
      description: 'Scan 50 different products',
      icon: <Star className="w-6 h-6" />,
      condition: (stats) => stats.uniqueProducts >= 50,
      rarity: 'rare',
      points: 75
    },
    {
      id: 'organic_lover',
      title: 'Organic Lover',
      description: 'Scan 5 organic products',
      icon: <Leaf className="w-6 h-6" />,
      condition: (stats) => stats.organicProducts >= 5,
      rarity: 'common',
      points: 25
    },
    {
      id: 'sodium_warrior',
      title: 'Sodium Warrior',
      description: 'Scan 10 low-sodium products',
      icon: <Shield className="w-6 h-6" />,
      condition: (stats) => stats.lowSodiumProducts >= 10,
      rarity: 'rare',
      points: 60
    }
  ];

  useEffect(() => {
    if (!user) return;
    fetchUserStats();
  }, [user, productData]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch scan history
      const { data: scanHistory, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (!scanHistory) return;

      // Calculate stats
      const stats: UserStats = {
        totalScans: scanHistory.length,
        healthyScans: scanHistory.filter(scan => (scan.health_score || 0) >= 70).length,
        streak: calculateStreak(scanHistory.map(s => s.scanned_at)),
        uniqueProducts: new Set(scanHistory.map(s => s.barcode)).size,
        organicProducts: scanHistory.filter(scan => 
          scan.product_name?.toLowerCase().includes('organic')
        ).length,
        lowSodiumProducts: scanHistory.filter(scan => 
          scan.product_name?.toLowerCase().includes('low sodium') ||
          scan.product_name?.toLowerCase().includes('no salt')
        ).length
      };

      const previousStats = { ...userStats };
      setUserStats(stats);

      // Check for new achievements
      checkForNewAchievements(previousStats, stats);

    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    const today = new Date();
    let streakCount = 0;
    let currentDate = new Date(today);
    
    const scansByDay = new Set();
    dates.forEach(dateStr => {
      const date = new Date(dateStr);
      const dayKey = date.toDateString();
      scansByDay.add(dayKey);
    });

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

  const checkForNewAchievements = (prevStats: UserStats, newStats: UserStats) => {
    const newUnlocked = achievements.filter(achievement => 
      !achievement.condition(prevStats) && achievement.condition(newStats)
    );

    if (newUnlocked.length > 0) {
      setNewAchievements(newUnlocked);
      setShowAchievement(true);
      
      // Show toast for each new achievement
      newUnlocked.forEach(achievement => {
        toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, {
          description: achievement.description,
          duration: 5000
        });
      });

      // Auto-hide after 3 seconds
      setTimeout(() => setShowAchievement(false), 3000);
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
    }
  };

  const getRarityBadgeColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'secondary';
      case 'rare': return 'default';
      case 'epic': return 'secondary';
      case 'legendary': return 'default';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.condition(userStats));
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  if (unlockedAchievements.length === 0) return null;

  return (
    <>
      {/* Achievement Display */}
      <Card className="w-full animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">Achievements</span>
              <Badge variant="outline">{unlockedAchievements.length}/{achievements.length}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{totalPoints} points</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {achievements.map((achievement) => {
              const isUnlocked = achievement.condition(userStats);
              return (
                <Dialog key={achievement.id}>
                  <DialogTrigger asChild>
                    <div 
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isUnlocked 
                          ? getRarityColor(achievement.rarity) 
                          : 'border-gray-200 bg-gray-100 opacity-50'
                      }`}
                    >
                      <div className={`${isUnlocked ? 'text-gray-700' : 'text-gray-400'} flex justify-center mb-1`}>
                        {achievement.icon}
                      </div>
                      <p className="text-xs text-center font-medium truncate">
                        {achievement.title}
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <div className="text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        isUnlocked ? getRarityColor(achievement.rarity) : 'border-gray-200 bg-gray-100'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                        <p className="text-muted-foreground mb-3">{achievement.description}</p>
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant={getRarityBadgeColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <Badge variant="outline">
                            {achievement.points} points
                          </Badge>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                        {isUnlocked ? '✅ Unlocked!' : '🔒 Locked'}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* New Achievement Popup */}
      {showAchievement && newAchievements.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <Card className="animate-scale-in border-4 border-yellow-400 shadow-2xl pointer-events-auto">
            <CardContent className="p-6 text-center">
              <div className="animate-bounce mb-4">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-600 mb-2">Achievement Unlocked!</h2>
              {newAchievements.map((achievement, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <Badge className="mt-1">+{achievement.points} points</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AchievementSystem;