-- Add retailers column to scanned_products table
ALTER TABLE public.scanned_products 
ADD COLUMN retailers JSONB DEFAULT '[]'::jsonb;