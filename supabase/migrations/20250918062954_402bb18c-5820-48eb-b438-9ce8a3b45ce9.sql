-- Add preferences column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN preferences JSONB DEFAULT '{
  "dietary": [],
  "allergies": [],
  "health_goal": null,
  "preferences": []
}'::jsonb;