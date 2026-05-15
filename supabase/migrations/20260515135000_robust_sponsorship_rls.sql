-- Rewrite RLS policies for sponsorship_proposals to be more robust
-- and ensure college members can correctly view them.

-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "organizers can view event proposals" ON public.sponsorship_proposals;
DROP POLICY IF EXISTS "organizer view event proposals" ON public.sponsorship_proposals;
DROP POLICY IF EXISTS "organizer update proposal status" ON public.sponsorship_proposals;
DROP POLICY IF EXISTS "companies can submit proposals" ON public.sponsorship_proposals;
DROP POLICY IF EXISTS "companies can view their own proposals" ON public.sponsorship_proposals;

-- 2. Create refined SELECT policy for organizers/college members
-- We use a JOIN-like structure with EXISTS which is often more reliable in RLS than IN subqueries
CREATE POLICY "organizers_view_proposals" ON public.sponsorship_proposals
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

-- 3. Create refined UPDATE policy for organizers
CREATE POLICY "organizers_update_proposals" ON public.sponsorship_proposals
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

-- 4. Restore company policies
CREATE POLICY "companies_insert_proposals" ON public.sponsorship_proposals
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = company_user_id
  );

CREATE POLICY "companies_view_own_proposals" ON public.sponsorship_proposals
  FOR SELECT TO authenticated
  USING (
    auth.uid() = company_user_id
  );

-- 5. Ensure realtime is enabled with FULL identity (redundant but safe)
ALTER TABLE public.sponsorship_proposals REPLICA IDENTITY FULL;

-- 6. Ensure the table is in the realtime publication (safe even if already present)
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
