import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ProductSubmissionData {
  barcode: string;
  productName: string;
  productDescription?: string;
  productImages?: string[];
  ingredients?: string;
  nutritionData?: Record<string, unknown>;
  brand?: string;
  guestEmail?: string;
  guestName?: string;
}

export interface ContributionLevel {
  tier: 'guest' | 'logged_in' | 'verified';
  contributionPoints: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  accuracyRate: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export function useProductSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitProduct = async (data: ProductSubmissionData) => {
    setIsSubmitting(true);
    try {
      const insertData: Record<string, unknown> = {
        barcode: data.barcode,
        product_name: data.productName,
        product_description: data.productDescription || null,
        product_images: data.productImages || null,
        ingredients: data.ingredients || null,
        nutrition_data: data.nutritionData || null,
        brand: data.brand || null,
        submitted_by: user?.id || null,
        guest_email: !user ? data.guestEmail : null,
        guest_name: !user ? data.guestName : null,
        status: 'pending',
      };
      
      const { error } = await supabase.from('product_submissions').insert([insertData as never]);

      if (error) throw error;

      toast({
        title: 'Product Submitted!',
        description: user 
          ? 'Your submission is pending review. You\'ll earn points once approved!'
          : 'Thanks for contributing! Create an account to earn points.',
      });

      return true;
    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting the product. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContributionLevel = async (): Promise<ContributionLevel | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_contribution_levels')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        tier: data.tier as 'guest' | 'logged_in' | 'verified',
        contributionPoints: data.contribution_points,
        totalSubmissions: data.total_submissions,
        approvedSubmissions: data.approved_submissions,
        rejectedSubmissions: data.rejected_submissions,
        accuracyRate: Number(data.accuracy_rate),
      };
    } catch (error) {
      console.error('Error fetching contribution level:', error);
      return null;
    }
  };

  const getUserBadges = async (): Promise<Badge[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          contribution_badges (
            id,
            name,
            description,
            icon
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      if (!data) return [];

      return data.map((item) => ({
        id: (item.contribution_badges as unknown as { id: string }).id,
        name: (item.contribution_badges as unknown as { name: string }).name,
        description: (item.contribution_badges as unknown as { description: string }).description,
        icon: (item.contribution_badges as unknown as { icon: string }).icon,
        earnedAt: item.earned_at,
      }));
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  };

  const getAvailableBadges = async (): Promise<Badge[]> => {
    try {
      const { data, error } = await supabase
        .from('contribution_badges')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (error) throw error;
      if (!data) return [];

      return data.map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
      }));
    } catch (error) {
      console.error('Error fetching available badges:', error);
      return [];
    }
  };

  const getUserSubmissions = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('product_submissions')
        .select('*')
        .eq('submitted_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  };

  return {
    submitProduct,
    getContributionLevel,
    getUserBadges,
    getAvailableBadges,
    getUserSubmissions,
    isSubmitting,
    isLoggedIn: !!user,
    userTier: user ? 'logged_in' : 'guest',
  };
}
