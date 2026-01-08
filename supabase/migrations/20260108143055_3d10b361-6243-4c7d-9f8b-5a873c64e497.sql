-- Create enum for rule types
CREATE TYPE public.ingredient_rule_type AS ENUM ('exact', 'contains', 'regex');

-- Create ingredient_rules table
CREATE TABLE public.ingredient_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_type ingredient_rule_type NOT NULL,
    pattern text NOT NULL,
    category text NOT NULL,
    confidence float DEFAULT 0.8,
    priority integer DEFAULT 0,
    description text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create ingredient_token_frequency table
CREATE TABLE public.ingredient_token_frequency (
    token text PRIMARY KEY,
    total_count bigint DEFAULT 0,
    first_seen timestamptz DEFAULT now(),
    last_seen timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_ingredient_rules_active ON public.ingredient_rules (active);
CREATE INDEX idx_ingredient_rules_category ON public.ingredient_rules (category);
CREATE INDEX idx_ingredient_rules_priority ON public.ingredient_rules (priority);

-- Enable RLS
ALTER TABLE public.ingredient_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_token_frequency ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for ingredient_rules
CREATE POLICY "Anyone can read ingredient rules"
ON public.ingredient_rules FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert ingredient rules"
ON public.ingredient_rules FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update ingredient rules"
ON public.ingredient_rules FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete ingredient rules"
ON public.ingredient_rules FOR DELETE
USING (true);

-- Public read/write policies for ingredient_token_frequency
CREATE POLICY "Anyone can read token frequency"
ON public.ingredient_token_frequency FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert token frequency"
ON public.ingredient_token_frequency FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update token frequency"
ON public.ingredient_token_frequency FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete token frequency"
ON public.ingredient_token_frequency FOR DELETE
USING (true);

-- Add updated_at trigger for ingredient_rules
CREATE TRIGGER update_ingredient_rules_updated_at
BEFORE UPDATE ON public.ingredient_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data
INSERT INTO public.ingredient_rules (rule_type, pattern, category, confidence) VALUES
('exact', 'sugar', 'added_sugar', 0.95),
('regex', '.*syrup.*', 'sugar_syrup', 0.9),
('contains', 'wheat flour', 'refined_grain', 0.9),
('contains', 'whole wheat', 'whole_grain', 0.9),
('contains', 'palm', 'high_saturated_fat', 0.85),
('contains', 'vegetable oil', 'fat_source', 0.8),
('contains', 'milk', 'dairy', 0.9),
('contains', 'whey', 'dairy', 0.9),
('contains', 'cocoa', 'cocoa_base', 0.85);