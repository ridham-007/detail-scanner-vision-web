-- Create account deletion requests table
CREATE TABLE public.account_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID
);

-- Enable RLS
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a deletion request
CREATE POLICY "Anyone can submit deletion requests"
ON public.account_deletion_requests
FOR INSERT
WITH CHECK (true);

-- Users can view their own requests
CREATE POLICY "Users can view their own requests"
ON public.account_deletion_requests
FOR SELECT
USING (email = (SELECT email FROM profiles WHERE id = auth.uid()) OR auth.uid() = user_id);

-- Admins can view and manage all requests
CREATE POLICY "Admins can manage deletion requests"
ON public.account_deletion_requests
FOR ALL
USING (is_admin_user() = true);