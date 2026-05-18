-- Fix sponsor_booth_visits insert policy to allow authenticated sponsors to record their visits
CREATE POLICY "sponsors can insert booth visits" 
ON public.sponsor_booth_visits FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sponsor_user_id);
