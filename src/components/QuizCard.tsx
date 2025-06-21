
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  creator_id: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onPlay?: (quizId: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onPlay }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePlay = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in with Google to play quizzes and appear on the leaderboard.",
        variant: "destructive"
      });
      return;
    }
    
    if (onPlay) {
      onPlay(quiz.id);
    } else {
      navigate(`/quiz/${quiz.id}`);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
          <Badge className={`${getDifficultyColor(quiz.difficulty)} text-white`}>
            {quiz.difficulty.toUpperCase()}
          </Badge>
        </div>
        {quiz.description && (
          <p className="text-sm text-muted-foreground">{quiz.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Creator</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <Button onClick={handlePlay} className="bg-gradient-to-r from-emerald-600 to-blue-600">
            <Play className="h-4 w-4 mr-2" />
            Play Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
