import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductData } from "@/types/ProductData";
import { useAuth } from "@/contexts/AuthContext";

type LookupMode = "scan" | "view";

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFromSupabase = async (
    barcode: string
  ): Promise<ProductData | null> => {
    try {
      const { data, error } = await supabase
        .from("scanned_products")
        .select("*")
        .eq("barcode", barcode)
        .eq("is_published", true)
        .maybeSingle();

      if (error || !data) return null;
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
        additives: [],
      };

      const rawData = data as any;

      return {
        barcode: data.barcode,
        name: data.name,
        description: data.description || undefined,
        health_score: data.health_score || 0,
        unit: data.unit || "",
        nutrition_per_100g:
          nutritionData && typeof nutritionData === "object"
            ? { ...defaultNutrition, ...nutritionData }
            : defaultNutrition,
        positives: data.positives || [],
        concerns: data.concerns || [],
        recommendations: data.recommendations || [],
        images: data.images || [],
        ingredients: data.ingredients || "",
        other_good_product_suggestions:
          rawData.other_good_product_suggestions || [],
        retailers: rawData.retailers || [],
        is_health_related_product:
          rawData.is_health_related_product !== false,
        nutrition_score_grade: rawData.nutrition_score_grade || undefined,
        allergens_analysis: rawData.allergens_analysis || [],
        additive_analysis: rawData.additive_analysis || [],
        ingredient_analysis: rawData.ingredient_analysis || [],
        nutrition_data: rawData.nutrition_data || [],
      };
    } catch {
      return null;
    }
  };

  const fetchFromAPI = async (
    barcode: string
  ): Promise<ProductData | null> => {
    try {
      const response = await fetch(
        `https://barcode-scanner-webn.onrender.com/api/product/${barcode}`,
        { headers: { Accept: "application/json" } }
      );

      if (!response.ok) return null;

      const json = await response.json();
      if (!json?.success || !json?.data) return null;

      const p = json.data;

      return {
        barcode: p.barcode,
        name: p.product,
        description: p.description,
        health_score: p.health_score || 0,
        unit: p.unit || "",
        nutrition_per_100g: p.nutrition_per_100g || {},
        positives: p.positives || [],
        concerns: p.concerns || [],
        recommendations: p.recommendations || [],
        images: p.images || [],
        ingredients: p.ingredients || "",
        other_good_product_suggestions:
          p.other_good_product_suggestions || [],
        retailers: p.retailers || [],
        is_health_related_product: p.is_health_related_product !== false,
        nutrition_score_grade: p.nutrition_score_grade,
        allergens_analysis: p.allergens_analysis || [],
        additive_analysis: p.additive_analysis || [],
        ingredient_analysis: p.ingredient_analysis || [],
        nutrition_data: p.nutrition_data || [],
        subcategories: p.subcategories || [],
      };
    } catch {
      return null;
    }
  };

  /* ---------------------------------------------
     Save Scan History (Scan Mode Only)
  --------------------------------------------- */
  const saveScanHistory = async (product: ProductData) => {
    if (!user) return;

    try {
      await supabase.from("scan_history").insert({
        user_id: user.id,
        barcode: product.barcode,
        product_name: product.name,
        health_score: product.health_score,
        scanned_at: new Date().toISOString(),
      });
    } catch {
      // silent
    }
  };

  /* ---------------------------------------------
     Save Unpublished Barcode
  --------------------------------------------- */
  const saveUnpublishedBarcode = async (barcode: string) => {
    try {
      await supabase.from("scanned_products").upsert({
        barcode,
        name: `Unknown Product - ${barcode}`,
        is_published: false,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // silent
    }
  };

  /* ---------------------------------------------
     MAIN LOOKUP FUNCTION
  --------------------------------------------- */
  const lookupProduct = async (
    barcode: string,
    options: { mode?: LookupMode } = {}
  ): Promise<ProductData | null> => {
    const mode = options.mode ?? "scan";
    setIsLoading(true);

    try {
      // 1️⃣ Supabase cache
      const cached = await fetchFromSupabase(barcode);
      if (cached) {
        if (mode === "scan") {
          await saveScanHistory(cached);
          toast({
            title: "Product Found",
            description: `Found ${cached.name}`,
          });
        }
        return cached;
      }

      // 2️⃣ External API
      const apiProduct = await fetchFromAPI(barcode);
      if (apiProduct) {
        if (mode === "scan") {
          await saveScanHistory(apiProduct);
          toast({
            title: "Product Found",
            description: `Found ${apiProduct.name}`,
          });
        }
        return apiProduct;
      }

      // 3️⃣ Not found
      if (mode === "scan") {
        await saveUnpublishedBarcode(barcode);
        toast({
          title: "Product Not Found",
          description:
            "This product is not available yet. We've noted your request.",
          variant: "destructive",
        });
      }

      return null;
    } catch (err) {
      console.error("Lookup error:", err);

      if (mode === "scan") {
        toast({
          title: "Lookup Error",
          description: "Unable to fetch product details.",
          variant: "destructive",
        });
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { lookupProduct, isLoading };
};
