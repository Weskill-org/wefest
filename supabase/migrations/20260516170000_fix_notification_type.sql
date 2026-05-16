-- Add type column to notification_logs
ALTER TABLE public.notification_logs ADD COLUMN IF NOT EXISTS type text;

-- Re-create the functions that depend on it (just in case they failed or were partially created)
-- Note: migrations are transactional, so if 20260516160000 failed, these functions don't exist.
-- If it succeeded (maybe someone added the column manually?), then these will just replace.

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
BEGIN
  -- Resolve invitee
  SELECT user_id, full_name INTO _invitee
  FROM public.profiles
  WHERE lower(email) = lower(trim(_invitee_email));

  IF NOT FOUND THEN
    -- Try student_profiles as fallback
    SELECT id AS user_id, full_name INTO _invitee
    FROM public.student_profiles sp
    JOIN auth.users u ON u.id = sp.id
    WHERE lower(u.email) = lower(trim(_invitee_email));
  END IF;

  IF _invitee.user_id IS NULL THEN
    RAISE EXCEPTION 'No WeFest account found for email: %', _invitee_email;
  END IF;

  -- Check already a member
  IF EXISTS (
    SELECT 1 FROM public.college_members
    WHERE college_id = _college_id AND user_id = _invitee.user_id AND is_approved = true
  ) THEN
    RAISE EXCEPTION 'This person is already an active team member';
  END IF;

  -- Check pending invite already exists
  IF EXISTS (
    SELECT 1 FROM public.team_invitations
    WHERE college_id = _college_id AND invitee_user_id = _invitee.user_id AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'An invitation is already pending for this person';
  END IF;

  -- Fetch college info
  SELECT name INTO _college FROM public.colleges WHERE id = _college_id;

  -- Insert invitation
  INSERT INTO public.team_invitations
    (college_id, event_id, invitee_user_id, inviter_user_id, role, position, message)
  VALUES
    (_college_id, _event_id, _invitee.user_id, _inviter_id, _role, _position, _message)
  RETURNING id INTO _inv_id;

  -- Notify the student
  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _invitee.user_id,
    'Team Invitation 🎉',
    format(
      'You''ve been invited to join %s as %s. Check your Alerts to accept or decline.',
      COALESCE(_college.name, 'a festival committee'),
      COALESCE(_position, _role)
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

CREATE OR REPLACE FUNCTION public.accept_team_invitation(_invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _inv        record;
  _user_id    uuid := auth.uid();
  _college    record;
  _inviter    record;
BEGIN
  SELECT * INTO _inv
  FROM public.team_invitations
  WHERE id = _invitation_id
    AND invitee_user_id = _user_id
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found or already responded to';
  END IF;

  -- Mark accepted
  UPDATE public.team_invitations
  SET status = 'accepted', responded_at = now()
  WHERE id = _invitation_id;

  -- Upsert into college_members
  INSERT INTO public.college_members (college_id, user_id, role, position, is_approved)
  VALUES (_inv.college_id, _user_id, _inv.role::college_internal_role, _inv.position, true)
  ON CONFLICT (college_id, user_id) DO UPDATE
    SET role = EXCLUDED.role,
        position = EXCLUDED.position,
        is_approved = true;

  -- Notify organizer
  SELECT name INTO _college FROM public.colleges WHERE id = _inv.college_id;
  SELECT full_name INTO _inviter FROM public.profiles WHERE user_id = _user_id;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _inv.inviter_user_id,
    'Invitation Accepted ✅',
    format('%s has accepted your invitation to join %s as %s.',
      COALESCE(_inviter.full_name, 'Someone'),
      COALESCE(_college.name, 'your team'),
      COALESCE(_inv.position, _inv.role)
    ),
    'team_response',
    jsonb_build_object('invitation_id', _invitation_id, 'college_id', _inv.college_id, 'accepted', true)
  );

  RETURN jsonb_build_object('ok', true, 'college_id', _inv.college_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.decline_team_invitation(_invitation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _inv     record;
  _college record;
  _student record;
BEGIN
  SELECT * INTO _inv
  FROM public.team_invitations
  WHERE id = _invitation_id AND invitee_user_id = _user_id AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found or already responded to';
  END IF;

  UPDATE public.team_invitations
  SET status = 'declined', responded_at = now()
  WHERE id = _invitation_id;

  -- Notify organizer
  SELECT name INTO _college FROM public.colleges WHERE id = _inv.college_id;
  SELECT full_name INTO _student FROM public.profiles WHERE user_id = _user_id;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _inv.inviter_user_id,
    'Invitation Declined',
    format('%s has declined the invitation to join %s.',
      COALESCE(_student.full_name, 'Someone'),
      COALESCE(_college.name, 'your team')
    ),
    'team_response',
    jsonb_build_object('invitation_id', _invitation_id, 'college_id', _inv.college_id, 'accepted', false)
  );
END;
$$;
