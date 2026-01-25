// components/quiz/QuizzesClient.tsx
"use client";

import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trophy, Brain, Target, ArrowLeft, Scan, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";
import QuizCard from "@/components/QuizCard";
import CreateQuizModal from "@/components/CreateQuizModal";
import LoginPromptModal from "@/components/LoginPromptModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard";
  created_at: string | null;
  creator_id: string;
  is_published?: boolean | null;
  slug: string | null;
}

interface LeaderboardEntry {
  id: string;
  full_name: string | null;
  total_score: number | null;
  quizzes_completed: number | null;
}

interface QuizzesClientProps {
  initialQuizzes: Quiz[];
  initialLeaderboard: LeaderboardEntry[];
}

export default function QuizzesClient({ 
  initialQuizzes, 
  initialLeaderboard 
}: QuizzesClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userQuizCount, setUserQuizCount] = useState(0);
  const [isLimitActive, setIsLimitActive] = useState(false);
  const [limitResetDate, setLimitResetDate] = useState<Date | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on client side
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (user) {
      runIdle(() => {
        fetchMyQuizzes();
        fetchUserQuizCount();
      });
    }
  }, [user]);

  const runIdle = (cb: () => void) => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(cb);
    } else {
      setTimeout(cb, 200);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, description, difficulty, created_at, creator_id, is_published, slug")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchMyQuizzes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, description, difficulty, created_at, creator_id, is_published, slug")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyQuizzes(data || []);
    } catch (error) {
      console.error("Error fetching my quizzes:", error);
    }
  };

  const fetchUserQuizCount = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const currentUser = user || authUser;
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, created_at")
        .eq("creator_id", currentUser.id)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;

      const now = new Date();
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const windowStart = new Date(now.getTime() - THIRTY_DAYS_MS);

      const recentQuizzes = (data || []).filter((q) => {
        const created = new Date(q.created_at || new Date());
        return created.getTime() >= windowStart.getTime();
      });

      setUserQuizCount(recentQuizzes.length || 0);

      if (recentQuizzes.length >= 2) {
        const oldest = recentQuizzes[0];
        const oldestDate = new Date(oldest.created_at || Date.now());
        const reset = new Date(oldestDate.getTime() + THIRTY_DAYS_MS);

        setIsLimitActive(true);
        setLimitResetDate(reset);
      } else {
        setIsLimitActive(false);
        setLimitResetDate(null);
      }
    } catch {
      setIsLimitActive(false);
      setLimitResetDate(null);
    }
  };

  const handleQuizUpdated = () => {
    fetchQuizzes();
    fetchMyQuizzes();
  };

  const handleCreateQuizClick = () => {
    if (user) {
      if (isLimitActive) {
        if (isMobile) {
          setShowLimitDialog(true);
        }
        return;
      }
      setShowCreateModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const createQuiz = async (formData: {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    prompt: string;
  }) => {
    if (!user) return;

    if (isLimitActive) {
      toast({
        title: "Monthly Limit Reached",
        description: limitResetDate
          ? `You can create a new quiz after ${limitResetDate.toLocaleString()}.`
          : "You can only create 2 quizzes within a 30-day period.",
        variant: "destructive",
      });
      setShowCreateModal(false);
      return;
    }

    setLoading(true);
    try {
      const baseSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { data: existingSlugs } = await supabase
        .from("quizzes")
        .select("slug")
        .like("slug", `${baseSlug}%`);

      let finalSlug = baseSlug;
      if (existingSlugs && existingSlugs.length > 0) {
        const slugSet = new Set(existingSlugs.map(s => s.slug));
        if (slugSet.has(baseSlug)) {
          let counter = 2;
          while (slugSet.has(`${baseSlug}-${counter}`)) {
            counter++;
          }
          finalSlug = `${baseSlug}-${counter}`;
        }
      }

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          creator_id: user.id,
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          prompt: formData.prompt,
          is_published: false,
          slug: finalSlug,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      const { error: questionsError } = await supabase.functions.invoke("generate-quiz", {
        body: {
          quizId: quiz.id,
          prompt: formData.prompt,
          difficulty: formData.difficulty,
        },
      });

      if (questionsError) throw questionsError;

      await supabase
        .from("quizzes")
        .update({ is_published: true })
        .eq("id", quiz.id);

      toast({
        title: "Quiz Created!",
        description: "Your quiz has been generated and published successfully.",
      });

      setShowCreateModal(false);
      await fetchQuizzes();
      await fetchMyQuizzes();
      await fetchUserQuizCount();
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const playQuiz = useCallback((slug: string) => {
    router.push(`/quiz/${slug}`);
  }, [router]);

  return (
    <div className="min-h-dvh bg-background">
      <Suspense fallback={null}>
        <AnimatedBackground />
      </Suspense>

      <main className="h-full container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium" aria-current="page">Quiz Hub</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="h-full w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row justify-between text-center w-full items-center gap-3 sm:gap-4">
            <div></div>

            <div className="flex flex-col flex-1 items-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                Quiz Hub
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Challenge yourself with fun nutrition quizzes
              </p>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      aria-label="Create Quiz"
                      onClick={handleCreateQuizClick}
                      className="bg-primary hover:bg-primary/90 sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="sm"
                      disabled={isLimitActive && !isMobile}
                    >
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span className="sm:hidden">Create</span>
                      <span className="hidden sm:inline">Create Quiz</span>
                    </Button>
                  </div>
                </TooltipTrigger>

                {isLimitActive && (
                  <TooltipContent
                    side="bottom"
                    sideOffset={8}
                    className="bg-white shadow-lg border rounded-md p-3"
                  >
                    <div className="max-w-xs">
                      <p className="font-semibold">Monthly Limit Reached</p>
                      <p className="text-sm mt-1">
                        You have already created 2 quizzes in the last 30 days.
                      </p>
                      {limitResetDate && (
                        <>
                          <p className="text-sm mt-2">
                            Resets on: <strong>{limitResetDate.toLocaleString()}</strong>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(() => {
                              const now = new Date();
                              const diffMs = limitResetDate.getTime() - now.getTime();
                              if (diffMs <= 0) return "Limit resets soon.";
                              const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
                              const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                              return `Time left: ${days}d ${hours}h`;
                            })()}
                          </p>
                        </>
                      )}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {user && (
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            You've created <strong>{userQuizCount}</strong> quiz{userQuizCount !== 1 && "zes"} this month.
          </p>
        )}

        <Tabs defaultValue="all-quizzes" className="space-y-4 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger
              value="all-quizzes"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="hidden sm:inline">All Quizzes</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger
              value="my-quizzes"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
              disabled={!user}
            >
              <Target className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="hidden sm:inline">My Quizzes</span>
              <span className="sm:hidden">Mine</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-quizzes" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {quizzes?.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onPlay={playQuiz}
                  onQuizUpdated={handleQuizUpdated}
                />
              ))}
            </div>

            {quizzes?.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Brain className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                <h2 className="text-base sm:text-lg font-semibold mb-2">No quizzes yet</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Be the first to create a quiz!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-quizzes" className="space-y-4 sm:space-y-6">
            {user ? (
              <>
                <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {myQuizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz}
                      onPlay={playQuiz}
                      onQuizUpdated={handleQuizUpdated}
                    />
                  ))}
                </div>
                {myQuizzes.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <Target className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                    <h2 className="text-base sm:text-lg font-semibold mb-2">No quizzes created yet</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">
                      Create your first nutrition quiz!
                    </p>
                    <Button
                      aria-label="Create Quiz"
                      onClick={handleCreateQuizClick}
                      className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      Create Quiz
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Please sign in to view your quizzes.
                </p>
                <Link href={"/quiz"}>
                  <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* How It Works Section */}
        <section className="py-12 mt-8 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              How Quiz Hub Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Choose a Quiz</h3>
                <p className="text-sm text-muted-foreground">
                  Browse through our collection of nutrition and food safety quizzes.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Answer Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge with multiple-choice questions at various difficulty levels.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See your scores, learn from explanations, and climb the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-8 border-t">
          <h2 className="text-xl font-bold mb-6 text-center">
            Explore More
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link href="/scanner/" className="group">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Scan className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      Food Scanner
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Scan products for instant nutrition info
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/" className="group">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/20">
                    <BookOpen className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      Nutrition Blog
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Expert articles on healthy eating
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 border-t">
          <h2 className="text-xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <details className="group border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium flex items-center justify-between">
                What topics do the nutrition quizzes cover?
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-muted-foreground">
                Our quizzes cover a wide range of topics including nutrition facts, food safety, 
                healthy eating habits, dietary guidelines, food labels, vitamins and minerals, and more.
              </div>
            </details>
            <details className="group border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium flex items-center justify-between">
                Can I create my own quiz?
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-muted-foreground">
                Yes! Registered users can create up to 2 custom quizzes per month. Simply sign in 
                and click the "Create Quiz" button to get started.
              </div>
            </details>
            <details className="group border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium flex items-center justify-between">
                Are the quizzes free to play?
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-muted-foreground">
                Yes, all quizzes on EaterIQ are completely free to play. You can test your nutrition 
                knowledge without any cost.
              </div>
            </details>
          </div>
        </section>

        {/* Modals */}
        <CreateQuizModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSubmit={createQuiz}
          loading={loading}
          userQuizCount={userQuizCount}
        />

        <LoginPromptModal
          open={showLoginPrompt}
          onOpenChange={setShowLoginPrompt}
          action="create quizzes"
        />

        <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Monthly Limit Reached</DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                You have already created 2 quizzes in the last 30 days.
                {limitResetDate && (
                  <span> You can create a new quiz after <strong>{limitResetDate.toLocaleString()}</strong>.</span>
                )}
              </p>
            </DialogHeader>
            <Button onClick={() => setShowLimitDialog(false)} className="mt-4 w-full">
              Got it
            </Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}