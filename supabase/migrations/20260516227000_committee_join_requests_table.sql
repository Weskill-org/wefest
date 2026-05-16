-- Repair: college_join_requests table was never created (20260516210000 version conflict on remote)

CREATE TABLE IF NOT EXISTS public.college_join_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id   uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pitch        text NOT NULL,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  reviewed_by  uuid REFERENCES auth.users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS college_join_requests_unique_pending
  ON public.college_join_requests (college_id, user_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS college_join_requests_college_idx ON public.college_join_requests (college_id);
CREATE INDEX IF NOT EXISTS college_join_requests_user_idx ON public.college_join_requests (user_id);

ALTER TABLE public.college_join_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_select_own_join_requests" ON public.college_join_requests;
CREATE POLICY "student_select_own_join_requests" ON public.college_join_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_college_join_requests" ON public.college_join_requests;
CREATE POLICY "admin_select_college_join_requests" ON public.college_join_requests
  FOR SELECT TO authenticated
  USING (public.is_college_admin(college_id, auth.uid()));

CREATE OR REPLACE FUNCTION public.notify_admins_on_join_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _college       record;
  _student_name  text;
BEGIN
  SELECT name INTO _college FROM public.colleges WHERE id = NEW.college_id;

  SELECT COALESCE(NULLIF(trim(sp.full_name), ''), NULLIF(trim(p.full_name), ''), 'A student')
  INTO _student_name
  FROM auth.users u
  LEFT JOIN public.student_profiles sp ON sp.id = u.id
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.id = NEW.user_id;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  SELECT
    cm.user_id,
    'New Committee Request',
    format('%s wants to join %s. Review their pitch in Team → Incoming Requests.',
      _student_name,
      COALESCE(_college.name, 'your committee')
    ),
    'join_request',
    jsonb_build_object(
      'request_id', NEW.id,
      'college_id', NEW.college_id,
      'college_name', _college.name,
      'student_user_id', NEW.user_id
    )
  FROM public.college_members cm
  WHERE cm.college_id = NEW.college_id
    AND cm.role = 'admin'
    AND cm.is_approved = true;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS college_join_request_notify_admins ON public.college_join_requests;
CREATE TRIGGER college_join_request_notify_admins
  AFTER INSERT ON public.college_join_requests
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION public.notify_admins_on_join_request();

CREATE OR REPLACE FUNCTION public.decline_college_join_request(_request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _admin_id uuid := auth.uid();
  _req      record;
  _college  record;
BEGIN
  SELECT * INTO _req
  FROM public.college_join_requests
  WHERE id = _request_id AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or already processed';
  END IF;

  IF NOT public.is_college_admin(_req.college_id, _admin_id) THEN
    RAISE EXCEPTION 'Only committee admins can decline join requests';
  END IF;

  UPDATE public.college_join_requests
  SET status = 'declined', reviewed_by = _admin_id, responded_at = now()
  WHERE id = _request_id;

  SELECT name INTO _college FROM public.colleges WHERE id = _req.college_id;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _req.user_id,
    'Request Not Accepted',
    format('Your request to join %s was not accepted at this time. You can reach out to the organizers for more info.',
      COALESCE(_college.name, 'the committee')
    ),
    'join_request_declined',
    jsonb_build_object('request_id', _request_id, 'college_id', _req.college_id)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.decline_college_join_request(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_college_join_requests(_college_id uuid)
RETURNS TABLE (
  id uuid,
  college_id uuid,
  user_id uuid,
  pitch text,
  status text,
  created_at timestamptz,
  responded_at timestamptz,
  student_name text,
  student_email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    jr.id,
    jr.college_id,
    jr.user_id,
    jr.pitch,
    jr.status,
    jr.created_at,
    jr.responded_at,
    COALESCE(NULLIF(trim(sp.full_name), ''), NULLIF(trim(p.full_name), ''), 'Student') AS student_name,
    COALESCE(NULLIF(trim(p.email), ''), '') AS student_email
  FROM public.college_join_requests jr
  LEFT JOIN public.profiles p ON p.user_id = jr.user_id
  LEFT JOIN public.student_profiles sp ON sp.id = jr.user_id
  WHERE jr.college_id = _college_id
    AND public.is_college_admin(_college_id, auth.uid())
  ORDER BY jr.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_college_join_requests(uuid) TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'college_join_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.college_join_requests;
  END IF;
END $$;
