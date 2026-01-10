-- Create ingredient_master table
CREATE TABLE IF NOT EXISTS public.ingredient_master (
  id text PRIMARY KEY,
  canonical_name text NOT NULL,
  ingredient_domain text NOT NULL,
  nova_role text,
  taxonomy_path text[] NOT NULL,
  parent_ids text[],
  vegan boolean,
  vegetarian boolean,
  from_palm_oil text,
  allergens text[],
  additive_classes text[],
  created_at timestamptz DEFAULT now()
);

-- Create ingredient_aliases table
CREATE TABLE IF NOT EXISTS public.ingredient_aliases (
  id bigserial PRIMARY KEY,
  ingredient_id text REFERENCES public.ingredient_master(id) ON DELETE CASCADE,
  alias text NOT NULL,
  normalized_alias text NOT NULL,
  language text,
  source text DEFAULT 'openfoodfacts',
  confidence float DEFAULT 1.0
);

-- Enable pg_trgm extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram index for fast fuzzy search
CREATE INDEX IF NOT EXISTS idx_ing_alias_trgm
ON public.ingredient_aliases
USING gin (normalized_alias gin_trgm_ops);

-- Enable RLS
ALTER TABLE public.ingredient_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_aliases ENABLE ROW LEVEL SECURITY;

-- Full anon access for ingredient_master
CREATE POLICY "Anyone can read ingredient_master"
ON public.ingredient_master FOR SELECT USING (true);

CREATE POLICY "Anyone can insert ingredient_master"
ON public.ingredient_master FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update ingredient_master"
ON public.ingredient_master FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete ingredient_master"
ON public.ingredient_master FOR DELETE USING (true);

-- Full anon access for ingredient_aliases
CREATE POLICY "Anyone can read ingredient_aliases"
ON public.ingredient_aliases FOR SELECT USING (true);

CREATE POLICY "Anyone can insert ingredient_aliases"
ON public.ingredient_aliases FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update ingredient_aliases"
ON public.ingredient_aliases FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete ingredient_aliases"
ON public.ingredient_aliases FOR DELETE USING (true);