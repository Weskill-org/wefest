-- Production-grade team invitation accept flow:
-- reliable college_members insert, notification cleanup, team listing RPCs, realtime.

-- ─── Helpers ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.team_role_label(_role text, _position text DEFAULT NULL)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    NULLIF(trim(_position), ''),
    CASE _role
      WHEN 'admin' THEN 'Admin'
      WHEN 'coordinator' THEN 'Coordinator'
      WHEN 'ticket_poc' THEN 'Ticket POC'
      WHEN 'member' THEN 'Member'
      ELSE initcap(replace(COALESCE(_role, 'member'), '_', ' '))
    END
  );
$$;

-- Ensure profiles row exists (college_members FK requires it)
CREATE OR REPLACE FUNCTION public.ensure_user_profile(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text;
  _name  text;
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id) THEN
    RETURN;
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _user_id;

  SELECT full_name INTO _name
  FROM public.student_profiles
  WHERE id = _user_id;

  IF _name IS NULL THEN
    SELECT COALESCE(raw_user_meta_data->>'full_name', '') INTO _name
    FROM auth.users
    WHERE id = _user_id;
  END IF;

  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (_user_id, COALESCE(_email, ''), COALESCE(_name, ''))
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- ─── List team members (names from profiles + student_profiles) ────────────────
CREATE OR REPLACE FUNCTION public.get_college_team_members(_college_id uuid)
RETURNS TABLE (
  id uuid,
  college_id uuid,
  user_id uuid,
  role public.college_internal_role,
  "position" text,
  is_approved boolean,
  created_at timestamptz,
  full_name text,
  email text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    cm.id,
    cm.college_id,
    cm.user_id,
    cm.role,
    cm."position",
    cm.is_approved,
    cm.created_at,
    COALESCE(NULLIF(trim(p.full_name), ''), NULLIF(trim(sp.full_name), ''), 'Team Member') AS full_name,
    COALESCE(NULLIF(trim(p.email), ''), '') AS email,
    sp.avatar_url AS avatar_url
  FROM public.college_members cm
  LEFT JOIN public.profiles p ON p.user_id = cm.user_id
  LEFT JOIN public.student_profiles sp ON sp.id = cm.user_id
  WHERE cm.college_id = _college_id
    AND (
      public.is_college_member(_college_id, auth.uid())
      OR cm.user_id = auth.uid()
    )
  ORDER BY cm.created_at ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_college_team_members(uuid) TO authenticated;

-- ─── List invitations with invitee display info ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_college_team_invitations(_college_id uuid)
RETURNS TABLE (
  id uuid,
  college_id uuid,
  invitee_user_id uuid,
  inviter_user_id uuid,
  role text,
  "position" text,
  message text,
  status text,
  created_at timestamptz,
  responded_at timestamptz,
  invitee_name text,
  invitee_email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ti.id,
    ti.college_id,
    ti.invitee_user_id,
    ti.inviter_user_id,
    ti.role,
    ti."position",
    ti.message,
    ti.status,
    ti.created_at,
    ti.responded_at,
    COALESCE(NULLIF(trim(p.full_name), ''), NULLIF(trim(sp.full_name), ''), 'Invited member') AS invitee_name,
    COALESCE(NULLIF(trim(p.email), ''), u.email) AS invitee_email
  FROM public.team_invitations ti
  LEFT JOIN public.profiles p ON p.user_id = ti.invitee_user_id
  LEFT JOIN public.student_profiles sp ON sp.id = ti.invitee_user_id
  LEFT JOIN auth.users u ON u.id = ti.invitee_user_id
  WHERE ti.college_id = _college_id
    AND (
      ti.inviter_user_id = auth.uid()
      OR public.is_college_member(_college_id, auth.uid())
    )
  ORDER BY ti.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_college_team_invitations(uuid) TO authenticated;

-- ─── Accept invitation (hardened) ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.accept_team_invitation(_invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _inv           record;
  _user_id       uuid := auth.uid();
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

  -- Mark invite notifications as responded
  UPDATE public.notification_logs
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
        'responded', true,
        'response', 'accepted',
        'responded_at', now()
      )
  WHERE user_id = _user_id
    AND type = 'team_invite'
    AND metadata->>'invitation_id' = _invitation_id::text;

  -- Notify organizer
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
      'accepted', true,
      'member_user_id', _user_id
    )
  );

  RETURN jsonb_build_object(
    'ok', true,
    'college_id', _inv.college_id,
    'college_name', COALESCE(_college_name, 'your committee'),
    'role', _inv.role,
    'position', _inv.position,
    'role_label', _role_label
  );
