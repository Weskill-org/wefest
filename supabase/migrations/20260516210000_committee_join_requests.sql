-- Student-initiated committee join requests (pull model)

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

CREATE POLICY "student_select_own_join_requests" ON public.college_join_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_select_college_join_requests" ON public.college_join_requests
  FOR SELECT TO authenticated
  USING (public.is_college_admin(college_id, auth.uid()));

-- ─── Notify college admins on new request ─────────────────────────────────────
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

-- ─── Submit join request ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.submit_college_join_request(
  _college_id uuid,
  _pitch      text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id   uuid := auth.uid();
  _college   record;
  _request_id uuid;
  _trim_pitch text;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to request to join a committee';
  END IF;

  _trim_pitch := trim(_pitch);
  IF length(_trim_pitch) < 10 THEN
    RAISE EXCEPTION 'Please write a short pitch (at least 10 characters)';
  END IF;

  SELECT id, name, status INTO _college
  FROM public.colleges
  WHERE id = _college_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'College not found';
  END IF;

  IF _college.status IS DISTINCT FROM 'approved' THEN
    RAISE EXCEPTION 'This committee is not accepting requests yet';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.college_members
    WHERE college_id = _college_id AND user_id = _user_id AND is_approved = true
  ) THEN
    RAISE EXCEPTION 'You are already a member of this committee';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.college_join_requests
    WHERE college_id = _college_id AND user_id = _user_id AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'You already have a pending request for this committee';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.team_invitations
    WHERE college_id = _college_id AND invitee_user_id = _user_id AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'You already have a pending invitation for this committee — check Alerts';
  END IF;

  INSERT INTO public.college_join_requests (college_id, user_id, pitch)
  VALUES (_college_id, _user_id, _trim_pitch)
  RETURNING id INTO _request_id;

  RETURN jsonb_build_object(
    'ok', true,
    'request_id', _request_id,
    'college_id', _college_id,
    'college_name', _college.name
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_college_join_request(uuid, text) TO authenticated;

-- ─── Accept join request ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.accept_college_join_request(
  _request_id uuid,
  _role       text DEFAULT 'member',
  _position   text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _admin_id  uuid := auth.uid();
  _req       record;
  _college   record;
  _role_label text;
BEGIN
  SELECT * INTO _req
  FROM public.college_join_requests
  WHERE id = _request_id AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or already processed';
  END IF;

  IF NOT public.is_college_admin(_req.college_id, _admin_id) THEN
    RAISE EXCEPTION 'Only committee admins can accept join requests';
  END IF;

  PERFORM public.ensure_user_profile(_req.user_id);

  UPDATE public.college_join_requests
  SET status = 'accepted', reviewed_by = _admin_id, responded_at = now()
  WHERE id = _request_id;

  INSERT INTO public.college_members (college_id, user_id, role, position, is_approved)
  VALUES (_req.college_id, _req.user_id, _role::college_internal_role, NULLIF(trim(_position), ''), true)
  ON CONFLICT (college_id, user_id) DO UPDATE
    SET role = EXCLUDED.role,
        position = EXCLUDED.position,
        is_approved = true;

  SELECT name INTO _college FROM public.colleges WHERE id = _req.college_id;
  _role_label := public.team_role_label(_role, _position);

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _req.user_id,
    'Request Accepted 🎉',
    format('Welcome to %s! You''ve been added as %s. Open Committees to see your membership.',
      COALESCE(_college.name, 'the committee'),
      _role_label
    ),
    'join_request_accepted',
    jsonb_build_object(
      'request_id', _request_id,
      'college_id', _req.college_id,
      'college_name', _college.name,
      'role', _role,
      'position', _position
    )
  );

  RETURN jsonb_build_object(
    'ok', true,
    'college_id', _req.college_id,
    'college_name', _college.name,
    'user_id', _req.user_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_college_join_request(uuid, text, text) TO authenticated;

-- ─── Decline join request ────────────────────────────────────────────────────
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
    format('Your request to join %s was not accepted at this time. You can try another committee or reach out to the organizers.',
      COALESCE(_college.name, 'the committee')
    ),
    'join_request_declined',
    jsonb_build_object('request_id', _request_id, 'college_id', _req.college_id)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.decline_college_join_request(uuid) TO authenticated;

-- ─── List join requests for organizers ─────────────────────────────────────────
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

-- Allow users to mark their notifications as read
DROP POLICY IF EXISTS "users can update own notification logs" ON public.notification_logs;
CREATE POLICY "users can update own notification logs" ON public.notification_logs
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Realtime ────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'college_join_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.college_join_requests;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notification_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_logs;
  END IF;
END $$;
