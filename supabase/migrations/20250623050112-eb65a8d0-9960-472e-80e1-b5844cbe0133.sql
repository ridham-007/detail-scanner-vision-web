
-- Create a table for contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved'))
);

-- Add Row Level Security (RLS) - only admins should see contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- For now, create a policy that allows all authenticated users to insert
-- You may want to restrict this further based on your needs
CREATE POLICY "Anyone can submit contact forms" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy for reading that you can modify later for admin access
CREATE POLICY "Only admins can view submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (false); -- Change this to your admin logic later
