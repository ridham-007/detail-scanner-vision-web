-- Drop the overly permissive public profile policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a more secure policy that only exposes safe public fields
-- Users can see their own full profile, others can only see public fields
CREATE POLICY "Secure profile access" ON public.profiles
FOR SELECT USING (
  CASE 
    -- Users can see their own full profile
    WHEN auth.uid() = id THEN true
    -- Admins can see full profiles (but we'll handle this separately to avoid recursion)
    ELSE false
  END
);

-- Create a separate policy for public profile data only
-- This will be used by applications that need to show user profiles publicly
CREATE POLICY "Public profile fields only" ON public.profiles
FOR SELECT USING (
  -- Only allow access to non-sensitive fields for other users
  -- This policy will be enforced at the application level by selecting only safe fields
  true
);

-- Update the policy to be more specific - drop the broad one and create specific ones
DROP POLICY IF EXISTS "Public profile fields only" ON public.profiles;

-- Create policy for own profile access (full data)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Create policy for admin access to all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- For public profile views (like leaderboards, user pages), we'll need to create a view
-- that only exposes safe fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  bio,
  website,
  total_score,
  quizzes_completed,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Grant access to the public profiles view
GRANT SELECT ON public.public_profiles TO authenticated, anon;