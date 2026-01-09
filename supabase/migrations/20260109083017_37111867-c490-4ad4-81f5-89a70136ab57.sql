-- Create allergens table
CREATE TABLE IF NOT EXISTS public.allergens (
  code text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('major', 'minor')),
  severity text NOT NULL CHECK (severity IN ('high', 'moderate')),
  regulatory_sources text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on allergens
ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;

-- Anyone can read allergens
CREATE POLICY "Anyone can read allergens"
ON public.allergens FOR SELECT
USING (true);

-- Anyone can insert allergens
CREATE POLICY "Anyone can insert allergens"
ON public.allergens FOR INSERT
WITH CHECK (true);

-- Anyone can delete allergens
CREATE POLICY "Anyone can delete allergens"
ON public.allergens FOR DELETE
USING (true);

-- Service role can manage allergens
CREATE POLICY "Service role can manage allergens"
ON public.allergens FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create unknown_allergens table for logging
CREATE TABLE IF NOT EXISTS public.unknown_allergens (
  code text PRIMARY KEY,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  count integer DEFAULT 1
);

-- Enable RLS on unknown_allergens
ALTER TABLE public.unknown_allergens ENABLE ROW LEVEL SECURITY;

-- Anyone can read unknown_allergens
CREATE POLICY "Anyone can read unknown_allergens"
ON public.unknown_allergens FOR SELECT
USING (true);

-- Anyone can insert unknown_allergens
CREATE POLICY "Anyone can insert unknown_allergens"
ON public.unknown_allergens FOR INSERT
WITH CHECK (true);

-- Anyone can update unknown_allergens
CREATE POLICY "Anyone can update unknown_allergens"
ON public.unknown_allergens FOR UPDATE
USING (true);

-- Create RPC function for logging unknown allergens
CREATE OR REPLACE FUNCTION public.log_unknown_allergen(codes text[])
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  INSERT INTO unknown_allergens (code, count)
  SELECT unnest(codes), 1
  ON CONFLICT (code)
  DO UPDATE
    SET count = unknown_allergens.count + 1,
        last_seen = now();
$$;