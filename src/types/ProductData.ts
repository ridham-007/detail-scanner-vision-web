
export interface ProductSuggestion {
  name: string;
  brand: string;
  why_better: string;
  barcode: string;
}

export interface AllergenAnalysis {
  allergen: string;
  severity_score: number;
  impact: 'positive' | 'negative' | 'neutral';
  short_reason: string;
}

export interface AdditiveAnalysis {
  code: string;
  name: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  short_reason: string;
}

export interface IngredientAnalysis {
  ingredient: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  short_reason: string;
}

export interface NutritionDataItem {
  key: string;
  nutrient: string;
  value: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  short_reason: string;
}

export interface SubcategoryMapping {
  code: string;
  confidence: number;
}

export interface ProductData {
  barcode: string;
  name: string;
  description?: string;
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
  ingredients: string;
  other_good_product_suggestions: ProductSuggestion[];
  retailers: Array<{
    name: string;
    link: string;
  }>;
  is_health_related_product: boolean;
  // New fields from enhanced API
  nutrition_score_grade?: string;
  allergens_analysis?: AllergenAnalysis[];
  additive_analysis?: AdditiveAnalysis[];
  ingredient_analysis?: IngredientAnalysis[];
  nutrition_data?: NutritionDataItem[];
  subcategories?: SubcategoryMapping[];
}
