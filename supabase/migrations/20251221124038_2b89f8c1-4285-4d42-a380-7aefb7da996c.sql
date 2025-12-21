-- Add new columns to scanned_products table for enhanced product analysis
ALTER TABLE public.scanned_products
ADD COLUMN IF NOT EXISTS nutrition_score_grade text,
ADD COLUMN IF NOT EXISTS allergens_analysis jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS additive_analysis jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ingredient_analysis jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS nutrition_data jsonb DEFAULT '[]'::jsonb;