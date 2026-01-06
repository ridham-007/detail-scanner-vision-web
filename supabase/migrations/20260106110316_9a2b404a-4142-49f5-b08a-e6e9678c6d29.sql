-- Add country column to scanned_products table
ALTER TABLE public.scanned_products 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add country column to product_classifications table
ALTER TABLE public.product_classifications 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Create composite index for efficient country-scoped alternatives queries
CREATE INDEX IF NOT EXISTS idx_classifications_hash_country 
ON public.product_classifications (classification_hash, country);