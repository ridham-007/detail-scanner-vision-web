
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
        .maybeSingle();

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
      const isHealthRelated = rawData.is_health_related_product !== false;

      return {
        barcode: data.barcode,
        name: data.name,
        description: data.description || undefined,
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
        is_health_related_product: isHealthRelated,
        // New fields
        nutrition_score_grade: rawData.nutrition_score_grade || undefined,
        allergens_analysis: rawData.allergens_analysis || [],
        additive_analysis: rawData.additive_analysis || [],
        ingredient_analysis: rawData.ingredient_analysis || [],
        nutrition_data: rawData.nutrition_data || []
      };
    } catch {
      return null;
    }
  };

  const mapSubcategories = async (barcode: string, subcategories: Array<{ code: string; confidence: number }>): Promise<void> => {
    if (!subcategories || subcategories.length === 0) return;

    try {
      // Fetch subcategory IDs by code
      const codes = subcategories.map(s => s.code);
      const { data: subcategoryData, error: fetchError } = await supabase
        .from('subcategories')
        .select('id, code')
        .in('code', codes);

      if (fetchError || !subcategoryData) {
        return;
      }

      // Create mapping from code to id
      const codeToId = new Map(subcategoryData.map(s => [s.code, s.id]));

      // Prepare product_categories entries
      const categoriesToInsert = subcategories
        .filter(s => codeToId.has(s.code))
        .map(s => ({
          product_barcode: barcode,
          subcategory_id: codeToId.get(s.code)!,
          confidence_score: s.confidence,
          assigned_by: 'system'
        }));

      if (categoriesToInsert.length === 0) return;

      // Delete existing categories for this product
      await supabase
        .from('product_categories')
        .delete()
        .eq('product_barcode', barcode);

      // Insert new categories
      const { error: insertError } = await supabase
        .from('product_categories')
        .insert(categoriesToInsert);

      if (insertError) {
        // Category mapping failed silently
      }
    } catch {
      // Category mapping error, continue silently
    }
  };

  const saveToSupabase = async (productData: ProductData): Promise<void> => {
    try {
      const { error } = await supabase
        .from('scanned_products')
        .upsert(
          {
            barcode: productData.barcode,
            name: productData.name,
            description: productData.description,
            health_score: productData.health_score,
            unit: productData.unit,
            nutrition_per_100g: productData.nutrition_per_100g as any,
            positives: productData.positives,
            concerns: productData.concerns,
            recommendations: productData.recommendations,
            images: productData.images,
            ingredients: productData.ingredients,
            other_good_product_suggestions: productData.other_good_product_suggestions as any,
            is_health_related_product: productData.is_health_related_product,
            is_published: true,
            updated_at: new Date().toISOString(),
            nutrition_score_grade: productData.nutrition_score_grade,
            allergens_analysis: (productData.allergens_analysis || []) as any,
            additive_analysis: (productData.additive_analysis || []) as any,
            ingredient_analysis: (productData.ingredient_analysis || []) as any,
            nutrition_data: (productData.nutrition_data || []) as any
          },
          { onConflict: 'barcode' }
        );

      if (error) {
        // Save to Supabase failed
      }

      // Map subcategories if available
      if (productData.subcategories && productData.subcategories.length > 0) {
        await mapSubcategories(productData.barcode, productData.subcategories);
      }
    } catch {
      // Error saving to Supabase
    }
  };

  const saveUnpublishedBarcode = async (barcode: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('scanned_products')
        .upsert({
          barcode: barcode,
          name: `Unknown Product - ${barcode}`,
          description: null,
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
        // Save failed silently
      }
    } catch {
      // Error saving unpublished barcode
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
        
        if (data.success && data.data) {
          const productData = data.data;
          
          const product: ProductData = {
            barcode: productData.barcode,
            name: productData.product,
            description: productData.description,
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
            is_health_related_product: productData.is_health_related_product !== false,
            // New fields from API
            nutrition_score_grade: productData.nutrition_score_grade,
            allergens_analysis: productData.allergens_analysis || [],
            additive_analysis: productData.additive_analysis || [],
            ingredient_analysis: productData.ingredient_analysis || [],
            nutrition_data: productData.nutrition_data || [],
            subcategories: productData.subcategories || []
          };

          // Save to Supabase for future use
          await saveToSupabase(product);
          
          return product;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const saveScanHistory = async (productData: ProductData): Promise<void> => {
    if (!user) return;
    
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
        // Scan history save failed
      }
    } catch {
      // Error saving scan history
    }
  };

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);

    try {
      const cachedProduct = await fetchFromSupabase(barcode);
      
      if (cachedProduct) {
        await saveScanHistory(cachedProduct);
        toast({
          title: "Product Found",
          description: `Found ${cachedProduct.name}`,
        });
        return cachedProduct;
      }


      const apiProduct = await fetchFromAPI(barcode);
      
      if (apiProduct) {
        await saveScanHistory(apiProduct);
        toast({
          title: "Product Found!",
          description: `Found ${apiProduct.name}`,
        });
        return apiProduct;
      }


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
