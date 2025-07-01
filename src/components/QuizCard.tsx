
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Calendar, Trophy, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QuizLeaderboardModal from './QuizLeaderboardModal';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  creator_id?: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onPlay: (quizId: string) => void;
  onQuizUpdated?: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onPlay, onQuizUpdated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleUnpublish = async () => {
    if (!user || quiz.creator_id !== user.id) return;

    setIsUnpublishing(true);
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_published: false })
        .eq('id', quiz.id)
        .eq('creator_id', user.id);

      if (error) throw error;

      toast({
        title: "Quiz Unpublished",
        description: "Your quiz has been unpublished successfully.",
      });

      // Refresh the quiz list
      if (onQuizUpdated) {
        onQuizUpdated();
      }
    } catch (error) {
      console.error('Error unpublishing quiz:', error);
      toast({
        title: "Error",
        description: "Failed to unpublish quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnpublishing(false);
    }
  };

  const isMyQuiz = user && quiz.creator_id === user.id;

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg mb-2 line-clamp-2 capitalize">{quiz.title}</CardTitle>
              <Badge className={`${getDifficultyColor(quiz.difficulty)} text-xs`}>
                {quiz.difficulty.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col pt-0">
          <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-3">
            {quiz.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 sm:mb-4">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{new Date(quiz.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button 
                onClick={() => onPlay(quiz.id)} 
                className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-sm h-9"
              >
                <Play className="h-4 w-4 mr-2" />
                Play Quiz
              </Button>
              {user && (
                <Button 
                  onClick={() => setShowLeaderboard(true)}
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full h-9"
                >
                  <Trophy className="h-4 w-4 sm:mr-2" />
                  <span className="sm:inline hidden">Leaderboard</span>
                </Button>
              )}
            </div>
            {isMyQuiz && (
              <Button
                onClick={handleUnpublish}
                variant="outline"
                size="sm"
                disabled={isUnpublishing}
                className="w-full h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                {isUnpublishing ? 'Unpublishing...' : 'Unpublish'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {user && (
        <QuizLeaderboardModal
          open={showLeaderboard}
          onOpenChange={setShowLeaderboard}
          quizId={quiz.id}
          quizTitle={quiz.title}
        />
      )}
    </>
  );
};

export default QuizCard;
