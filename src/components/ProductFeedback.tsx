
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProductFeedbackModal from './ProductFeedbackModal';

interface ProductFeedbackProps {
  barcode: string;
}

interface FeedbackStats {
  helpful: number;
  not_helpful: number;
  total: number;
  userFeedback?: 'helpful' | 'not_helpful' | null;
}

const ProductFeedback: React.FC<ProductFeedbackProps> = ({ barcode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    helpful: 0,
    not_helpful: 0,
    total: 0,
    userFeedback: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingFeedbackType, setPendingFeedbackType] = useState<'helpful' | 'not_helpful' | null>(null);

  useEffect(() => {
    fetchFeedbackStats();
  }, [barcode, user]);

  const fetchFeedbackStats = async () => {
    try {
      // Get overall feedback stats
      const { data: allFeedback, error: statsError } = await supabase
        .from('product_feedback')
        .select('feedback_type')
        .eq('barcode', barcode);

      if (statsError) throw statsError;

      const helpful = allFeedback?.filter(f => f.feedback_type === 'helpful').length || 0;
      const not_helpful = allFeedback?.filter(f => f.feedback_type === 'not_helpful').length || 0;

      let userFeedback = null;
      
      // Get user's feedback if logged in
      if (user) {
        const { data: userFeedbackData, error: userError } = await supabase
          .from('product_feedback')
          .select('feedback_type')
          .eq('barcode', barcode)
          .eq('user_id', user.id)
          .single();

        if (!userError && userFeedbackData) {
          userFeedback = userFeedbackData.feedback_type as 'helpful' | 'not_helpful';
        }
      }

      setFeedbackStats({
        helpful,
        not_helpful,
        total: helpful + not_helpful,
        userFeedback
      });
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
    }
  };

  const handleFeedbackClick = async (feedbackType: 'helpful' | 'not_helpful') => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to provide feedback on products.",
        variant: "destructive"
      });
      return;
    }

    if (feedbackType === 'not_helpful') {
      setPendingFeedbackType(feedbackType);
      setShowFeedbackModal(true);
      return;
    }

    // For helpful feedback, submit directly
    await submitFeedback(feedbackType);
  };

  const submitFeedback = async (
    feedbackType: 'helpful' | 'not_helpful',
    category?: string,
    comment?: string
  ) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Check if user already provided feedback
      const { data: existingFeedback } = await supabase
        .from('product_feedback')
        .select('id')
        .eq('barcode', barcode)
        .eq('user_id', user.id)
        .single();

      if (existingFeedback) {
        toast({
          title: "Already Submitted",
          description: "You've already provided feedback for this product.",
          variant: "destructive"
        });
        return;
      }

      // Submit new feedback
      const { error } = await supabase
        .from('product_feedback')
        .insert({
          barcode,
          user_id: user.id,
          feedback_type: feedbackType,
          category: category || null,
          comment: comment || null
        });

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded and helps improve data quality."
      });

      // Refresh stats
      await fetchFeedbackStats();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setShowFeedbackModal(false);
      setPendingFeedbackType(null);
    }
  };

  const getHelpfulPercentage = () => {
    if (feedbackStats.total === 0) return 0;
    return Math.round((feedbackStats.helpful / feedbackStats.total) * 100);
  };

  const getFeedbackBadgeVariant = () => {
    const percentage = getHelpfulPercentage();
    if (percentage >= 80) return 'default'; // Green
    if (percentage >= 60) return 'secondary'; // Yellow
    return 'destructive'; // Red
  };

  const shouldShowWarning = () => {
    return feedbackStats.total >= 3 && getHelpfulPercentage() < 60;
  };

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Feedback Stats */}
            {feedbackStats.total > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={getFeedbackBadgeVariant()}>
                    {getHelpfulPercentage()}% found this helpful
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({feedbackStats.total} feedback{feedbackStats.total !== 1 ? 's' : ''})
                  </span>
                </div>
                {shouldShowWarning() && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Some users reported issues</span>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <p className="text-sm text-muted-foreground">Is this information accurate?</p>
              <div className="flex gap-2">
                <Button
                  variant={feedbackStats.userFeedback === 'helpful' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFeedbackClick('helpful')}
                  disabled={isLoading || !!feedbackStats.userFeedback}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({feedbackStats.helpful})
                </Button>
                <Button
                  variant={feedbackStats.userFeedback === 'not_helpful' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleFeedbackClick('not_helpful')}
                  disabled={isLoading || !!feedbackStats.userFeedback}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Not Helpful ({feedbackStats.not_helpful})
                </Button>
              </div>
            </div>

            {feedbackStats.userFeedback && (
              <p className="text-xs text-muted-foreground text-center">
                Thank you for your feedback!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <ProductFeedbackModal
        open={showFeedbackModal}
        onOpenChange={setShowFeedbackModal}
        onSubmit={async (category, comment) => {
          if (pendingFeedbackType) {
            await submitFeedback(pendingFeedbackType, category, comment);
          }
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProductFeedback;
