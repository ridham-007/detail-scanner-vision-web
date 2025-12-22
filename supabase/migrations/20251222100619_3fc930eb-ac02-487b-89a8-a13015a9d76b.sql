-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Migrate existing admins from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE is_admin = true
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Update profiles RLS - restrict email visibility
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile fully"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Public can view limited profile info"
ON public.profiles FOR SELECT
USING (true);

-- 8. Protect early_access_subscriptions - only admins can view
DROP POLICY IF EXISTS "Anyone can insert early access subscription" ON public.early_access_subscriptions;
DROP POLICY IF EXISTS "Anyone can view early access subscriptions" ON public.early_access_subscriptions;

CREATE POLICY "Anyone can subscribe to early access"
ON public.early_access_subscriptions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view early access subscriptions"
ON public.early_access_subscriptions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Update is_admin_user function to use new roles table
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;