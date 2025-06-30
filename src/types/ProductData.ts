
export interface ProductSuggestion {
  name: string;
  brand: string;
  why_better: string;
  barcode: string;
}

export interface ProductData {
  barcode: string;
  name: string;
  health_score: number;
  unit: string;
  nutrition_per_100g: {
    calories_kcal: number | null;
    total_fat_g: number | null;
    saturated_fat_g: number | null;
    trans_fat_g: number | null;
    polyunsaturated_fat_g: number | null;
    monounsaturated_fat_g: number | null;
    cholesterol_mg: number | null;
    carbohydrates_g: number | null;
    sugar_g: number | null;
    sugar_alcohols_g: number | null;
    fiber_g: number | null;
    soluble_fibre_g: number | null;
    insoluble_fibre_g: number | null;
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
  other_good_product_suggestions: ProductSuggestion[];
  is_health_related_product: boolean;
}
