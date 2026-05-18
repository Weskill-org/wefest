-- Add policy to allow company users to delete their own pending sponsorship proposals
DROP POLICY IF EXISTS "companies_delete_proposals" ON public.sponsorship_proposals;

CREATE POLICY "companies_delete_proposals" ON public.sponsorship_proposals
  FOR DELETE TO authenticated
  USING (auth.uid() = company_user_id AND status = 'pending');
