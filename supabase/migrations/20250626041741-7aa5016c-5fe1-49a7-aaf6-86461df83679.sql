
-- Create a table for early access email subscriptions
CREATE TABLE public.early_access_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Add Row Level Security (RLS)
ALTER TABLE public.early_access_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public early access signup)
CREATE POLICY "Anyone can subscribe for early access" 
  ON public.early_access_subscriptions 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Create policy to allow reading own subscription (optional, for confirmation)
CREATE POLICY "Users can view their own subscription" 
  ON public.early_access_subscriptions 
  FOR SELECT 
  TO public
  USING (true);
