-- Create favorites table for user favorite products
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  barcode TEXT NOT NULL,
  product_name TEXT NOT NULL,
  health_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, barcode)
);

-- Create shopping_lists table for list metadata
CREATE TABLE public.shopping_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shopping_list_items table for items in lists
CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID NOT NULL,
  barcode TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_purchased BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
ON public.favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists" 
ON public.shopping_lists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shopping lists" 
ON public.shopping_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists" 
ON public.shopping_lists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists" 
ON public.shopping_lists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for shopping_list_items
CREATE POLICY "Users can view items in their shopping lists" 
ON public.shopping_list_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.shopping_lists 
  WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
  AND shopping_lists.user_id = auth.uid()
));

CREATE POLICY "Users can create items in their shopping lists" 
ON public.shopping_list_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.shopping_lists 
  WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
  AND shopping_lists.user_id = auth.uid()
));

CREATE POLICY "Users can update items in their shopping lists" 
ON public.shopping_list_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.shopping_lists 
  WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
  AND shopping_lists.user_id = auth.uid()
));

CREATE POLICY "Users can delete items in their shopping lists" 
ON public.shopping_list_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.shopping_lists 
  WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
  AND shopping_lists.user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_barcode ON public.favorites(barcode);
CREATE INDEX idx_shopping_lists_user_id ON public.shopping_lists(user_id);
CREATE INDEX idx_shopping_list_items_list_id ON public.shopping_list_items(shopping_list_id);

-- Add foreign key constraint
ALTER TABLE public.shopping_list_items 
ADD CONSTRAINT fk_shopping_list_items_list_id 
FOREIGN KEY (shopping_list_id) REFERENCES public.shopping_lists(id) ON DELETE CASCADE;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_shopping_lists_updated_at
BEFORE UPDATE ON public.shopping_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_list_items_updated_at
BEFORE UPDATE ON public.shopping_list_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();