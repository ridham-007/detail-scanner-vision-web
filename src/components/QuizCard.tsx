import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Calendar, Trophy, EyeOff, Eye, Edit, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import QuizLeaderboardModal from './QuizLeaderboardModal';
import EditQuizModal from './EditQuizModal';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  creator_id: string;
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
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  // Fetch creator profile
  const { data: creator } = useQuery({
    queryKey: ['creator-profile', quiz.creator_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, username')
        .eq('id', quiz.creator_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!quiz.creator_id,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'medium':
        return 'bg-accent/10 text-accent-foreground border border-accent/20';
      case 'hard':
        return 'bg-destructive/10 text-destructive border border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border border-muted/20';
    }
  };

  const handleCreatorClick = () => {
    if (creator && creator.username) {
      navigate(`/profile/${creator.username}`);
    }
  };

  const getCreatorDisplayName = () => {
    if (!creator) return 'Anonymous';
    return creator.full_name || creator.username || 'Anonymous';
  };

  const getCreatorInitials = () => {
    const name = getCreatorDisplayName();
    if (name === 'Anonymous') return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleTogglePublish = async () => {
    if (!user || (quiz.creator_id !== user.id && !isAdmin)) return;

    const newPublishedState = !quiz.is_published;
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_published: newPublishedState })
        .eq('id', quiz.id);

      if (error) throw error;

      toast({
        title: newPublishedState ? "Quiz Published" : "Quiz Unpublished",
        description: newPublishedState 
          ? "Quiz has been published successfully." 
          : "Quiz has been unpublished successfully.",
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

  const handleDeleteQuiz = async () => {
    if (!user || (quiz.creator_id !== user.id && !isAdmin)) return;
    
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quiz.id);

      if (error) throw error;

      toast({
        title: "Quiz Deleted",
        description: "Quiz has been deleted successfully.",
      });

      if (onQuizUpdated) {
        onQuizUpdated();
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isMyQuiz = user && quiz.creator_id === user.id;
  const isPublished = quiz.is_published !== false;
  const canManageQuiz = isMyQuiz || isAdmin;

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/20 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold leading-none tracking-tight text-base sm:text-lg mb-2 line-clamp-2 capitalize">{quiz.title}</h2>
              <div className="flex gap-2 mb-3">
                <Badge className={`${getDifficultyColor(quiz.difficulty)} text-xs`}>
                  {quiz.difficulty.toUpperCase()}
                </Badge>
                {(isMyQuiz || isAdmin) && (
                  <Badge variant={isPublished ? "default" : "secondary"} className="text-xs">
                    {isPublished ? "Published" : "Draft"}
                  </Badge>
                )}
                {isAdmin && !isMyQuiz && (
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              
              {/* Creator Info */}
              <Link
              to={creator && creator.username ? `/profile/${creator.username}` : ''} 
                className={`flex items-center gap-2 transition-opacity ${creator && creator.username ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={creator?.avatar_url || ''} alt={getCreatorDisplayName()} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getCreatorInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className={`text-xs text-muted-foreground transition-colors ${creator && creator.username ? 'hover:text-foreground' : ''}`}>
                  by {getCreatorDisplayName()}
                </span>
              </Link>
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
                className="flex-1 text-sm h-9"
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
            {canManageQuiz && (
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
                  aria-label="Toggle Publish"
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
            {isAdmin && !isMyQuiz && (
              <Button
                aria-label="Delete Quiz"
                onClick={handleDeleteQuiz}
                variant="outline"
                size="sm"
                disabled={isUpdating}
                className="w-full h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                {isUpdating ? 'Deleting...' : 'Delete Quiz'}
              </Button>
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
          {canManageQuiz && (
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
