-- Create function to upsert token with count increment
CREATE OR REPLACE FUNCTION public.upsert_token_frequency(p_token text, p_increment integer DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO ingredient_token_frequency (token, total_count, first_seen, last_seen)
  VALUES (p_token, p_increment, now(), now())
  ON CONFLICT (token) DO UPDATE SET
    total_count = ingredient_token_frequency.total_count + p_increment,
    last_seen = now();
END;
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.upsert_token_frequency(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_token_frequency(text, integer) TO authenticated;