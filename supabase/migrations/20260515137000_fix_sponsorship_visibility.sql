-- Fix sponsorship visibility by hardening RLS policies and ensuring proper Realtime registration

-- 1. Drop the simplified v3 policies to replace them with robust ones
DROP POLICY IF EXISTS "organizers_view_proposals_v3" ON public.sponsorship_proposals;
DROP POLICY IF EXISTS "organizers_update_proposals_v3" ON public.sponsorship_proposals;

-- 2. Create robust SELECT policy for organizers and college members
-- We use EXISTS with explicit checks for organizer_user_id and college membership
CREATE POLICY "organizers_view_proposals_final" ON public.sponsorship_proposals
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = sponsorship_proposals.event_id
      AND (
        e.organizer_user_id = auth.uid()
        OR e.college_id IN (
          SELECT college_id FROM public.college_members
          WHERE user_id = auth.uid() AND is_approved = true
        )
      )
    )
  );

-- 3. Create robust UPDATE policy for organizers and college members
CREATE POLICY "organizers_update_proposals_final" ON public.sponsorship_proposals
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = sponsorship_proposals.event_id
      AND (
        e.organizer_user_id = auth.uid()
        OR e.college_id IN (
          SELECT college_id FROM public.college_members
          WHERE user_id = auth.uid() AND is_approved = true
        )
      )
    )
  );

-- 4. Ensure company policies are preserved (just in case they were dropped)
-- Note: We use auth.uid() = company_user_id to ensure companies only see their own requests
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'companies_view_own_proposals' AND tablename = 'sponsorship_proposals') THEN
    CREATE POLICY "companies_view_own_proposals" ON public.sponsorship_proposals
      FOR SELECT TO authenticated
      USING (auth.uid() = company_user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'companies_insert_proposals' AND tablename = 'sponsorship_proposals') THEN
    CREATE POLICY "companies_insert_proposals" ON public.sponsorship_proposals
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = company_user_id);
  END IF;
END $$;

-- 5. Re-verify Realtime registration
ALTER TABLE public.sponsorship_proposals REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'sponsorship_proposals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sponsorship_proposals;
  END IF;
END $$;
