-- Update function to user's exact version
CREATE OR REPLACE FUNCTION public.increment_ingredient_tokens(tokens text[])
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO ingredient_token_frequency (token, total_count)
  SELECT unnest(tokens), 1
  ON CONFLICT (token)
  DO UPDATE
    SET total_count = ingredient_token_frequency.total_count + 1;
$$;