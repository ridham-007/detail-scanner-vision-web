
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Heart, Lightbulb, Users, Trophy, ArrowLeft, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question_text: string;
  correct_answer: string;
  wrong_answer_1: string;
  wrong_answer_2: string;
  wrong_answer_3: string;
  question_order: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  profiles: { full_name: string } | null;
}

interface QuizPageProps {
  quizId: string;
  onBack: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ quizId, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    skipQuestion: true,
    extraTime: true
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(10).fill(false));
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    fetchQuizData();
    setStartTime(new Date());
  }, [quizId]);

  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }
  }, [timeLeft, gameOver, showResult]);

  const fetchQuizData = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select(`
          id, title, description, difficulty,
          profiles!creator_id (full_name)
        `)
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_order');

      if (questionsError) throw questionsError;

      setQuiz(quizData);
      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz data",
        variant: "destructive"
      });
    }
  };

  const getCurrentAnswers = () => {
    if (!questions[currentQuestion]) return [];
    const q = questions[currentQuestion];
    return [q.correct_answer, q.wrong_answer_1, q.wrong_answer_2, q.wrong_answer_3]
      .sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    const isCorrect = selectedAnswer === questions[currentQuestion]?.correct_answer;
    if (isCorrect) {
      setScore(score + 10);
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (currentQuestion === questions.length - 1) {
      setGameOver(true);
      await saveQuizAttempt();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setTimeLeft(30);
      setShowResult(false);
    }
  };

  const saveQuizAttempt = async () => {
    if (!user || !startTime) return;

    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          score: score + (selectedAnswer === questions[currentQuestion]?.correct_answer ? 10 : 0),
          total_questions: questions.length,
          time_taken: timeSpent
        });

      if (error) throw error;

      toast({
        title: "Quiz Completed!",
        description: `Your score: ${score}/100 points`,
      });
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty) return;
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    // Logic to remove 2 wrong answers would go here
  };

  const useSkipQuestion = () => {
    if (!lifelines.skipQuestion) return;
    setLifelines(prev => ({ ...prev, skipQuestion: false }));
    handleNextQuestion();
  };

  const useExtraTime = () => {
    if (!lifelines.extraTime) return;
    setLifelines(prev => ({ ...prev, extraTime: false }));
    setTimeLeft(timeLeft + 15);
  };

  const shareQuiz = () => {
    const shareText = `Check out this ${quiz?.difficulty} quiz: "${quiz?.title}" on EaterIQ!`;
    const shareUrl = `${window.location.origin}/?quiz=${quizId}`;
    
    if (navigator.share) {
      navigator.share({
        title: quiz?.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Link Copied!",
        description: "Quiz link copied to clipboard",
      });
    }
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="text-center">
          <CardHeader>
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-emerald-600">{score}/100</div>
            <p className="text-muted-foreground">
              You answered {Math.floor(score/10)} out of {questions.length} questions correctly!
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Button>
              <Button onClick={shareQuiz} className="bg-gradient-to-r from-emerald-600 to-blue-600">
                <Share2 className="h-4 w-4 mr-2" />
                Share Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <Badge variant="outline">{quiz.difficulty.toUpperCase()}</Badge>
        </div>
        <Button onClick={shareQuiz} variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}/100</span>
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} />
      </div>

      {/* Lifelines */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={useFiftyFifty}
          disabled={!lifelines.fiftyFifty}
          className="flex items-center gap-1"
        >
          <Users className="h-4 w-4" />
          50:50
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={useSkipQuestion}
          disabled={!lifelines.skipQuestion}
          className="flex items-center gap-1"
        >
          <Lightbulb className="h-4 w-4" />
          Skip
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={useExtraTime}
          disabled={!lifelines.extraTime}
          className="flex items-center gap-1"
        >
          <Clock className="h-4 w-4" />
          +15s
        </Button>
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          <Clock className="h-4 w-4" />
          <span className="font-mono text-lg">{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">
            {questions[currentQuestion]?.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getCurrentAnswers().map((answer, index) => (
            <Button
              key={index}
              variant={selectedAnswer === answer ? "default" : "outline"}
              className="w-full text-left justify-start h-auto p-4"
              onClick={() => handleAnswerSelect(answer)}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
              {answer}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 px-8"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;
