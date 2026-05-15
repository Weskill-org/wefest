-- Simplify RLS for sponsorship_proposals to rely on events table RLS
-- This is more efficient and avoids complex subquery issues.

DROP POLICY IF EXISTS "organizers_view_proposals" ON public.sponsorship_proposals;
DROP POLICY IF EXISTS "organizers_view_v2" ON public.sponsorship_proposals;

CREATE POLICY "organizers_view_proposals_v3" ON public.sponsorship_proposals
  FOR SELECT TO authenticated
  USING (
    event_id IN (
      SELECT id FROM public.events
    )
  );

-- Also ensure UPDATE is similarly simplified
DROP POLICY IF EXISTS "organizers_update_proposals" ON public.sponsorship_proposals;

CREATE POLICY "organizers_update_proposals_v3" ON public.sponsorship_proposals
  FOR UPDATE TO authenticated
  USING (
    event_id IN (
      SELECT id FROM public.events
    )
  );
