-- Create dietary_rules table
CREATE TABLE IF NOT EXISTS public.dietary_rules (
  code text PRIMARY KEY,
  disallowed_allergens text[] DEFAULT '{}',
  disallowed_ingredients text[] DEFAULT '{}',
  disallowed_additives text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dietary_rules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read dietary rules
CREATE POLICY "Anyone can read dietary rules"
ON public.dietary_rules
FOR SELECT
USING (true);

-- Only admins can manage dietary rules
CREATE POLICY "Only admins can manage dietary rules"
ON public.dietary_rules
FOR ALL
USING (is_admin_user() = true);

-- Insert dietary rules data
INSERT INTO public.dietary_rules (code, disallowed_allergens, disallowed_ingredients, disallowed_additives) VALUES
('vegan', array['milk','eggs','fish','shellfish','molluscs','peanuts','tree_nuts'], array['meat','beef','pork','chicken','fish','gelatin','lard','honey','butter','cheese','milk','cream','whey','casein'], array['gelatine']),
('vegetarian', array['fish','shellfish','molluscs'], array['meat','beef','pork','chicken','fish','gelatin','lard'], array['gelatine']),
('halal', array[]::text[], array['pork','lard','alcohol','wine','beer'], array['alcohol']),
('kosher', array['shellfish','molluscs'], array['pork','shellfish','molluscs','meat_and_dairy'], array[]::text[]),
('gluten_free', array['gluten'], array['wheat','barley','rye','spelt'], array[]::text[]),
('lactose_free', array['milk'], array['milk','cream','butter','cheese','whey','lactose'], array[]::text[]),
('dairy_free', array['milk'], array['milk','cream','butter','cheese','yogurt','whey','casein','lactose'], array[]::text[]),
('nut_free', array['peanuts','tree_nuts'], array['almonds','cashews','walnuts','hazelnuts','pistachios','pecans'], array[]::text[])
ON CONFLICT (code) DO NOTHING;