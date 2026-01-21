-- Add display_name column to ingredient_master table
ALTER TABLE public.ingredient_master
ADD COLUMN display_name TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN public.ingredient_master.display_name IS 'Human-readable display name for the ingredient';