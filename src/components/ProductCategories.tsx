import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProductCategoriesProps {
  barcode: string;
  className?: string;
}

const ProductCategories = ({ barcode, className }: ProductCategoriesProps) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['product-categories', barcode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select(`
          confidence_score,
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
    }
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No categories assigned yet</p>
        </CardContent>
      </Card>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Product Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={getConfidenceColor(category.confidence_score || 0)}
                >
                  {category.subcategories?.categories?.name}
                </Badge>
                <Badge variant="secondary">
                  {category.subcategories?.name}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round((category.confidence_score || 0) * 100)}% confidence
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCategories;