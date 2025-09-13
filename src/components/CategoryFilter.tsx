import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  className?: string;
}

const CategoryFilter = ({ selectedCategories, onCategoryChange, className }: CategoryFilterProps) => {
  const { data: categories } = useQuery({
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
            slug
          )
        `)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data;
    }
  });

  const handleCategorySelect = (categorySlug: string) => {
    if (!selectedCategories.includes(categorySlug)) {
      onCategoryChange([...selectedCategories, categorySlug]);
    }
  };

  const handleCategoryRemove = (categorySlug: string) => {
    onCategoryChange(selectedCategories.filter(cat => cat !== categorySlug));
  };

  const getCategoryName = (slug: string) => {
    for (const category of categories || []) {
      if (category.slug === slug) return category.name;
      for (const subcategory of category.subcategories || []) {
        if (subcategory.slug === slug) return `${category.name} > ${subcategory.name}`;
      }
    }
    return slug;
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        <Select onValueChange={handleCategorySelect}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category..." />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <div key={category.id}>
                <SelectItem value={category.slug} className="font-medium">
                  {category.name}
                </SelectItem>
                {category.subcategories?.map((subcategory) => (
                  <SelectItem 
                    key={subcategory.id} 
                    value={subcategory.slug}
                    className="pl-6 text-sm"
                  >
                    {subcategory.name}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>

        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categorySlug) => (
              <Badge key={categorySlug} variant="secondary" className="flex items-center gap-1">
                {getCategoryName(categorySlug)}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleCategoryRemove(categorySlug)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;