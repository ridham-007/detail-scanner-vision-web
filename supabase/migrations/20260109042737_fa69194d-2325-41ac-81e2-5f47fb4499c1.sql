-- Create additives table
CREATE TABLE public.additives (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  purpose TEXT,
  impact TEXT CHECK (impact IN ('positive','neutral','negative')),
  severity TEXT CHECK (severity IN ('none','low','moderate','high')),
  rating TEXT,
  health_concern TEXT,
  concerns JSONB,
  source TEXT,
  origin TEXT,
  acceptable_daily_intake TEXT,
  banned_in TEXT[],
  requires_warning_in TEXT[],
  warning_text TEXT,
  vegan TEXT,
  vegetarian TEXT,
  halal TEXT,
  kosher TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create unknown_additives table
CREATE TABLE public.unknown_additives (
  code TEXT PRIMARY KEY,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  count INTEGER DEFAULT 1
);

-- Enable RLS
ALTER TABLE public.additives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unknown_additives ENABLE ROW LEVEL SECURITY;

-- RLS policies for additives (read-only for everyone)
CREATE POLICY "Anyone can read additives"
ON public.additives FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage additives"
ON public.additives FOR ALL
USING (is_admin_user() = true);

-- RLS policies for unknown_additives
CREATE POLICY "Anyone can read unknown additives"
ON public.unknown_additives FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert unknown additives"
ON public.unknown_additives FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update unknown additives"
ON public.unknown_additives FOR UPDATE
USING (true);

-- Create log_unknown_additive RPC function (similar to increment_ingredient_tokens)
CREATE OR REPLACE FUNCTION public.log_unknown_additive(codes text[])
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO unknown_additives (code, count)
  SELECT unnest(codes), 1
  ON CONFLICT (code)
  DO UPDATE
    SET count = unknown_additives.count + 1,
        last_seen = now();
$$;