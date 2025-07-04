
-- Add ingredients column to the scanned_products table
ALTER TABLE public.scanned_products 
ADD COLUMN ingredients TEXT;
