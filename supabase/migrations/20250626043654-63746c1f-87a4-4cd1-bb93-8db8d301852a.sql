
-- Add a policy to allow inserting unpublished products for tracking purposes
CREATE POLICY "Anyone can insert products for tracking" ON public.scanned_products
    FOR INSERT WITH CHECK (true);
