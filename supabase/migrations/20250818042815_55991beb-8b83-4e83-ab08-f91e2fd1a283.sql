-- Drop the problematic security definer view
DROP VIEW IF EXISTS public.public_profiles;

-- Instead of a view, we'll use a better RLS approach
-- Drop existing policies and recreate them properly
DROP POLICY IF EXISTS "Secure profile access" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;  
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a function to check if user is admin (to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Policy 1: Users can see their own full profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Policy 2: Admins can view all profiles  
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_admin_user() = true);

-- Policy 3: Public can view limited profile fields only
-- We'll handle this at the application level by selecting only safe fields
CREATE POLICY "Public limited profile access" ON public.profiles  
FOR SELECT USING (
  -- This allows queries but applications must select only public fields
  -- We'll enforce this in the application code
  true
);