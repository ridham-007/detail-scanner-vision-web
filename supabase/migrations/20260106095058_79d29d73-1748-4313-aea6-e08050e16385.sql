-- Create product_classifications table with generated hash for fast grouping
CREATE TABLE public.product_classifications (
  barcode TEXT PRIMARY KEY REFERENCES public.scanned_products(barcode) ON DELETE CASCADE,
  l1_category TEXT,
  l2_category TEXT,
  l3_category TEXT,
  l4_tags TEXT[],
  l5_tags TEXT[],
  attributes JSONB DEFAULT '{}'::jsonb,
  confidence TEXT DEFAULT 'low',
  classification_hash TEXT GENERATED ALWAYS AS (
    MD5(COALESCE(l1_category, '') || '|' || COALESCE(l2_category, '') || '|' || COALESCE(l3_category, ''))
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast alternative lookups (main query pattern)
CREATE INDEX idx_product_classifications_hash ON public.product_classifications(classification_hash);

-- Index for filtering by category levels
CREATE INDEX idx_product_classifications_l1 ON public.product_classifications(l1_category);
CREATE INDEX idx_product_classifications_l2 ON public.product_classifications(l2_category);
CREATE INDEX idx_product_classifications_l3 ON public.product_classifications(l3_category);

-- Index for confidence filtering
CREATE INDEX idx_product_classifications_confidence ON public.product_classifications(confidence);

-- Enable RLS
ALTER TABLE public.product_classifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access for ML pipeline)
CREATE POLICY "Anyone can view classifications"
ON public.product_classifications FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert classifications"
ON public.product_classifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update classifications"
ON public.product_classifications FOR UPDATE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_product_classifications_updated_at
BEFORE UPDATE ON public.product_classifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add composite index on scanned_products for faster join
CREATE INDEX idx_scanned_products_barcode_health ON public.scanned_products(barcode, health_score DESC);