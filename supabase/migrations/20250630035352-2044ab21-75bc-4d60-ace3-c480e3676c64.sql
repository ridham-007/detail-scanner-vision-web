
-- Add new columns to store product suggestions and health-related flag
ALTER TABLE public.scanned_products 
ADD COLUMN other_good_product_suggestions JSONB,
ADD COLUMN is_health_related_product BOOLEAN DEFAULT true;

-- Create an index on the health-related flag for faster queries
CREATE INDEX idx_scanned_products_health_related ON public.scanned_products(is_health_related_product);
