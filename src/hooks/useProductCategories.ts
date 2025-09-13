import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProductCategories = (barcode?: string) => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          subcategories (
            id,
            name,
            slug,
            code
          )
        `)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data;
    }
  });

  const productCategoriesQuery = useQuery({
    queryKey: ['product-categories', barcode],
    queryFn: async () => {
      if (!barcode) return [];
      
      const { data, error } = await supabase
        .from('product_categories')
        .select(`
          confidence_score,
          assigned_by,
          subcategories (
            name,
            slug,
            code,
            categories (
              name,
              slug
            )
          )
        `)
        .eq('product_barcode', barcode);

      if (error) throw error;
      return data;
    },
    enabled: !!barcode
  });

  const assignCategoryMutation = useMutation({
    mutationFn: async ({ 
      productBarcode, 
      subcategoryId, 
      confidenceScore = 1.0 
    }: { 
      productBarcode: string;
      subcategoryId: string;
      confidenceScore?: number;
    }) => {
      const { error } = await supabase
        .from('product_categories')
        .upsert({
          product_barcode: productBarcode,
          subcategory_id: subcategoryId,
          confidence_score: confidenceScore,
          assigned_by: 'user'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      toast.success('Category assigned successfully');
    },
    onError: (error) => {
      console.error('Error assigning category:', error);
      toast.error('Failed to assign category');
    }
  });

  const removeCategoryMutation = useMutation({
    mutationFn: async ({ 
      productBarcode, 
      subcategoryId 
    }: { 
      productBarcode: string;
      subcategoryId: string;
    }) => {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('product_barcode', productBarcode)
        .eq('subcategory_id', subcategoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      toast.success('Category removed successfully');
    },
    onError: (error) => {
      console.error('Error removing category:', error);
      toast.error('Failed to remove category');
    }
  });

  return {
    categories: categoriesQuery.data,
    productCategories: productCategoriesQuery.data,
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingProductCategories: productCategoriesQuery.isLoading,
    assignCategory: assignCategoryMutation.mutate,
    removeCategory: removeCategoryMutation.mutate,
    isAssigning: assignCategoryMutation.isPending,
    isRemoving: removeCategoryMutation.isPending
  };
};