-- Clean up fake events to make the dashboard look production ready
DELETE FROM public.events 
WHERE title ILIKE '%blah blah%' 
   OR title ILIKE '%test%' 
   OR description ILIKE '%test%';

-- Ensure we have at least one good event for DAVV if it was deleted
DO $$
DECLARE
  _davv_id uuid;
BEGIN
  SELECT id INTO _davv_id FROM public.colleges WHERE name ILIKE '%DAVV%' LIMIT 1;
  
  IF _davv_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.events WHERE college_id = _davv_id) THEN
    INSERT INTO public.events (title, college_id, organizer, city, category, date, attendees, college_name, description, status)
    VALUES ('Spandan 2026', _davv_id, 'DAVV Cultural Committee', 'Indore', 'Cultural', '2026-10-15', 5000, 'DAVV Indore', 'The biggest cultural festival of central India.', 'Published');
  END IF;
END $$;
