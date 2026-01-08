-- Drop the previous function
DROP FUNCTION IF EXISTS public.upsert_token_frequency(text, integer);

-- Create batch function as user specified
CREATE OR REPLACE FUNCTION public.increment_ingredient_tokens(tokens text[])
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO ingredient_token_frequency (token, total_count)
  SELECT unnest(tokens), 1
  ON CONFLICT (token)
  DO UPDATE SET 
    total_count = ingredient_token_frequency.total_count + 1,
    last_seen = now();
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.increment_ingredient_tokens(text[]) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_ingredient_tokens(text[]) TO authenticated;