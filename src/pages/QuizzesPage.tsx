import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trophy, Brain, Target, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import QuizCard from "@/components/QuizCard";
import CreateQuizModal from "@/components/CreateQuizModal";
import LoginPromptModal from "@/components/LoginPromptModal";
import SEOHead from "@/components/SEOHead";
import { generateBreadcrumbStructuredData } from "@/utils/seo";
import { cn } from "@/lib/utils";
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
  description: string;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
  creator_id: string;
  is_published?: boolean;
  slug: string;
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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userQuizCount, setUserQuizCount] = useState(0);
  // NEW: whether user is currently blocked from creating (2 quizzes in active 30-day window)
  const [isLimitActive, setIsLimitActive] = useState(false);

  // NEW: when the limit window resets (Date or null)
  const [limitResetDate, setLimitResetDate] = useState<Date | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: "https://www.eateriq.com/" },
    { name: "Quiz Hub", url: "https://www.eateriq.com/quiz" },
  ]);

  useEffect(() => {
    fetchQuizzes();
    fetchLeaderboard();

    if (user) {
      fetchMyQuizzes();
      fetchUserQuizCount(); // 🟢 NEW: check how many created this month
    }
  }, [user]);


  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select(
          "id, title, description, difficulty, created_at, creator_id, is_published, slug"
        )
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
        .select(
          "id, title, description, difficulty, created_at, creator_id, is_published, slug"
        )
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyQuizzes(data || []);
    } catch (error) {
      console.error("Error fetching my quizzes:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, total_score, quizzes_completed")
        .order("total_score", { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };
  // 🟢 Function: Fetch how many quizzes user created this month
  // 🟢 Function: Fetch quizzes inside the active 30-day window and compute limit state
  const fetchUserQuizCount = async () => {
    // get authenticated user if not present from context
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const currentUser = user || authUser;
    if (!currentUser) return;

    try {
      // fetch user's quizzes (we only need created_at; fetch last 50 to be safe)
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, created_at")
        .eq("creator_id", currentUser.id)
        .order("created_at", { ascending: true }) // earliest first
        .limit(100);

      if (error) throw error;

      // compute 30-day window start (30 days ago from now)
      const now = new Date();
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const windowStart = new Date(now.getTime() - THIRTY_DAYS_MS);

      // keep only quizzes created within last 30 days
      const recentQuizzes = (data || []).filter((q: any) => {
        const created = new Date(q.created_at);
        return created.getTime() >= windowStart.getTime();
      });

      // Update count state (count of quizzes in active 30-day window)
      setUserQuizCount(recentQuizzes.length || 0);

      if (recentQuizzes.length >= 2) {
        // limit active -> find oldest quiz within window (earliest created_at)
        const oldest = recentQuizzes[0]; // because ascending order
        const oldestDate = new Date(oldest.created_at);
        const reset = new Date(oldestDate.getTime() + THIRTY_DAYS_MS);

        setIsLimitActive(true);
        setLimitResetDate(reset);
      } else {
        // limit not active
        setIsLimitActive(false);
        setLimitResetDate(null);
      }
    } catch {
      // fail-safe: assume not limited on error
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
        // ✅ If on mobile, show dialog instead of tooltip
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
      // Generate base slug from title
      const baseSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check for existing slugs and find next available number
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

      // Create quiz in database
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

      // Call edge function to generate questions with ChatGPT
      const { data: questionsData, error: questionsError } =
        await supabase.functions.invoke("generate-quiz", {
          body: {
            quizId: quiz.id,
            prompt: formData.prompt,
            difficulty: formData.difficulty,
          },
        });

      if (questionsError) throw questionsError;

      // Publish the quiz after questions are generated
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
      await fetchUserQuizCount(); // refresh the limit window after creation
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

  const playQuiz = (slug: string) => {
    navigate(`/quiz/${slug}`);
  };

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Quiz Hub - AI-Generated Food & Nutrition Quizzes | EaterIQ"
        description="Challenge yourself with AI-generated quizzes about nutrition, food safety, and healthy eating. Create custom quizzes and compete with other food enthusiasts on EaterIQ."
        keywords="nutrition quiz, food quiz, AI quiz generator, healthy eating quiz, food safety quiz, nutrition knowledge test"
        type="website"
        structuredData={breadcrumbStructuredData}
        canonicalUrl="https://www.eateriq.com/quiz/"
      />

      <AnimatedBackground />
      <main className="h-full container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10 max-w-6xl">
        <div className="h-full w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <Link to={"/"}>
            <Button
              aria-label="Back to Home"
              variant="outline"
              size="sm"
              className="shrink-0 flex md:hidden"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row justify-between text-center w-full items-center gap-3 sm:gap-4">
            {/* Back Button - always visible */}
            <Link to={"/"}>
              <Button
                aria-label="Back to Home"
                variant="outline"
                size="sm"
                className="shrink-0 hidden md:flex"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            {/* Center Heading */}
            <div className="flex flex-col flex-1 items-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                Quiz Hub
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Challenge yourself with AI-generated quizzes
              </p>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      aria-label="Create Quiz"
                      onClick={handleCreateQuizClick}
                      className="bg-primary hover:bg-primary/90  sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="sm"
                      disabled={isLimitActive && !isMobile} // Disable when limit reached
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="sm:hidden">Create</span>
                      <span className="hidden sm:inline">Create Quiz</span>
                    </Button>
                  </div>
                </TooltipTrigger>

                {/* Tooltip content when limit is active */}
                {isLimitActive && (
                  <TooltipContent
                    side="bottom"       // ⬅️ This shows tooltip below the button
                    sideOffset={8}      // ⬅️ Optional: spacing between button & tooltip
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
                              const hours = Math.floor(
                                (diffMs % (24 * 60 * 60 * 1000)) /
                                (60 * 60 * 1000)
                              );

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
        <p className="text-sm text-muted-foreground mt-2">
          You’ve created <strong>{userQuizCount}</strong> quiz{userQuizCount !== 1 && "zes"} this month.
        </p>


        <Tabs defaultValue="all-quizzes" className="space-y-4 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger
              value="all-quizzes"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">All Quizzes</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger
              value="my-quizzes"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
              disabled={!user}
            >
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
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
                <Brain className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  No quizzes yet
                </h3>
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
                    <Target className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">
                      No quizzes created yet
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">
                      Create your first AI-generated quiz!
                    </p>
                    {/* <Link to={"/create"}> */}
                    <Button
                      aria-label="Create Quiz"
                      onClick={handleCreateQuizClick}
                      className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                    {/* </Link> */}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Please sign in to view your quizzes.
                </p>
                <Link to={"/auth"}>
                  <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  Top Players
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {leaderboard.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                                ? "bg-amber-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate">
                            {player.full_name || "Anonymous"}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {player.quizzes_completed} quiz
                            {player.quizzes_completed !== 1 ? "es" : ""}{" "}
                            completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-emerald-600 text-sm sm:text-base">
                          {player.total_score}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {leaderboard.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <Trophy className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      No scores yet. Be the first!
                    </p>
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
};

export default QuizzesPage;
