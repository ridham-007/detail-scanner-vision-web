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

    try {
      const { error } = await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        quiz_id: quizId,
        score:
          score +
          (answer === questions[currentQuestion]?.correct_answer
            ? 10
            : 0),
        total_questions: questions.length,
        time_taken: timeSpent,
      });

      if (error) throw error;

      toast({
        title: "Quiz Completed!",
        description: `Your score: ${score}/100 points has been saved to the leaderboard`,
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

  if (!quizId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="flex justify-center items-center h-64 px-4">
          <div className="text-center">
            <p className="text-sm sm:text-base">Quiz not found</p>
            <Button onClick={onBack} className="mt-4">
              Back to Quizzes
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <AnimatedBackground />
        <main className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-xl sm:text-2xl">
                  Quiz Completed!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-600">
                  {score}/100
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  You answered {Math.floor(score / 10)} out of{" "}
                  {questions.length} questions correctly!
                </p>

                {!user && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
                      Want to save your score?
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Sign in to save your score and appear on the leaderboard!
                    </p>
                    <Button
                      onClick={signInWithGoogle}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 w-full sm:w-auto"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign in with Google
                    </Button>
                  </div>
                )}

                {user && (
                  <div className="bg-green-50 dark:bg-green-950 p-3 sm:p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-700 dark:text-green-300 text-sm sm:text-base">
                      ✅ Your score has been saved to the leaderboard!
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    onClick={onBack}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Quizzes
                  </Button>
                  <Button
                    onClick={shareQuiz}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 w-full sm:w-auto"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Quiz
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <AnimatedBackground />

      <main className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Quiz Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button variant="outline" onClick={onBack} className="self-start">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold capitalize">
                {quiz.title}
              </h1>
              <Badge
                variant="outline"
                className={`mt-3 ${getDifficultyColor(quiz.difficulty)}`}
              >
                {quiz.difficulty.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="flex items-end justify-end flex-wrap gap-2 self-start sm:self-auto">
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            {user && (
              <Button
                onClick={() => setShowLeaderboard(true)}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            )}
            <Button
              onClick={shareQuiz}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {/* Mobile-only buttons */}
            {user && (
              <Button
                onClick={() => setShowLeaderboard(true)}
                variant="outline"
                size="sm"
                className="sm:hidden"
              >
                <Trophy className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={shareQuiz}
              variant="outline"
              size="sm"
              className="sm:hidden"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>Score: {score}/100</span>
            </div>
            <Progress value={(currentQuestion / questions.length) * 100} />
          </div>

          {/* Login reminder for score saving */}
          {!user && (
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <LogIn className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Playing as guest
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Sign in to save your score to the leaderboard
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={signInWithGoogle}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lifelines */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={useFiftyFifty}
              disabled={!lifelines.fiftyFifty || answerFeedback.show}
              className={`flex items-center gap-1 text-xs sm:text-sm ${
                !lifelines.fiftyFifty ? "opacity-50 bg-gray-100" : ""
              }`}
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              50:50 {!lifelines.fiftyFifty && "(Used)"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={useSkipQuestion}
              disabled={!lifelines.skipQuestion || answerFeedback.show}
              className={`flex items-center gap-1 text-xs sm:text-sm ${
                !lifelines.skipQuestion ? "opacity-50 bg-gray-100" : ""
              }`}
            >
              <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
              Skip {!lifelines.skipQuestion && "(Used)"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={useExtraTime}
              disabled={!lifelines.extraTime || answerFeedback.show}
              className={`flex items-center gap-1 text-xs sm:text-sm ${
                !lifelines.extraTime ? "opacity-50 bg-gray-100" : ""
              }`}
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              +15s {!lifelines.extraTime && "(Used)"}
            </Button>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full ${
                timeLeft <= 10
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono text-base sm:text-lg">
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Answer Feedback */}
          {answerFeedback.show && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
              <div
                className={`bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center transform transition-all duration-500`}
              >
                {answerFeedback.isCorrect ? (
                  <div className="text-green-500">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      Correct!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      +10 points
                    </p>
                  </div>
                ) : (
                  <div className="text-red-500">
                    <XCircle className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-600 mb-2">
                      Incorrect!
                    </h3>
                    <p className="text-gray-900 dark:text-gray-300">
                      Correct answer:{" "}
                      {questions[currentQuestion]?.correct_answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-base sm:text-lg leading-relaxed">
                {questions[currentQuestion]?.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {shuffledAnswers.map((answer, index) => {
                const isHidden = hiddenAnswers.includes(answer);

                if (isHidden) {
                  return (
                    <div
                      key={index}
                      className="h-12 sm:h-14 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center opacity-50"
                    >
                      <span className="text-gray-400 text-sm">
                        Answer removed
                      </span>
                    </div>
                  );
                }

                return (
                  <Button
                    key={index}
                    variant={selectedAnswer === answer ? "default" : "outline"}
                    className={`w-full text-left justify-start h-auto p-3 sm:p-4 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] ${
                      answerFeedback.show &&
                      answerFeedback.selectedAnswer === answer
                        ? answerFeedback.isCorrect
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-red-500 text-white border-red-500"
                        : answerFeedback.show &&
                          answer === questions[currentQuestion]?.correct_answer
                        ? "bg-green-100 border-green-300 text-green-800"
                        : ""
                    } ${answerFeedback.show ? "pointer-events-none" : ""}`}
                    onClick={() => handleAnswerSelect(answer)}
                    disabled={answerFeedback.show}
                  >
                    <span className="font-medium mr-2 shrink-0">
                      {String.fromCharCode(
                        65 + shuffledAnswers.indexOf(answer)
                      )}
                      .
                    </span>
                    <span className="break-words">{answer}</span>
                    {answerFeedback.show &&
                      answerFeedback.selectedAnswer === answer && (
                        <span className="ml-auto">
                          {answerFeedback.isCorrect ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </span>
                      )}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {answerFeedback.show && (
            <div className="text-center text-sm text-muted-foreground">
              Moving to next question in{" "}
              {Math.ceil((2000 - (Date.now() % 2000)) / 1000)}s...
            </div>
          )}
        </div>
      </main>

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
