
-- Add a published status column to track product availability
ALTER TABLE public.scanned_products 
ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT true;

-- Create an index on the published status for faster queries
CREATE INDEX idx_scanned_products_published ON public.scanned_products(is_published);

-- Update the existing policy to only show published products
DROP POLICY IF EXISTS "Anyone can view cached products" ON public.scanned_products;

CREATE POLICY "Anyone can view published products" ON public.scanned_products
    FOR SELECT USING (is_published = true);

-- Keep the insert and update policies as they are for caching functionality
