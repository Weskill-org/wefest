-- College Specific Activity Updates

-- 1. Add college_id to recent_activity
ALTER TABLE public.recent_activity ADD COLUMN IF NOT EXISTS college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE;

-- 2. Update log_activity function
CREATE OR REPLACE FUNCTION public.log_activity(
  _type text,
  _title text,
  _description text,
  _user_id uuid DEFAULT NULL,
  _event_id uuid DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb,
  _college_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _activity_id uuid;
  _final_college_id uuid := _college_id;
BEGIN
  -- If college_id is not provided but event_id is, try to fetch it
  IF _final_college_id IS NULL AND _event_id IS NOT NULL THEN
    SELECT college_id INTO _final_college_id FROM public.events WHERE id = _event_id;
  END IF;

  INSERT INTO public.recent_activity (type, title, description, user_id, event_id, metadata, college_id)
  VALUES (_type, _title, _description, _user_id, _event_id, _metadata, _final_college_id)
  RETURNING id INTO _activity_id;
  
  RETURN _activity_id;
END;
$$;

-- 3. Update existing triggers

-- Trigger for new events
CREATE OR REPLACE FUNCTION public.trg_fn_log_event_created()
RETURNS trigger AS $$
BEGIN
  PERFORM public.log_activity(
    'event_created',
    'New Fest Posted',
    NEW.organizer || ' posted a new fest: ' || NEW.title,
    NEW.organizer_user_id,
    NEW.id,
    jsonb_build_object('college_name', NEW.college_name),
    NEW.college_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for event status changes
CREATE OR REPLACE FUNCTION public.trg_fn_log_event_status_updated()
RETURNS trigger AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    PERFORM public.log_activity(
      'event_status_updated',
      'Event Status Changed',
      'Event "' || NEW.title || '" is now ' || NEW.status,
      NULL,
      NEW.id,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status),
      NEW.college_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new tickets
CREATE OR REPLACE FUNCTION public.trg_fn_log_ticket_purchased()
RETURNS trigger AS $$
DECLARE
  _user_name text;
  _event_title text;
  _college_id uuid;
BEGIN
  SELECT full_name INTO _user_name FROM public.profiles WHERE user_id = NEW.user_id;
  SELECT title, college_id INTO _event_title, _college_id FROM public.events WHERE id = NEW.event_id;
  
  PERFORM public.log_activity(
    'ticket_purchased',
    'New Ticket Purchased',
    COALESCE(_user_name, 'A student') || ' bought a ' || NEW.tier || ' ticket for ' || COALESCE(_event_title, 'an event'),
    NEW.user_id,
    NEW.event_id,
    jsonb_build_object('tier', NEW.tier),
    _college_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add trigger for merchandise orders
CREATE OR REPLACE FUNCTION public.trg_fn_log_order_created()
RETURNS trigger AS $$
DECLARE
  _user_name text;
  _product_name text;
  _college_id uuid;
BEGIN
  -- Get user name (from student_profiles or profiles)
  SELECT COALESCE(display_name, full_name) INTO _user_name FROM public.student_profiles WHERE id = NEW.user_id;
  
  -- Get product name and college_id
  SELECT p.name, e.college_id INTO _product_name, _college_id 
  FROM public.products p
  JOIN public.events e ON e.id = p.event_id
  WHERE p.id = NEW.product_id;
  
  PERFORM public.log_activity(
    'order_created',
    'New Order Placed',
    COALESCE(_user_name, 'A student') || ' ordered ' || NEW.quantity || 'x ' || COALESCE(_product_name, 'merchandise'),
    NEW.user_id,
    NULL, -- No specific event link in description but we have college_id
    jsonb_build_object('quantity', NEW.quantity, 'product_name', _product_name),
    _college_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_order_created ON public.orders;
CREATE TRIGGER trg_log_order_created
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_log_order_created();

-- 5. Backfill existing records
UPDATE public.recent_activity ra
SET college_id = e.college_id
FROM public.events e
WHERE ra.event_id = e.id
AND ra.college_id IS NULL;
