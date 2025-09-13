-- Drop existing tables to recreate with proper structure
DROP TABLE IF EXISTS public.product_categories CASCADE;
DROP TABLE IF EXISTS public.subcategories CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Create categories table with proper structure
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE, -- URL-friendly identifier
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subcategories table with proper UUIDs
CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier  
  code TEXT, -- Optional short code for API/system use
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category_id, slug), -- Unique slug within each category
  UNIQUE(category_id, code) -- Unique code within each category if provided
);

-- Create product_categories junction table
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_barcode TEXT NOT NULL,
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  confidence_score FLOAT DEFAULT 1.0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  assigned_by TEXT DEFAULT 'system', -- 'system', 'ai', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_barcode, subcategory_id)
);

-- Add indexes for performance
CREATE INDEX idx_product_categories_barcode ON public.product_categories(product_barcode);
CREATE INDEX idx_product_categories_subcategory ON public.product_categories(subcategory_id);
CREATE INDEX idx_subcategories_category ON public.subcategories(category_id);
CREATE INDEX idx_subcategories_slug ON public.subcategories(slug);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Anyone can view active categories" ON public.categories 
FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage categories" ON public.categories 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for subcategories  
CREATE POLICY "Anyone can view active subcategories" ON public.subcategories 
FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage subcategories" ON public.subcategories 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for product_categories
CREATE POLICY "Anyone can view product categories" ON public.product_categories 
FOR SELECT USING (true);

CREATE POLICY "Anyone can insert product categories" ON public.product_categories 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update product categories" ON public.product_categories 
FOR UPDATE USING (true);

CREATE POLICY "Only admins can delete product categories" ON public.product_categories 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Insert the main categories with proper slugs
INSERT INTO public.categories (name, slug, description, sort_order) VALUES 
('Food Type', 'food-type', 'Primary classification of food products by type', 1),
('Nutrition Profile', 'nutrition-profile', 'Nutritional characteristics and dietary attributes', 2),
('Meal Context', 'meal-context', 'Meal timing and consumption context', 3);

-- Add update triggers for timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();