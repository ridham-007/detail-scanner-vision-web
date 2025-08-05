import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteItem {
  id: string;
  barcode: string;
  product_name: string;
  health_score: number | null;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id, barcode, product_name, health_score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch favorites',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (barcode: string) => {
    return favorites.some(fav => fav.barcode === barcode);
  };

  const addToFavorites = async (barcode: string, productName: string, healthScore?: number) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add favorites',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          barcode,
          product_name: productName,
          health_score: healthScore
        });

      if (error) throw error;

      toast({
        title: 'Added to Favorites',
        description: `${productName} has been added to your favorites`
      });

      // Refresh favorites
      fetchFavorites();
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: 'Already in Favorites',
          description: 'This product is already in your favorites',
          variant: 'destructive'
        });
      } else {
        console.error('Error adding to favorites:', error);
        toast({
          title: 'Error',
          description: 'Failed to add to favorites',
          variant: 'destructive'
        });
      }
    }
  };

  const removeFromFavorites = async (barcode: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('barcode', barcode);

      if (error) throw error;

      toast({
        title: 'Removed from Favorites',
        description: 'Product removed from your favorites'
      });

      // Update local state
      setFavorites(prev => prev.filter(fav => fav.barcode !== barcode));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  return {
    favorites,
    isLoading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    fetchFavorites
  };
};