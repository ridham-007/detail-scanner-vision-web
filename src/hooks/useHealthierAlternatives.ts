import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AlternativeProduct {
  barcode: string;
  name: string;
  health_score: number;
  images: string[] | null;
}

export const useHealthierAlternatives = (barcode: string | undefined, currentHealthScore: number | null) => {
  return useQuery({
    queryKey: ['healthier-alternatives', barcode],
    queryFn: async (): Promise<AlternativeProduct[]> => {
      if (!barcode || currentHealthScore === null) return [];

      // First, get the classification hash for the current product
      const { data: classification, error: classError } = await supabase
        .from('product_classifications')
        .select('classification_hash')
        .eq('barcode', barcode)
        .single();

      if (classError || !classification?.classification_hash) {
        return [];
      }

      // Find products with the same classification hash but better health score
      const { data: alternatives, error: altError } = await supabase
        .from('product_classifications')
        .select('barcode')
        .eq('classification_hash', classification.classification_hash)
        .neq('barcode', barcode);

      if (altError || !alternatives || alternatives.length === 0) {
        return [];
      }

      // Get product details for alternatives with better health scores
      const alternativeBarcodes = alternatives.map(a => a.barcode);
      
      const { data: products, error: prodError } = await supabase
        .from('scanned_products')
        .select('barcode, name, health_score, images')
        .in('barcode', alternativeBarcodes)
        .gt('health_score', currentHealthScore)
        .order('health_score', { ascending: false })
        .limit(6);

      if (prodError || !products) {
        return [];
      }

      return products as AlternativeProduct[];
    },
    enabled: !!barcode && currentHealthScore !== null,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
