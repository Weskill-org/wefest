-- Students may only join / request committees at their registered college (student_profiles.college_id)

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
  _user_id      uuid := auth.uid();
  _own_college  uuid;
  _college      record;
  _request_id   uuid;
  _trim_pitch   text;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to request to join a committee';
  END IF;

  SELECT college_id INTO _own_college
  FROM public.student_profiles
  WHERE id = _user_id;

  IF _own_college IS NULL THEN
    RAISE EXCEPTION 'Link your college in Settings before requesting to join a committee';
  END IF;

  IF _own_college IS DISTINCT FROM _college_id THEN
    RAISE EXCEPTION 'You can only request to join your own college committee';
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
    SELECT 1 FROM public.college_members
    WHERE user_id = _user_id AND is_approved = true AND college_id IS DISTINCT FROM _college_id
  ) THEN
    RAISE EXCEPTION 'You are already on another college committee';
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

CREATE OR REPLACE FUNCTION public.accept_team_invitation(_invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _inv           record;
  _user_id       uuid := auth.uid();
  _own_college   uuid;
  _college_name  text;
  _role_label    text;
  _student_name  text;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to accept an invitation';
  END IF;

  SELECT * INTO _inv
  FROM public.team_invitations
  WHERE id = _invitation_id
    AND invitee_user_id = _user_id
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'This invitation is no longer available. It may have expired or already been answered.';
  END IF;

  SELECT college_id INTO _own_college
  FROM public.student_profiles
  WHERE id = _user_id;

  IF _own_college IS NULL THEN
    RAISE EXCEPTION 'Link your college in Settings before joining a committee';
  END IF;

  IF _own_college IS DISTINCT FROM _inv.college_id THEN
    RAISE EXCEPTION 'You can only join the committee at your registered college';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.college_members
    WHERE user_id = _user_id AND is_approved = true AND college_id IS DISTINCT FROM _inv.college_id
  ) THEN
    RAISE EXCEPTION 'You are already on another college committee';
  END IF;

  PERFORM public.ensure_user_profile(_user_id);

  UPDATE public.team_invitations
  SET status = 'accepted', responded_at = now()
  WHERE id = _invitation_id;

  INSERT INTO public.college_members (college_id, user_id, role, position, is_approved)
  VALUES (_inv.college_id, _user_id, _inv.role::public.college_internal_role, _inv.position, true)
  ON CONFLICT (college_id, user_id) DO UPDATE
    SET role = EXCLUDED.role,
        position = EXCLUDED.position,
        is_approved = true;

  SELECT name INTO _college_name FROM public.colleges WHERE id = _inv.college_id;
  _role_label := public.team_role_label(_inv.role, _inv.position);

  SELECT COALESCE(NULLIF(trim(p.full_name), ''), NULLIF(trim(sp.full_name), ''), 'A team member')
  INTO _student_name
  FROM (SELECT _user_id AS uid) x
  LEFT JOIN public.profiles p ON p.user_id = x.uid
  LEFT JOIN public.student_profiles sp ON sp.id = x.uid;

  UPDATE public.notification_logs
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
        'responded', true,
        'response', 'accepted',
        'responded_at', now()
      )
  WHERE user_id = _user_id
    AND type = 'team_invite'
    AND metadata->>'invitation_id' = _invitation_id::text;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _inv.inviter_user_id,
    'Team member joined',
    format('%s accepted your invitation and joined %s as %s.',
      _student_name,
      COALESCE(_college_name, 'your committee'),
      _role_label
    ),
    'team_response',
    jsonb_build_object(
      'invitation_id', _invitation_id,
      'college_id', _inv.college_id,
      'accepted', true
    )
  );

  RETURN jsonb_build_object(
    'ok', true,
    'college_id', _inv.college_id,
    'college_name', _college_name,
    'role', _inv.role,
    'position', _inv.position,
    'role_label', _role_label
  );
END;
$$;

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
  _admin_id     uuid := auth.uid();
  _req          record;
  _college      record;
  _role_label   text;
  _own_college  uuid;
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

  SELECT college_id INTO _own_college
  FROM public.student_profiles
  WHERE id = _req.user_id;

  IF _own_college IS NULL OR _own_college IS DISTINCT FROM _req.college_id THEN
    RAISE EXCEPTION 'This student can only join their own college committee';
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
