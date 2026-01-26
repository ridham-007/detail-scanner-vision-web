"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import { Search, Package } from 'lucide-react';

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-with-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          sort_order,
          subcategories (
            id,
            name,
            slug,
            description,
            product_categories (
              product_barcode
            )
          )
        `)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data;
    }
  });

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories?.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <SEOHead
        title="Product Categories | EaterIQ"
        description="Browse product categories and find items organized by type, nutrition profile, and meal context."
        canonicalUrl="https://www.eateriq.com/categories/"
      />
      
      <div className="min-h-screen dark:bg-[#1E2836]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Product Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover products organized by type, nutrition profile, and meal context to make informed choices.
            </p>
          </div>

          <div className="relative mb-8 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories?.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <Badge variant="outline" className="ml-2">
                        {category.subcategories?.length || 0} types
                      </Badge>
                    </CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.subcategories?.map((subcategory) => {
                        const productCount = subcategory.product_categories?.length || 0;
                        return (
                          <div 
                            key={subcategory.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {subcategory.name}
                              </div>
                              {subcategory.description && (
                                <div className="text-xs text-muted-foreground">
                                  {subcategory.description}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Package className="h-3 w-3" />
                              {productCount}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredCategories && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No categories found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or browse all available categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;