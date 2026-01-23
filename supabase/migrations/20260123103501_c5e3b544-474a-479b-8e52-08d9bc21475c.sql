-- Add slug column to quizzes table
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON public.quizzes(slug);

-- Update existing quizzes with auto-generated slugs based on title
UPDATE public.quizzes 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING(id::text, 1, 8)
WHERE slug IS NULL;