
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS scanned_at timestamptz;

DROP POLICY IF EXISTS "Organizer can update tickets for own events" ON public.tickets;
CREATE POLICY "Organizer can update tickets for own events"
ON public.tickets FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = tickets.event_id AND e.organizer_user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = tickets.event_id AND e.organizer_user_id = auth.uid()));

DROP POLICY IF EXISTS "Organizer can view tickets for own events" ON public.tickets;
CREATE POLICY "Organizer can view tickets for own events"
ON public.tickets FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = tickets.event_id AND e.organizer_user_id = auth.uid()));
