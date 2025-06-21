import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trophy, Brain, Target, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import QuizCard from '@/components/QuizCard';
import CreateQuizModal from '@/components/CreateQuizModal';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  creator_id: string;
}

interface LeaderboardEntry {
  id: string;
  full_name: string;
  total_score: number;
  quizzes_completed: number;
}

const QuizzesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
    fetchLeaderboard();
    if (user) {
      fetchMyQuizzes();
    }
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, description, difficulty, created_at, creator_id')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchMyQuizzes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, description, difficulty, created_at, creator_id')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching my quizzes:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, total_score, quizzes_completed')
        .order('total_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const createQuiz = async (formData: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    prompt: string;
  }) => {
    if (!user) return;

    setLoading(true);
    try {
      // Create quiz in database
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          creator_id: user.id,
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          prompt: formData.prompt,
          is_published: false
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Call edge function to generate questions with ChatGPT
      const { data: questionsData, error: questionsError } = await supabase.functions.invoke('generate-quiz', {
        body: {
          quizId: quiz.id,
          prompt: formData.prompt,
          difficulty: formData.difficulty
        }
      });

      if (questionsError) throw questionsError;

      // Publish the quiz after questions are generated
      await supabase
        .from('quizzes')
        .update({ is_published: true })
        .eq('id', quiz.id);

      toast({
        title: "Quiz Created!",
        description: "Your quiz has been generated and published successfully.",
      });

      setShowCreateModal(false);
      fetchQuizzes();
      fetchMyQuizzes();
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const playQuiz = (quizId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in with Google to play quizzes and appear on the leaderboard.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/quiz/${quizId}`);
  };

  if (currentQuiz) {
    return <QuizPage quizId={currentQuiz} onBack={() => setCurrentQuiz(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <AnimatedBackground />
      
      <main className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Quiz Hub
              </h1>
              <p className="text-muted-foreground">Challenge yourself with AI-generated quizzes</p>
            </div>
          </div>
          {user && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-emerald-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          )}
        </div>

        <Tabs defaultValue="all-quizzes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-quizzes" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              All Quizzes
            </TabsTrigger>
            <TabsTrigger value="my-quizzes" className="flex items-center gap-2" disabled={!user}>
              <Target className="h-4 w-4" />
              My Quizzes
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-quizzes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onPlay={playQuiz} />
              ))}
            </div>
            {quizzes.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
                <p className="text-muted-foreground">Be the first to create a quiz!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-quizzes" className="space-y-6">
            {user ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} onPlay={playQuiz} />
                  ))}
                </div>
                {myQuizzes.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No quizzes created yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first AI-generated quiz!</p>
                    <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-emerald-600 to-blue-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Please sign in to view your quizzes.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{player.full_name || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.quizzes_completed} quizzes completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{player.total_score}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
                {leaderboard.length === 0 && (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No scores yet. Be the first!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CreateQuizModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSubmit={createQuiz}
          loading={loading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default QuizzesPage;
