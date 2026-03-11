// components/quiz/QuizHubClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateQuizModal from '@/components/CreateQuizModal';
import LoginPromptModal from '@/components/LoginPromptModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";import { useSubscription } from '@/hooks/useSubscription';

export default function QuizHubClient() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { tier } = useSubscription();
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userQuizCount, setUserQuizCount] = useState(0);
  const [isLimitActive, setIsLimitActive] = useState(false);
  const [limitResetDate, setLimitResetDate] = useState<Date | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserQuizCount();
    }
  }, [user]);

  const fetchUserQuizCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, created_at')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: true })
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

  const handleCreateQuizClick = () => {
    if (user) {
      if (tier === 'free') {
        setShowUpgradeModal(true);
        return;
      }

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
    difficulty: 'easy' | 'medium' | 'hard';
    prompt: string;
  }) => {
    if (!user) return;

    if (isLimitActive) {
      toast({
        title: 'Monthly Limit Reached',
        description: limitResetDate
          ? `You can create a new quiz after ${limitResetDate.toLocaleString()}.`
          : 'You can only create 2 quizzes within a 30-day period.',
        variant: 'destructive',
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
        .from('quizzes')
        .select('slug')
        .like('slug', `${baseSlug}%`);

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
        .from('quizzes')
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

      const { error: questionsError } = await supabase.functions.invoke('generate-quiz', {
        body: {
          quizId: quiz.id,
          prompt: formData.prompt,
          difficulty: formData.difficulty,
        },
      });

      if (questionsError) throw questionsError;

      await supabase
        .from('quizzes')
        .update({ is_published: true })
        .eq('id', quiz.id);

      toast({
        title: 'Quiz Created!',
        description: 'Your quiz has been generated and published successfully.',
      });

      setShowCreateModal(false);
      fetchUserQuizCount();

      // Refresh the page to show new quiz
      window.location.reload();
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to create quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Create Quiz Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              <Button
                onClick={handleCreateQuizClick}
                className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
                size="lg"
                disabled={isLimitActive && !isMobile}
              >
                <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                Create Your Own Quiz
              </Button>
            </div>
          </TooltipTrigger>

          {isLimitActive && (
            <TooltipContent side="bottom" sideOffset={8} className="bg-white shadow-lg border rounded-md p-3">
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
                        if (diffMs <= 0) return 'Limit resets soon.';
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

      {/* User Quiz Count */}
      {user && (
        <p className="text-sm text-muted-foreground mt-4">
          You&apos;ve created <strong>{userQuizCount}</strong> quiz{userQuizCount !== 1 && 'zes'} this month (max 2/month).
        </p>
      )}

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

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md p-8">

          <div className="flex flex-col items-center text-center space-y-4">

            {/* Badge */}
            <span className="text-xs font-medium bg-muted px-3 py-1 rounded-full">
              PRO FEATURE
            </span>

            {/* Title */}
            <h2 className="text-xl font-semibold">
              Create Your Own Quiz
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-sm">
              You've discovered a Pro feature. Upgrade to create AI-powered quizzes
              and share them with the community.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">

              <span className="text-xs border rounded-full px-3 py-1">
                ⚡ AI quiz generation
              </span>

              <span className="text-xs border rounded-full px-3 py-1">
                🧠 Unlimited quizzes
              </span>

              <span className="text-xs border rounded-full px-3 py-1">
                🌍 Share with others
              </span>

            </div>

            {/* CTA */}
            <Button
              className="mt-4"
              onClick={() => {
                setShowUpgradeModal(false);
                router.push("/pricing");
              }}
            >
              ⭐  Upgrade to Pro
            </Button>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}