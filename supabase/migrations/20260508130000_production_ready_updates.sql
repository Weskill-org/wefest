
-- Production Ready Updates

-- 1. Admin Ranks
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_rank') THEN
    CREATE TYPE public.admin_rank AS ENUM ('Moderator', 'Organizer', 'Admin', 'Superadmin');
  END IF;
END
$$;

ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS rank public.admin_rank NOT NULL DEFAULT 'Moderator';

-- 2. College Approval Status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'college_status') THEN
    CREATE TYPE public.college_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END
$$;

ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS status public.college_status NOT NULL DEFAULT 'approved'; -- Default to approved for existing ones
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Update existing colleges to 'approved'
UPDATE public.colleges SET status = 'approved' WHERE status IS NULL;

-- 3. Recent Activity Table
CREATE TABLE IF NOT EXISTS public.recent_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'ticket_purchased', 'event_created', 'event_status_updated', 'college_approved', etc.
  title text NOT NULL,
  description text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view recent activity" ON public.recent_activity FOR SELECT USING (true);

-- 4. Activity Logging Function
CREATE OR REPLACE FUNCTION public.log_activity(
  _type text,
  _title text,
  _description text,
  _user_id uuid DEFAULT NULL,
  _event_id uuid DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _activity_id uuid;
BEGIN
  INSERT INTO public.recent_activity (type, title, description, user_id, event_id, metadata)
  VALUES (_type, _title, _description, _user_id, _event_id, _metadata)
  RETURNING id INTO _activity_id;
  RETURN _activity_id;
END;
$$;

-- 5. Triggers for automatic logging

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
    jsonb_build_object('college_name', NEW.college_name)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_event_created ON public.events;
CREATE TRIGGER trg_log_event_created
AFTER INSERT ON public.events
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_log_event_created();

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
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_event_status_updated ON public.events;
CREATE TRIGGER trg_log_event_status_updated
AFTER UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_log_event_status_updated();

-- Trigger for new tickets
CREATE OR REPLACE FUNCTION public.trg_fn_log_ticket_purchased()
RETURNS trigger AS $$
DECLARE
  _user_name text;
  _event_title text;
BEGIN
  SELECT full_name INTO _user_name FROM public.profiles WHERE user_id = NEW.user_id;
  SELECT title INTO _event_title FROM public.events WHERE id = NEW.event_id;
  
  PERFORM public.log_activity(
    'ticket_purchased',
    'New Ticket Purchased',
    COALESCE(_user_name, 'A student') || ' bought a ' || NEW.tier || ' ticket for ' || COALESCE(_event_title, 'an event'),
    NEW.user_id,
    NEW.event_id,
    jsonb_build_object('tier', NEW.tier)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_ticket_purchased ON public.tickets;
CREATE TRIGGER trg_log_ticket_purchased
AFTER INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_log_ticket_purchased();
