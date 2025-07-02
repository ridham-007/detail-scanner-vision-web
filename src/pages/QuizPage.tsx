
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Heart,
  Lightbulb,
  Users,
  Trophy,
  ArrowLeft,
  Share2,
  LogIn,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Target,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import QuizLeaderboardModal from "@/components/QuizLeaderboardModal";
import { soundEffects } from "@/utils/soundEffects";
import confetti from "canvas-confetti";

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
  creator_id: string;
}

interface QuizPageProps {
  quizId: string;
  onBack: () => void;
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    selectedAnswer: string;
  }>({
    show: false,
    isCorrect: false,
    selectedAnswer: "",
  });
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    skipQuestion: true,
    extraTime: true,
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(10).fill(false)
  );
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hiddenAnswers, setHiddenAnswers] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const onBack = () => {
    navigate("/quizzes");
  };

  useEffect(() => {
    fetchQuizData();
    setStartTime(new Date());
  }, [quizId]);

  useEffect(() => {
    if (!gameOver && timeLeft > 0 && !answerFeedback.show) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);

        // Play warning sound when time is running low
        if (soundEnabled && timeLeft <= 5 && timeLeft > 1) {
          soundEffects.playWarning();
        } else if (soundEnabled && timeLeft > 5) {
          soundEffects.playTick();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && !answerFeedback.show) {
      handleAnswerSelect(""); // Auto-select empty answer when time runs out
    }
  }, [timeLeft, gameOver, showResult, soundEnabled, answerFeedback.show]);

  // Shuffle answers when current question changes and clear hidden answers
  useEffect(() => {
    if (questions[currentQuestion]) {
      const q = questions[currentQuestion];
      const answers = [
        q.correct_answer,
        q.wrong_answer_1,
        q.wrong_answer_2,
        q.wrong_answer_3,
      ];
      const shuffled = [...answers].sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
      setHiddenAnswers([]); // Clear hidden answers for new question
    }
  }, [currentQuestion, questions]);

  const fetchQuizData = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("id, title, description, difficulty, creator_id")
        .eq("id", quizId)
        .single();

      if (quizError) throw quizError;

      const { data: questionsData, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("question_order");

      if (questionsError) throw questionsError;

      setQuiz(quizData);
      setQuestions(questionsData || []);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast({
        title: "Error",
        description: "Failed to load quiz data",
        variant: "destructive",
      });
    }
  };

  const handleAnswerSelect = async (answer: string, isSkip: boolean = false) => {
    if (answerFeedback.show) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion]?.correct_answer;

    // Show feedback animation
    if (!isSkip) {
    setAnswerFeedback({ show: true, isCorrect, selectedAnswer: answer });
    }

    // Play sound based on answer correctness
    if (soundEnabled) {
      if (isCorrect) {
        soundEffects.playCorrectAnswer();
      } else {
        soundEffects.playWrongAnswer();
      }
    }

    if (isCorrect) {
      setScore((prev) => prev + 10);
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    // Wait for animation to complete before moving to next question
    setTimeout(async () => {
      if (currentQuestion === questions.length - 1) {
        setGameOver(true);
        if (soundEnabled) {
          setTimeout(() => {
            soundEffects.playQuizComplete();
          }, 500);
        }
        await saveQuizAttempt(answer);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
        setTimeLeft(30);
        setShowResult(false);
        setAnswerFeedback({
          show: false,
          isCorrect: false,
          selectedAnswer: "",
        });
      }
    }, 2000); // 2 second delay for feedback animation
  };

  const saveQuizAttempt = async (answer: string) => {
    if (!user || !startTime) return;

    const timeSpent = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    );

    const finalScore = score + (answer === questions[currentQuestion]?.correct_answer ? 10 : 0);

    try {
      const { error } = await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        quiz_id: quizId,
        score: finalScore,
        total_questions: questions.length,
        time_taken: timeSpent,
      });

      if (error) throw error;

      // Trigger confetti if score is more than 50
      if (finalScore > 50) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Additional confetti burst after a short delay
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 200);
      }

      toast({
        title: "Quiz Completed!",
        description: `Your score: ${finalScore}/100 points has been saved to the leaderboard`,
      });
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || !questions[currentQuestion]) return;

    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
    if (soundEnabled) {
      soundEffects.playButtonClick();
    }

    // Get current question answers
    const q = questions[currentQuestion];
    const wrongAnswers = [q.wrong_answer_1, q.wrong_answer_2, q.wrong_answer_3];

    // Randomly select 2 wrong answers to hide
    const shuffledWrongAnswers = [...wrongAnswers].sort(
      () => Math.random() - 0.5
    );
    const answersToHide = shuffledWrongAnswers.slice(0, 2);

    setHiddenAnswers(answersToHide);

    toast({
      title: "50:50 Used!",
      description: "Two wrong answers have been removed",
    });
  };

  const useSkipQuestion = () => {
    if (!lifelines.skipQuestion) return;
    setLifelines((prev) => ({ ...prev, skipQuestion: false }));
    if (soundEnabled) {
      soundEffects.playButtonClick();
    }
    handleAnswerSelect("", true); // Skip by selecting empty answer
  };

  const useExtraTime = () => {
    if (!lifelines.extraTime) return;
    setLifelines((prev) => ({ ...prev, extraTime: false }));
    if (soundEnabled) {
      soundEffects.playButtonClick();
    }
    setTimeLeft(timeLeft + 15);
    toast({
      title: "Extra Time!",
      description: "+15 seconds added to the timer",
    });
  };

  const shareQuiz = () => {
    const shareText = `Check out this ${quiz?.difficulty} quiz: "${quiz?.title}" on EaterIQ!`;
    const shareUrl = `${window.location.origin}/quiz/${quizId}`;

    if (navigator.share) {
      navigator
        .share({
          title: quiz?.title,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {
          // Fallback to clipboard if sharing fails
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Link Copied!",
            description: "Quiz link copied to clipboard",
          });
        });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Link Copied!",
        description: "Quiz link copied to clipboard",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const speakQuestion = () => {
    if (!questions[currentQuestion]) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question_text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = soundEnabled ? 1 : 0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when component unmounts or question changes
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [currentQuestion]);

  if (!quizId) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="flex justify-center items-center h-64 px-4">
          <div className="text-center">
            <p className="text-sm sm:text-base">Quiz not found</p>
            <Button aria-label="Back to List" onClick={onBack} className="mt-4">
              Back to List
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col justify-between bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <AnimatedBackground />
        <div className="flex justify-center items-center h-full relative z-10 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-sm sm:text-base">Loading quiz...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <AnimatedBackground />
        <main className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <CardHeader className="pb-4">
                <div className="relative">
                  <Trophy className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
                  {score > 70 && (
                    <div className="absolute -top-2 -right-2">
                      <Star className="h-8 w-8 text-yellow-400 animate-pulse" fill="currentColor" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Quiz Completed!
                </CardTitle>
                {score > 50 && (
                  <div className="text-lg font-semibold text-emerald-600 animate-pulse flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5" />
                    🎉 Excellent Performance! 🎉
                    <Zap className="h-5 w-5" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className={`text-4xl sm:text-5xl font-bold ${score > 50 ? 'text-emerald-600' : score > 30 ? 'text-yellow-600' : 'text-red-600'} animate-pulse`}>
                    {score}/100
                  </div>
                  <div className="text-lg text-muted-foreground mt-2">
                    {score > 70 ? "🏆 Outstanding!" : score > 50 ? "🌟 Great Job!" : score > 30 ? "👍 Good Effort!" : "📚 Keep Learning!"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <Target className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <div className="font-semibold">{Math.floor(score / 10)}/{questions.length}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <div className="font-semibold">{Math.floor(((new Date().getTime() - (startTime?.getTime() || 0)) / 1000) / 60)}m</div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                </div>

                {score > 50 && (
                  <div className="bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-950 dark:to-blue-950 p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                      <Star className="h-6 w-6 text-yellow-500" fill="currentColor" />
                      <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                      🌟 Outstanding Achievement! 🌟
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      You've mastered this topic!
                    </p>
                  </div>
                )}

                {!user && (
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Save Your Achievement!
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Sign in to save your score and climb the leaderboard!
                    </p>
                    <Button
                      aria-label="Sign in with Google"
                      onClick={signInWithGoogle}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign in with Google
                    </Button>
                  </div>
                )}

                {user && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 p-4 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700 dark:text-green-300">Score Saved!</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your achievement is now on the leaderboard!
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    aria-label="Back to Quizzes"
                    onClick={onBack}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Quizzes
                  </Button>
                  <Button
                    aria-label="Share Achievement"
                    onClick={shareQuiz}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Achievement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <AnimatedBackground />

      <main className="container mx-auto px-3 sm:px-4 py-4 relative z-10 max-w-4xl">
        {/* Quiz Header - Compact and Mobile Optimized */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <Button aria-label="Back" variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Toggle Sound"
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              {user && (
                <Button
                  aria-label="Leaderboard"
                  onClick={() => setShowLeaderboard(true)}
                  variant="outline"
                  size="sm"
                >
                  <Trophy className="h-4 w-4" />
                </Button>
              )}
              <Button aria-label="Share" onClick={shareQuiz} variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold capitalize mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {quiz.title}
            </h1>
            <Badge className={`${getDifficultyColor(quiz.difficulty)} mb-3`}>
              {quiz.difficulty.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Game Stats Bar */}
        <div className="bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 mb-4 border-2 border-emerald-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-emerald-600">{currentQuestion + 1}</div>
                <div className="text-xs text-muted-foreground">Question</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-600">{score}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold font-mono ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
                {timeLeft}s
              </div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
          </div>
          <Progress 
            value={(currentQuestion / questions.length) * 100} 
            className="h-2 bg-white/50 dark:bg-gray-600"
          />
        </div>

        {/* Guest Notice - Compact */}
        {!user && (
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 mb-4">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <LogIn className="h-4 w-4 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Playing as guest</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 truncate">Sign in to save score</p>
                  </div>
                </div>
                <Button aria-label="Sign In" onClick={signInWithGoogle} size="sm" className="bg-gradient-to-r from-emerald-600 to-blue-600 shrink-0">
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lifelines - Gamified Design */}
        <div className="mb-4">
          <div className="text-center mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Power-Ups
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              aria-label="50:50"
              variant={lifelines.fiftyFifty ? "default" : "outline"}
              size="sm"
              onClick={useFiftyFifty}
              disabled={!lifelines.fiftyFifty || answerFeedback.show}
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                !lifelines.fiftyFifty ? "opacity-50 bg-gray-100 dark:bg-gray-800" : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="text-xs">50:50</span>
              {!lifelines.fiftyFifty && <span className="text-[10px] opacity-75">Used</span>}
            </Button>
            <Button
              aria-label="Skip"
              variant={lifelines.skipQuestion ? "default" : "outline"}
              size="sm"
              onClick={useSkipQuestion}
              disabled={!lifelines.skipQuestion || answerFeedback.show}
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                !lifelines.skipQuestion ? "opacity-50 bg-gray-100 dark:bg-gray-800" : "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs">Skip</span>
              {!lifelines.skipQuestion && <span className="text-[10px] opacity-75">Used</span>}
            </Button>
            <Button
              aria-label="Extra Time"
              variant={lifelines.extraTime ? "default" : "outline"}
              size="sm"
              onClick={useExtraTime}
              disabled={!lifelines.extraTime || answerFeedback.show}
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                !lifelines.extraTime ? "opacity-50 bg-gray-100 dark:bg-gray-800" : "bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="text-xs">+15s</span>
              {!lifelines.extraTime && <span className="text-[10px] opacity-75">Used</span>}
            </Button>
          </div>
        </div>

        {/* Question Card - Enhanced Design */}
        <Card className="mb-4 border-2 border-gradient bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base sm:text-lg leading-relaxed flex-1 text-center">
                {questions[currentQuestion]?.question_text}
              </CardTitle>
              <Button
                aria-label="Speak Question"
                variant="outline"
                size="sm"
                onClick={speakQuestion}
                disabled={answerFeedback.show}
                className={`shrink-0 ${isSpeaking ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900' : ''}`}
              >
                <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {shuffledAnswers.map((answer, index) => {
              const isHidden = hiddenAnswers.includes(answer);
              const letter = String.fromCharCode(65 + index);

              if (isHidden) {
                return (
                  <div
                    key={index}
                    className="h-12 sm:h-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center opacity-50 border-2 border-dashed border-gray-300"
                  >
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Answer removed
                    </span>
                  </div>
                );
              }

              const isSelectedAnswer = answerFeedback.show && answerFeedback.selectedAnswer === answer;
              const isCorrectAnswer = answerFeedback.show && answer === questions[currentQuestion]?.correct_answer;

              return (
                <Button
                  aria-label={`Answer ${letter}`}
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto p-4 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] border-2 ${
                    isSelectedAnswer
                      ? answerFeedback.isCorrect
                        ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200"
                        : "bg-red-100 border-red-400 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200"
                      : isCorrectAnswer
                      ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-950 dark:border-green-700"
                      : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-600"
                  } ${answerFeedback.show ? "pointer-events-none" : ""}`}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={answerFeedback.show}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 font-bold text-xs shrink-0 ${
                    isSelectedAnswer || isCorrectAnswer 
                      ? "bg-white dark:bg-gray-800" 
                      : "bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-gray-700 dark:to-gray-600"
                  }`}>
                    {letter}
                  </div>
                  <span className="break-words flex-1">{answer}</span>
                  {isSelectedAnswer && (
                    <div className="ml-auto">
                      {answerFeedback.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  )}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Next Question Timer */}
        {answerFeedback.show && (
          <div className="text-center text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Moving to next question in {Math.ceil((2000 - (Date.now() % 2000)) / 1000)}s...
            </div>
          </div>
        )}
      </main>

      {/* Answer Feedback Modal - Enhanced */}
      {answerFeedback.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center transform transition-all duration-500 animate-scale-in border-4 ${
            answerFeedback.isCorrect ? 'border-green-400' : 'border-red-400'
          }`}>
            {answerFeedback.isCorrect ? (
              <div className="text-green-500">
                <div className="relative mb-4">
                  <CheckCircle className="h-20 w-20 mx-auto animate-bounce" />
                  <div className="absolute -top-2 -right-2">
                    <Star className="h-8 w-8 text-yellow-400 animate-spin" fill="currentColor" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  🎉 Correct!
                </h3>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 mb-2">
                  <p className="text-lg font-semibold text-green-800 dark:text-green-200">
                    +10 points
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Great job! Keep it up! 🚀
                </p>
              </div>
            ) : (
              <div className="text-red-500">
                <XCircle className="h-20 w-20 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold text-red-600 mb-3">
                  ❌ Incorrect!
                </h3>
                <div className="bg-red-100 dark:bg-red-900 rounded-lg p-3 mb-2">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Correct answer:
                  </p>
                  <p className="font-semibold text-red-900 dark:text-red-100">
                    {questions[currentQuestion]?.correct_answer}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don't worry, keep learning! 📚
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showLeaderboard && (
        <QuizLeaderboardModal
          quizId={quizId!}
          quizTitle={quiz.title}
          open={showLeaderboard}
          onOpenChange={setShowLeaderboard}
        />
      )}

      <Footer />
    </div>
  );
};

export default QuizPage;
