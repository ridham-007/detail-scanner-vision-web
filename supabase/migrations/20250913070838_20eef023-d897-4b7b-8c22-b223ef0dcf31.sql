-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subcategories table
CREATE TABLE public.subcategories (
  id TEXT PRIMARY KEY, -- Using custom IDs like 'FT-1', 'NP-1', etc.
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_categories junction table
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_barcode TEXT NOT NULL,
  subcategory_id TEXT NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  confidence_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_barcode, subcategory_id)
);

-- Add indexes for performance
CREATE INDEX idx_product_categories_barcode ON public.product_categories(product_barcode);
CREATE INDEX idx_product_categories_subcategory ON public.product_categories(subcategory_id);
CREATE INDEX idx_subcategories_category ON public.subcategories(category_id);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for subcategories  
CREATE POLICY "Anyone can view subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage subcategories" ON public.subcategories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for product_categories
CREATE POLICY "Anyone can view product categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert product categories" ON public.product_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product categories" ON public.product_categories FOR UPDATE USING (true);

-- Insert the main categories
INSERT INTO public.categories (id, name, description) VALUES 
('00000000-0000-0000-0000-000000000001', 'Food Type', 'Primary classification of food products by type'),
('00000000-0000-0000-0000-000000000002', 'Nutrition Profile', 'Nutritional characteristics and dietary attributes'),
('00000000-0000-0000-0000-000000000003', 'Meal Context', 'Meal timing and consumption context');

-- Insert Food Type subcategories
INSERT INTO public.subcategories (id, category_id, name) VALUES 
('FT-1', '00000000-0000-0000-0000-000000000001', 'Fruits'),
('FT-2', '00000000-0000-0000-0000-000000000001', 'Vegetables'),
('FT-3', '00000000-0000-0000-0000-000000000001', 'Grains'),
('FT-4', '00000000-0000-0000-0000-000000000001', 'Dairy'),
('FT-5', '00000000-0000-0000-0000-000000000001', 'Meat & Poultry'),
('FT-6', '00000000-0000-0000-0000-000000000001', 'Seafood'),
('FT-7', '00000000-0000-0000-0000-000000000001', 'Snacks'),
('FT-8', '00000000-0000-0000-0000-000000000001', 'Beverages'),
('FT-9', '00000000-0000-0000-0000-000000000001', 'Bakery'),
('FT-10', '00000000-0000-0000-0000-000000000001', 'Frozen Foods'),
('FT-11', '00000000-0000-0000-0000-000000000001', 'Condiments & Sauces');

-- Insert Nutrition Profile subcategories
INSERT INTO public.subcategories (id, category_id, name) VALUES 
('NP-1', '00000000-0000-0000-0000-000000000002', 'High Protein'),
('NP-2', '00000000-0000-0000-0000-000000000002', 'Low Sugar'),
('NP-3', '00000000-0000-0000-0000-000000000002', 'Low Fat'),
('NP-4', '00000000-0000-0000-0000-000000000002', 'High Fiber'),
('NP-5', '00000000-0000-0000-0000-000000000002', 'Gluten Free'),
('NP-6', '00000000-0000-0000-0000-000000000002', 'Organic'),
('NP-7', '00000000-0000-0000-0000-000000000002', 'Vegan'),
('NP-8', '00000000-0000-0000-0000-000000000002', 'Keto Friendly'),
('NP-9', '00000000-0000-0000-0000-000000000002', 'Low Sodium'),
('NP-10', '00000000-0000-0000-0000-000000000002', 'Heart Healthy');

-- Insert Meal Context subcategories
INSERT INTO public.subcategories (id, category_id, name) VALUES 
('MC-1', '00000000-0000-0000-0000-000000000003', 'Breakfast'),
('MC-2', '00000000-0000-0000-0000-000000000003', 'Lunch'),
('MC-3', '00000000-0000-0000-0000-000000000003', 'Dinner'),
('MC-4', '00000000-0000-0000-0000-000000000003', 'Snacks'),
('MC-5', '00000000-0000-0000-0000-000000000003', 'Desserts'),
('MC-6', '00000000-0000-0000-0000-000000000003', 'Beverages'),
('MC-7', '00000000-0000-0000-0000-000000000003', 'On-the-Go');

-- Add update triggers for timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();