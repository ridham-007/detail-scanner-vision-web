
-- Create a table to store user feedback on product information
CREATE TABLE public.product_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barcode TEXT NOT NULL,
  user_id UUID REFERENCES auth.users,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('helpful', 'not_helpful')),
  category TEXT CHECK (category IN ('wrong_product', 'incorrect_nutrition', 'misleading_health_score', 'wrong_image', 'other')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.product_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view feedback (for aggregate stats)
CREATE POLICY "Anyone can view product feedback" 
  ON public.product_feedback 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to submit feedback
CREATE POLICY "Authenticated users can submit feedback" 
  ON public.product_feedback 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create index for better performance
CREATE INDEX idx_product_feedback_barcode ON public.product_feedback(barcode);
CREATE INDEX idx_product_feedback_type ON public.product_feedback(feedback_type);
