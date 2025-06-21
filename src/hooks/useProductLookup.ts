
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductData {
  barcode: string;
  name: string;
  health_score: number;
  unit: string;
  nutrition_per_100g: {
    calories_kcal: number | null;
    total_fat_g: number | null;
    saturated_fat_g: number | null;
    trans_fat_g: number | null;
    cholesterol_mg: number | null;
    carbohydrates_g: number | null;
    sugar_g: number | null;
    fiber_g: number | null;
    protein_g: number | null;
    salt_mg: number | null;
    vitamin_a_iu: number | null;
    vitamin_c_mg: number | null;
    calcium_mg: number | null;
    iron_mg: number | null;
    potassium_mg: number | null;
    magnesium_mg: number | null;
    zinc_mg: number | null;
    allergens: string[];
    additives: string[];
  };
  positives: string[];
  concerns: string[];
  recommendations: string[];
  images: string[];
}

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchFromSupabase = async (barcode: string): Promise<ProductData | null> => {
    try {
      const { data, error } = await supabase
        .from('scanned_products')
        .select('*')
        .eq('barcode', barcode)
        .single();

      if (error || !data) {
        return null;
      }

      // Safely cast and validate the nutrition data
      const nutritionData = data.nutrition_per_100g as any;
      const defaultNutrition = {
        calories_kcal: null,
        total_fat_g: null,
        saturated_fat_g: null,
        trans_fat_g: null,
        cholesterol_mg: null,
        carbohydrates_g: null,
        sugar_g: null,
        fiber_g: null,
        protein_g: null,
        salt_mg: null,
        vitamin_a_iu: null,
        vitamin_c_mg: null,
        calcium_mg: null,
        iron_mg: null,
        potassium_mg: null,
        magnesium_mg: null,
        zinc_mg: null,
        allergens: [],
        additives: []
      };

      return {
        barcode: data.barcode,
        name: data.name,
        health_score: data.health_score || 0,
        unit: data.unit || '',
        nutrition_per_100g: nutritionData && typeof nutritionData === 'object' ? { ...defaultNutrition, ...nutritionData } : defaultNutrition,
        positives: data.positives || [],
        concerns: data.concerns || [],
        recommendations: data.recommendations || [],
        images: data.images || []
      };
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      return null;
    }
  };

  const saveToSupabase = async (productData: ProductData): Promise<void> => {
    try {
      const { error } = await supabase
        .from('scanned_products')
        .upsert({
          barcode: productData.barcode,
          name: productData.name,
          health_score: productData.health_score,
          unit: productData.unit,
          nutrition_per_100g: productData.nutrition_per_100g,
          positives: productData.positives,
          concerns: productData.concerns,
          recommendations: productData.recommendations,
          images: productData.images,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
      } else {
        console.log('Product data cached successfully');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  const fetchFromAPI = async (barcode: string): Promise<ProductData | null> => {
    try {
      const response = await fetch(`https://barcode-scanner-webn.onrender.com/api/product/${barcode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.success && data.data) {
          const productData = data.data;
          
          const product: ProductData = {
            barcode: productData.barcode,
            name: productData.product,
            health_score: productData.health_score,
            unit: productData.unit,
            nutrition_per_100g: productData.nutrition_per_100g,
            positives: productData.positives || [],
            concerns: productData.concerns || [],
            recommendations: productData.recommendations || [],
            images: productData.images || []
          };

          // Save to Supabase for future use
          await saveToSupabase(product);
          
          return product;
        }
      }
      return null;
    } catch (error) {
      console.error('API lookup error:', error);
      return null;
    }
  };

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);
    console.log('Looking up product with barcode:', barcode);

    try {
      // First, try to fetch from Supabase cache
      console.log('Checking Supabase cache...');
      const cachedProduct = await fetchFromSupabase(barcode);
      
      if (cachedProduct) {
        console.log('Found product in cache');
        toast({
          title: "Product Found (Cached)!",
          description: `Found ${cachedProduct.name}`,
        });
        return cachedProduct;
      }

      // If not found in cache, fetch from external API
      console.log('Product not in cache, fetching from API...');
      const apiProduct = await fetchFromAPI(barcode);
      
      if (apiProduct) {
        toast({
          title: "Product Found!",
          description: `Found ${apiProduct.name}`,
        });
        return apiProduct;
      }

      toast({
        title: "Product Not Found",
        description: "This product is not available in our database.",
        variant: "destructive",
      });
      
      return null;

    } catch (error) {
      console.error('Product lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "Unable to fetch product details. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { lookupProduct, isLoading };
};
