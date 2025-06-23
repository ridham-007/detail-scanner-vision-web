import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Clock, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuizAttempt {
  id: string;
  score: number;
  total_questions: number;
  time_taken: number;
  completed_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

interface QuizLeaderboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  quizTitle: string;
}

const QuizLeaderboardModal: React.FC<QuizLeaderboardModalProps> = ({
  open,
  onOpenChange,
  quizId,
  quizTitle
}) => {
  const [leaderboard, setLeaderboard] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && quizId) {
      fetchQuizLeaderboard();
    }
  }, [open, quizId]);

  const fetchQuizLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          id,
          score,
          total_questions,
          time_taken,
          completed_at,
          profiles!quiz_attempts_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('quiz_id', quizId)
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching quiz leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
            {index + 1}
          </div>
        );
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScorePercentage = (score: number, totalQuestions: number) => {
    return Math.round((score / (totalQuestions * 10)) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {quizTitle} - Leaderboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((attempt, index) => (
                <Card key={attempt.id} className={`${
                  index === 0 ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20' :
                  index === 1 ? 'border-gray-200 bg-gray-50 dark:bg-gray-950/20' :
                  index === 2 ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20' :
                  'border-muted'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRankIcon(index)}
                        <div>
                          <p className="font-semibold">
                            {attempt.profiles?.full_name || 'Anonymous Player'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(attempt.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-emerald-600 text-lg">
                            {getScorePercentage(attempt.score, attempt.total_questions)}%
                          </div>
                          <div className="text-muted-foreground">
                            {attempt.score}/{attempt.total_questions * 10} pts
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(attempt.time_taken)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>{Math.floor(attempt.score / 10)}/{attempt.total_questions}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No attempts yet</h3>
              <p className="text-muted-foreground">
                Be the first to complete this quiz and claim the top spot!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizLeaderboardModal;
