
-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create an index for faster admin checks
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- You can manually set admin users like this (replace with actual user IDs):
-- UPDATE public.profiles SET is_admin = true WHERE id = 'your-user-id-here';
