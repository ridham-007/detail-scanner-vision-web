-- Add description column to scanned_products table
ALTER TABLE public.scanned_products 
ADD COLUMN description TEXT NULL;