-- Drop old restrictive tickets policies
DROP POLICY IF EXISTS "Organizer can update tickets for own events" ON public.tickets;
DROP POLICY IF EXISTS "Organizer can view tickets for own events" ON public.tickets;

-- Re-create SELECT policy to support event creator, approved college members, and accepted sponsors
CREATE POLICY "Organizer and Sponsor view tickets"
ON public.tickets FOR SELECT TO authenticated
USING (
  -- 1. Ticket owner
  auth.uid() = user_id
  OR
  -- 2. Event creator
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = tickets.event_id
    AND e.organizer_user_id = auth.uid()
  )
  -- 3. Approved college member
  OR EXISTS (
    SELECT 1 FROM public.events e
    JOIN public.college_members m ON e.college_id = m.college_id
    WHERE e.id = tickets.event_id
    AND m.user_id = auth.uid()
    AND m.is_approved = true
  )
  -- 4. Accepted event sponsor
  OR EXISTS (
    SELECT 1 FROM public.sponsorship_proposals p
    WHERE p.event_id = tickets.event_id
    AND p.company_user_id = auth.uid()
    AND p.status = 'accepted'
  )
);

-- Re-create UPDATE policy to support event creator and approved college members for scanning check-ins
CREATE POLICY "Organizer update tickets"
ON public.tickets FOR UPDATE TO authenticated
USING (
  -- 1. Event creator
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = tickets.event_id
    AND e.organizer_user_id = auth.uid()
  )
  -- 2. Approved college member
  OR EXISTS (
    SELECT 1 FROM public.events e
    JOIN public.college_members m ON e.college_id = m.college_id
    WHERE e.id = tickets.event_id
    AND m.user_id = auth.uid()
    AND m.is_approved = true
  )
)
WITH CHECK (
  -- 1. Event creator
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = tickets.event_id
    AND e.organizer_user_id = auth.uid()
  )
  -- 2. Approved college member
  OR EXISTS (
    SELECT 1 FROM public.events e
    JOIN public.college_members m ON e.college_id = m.college_id
    WHERE e.id = tickets.event_id
    AND m.user_id = auth.uid()
    AND m.is_approved = true
  )
);
