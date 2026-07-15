// components/quiz/QuizPlayClient.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/integrations/supabase/types";
import {
  Clock,
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
  Flame,
  Award,
  Crown,
  Sparkles,
  Bolt,
  Scan,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";
import QuizLeaderboardModal from "@/components/QuizLeaderboardModal";
import { soundEffects } from "@/utils/soundEffects";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";

type QuizAttemptInsert =
  Database["public"]["Tables"]["quiz_attempts"]["Insert"];

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
  description: string | null;
  difficulty: string;
  creator_id: string;
  slug: string | null;
}

interface QuizPlayClientProps {
  initialQuiz: Quiz;
  initialQuestions: Question[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPlayClient({
  initialQuiz,
  initialQuestions,
}: QuizPlayClientProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [quiz] = useState<Quiz>(initialQuiz);
  const [questions] = useState<Question[]>(() =>
    shuffleArray(initialQuestions),
  );
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
    new Array(10).fill(false),
  );
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hiddenAnswers, setHiddenAnswers] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spentTime, setSpentTime] = useState<number>(0);

  // Gamification states
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [perfectAnswers, setPerfectAnswers] = useState(0);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    if (!gameOver && timeLeft > 0 && !answerFeedback.show) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);

        if (soundEnabled && timeLeft <= 5 && timeLeft > 1) {
          soundEffects.playWarning();
        } else if (soundEnabled && timeLeft > 5) {
          soundEffects.playTick();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && !answerFeedback.show) {
      handleAnswerSelect("");
    }
  }, [timeLeft, gameOver, showResult, soundEnabled, answerFeedback.show]);

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
      setHiddenAnswers([]);
    }
  }, [currentQuestion, questions]);

  const handleAnswerSelect = async (
    answer: string,
    isSkip: boolean = false,
  ) => {
    if (answerFeedback.show) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion]?.correct_answer;
    const isPerfectAnswer = timeLeft >= 25;

    if (!isSkip) {
      setAnswerFeedback({ show: true, isCorrect, selectedAnswer: answer });
    }

    if (isCorrect) {
      let pointsEarned = 10;
      let xpEarned = 15;

      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      if (isPerfectAnswer) {
        pointsEarned += 5;
        xpEarned += 10;
        setPerfectAnswers((prev) => prev + 1);
      }

      const newMultiplier = Math.min(Math.floor(newStreak / 3) + 1, 4);
      setComboMultiplier(newMultiplier);

      if (newMultiplier > 1) {
        pointsEarned *= newMultiplier;
        xpEarned *= newMultiplier;
      }

      setScore((prev) => prev + pointsEarned);
      setXP((prev) => prev + xpEarned);
      setTotalXP((prev) => prev + xpEarned);

      const newAchievements = [...achievements];

      if (newStreak === 1 && !achievements.includes("first_correct")) {
        newAchievements.push("first_correct");
        setShowAchievement("First Blood! 🎯");
      }

      if (newStreak === 3 && !achievements.includes("hot_streak")) {
        newAchievements.push("hot_streak");
        setShowAchievement("On Fire! 🔥");
      }

      if (newStreak === 5 && !achievements.includes("perfect_streak")) {
        newAchievements.push("perfect_streak");
        setShowAchievement("Unstoppable! ⚡");
      }

      if (perfectAnswers >= 3 && !achievements.includes("speed_demon")) {
        newAchievements.push("speed_demon");
        setShowAchievement("Speed Demon! 🚄");
      }

      setAchievements(newAchievements);

      if (newStreak >= 3) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#10B981", "#3B82F6", "#8B5CF6"],
        });
      }
    } else {
      setStreak(0);
      setComboMultiplier(1);
    }

    if (soundEnabled) {
      if (isCorrect) {
        soundEffects.playCorrectAnswer();
      } else {
        soundEffects.playWrongAnswer();
      }
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (showAchievement) {
      setTimeout(() => setShowAchievement(null), 3000);
    }

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
    }, 2000);
  };

  const saveQuizAttempt = async (answer: string) => {
    if (!user || !startTime) return;

    const timeSpent = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000,
    );

    const finalScore =
      score + (answer === questions[currentQuestion]?.correct_answer ? 10 : 0);
    setSpentTime(timeSpent);

    try {
      const payload: QuizAttemptInsert = {
        user_id: user.id,
        quiz_id: quiz.id,
        score: finalScore,
        total_questions: questions.length,
        time_taken: timeSpent,
      };

      const { error } = await supabase.from("quiz_attempts").insert(payload);

      if (error) throw error;

      if (finalScore > 50) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 200);
      }

      toast({
        title: "Quiz Completed!",
        description: `Your score: ${finalScore}/100 points has been saved to the leaderboard`,
      });
    } catch {
      // Score save failed silently
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || !questions[currentQuestion]) return;

    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
    if (soundEnabled) {
      soundEffects.playButtonClick();
    }

    const q = questions[currentQuestion];
    const wrongAnswers = [q.wrong_answer_1, q.wrong_answer_2, q.wrong_answer_3];
    const shuffledWrongAnswers = [...wrongAnswers].sort(
      () => Math.random() - 0.5,
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
    handleAnswerSelect("", true);
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

  const shareQuiz = async () => {
    if (!codeRef.current) return;

    const shareText = `Check out this ${quiz.difficulty} quiz: "${quiz.title}" on EaterIQ!`;
    const shareUrl = `${window.location.origin}/quiz/${quiz.slug}`;

    const clone = codeRef.current.cloneNode(true) as HTMLElement;
    const elementsToRemove = clone.querySelectorAll(".ignoreInShare");
    elementsToRemove.forEach((el) => el.remove());

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-10000px";
    container.style.left = "-10000px";
    container.style.zIndex = "-1";
    container.appendChild(clone);
    document.body.appendChild(container);

    const dataUrl = await toPng(clone, { pixelRatio: 2 });
    document.body.removeChild(container);

    if (navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const filesArray = [new File([blob], "quiz.png", { type: blob.type })];
        await navigator.share({
          title: "Check out this quiz!",
          text: shareText,
          files: filesArray,
          url: shareUrl,
        });
      } catch {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: "Link Copied!",
          description: "Quiz link copied to clipboard",
        });
      }
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
        return "bg-primary/10 text-primary border border-primary/20";
      case "medium":
        return "bg-accent/10 text-accent-foreground border border-accent/20";
      case "hard":
        return "bg-destructive/10 text-destructive border border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border border-muted/20";
    }
  };

  const speakQuestion = () => {
    if (!questions[currentQuestion]) return;

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      questions[currentQuestion].question_text,
    );
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = soundEnabled ? 1 : 0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [currentQuestion]);

  // Game Over Screen
  if (gameOver) {
    return (
      <div className="min-h-dvh bg-background">
        <AnimatedBackground />
        <main
          ref={codeRef}
          className="container mx-auto px-4 py-4 sm:py-8 relative z-10"
        >
          {/* Breadcrumb */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground/90">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/quiz/" className="hover:text-primary">
                  Quiz Hub
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium truncate max-w-[150px]">
                {quiz.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-2xl mx-auto">
            <Card className="text-center border-2 border-primary/20 bg-card">
              <CardHeader className="pb-4">
                <div className="relative">
                  <Trophy
                    className="h-16 w-16 sm:h-20 sm:w-20 text-primary mx-auto mb-4 animate-bounce"
                    aria-hidden="true"
                  />
                  {score > 70 && (
                    <div className="absolute -top-2 -right-2">
                      <Star
                        className="h-8 w-8 text-accent animate-pulse"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-primary">
                  Quiz Completed!
                </CardTitle>
                {score > 50 && (
                  <div className="text-lg font-semibold text-primary flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5" aria-hidden="true" />
                    🎉 Excellent Performance! 🎉
                    <Zap className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div
                    className={`text-4xl sm:text-5xl font-bold ${
                      score > 50
                        ? "text-primary"
                        : score > 30
                          ? "text-accent"
                          : "text-destructive"
                    }`}
                  >
                    {score}/100
                  </div>
                  <div className="text-lg text-muted-foreground mt-2">
                    {score > 70
                      ? "🏆 Outstanding!"
                      : score > 50
                        ? "🌟 Great Job!"
                        : score > 30
                          ? "👍 Good Effort!"
                          : "📚 Keep Learning!"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted rounded-lg p-3">
                    <Target
                      className="h-5 w-5 mx-auto mb-1 text-primary"
                      aria-hidden="true"
                    />
                    <div className="font-semibold">
                      {Math.floor(score / 10)}/{questions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <Clock
                      className="h-5 w-5 mx-auto mb-1 text-accent"
                      aria-hidden="true"
                    />
                    <div className="font-semibold">
                      {(() => {
                        const minutes = Math.floor(spentTime / 60);
                        const seconds = spentTime % 60;
                        return `${minutes}m ${seconds}s`;
                      })()}
                    </div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                </div>

                {score > 50 && (
                  <div className="bg-primary/10 p-4 rounded-xl border-2 border-primary/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star
                        className="h-5 w-5 text-accent"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      <Star
                        className="h-6 w-6 text-accent"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      <Star
                        className="h-5 w-5 text-accent"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-primary font-medium">
                      🌟 Outstanding Achievement! 🌟
                    </p>
                    <p className="text-sm text-primary/80 mt-1">
                      You've mastered this topic!
                    </p>
                  </div>
                )}

                {!user && (
                  <div className="bg-accent/10 p-4 rounded-xl border-2 border-accent/20">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2">
                      <Trophy className="h-5 w-5" aria-hidden="true" />
                      Save Your Achievement!
                    </h3>
                    <p className="text-sm text-accent/80 mb-3">
                      Sign in to save your score and climb the leaderboard!
                    </p>
                    <Button
                      aria-label="Sign in with Google"
                      onClick={() => signInWithGoogle()}
                      className="bg-primary hover:bg-primary/90 w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                      Sign in with Google
                    </Button>
                  </div>
                )}

                {user && (
                  <div className="ignoreInShare bg-primary/10 p-4 rounded-xl border-2 border-primary/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-primary">
                        Score Saved!
                      </span>
                    </div>
                    <p className="text-sm text-primary/80">
                      Your achievement is now on the leaderboard!
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 ignoreInShare">
                  <Link href={"/quiz"} className="flex-1">
                    <Button
                      aria-label="Back to Quizzes"
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                      Back to Quizzes
                    </Button>
                  </Link>
                  <Button
                    aria-label="Share Achievement"
                    onClick={shareQuiz}
                    className="bg-primary hover:bg-primary/90 flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Share Achievement
                  </Button>
                </div>

                {/* Related Links */}
                <div className="pt-4 border-t ignoreInShare">
                  <p className="text-sm text-muted-foreground mb-3">
                    Continue Learning
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/food-scanner/" className="group">
                      <div className="p-3 rounded-lg border hover:border-primary transition-colors flex items-center gap-2">
                        <Scan
                          className="h-4 w-4 text-primary"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium group-hover:text-primary">
                          Food Scanner
                        </span>
                      </div>
                    </Link>
                    <Link href="/blog/" className="group">
                      <div className="p-3 rounded-lg border hover:border-primary transition-colors flex items-center gap-2">
                        <BookOpen
                          className="h-4 w-4 text-primary"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium group-hover:text-primary">
                          Read Articles
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Main Quiz Interface
  return (
    <div className="min-h-dvh bg-background">
      <AnimatedBackground />

      <main className="container mx-auto px-3 sm:px-4 py-4 relative z-10 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/quiz/" className="hover:text-primary">
                Quiz Hub
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              className="text-foreground font-medium truncate max-w-[150px]"
              aria-current="page"
            >
              {quiz.title}
            </li>
          </ol>
        </nav>

        {/* Quiz Header */}
        <div className="mb-4">
          <div className="flex items-center justify-end mb-3">
            {/* <Link href={"/quiz"}>
              <Button aria-label="Back" variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link> */}
            <div className="flex items-center gap-2">
              <Button
                aria-label="Toggle Sound"
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
              {user && (
                <Button
                  aria-label="Leaderboard"
                  onClick={() => setShowLeaderboard(true)}
                  variant="outline"
                  size="sm"
                >
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              <Button
                aria-label="Share"
                onClick={shareQuiz}
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold capitalize mb-2 text-primary">
              {quiz.title}
            </h1>
            <Badge className={`${getDifficultyColor(quiz.difficulty)} mb-3`}>
              {quiz.difficulty.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Game Stats Bar */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4 border-2 border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary">
                  {currentQuestion + 1}
                </div>
                <div className="text-xs text-muted-foreground">Question</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-accent">
                  {score}
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              {streak > 0 && (
                <div className="text-center animate-pulse">
                  <div className="flex items-center gap-1">
                    <Flame
                      className={`h-4 w-4 ${
                        streak >= 3
                          ? "text-destructive animate-bounce"
                          : "text-destructive/80"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="text-lg sm:text-xl font-bold text-destructive">
                      {streak}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-secondary">
                  {xp}
                </div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
              {comboMultiplier > 1 && (
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Bolt
                      className="h-4 w-4 text-accent animate-pulse"
                      aria-hidden="true"
                    />
                    <div className="text-lg sm:text-xl font-bold text-accent">
                      x{comboMultiplier}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Combo</div>
                </div>
              )}
            </div>
            <div className="text-center">
              <div
                className={`text-xl sm:text-2xl font-bold font-mono ${
                  timeLeft <= 10
                    ? "text-destructive animate-pulse"
                    : "text-primary"
                }`}
              >
                {timeLeft}s
              </div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
          </div>
          <Progress
            value={(currentQuestion / questions.length) * 100}
            className="h-2 bg-muted mb-2"
          />
          {bestStreak > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Crown className="h-3 w-3 text-accent" aria-hidden="true" />
              Best Streak: {bestStreak}
              {perfectAnswers > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <Sparkles
                    className="h-3 w-3 text-primary"
                    aria-hidden="true"
                  />
                  Perfect Answers: {perfectAnswers}
                </>
              )}
            </div>
          )}
        </div>

        {/* Guest Notice */}
        {!user && (
          <Card className="bg-accent/30 text-accent-foreground mb-4">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <LogIn
                    className="h-4 w-4 text-accent shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Playing as guest
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Sign in to save score
                    </p>
                  </div>
                </div>
                <Button
                  aria-label="Sign In"
                  onClick={() => signInWithGoogle()}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 shrink-0"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lifelines / Power-Ups */}
        <div className="mb-4">
          <div className="text-center mb-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Power-Ups
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              aria-label="50:50"
              variant={lifelines.fiftyFifty ? "default" : "outline"}
              size="sm"
              onClick={useFiftyFifty}
              disabled={!lifelines.fiftyFifty || answerFeedback.show}
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                !lifelines.fiftyFifty
                  ? "opacity-80 bg-muted"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">50:50</span>
              {!lifelines.fiftyFifty && (
                <span className="text-xs opacity-75">Used</span>
              )}
            </Button>
            <Button
              aria-label="Skip"
              variant={lifelines.skipQuestion ? "default" : "outline"}
              size="sm"
              onClick={useSkipQuestion}
              disabled={!lifelines.skipQuestion || answerFeedback.show}
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                !lifelines.skipQuestion
                  ? "opacity-80 bg-muted"
                  : "bg-accent/60 hover:bg-accent/50 text-accent-foreground"
              }`}
            >
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Skip</span>
              {!lifelines.skipQuestion && (
                <span className="text-xs opacity-75">Used</span>
              )}
            </Button>
            <Button
              aria-label="Extra Time"
              variant={lifelines.extraTime ? "default" : "outline"}
              size="sm"
              onClick={useExtraTime}
              disabled={!lifelines.extraTime || answerFeedback.show}
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                !lifelines.extraTime
                  ? "opacity-80 bg-muted"
                  : "bg-secondary/60 hover:bg-secondary/50 text-secondary-foreground"
              }`}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">+15s</span>
              {!lifelines.extraTime && (
                <span className="text-xs opacity-75">Used</span>
              )}
            </Button>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-4 border-2 border-border bg-card">
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
                className={`shrink-0 ${
                  isSpeaking ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <Volume2
                  className={`h-4 w-4 ${isSpeaking ? "animate-pulse" : ""}`}
                  aria-hidden="true"
                />
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
                    className="h-12 sm:h-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-dashed border-border"
                  >
                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                      <XCircle className="h-4 w-4" aria-hidden="true" />
                      Answer removed
                    </span>
                  </div>
                );
              }

              const isSelectedAnswer =
                answerFeedback.show && answerFeedback.selectedAnswer === answer;
              const isCorrectAnswer =
                answerFeedback.show &&
                answer === questions[currentQuestion]?.correct_answer;

              return (
                <Button
                  aria-label={`Answer ${letter}`}
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto p-4 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] border-2 ${
                    isSelectedAnswer
                      ? answerFeedback.isCorrect
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-destructive/20 border-destructive text-destructive"
                      : isCorrectAnswer
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "hover:bg-muted/50"
                  } ${answerFeedback.show ? "pointer-events-none" : ""}`}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={answerFeedback.show}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 font-bold text-xs shrink-0 ${
                      isSelectedAnswer || isCorrectAnswer
                        ? "bg-background"
                        : "bg-muted"
                    }`}
                  >
                    {letter}
                  </div>
                  <span className="break-words flex-1">{answer}</span>
                  {isSelectedAnswer && (
                    <div className="ml-auto">
                      {answerFeedback.isCorrect ? (
                        <CheckCircle
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircle
                          className="h-5 w-5 text-destructive"
                          aria-hidden="true"
                        />
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
          <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Moving to next question...
            </div>
          </div>
        )}
      </main>

      {/* Answer Feedback Modal */}
      {answerFeedback.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div
            className={`bg-card rounded-2xl p-6 max-w-sm w-full text-center transform transition-all duration-500 animate-scale-in border-4 ${
              answerFeedback.isCorrect ? "border-primary" : "border-destructive"
            }`}
          >
            {answerFeedback.isCorrect ? (
              <div className="text-primary">
                <div className="relative mb-4">
                  <CheckCircle
                    className="h-20 w-20 mx-auto animate-bounce"
                    aria-hidden="true"
                  />
                  <div className="absolute -top-2 -right-2">
                    <Star
                      className="h-8 w-8 text-accent animate-spin"
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-primary mb-2">
                  🎉 Correct!
                </h3>
                <div className="space-y-2">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        Points:
                      </span>
                      <span className="text-lg font-bold text-primary">
                        +
                        {comboMultiplier > 1 ? `${10 * comboMultiplier}` : "10"}
                        {comboMultiplier > 1 && (
                          <span className="text-sm ml-1">
                            (x{comboMultiplier})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold text-primary">XP:</span>
                      <span className="text-lg font-bold text-secondary">
                        +
                        {comboMultiplier > 1 ? `${15 * comboMultiplier}` : "15"}
                        {timeLeft >= 25 && (
                          <span className="text-sm ml-1 text-accent">
                            (+10 speed bonus!)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  {streak > 0 && (
                    <div className="bg-destructive/10 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-2">
                        <Flame
                          className="h-4 w-4 text-destructive"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-destructive">
                          {streak} Question Streak! 🔥
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Great job! Keep it up! 🚀
                </p>
              </div>
            ) : (
              <div className="text-destructive">
                <XCircle
                  className="h-20 w-20 mx-auto mb-4 animate-pulse"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-semibold tracking-tight text-destructive mb-3">
                  ❌ Incorrect!
                </h3>
                <div className="bg-destructive/10 rounded-lg p-3 mb-2">
                  <p className="text-sm font-medium text-destructive mb-1">
                    Correct answer:
                  </p>
                  <p className="font-semibold text-destructive">
                    {questions[currentQuestion]?.correct_answer}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Don't worry, keep learning! 📚
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl border-4 border-accent animate-bounce">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 animate-spin" aria-hidden="true" />
              <span className="font-bold text-lg">{showAchievement}</span>
              <Sparkles className="h-6 w-6 animate-pulse" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <QuizLeaderboardModal
          quizId={quiz.id}
          quizTitle={quiz.title}
          open={showLeaderboard}
          onOpenChange={setShowLeaderboard}
        />
      )}
    </div>
  );
}
