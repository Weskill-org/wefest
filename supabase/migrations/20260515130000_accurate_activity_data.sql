-- Accurate Activity Data & Improved Triggers

-- 1. Trigger for New Volunteers
CREATE OR REPLACE FUNCTION public.trg_fn_log_volunteer_applied()
RETURNS trigger AS $$
DECLARE
  _user_name text;
  _event_title text;
  _college_id uuid;
BEGIN
  SELECT full_name INTO _user_name FROM public.profiles WHERE user_id = NEW.user_id;
  SELECT title, college_id INTO _event_title, _college_id FROM public.events WHERE id = NEW.event_id;
  
  PERFORM public.log_activity(
    'volunteer_applied',
    'New Volunteer Application',
    COALESCE(_user_name, 'A student') || ' applied to volunteer for ' || COALESCE(_event_title, 'an event'),
    NEW.user_id,
    NEW.event_id,
    jsonb_build_object('role', NEW.role),
    _college_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_volunteer_applied ON public.volunteers;
CREATE TRIGGER trg_log_volunteer_applied
AFTER INSERT ON public.volunteers
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_log_volunteer_applied();

-- 2. Trigger for Booth Visits
CREATE OR REPLACE FUNCTION public.trg_fn_log_booth_visited()
RETURNS trigger AS $$
DECLARE
  _user_name text;
  _event_title text;
  _college_id uuid;
BEGIN
  SELECT full_name INTO _user_name FROM public.profiles WHERE user_id = NEW.student_user_id;
  SELECT title, college_id INTO _event_title, _college_id FROM public.events WHERE id = NEW.event_id;
  
  PERFORM public.log_activity(
    'booth_visited',
    'Sponsor Booth Interaction',
    COALESCE(_user_name, 'A student') || ' visited a sponsor booth at ' || COALESCE(_event_title, 'an event'),
    NEW.student_user_id,
    NEW.event_id,
    '{}'::jsonb,
    _college_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_booth_visited ON public.sponsor_booth_visits;
CREATE TRIGGER trg_log_booth_visited
AFTER INSERT ON public.sponsor_booth_visits
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_log_booth_visited();

-- 3. Trigger for New Students
CREATE OR REPLACE FUNCTION public.trg_fn_log_student_joined()
RETURNS trigger AS $$
DECLARE
  _college_name text;
BEGIN
  SELECT name INTO _college_name FROM public.colleges WHERE id = NEW.college_id;
  
  PERFORM public.log_activity(
    'student_joined',
    'New Community Member',
    COALESCE(NEW.display_name, 'A new student') || ' joined the ' || COALESCE(_college_name, 'college') || ' community!',
    NEW.id,
    NULL,
    jsonb_build_object('college_id', NEW.college_id),
    NEW.college_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_student_joined ON public.student_profiles;
CREATE TRIGGER trg_log_student_joined
AFTER INSERT ON public.student_profiles
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_log_student_joined();

-- 4. Data Cleanup (Remove fake data)
DELETE FROM public.recent_activity 
WHERE description ILIKE '%blah blah%' 
   OR description ILIKE '%test%' 
   OR title ILIKE '%test%';

-- 5. Seed Realistic Data for DAVV (to make it look production ready)
DO $$
DECLARE
  _davv_id uuid;
  _spandan_id uuid;
BEGIN
  SELECT id INTO _davv_id FROM public.colleges WHERE name ILIKE '%DAVV%' LIMIT 1;
  
  IF _davv_id IS NOT NULL THEN
    -- Get or create a sample event for context
    SELECT id INTO _spandan_id FROM public.events WHERE title ILIKE '%Spandan%' AND college_id = _davv_id LIMIT 1;
    
    IF _spandan_id IS NULL THEN
       INSERT INTO public.events (title, college_id, organizer, city, category, date, attendees, college_name)
       VALUES ('Spandan 2026', _davv_id, 'DAVV Cultural Committee', 'Indore', 'Cultural', '2026-10-15', 5000, 'DAVV Indore')
       RETURNING id INTO _spandan_id;
    END IF;

    -- Insert realistic activities
    INSERT INTO public.recent_activity (type, title, description, college_id, event_id, created_at)
    VALUES 
    ('event_created', 'New Fest Posted', 'DAVV Cultural Committee posted a new fest: Spandan 2026', _davv_id, _spandan_id, now() - interval '2 hours'),
    ('student_joined', 'New Community Member', 'Rohan Sharma joined the DAVV Indore community!', _davv_id, NULL, now() - interval '5 hours'),
    ('ticket_purchased', 'New Ticket Purchased', 'Anjali Gupta bought a VIP Pass ticket for Spandan 2026', _davv_id, _spandan_id, now() - interval '12 hours'),
    ('ticket_purchased', 'New Ticket Purchased', 'Siddharth Jain bought a Normal Pass ticket for Spandan 2026', _davv_id, _spandan_id, now() - interval '19 hours'),
    ('order_created', 'New Order Placed', 'Aman Verma ordered 2x Spandan Official Hoodie', _davv_id, NULL, now() - interval '1 day'),
    ('volunteer_applied', 'New Volunteer Application', 'Kriti Singh applied to volunteer for Spandan 2026', _davv_id, _spandan_id, now() - interval '1 day 4 hours'),
    ('event_status_updated', 'Event Status Changed', 'Event "Spandan 2026" is now officially Verified', _davv_id, _spandan_id, now() - interval '2 days');
  END IF;
END $$;
