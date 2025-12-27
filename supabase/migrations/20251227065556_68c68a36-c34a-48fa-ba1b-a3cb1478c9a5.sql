-- Add unique constraint on scanned_products.barcode (required for FK reference)
ALTER TABLE public.scanned_products 
ADD CONSTRAINT scanned_products_barcode_unique UNIQUE (barcode);

-- Add foreign key from product_categories to scanned_products
ALTER TABLE public.product_categories 
ADD CONSTRAINT product_categories_product_barcode_fkey 
FOREIGN KEY (product_barcode) 
REFERENCES public.scanned_products(barcode) 
ON DELETE CASCADE;