END;
$$;

-- ─── Decline invitation (hardened) ─────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.decline_team_invitation(uuid);
CREATE OR REPLACE FUNCTION public.decline_team_invitation(_invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id      uuid := auth.uid();
  _inv          record;
  _college_name text;
  _student_name text;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to decline an invitation';
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

  UPDATE public.team_invitations
  SET status = 'declined', responded_at = now()
  WHERE id = _invitation_id;

  SELECT name INTO _college_name FROM public.colleges WHERE id = _inv.college_id;

  SELECT COALESCE(NULLIF(trim(p.full_name), ''), NULLIF(trim(sp.full_name), ''), 'A student')
  INTO _student_name
  FROM (SELECT _user_id AS uid) x
  LEFT JOIN public.profiles p ON p.user_id = x.uid
  LEFT JOIN public.student_profiles sp ON sp.id = x.uid;

  UPDATE public.notification_logs
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
        'responded', true,
        'response', 'declined',
        'responded_at', now()
      )
  WHERE user_id = _user_id
    AND type = 'team_invite'
    AND metadata->>'invitation_id' = _invitation_id::text;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _inv.inviter_user_id,
    'Invitation declined',
    format('%s declined the invitation to join %s.',
      _student_name,
      COALESCE(_college_name, 'your committee')
    ),
    'team_response',
    jsonb_build_object(
      'invitation_id', _invitation_id,
      'college_id', _inv.college_id,
      'accepted', false
    )
  );

  RETURN jsonb_build_object(
    'ok', true,
    'college_name', COALESCE(_college_name, 'the committee')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.decline_team_invitation(uuid) TO authenticated;

-- Cleaner student-facing invite copy (no emoji in title)
CREATE OR REPLACE FUNCTION public.send_team_invitation(
  _college_id      uuid,
  _invitee_email   text,
  _role            text DEFAULT 'member',
  _position        text DEFAULT NULL,
  _message         text DEFAULT NULL,
  _event_id        uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _inviter_id   uuid := auth.uid();
  _invitee      record;
  _college      record;
  _inv_id       uuid;
  _role_label   text;
BEGIN
  SELECT user_id, full_name INTO _invitee
  FROM public.profiles
  WHERE lower(email) = lower(trim(_invitee_email));

  IF NOT FOUND THEN
    SELECT sp.id AS user_id, sp.full_name INTO _invitee
    FROM public.student_profiles sp
    JOIN auth.users u ON u.id = sp.id
    WHERE lower(u.email) = lower(trim(_invitee_email));
  END IF;

  IF _invitee.user_id IS NULL THEN
    RAISE EXCEPTION 'No WeFest account found for email: %', _invitee_email;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.college_members
    WHERE college_id = _college_id AND user_id = _invitee.user_id AND is_approved = true
  ) THEN
    RAISE EXCEPTION 'This person is already an active team member';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.team_invitations
    WHERE college_id = _college_id AND invitee_user_id = _invitee.user_id AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'An invitation is already pending for this person';
  END IF;

  SELECT name INTO _college FROM public.colleges WHERE id = _college_id;
  _role_label := public.team_role_label(_role, _position);

  INSERT INTO public.team_invitations
    (college_id, event_id, invitee_user_id, inviter_user_id, role, position, message)
  VALUES
    (_college_id, _event_id, _invitee.user_id, _inviter_id, _role, _position, _message)
  RETURNING id INTO _inv_id;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _invitee.user_id,
    'Team invitation',
    format(
      '%s invited you to join %s as %s. Open Alerts to accept or decline.',
      COALESCE((SELECT full_name FROM public.profiles WHERE user_id = _inviter_id), 'An organizer'),
      COALESCE(_college.name, 'a festival committee'),
      _role_label
    ),
    'team_invite',
    jsonb_build_object(
      'invitation_id',  _inv_id,
      'college_id',     _college_id,
      'college_name',   _college.name,
      'role',           _role,
      'position',       _position,
      'message',        _message,
      'inviter_id',     _inviter_id
    )
  );

  RETURN jsonb_build_object(
    'ok',            true,
    'invitation_id', _inv_id,
    'invitee_name',  _invitee.full_name
  );
END;
$$;

-- ─── Realtime for live team updates ────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'college_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.college_members;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'team_invitations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.team_invitations;
  END IF;
END $$;
