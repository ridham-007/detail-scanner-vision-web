
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductData } from '@/types/ProductData';
import { useAuth } from '@/contexts/AuthContext';

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFromSupabase = async (barcode: string): Promise<ProductData | null> => {
    try {
      const { data, error } = await supabase
        .from('scanned_products')
        .select('*')
        .eq('barcode', barcode)
        .eq('is_published', true)
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
        polyunsaturated_fat_g: null,
        monounsaturated_fat_g: null,
        cholesterol_mg: null,
        carbohydrates_g: null,
        sugar_g: null,
        sugar_alcohols_g: null,
        fiber_g: null,
        soluble_fibre_g: null,
        insoluble_fibre_g: null,
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

      // Safely access the new fields with fallbacks
      const rawData = data as any;
      const productSuggestions = rawData.other_good_product_suggestions || [];
      const isHealthRelated = rawData.is_health_related_product !== false; // Default to true if not specified

      return {
        barcode: data.barcode,
        name: data.name,
        health_score: data.health_score || 0,
        unit: data.unit || '',
        nutrition_per_100g: nutritionData && typeof nutritionData === 'object' ? { ...defaultNutrition, ...nutritionData } : defaultNutrition,
        positives: data.positives || [],
        concerns: data.concerns || [],
        recommendations: data.recommendations || [],
        images: data.images || [],
        ingredients: data.ingredients || '',
        other_good_product_suggestions: productSuggestions,
        retailers: rawData.retailers || [],
        is_health_related_product: isHealthRelated
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
          ingredients: productData.ingredients,
          other_good_product_suggestions: productData.other_good_product_suggestions as any,
          is_health_related_product: productData.is_health_related_product,
          is_published: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  const saveUnpublishedBarcode = async (barcode: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('scanned_products')
        .upsert({
          barcode: barcode,
          name: `Unknown Product - ${barcode}`,
          health_score: 0,
          unit: '',
          nutrition_per_100g: {},
          positives: [],
          concerns: [],
          recommendations: [],
          images: [],
          ingredients: '',
          other_good_product_suggestions: [] as any,
          is_health_related_product: true,
          is_published: false,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving unpublished barcode:', error);
      } else {
        console.log('Unpublished barcode tracked successfully');
      }
    } catch (error) {
      console.error('Error saving unpublished barcode:', error);
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
            health_score: productData.health_score || 0,
            unit: productData.unit || '',
            nutrition_per_100g: productData.nutrition_per_100g || {},
            positives: productData.positives || [],
            concerns: productData.concerns || [],
            recommendations: productData.recommendations || [],
            images: productData.images || [],
            ingredients: productData.ingredients || '',
            other_good_product_suggestions: productData.other_good_product_suggestions || [],
            retailers: productData.retailers || [],
            is_health_related_product: productData.is_health_related_product !== false
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

  const saveScanHistory = async (productData: ProductData): Promise<void> => {
    if (!user) return; // Only save for authenticated users
    
    try {
      const { error } = await supabase
        .from('scan_history')
        .insert({
          user_id: user.id,
          barcode: productData.barcode,
          product_name: productData.name,
          health_score: productData.health_score,
          scanned_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving scan history:', error);
      }
    } catch (error) {
      console.error('Error saving scan history:', error);
    }
  };

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);

    try {
      // First, try to fetch from Supabase cache (published only)
      console.log('Checking Supabase cache...');
      const cachedProduct = await fetchFromSupabase(barcode);
      
      if (cachedProduct) {
        console.log('Found product in cache');
        // Save to scan history
        await saveScanHistory(cachedProduct);
        toast({
          title: "Product Found",
          description: `Found ${cachedProduct.name}`,
        });
        return cachedProduct;
      }

      // If not found in cache, fetch from external API
      console.log('Product not in cache, fetching from API...');
      const apiProduct = await fetchFromAPI(barcode);
      
      if (apiProduct) {
        // Save to scan history
        await saveScanHistory(apiProduct);
        toast({
          title: "Product Found!",
          description: `Found ${apiProduct.name}`,
        });
        return apiProduct;
      }

      // If no data found anywhere, save as unpublished for tracking
      console.log('No product data found, saving as unpublished...');
      await saveUnpublishedBarcode(barcode);

      toast({
        title: "Product Not Found",
        description: "This product is not available in our database. We've noted your request!",
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
