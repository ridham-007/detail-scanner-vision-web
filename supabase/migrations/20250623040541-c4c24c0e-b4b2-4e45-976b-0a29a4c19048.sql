
-- Add username and bio fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE,
ADD COLUMN bio TEXT,
ADD COLUMN website TEXT,
ADD COLUMN location TEXT;

-- Create an index on username for faster lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add a constraint to ensure username is lowercase and alphanumeric with underscores/hyphens
ALTER TABLE public.profiles 
ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$');
