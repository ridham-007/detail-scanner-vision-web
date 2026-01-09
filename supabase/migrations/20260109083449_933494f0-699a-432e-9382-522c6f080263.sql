-- Add additional fields to allergens table
ALTER TABLE public.allergens
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS sub_category text,
ADD COLUMN IF NOT EXISTS common_foods text[],
ADD COLUMN IF NOT EXISTS cross_reactivity text[],
ADD COLUMN IF NOT EXISTS symptoms text[],
ADD COLUMN IF NOT EXISTS alternative_names text[],
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();