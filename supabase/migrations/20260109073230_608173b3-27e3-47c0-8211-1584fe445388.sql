-- Allow service role to insert additives (for data imports)
CREATE POLICY "Service role can manage additives"
ON public.additives
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);