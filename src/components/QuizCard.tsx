import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Calendar, Trophy, EyeOff, Eye, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QuizLeaderboardModal from './QuizLeaderboardModal';
import EditQuizModal from './EditQuizModal';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  creator_id?: string;
  is_published?: boolean;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleTogglePublish = async () => {
    if (!user || quiz.creator_id !== user.id) return;

    const newPublishedState = !quiz.is_published;
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_published: newPublishedState })
        .eq('id', quiz.id)
        .eq('creator_id', user.id);

      if (error) throw error;

      toast({
        title: newPublishedState ? "Quiz Published" : "Quiz Unpublished",
        description: newPublishedState 
          ? "Your quiz has been published successfully." 
          : "Your quiz has been unpublished successfully.",
      });

      if (onQuizUpdated) {
        onQuizUpdated();
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to update quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isMyQuiz = user && quiz.creator_id === user.id;
  const isPublished = quiz.is_published !== false;

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold leading-none tracking-tight text-base sm:text-lg mb-2 line-clamp-2 capitalize">{quiz.title}</h2>
              <div className="flex gap-2">
                <Badge className={`${getDifficultyColor(quiz.difficulty)} text-xs`}>
                  {quiz.difficulty.toUpperCase()}
                </Badge>
                {isMyQuiz && (
                  <Badge variant={isPublished ? "default" : "secondary"} className="text-xs">
                    {isPublished ? "Published" : "Draft"}
                  </Badge>
                )}
              </div>
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
                aria-label="Play Quiz"
                onClick={() => onPlay(quiz.id)} 
                className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-sm h-9"
              >
                <Play className="h-4 w-4 mr-2" />
                Play Quiz
              </Button>
              {user && (
                <Button 
                  aria-label="Leaderboard"
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
              <div className="flex gap-2">
                <Button
                  aria-label="Edit Quiz"
                  onClick={() => setShowEditModal(true)}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  aria-label="Publish Quiz"
                  onClick={handleTogglePublish}
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className={`flex-1 h-9 ${
                    isPublished 
                      ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                      : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {isPublished ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      {isUpdating ? 'Unpublishing...' : 'Unpublish'}
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      {isUpdating ? 'Publishing...' : 'Publish'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {user && (
        <>
          <QuizLeaderboardModal
            open={showLeaderboard}
            onOpenChange={setShowLeaderboard}
            quizId={quiz.id}
            quizTitle={quiz.title}
          />
          {isMyQuiz && (
            <EditQuizModal
              open={showEditModal}
              onOpenChange={setShowEditModal}
              quiz={quiz}
              onQuizUpdated={onQuizUpdated || (() => {})}
            />
          )}
        </>
      )}
    </>
  );
};

export default QuizCard;
