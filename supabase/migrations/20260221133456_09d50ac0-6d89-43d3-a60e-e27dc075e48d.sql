
-- Update RLS policy for reviews to show all reviews (no approval needed)
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
CREATE POLICY "Anyone can view all reviews"
ON public.reviews
FOR SELECT
USING (true);
