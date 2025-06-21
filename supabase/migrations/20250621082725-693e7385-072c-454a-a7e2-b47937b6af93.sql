
-- Create a table to store scanned product data
CREATE TABLE public.scanned_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  health_score INTEGER,
  unit TEXT,
  nutrition_per_100g JSONB,
  positives TEXT[],
  concerns TEXT[],
  recommendations TEXT[],
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.scanned_products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read cached product data
CREATE POLICY "Anyone can view cached products" ON public.scanned_products
    FOR SELECT USING (true);

-- Create policy to allow anyone to insert new product data
CREATE POLICY "Anyone can cache new products" ON public.scanned_products
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to update existing product data
CREATE POLICY "Anyone can update cached products" ON public.scanned_products
    FOR UPDATE USING (true);

-- Create index on barcode for faster lookups
CREATE INDEX idx_scanned_products_barcode ON public.scanned_products(barcode);
