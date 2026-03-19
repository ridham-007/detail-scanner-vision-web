"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import { Search, Package } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

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

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Categories' }]} />
          <div className="mb-8 pt-4 pb-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2 text-sm font-semibold text-primary mb-5">
              <span>Explore by Category</span>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-[1.02] tracking-tight text-foreground">
              Product{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Categories
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Discover products organized by type, nutrition profile, and meal context to make informed choices.
            </p>
          </div>

          <div className="relative mx-auto mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full border-white/70 bg-white/90 pl-10 shadow-[var(--shadow-soft)]"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse rounded-[28px] border-white/70 bg-white/88 shadow-product">
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
                <Card key={category.id} className="rounded-[28px] border-white/70 bg-white/88 transition-shadow hover:shadow-[var(--shadow-warm)]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <Badge variant="outline" className="ml-2 rounded-full border-orange-200/80 bg-orange-50 text-orange-800">
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
                            className="flex items-center justify-between rounded-[20px] border border-orange-100/60 bg-orange-50/40 p-3 transition-colors hover:bg-orange-50/80"
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
              <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
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
