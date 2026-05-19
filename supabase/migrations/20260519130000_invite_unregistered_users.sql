-- Migration: Support inviting unregistered users to college teams (organizers)
-- Modifies team_invitations table to support email-based invitations for non-users.

-- 1. Alter team_invitations table
ALTER TABLE public.team_invitations ALTER COLUMN invitee_user_id DROP NOT NULL;
ALTER TABLE public.team_invitations ADD COLUMN IF NOT EXISTS invitee_email text;
ALTER TABLE public.team_invitations ADD COLUMN IF NOT EXISTS token text UNIQUE DEFAULT replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');

-- 2. Backfill invitee_email from existing invitee_user_id for older invitations
UPDATE public.team_invitations ti
SET invitee_email = COALESCE(p.email, u.email, '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE u.id = ti.invitee_user_id AND ti.invitee_email IS NULL;

-- 3. Set invitee_email to NOT NULL now that it is backfilled
ALTER TABLE public.team_invitations ALTER COLUMN invitee_email SET NOT NULL;

-- 4. Update unique index to be email-based instead of user-id-based
DROP INDEX IF EXISTS public.team_invitations_unique_pending;
CREATE UNIQUE INDEX IF NOT EXISTS team_invitations_unique_pending
  ON public.team_invitations (college_id, lower(invitee_email))
  WHERE status = 'pending';

-- 5. Re-create performance indexes
CREATE INDEX IF NOT EXISTS team_invitations_email_idx ON public.team_invitations (lower(invitee_email));
CREATE INDEX IF NOT EXISTS team_invitations_token_idx ON public.team_invitations (token);

-- 6. Update RLS policies
DROP POLICY IF EXISTS "invitee_select" ON public.team_invitations;
CREATE POLICY "invitee_select" ON public.team_invitations
  FOR SELECT USING (
    auth.uid() = invitee_user_id
    OR lower(invitee_email) = lower((SELECT email FROM auth.users WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "invitee_respond" ON public.team_invitations;
CREATE POLICY "invitee_respond" ON public.team_invitations
  FOR UPDATE USING (
    auth.uid() = invitee_user_id
    OR lower(invitee_email) = lower((SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- 7. Drop and Re-create send_team_invitation RPC to handle nullable user_id, return token
DROP FUNCTION IF EXISTS public.send_team_invitation(uuid, text, text, text, text, uuid);
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
  _inv_token    text;
  _role_label   text;
BEGIN
  -- Resolve invitee
  SELECT user_id, full_name INTO _invitee
  FROM public.profiles
  WHERE lower(email) = lower(trim(_invitee_email));

  IF NOT FOUND THEN
    -- Try student_profiles as fallback
    SELECT sp.id AS user_id, sp.full_name INTO _invitee
    FROM public.student_profiles sp
    JOIN auth.users u ON u.id = sp.id
    WHERE lower(u.email) = lower(trim(_invitee_email));
  END IF;

  -- Check already a member
  IF _invitee.user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.college_members
    WHERE college_id = _college_id AND user_id = _invitee.user_id AND is_approved = true
  ) THEN
    RAISE EXCEPTION 'This person is already an active team member';
  END IF;

  -- Check pending invite already exists
  IF EXISTS (
    SELECT 1 FROM public.team_invitations
    WHERE college_id = _college_id AND lower(invitee_email) = lower(trim(_invitee_email)) AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'An invitation is already pending for this email';
  END IF;

  -- Fetch college info
  SELECT name INTO _college FROM public.colleges WHERE id = _college_id;
  _role_label := public.team_role_label(_role, _position);

  -- Insert invitation
  INSERT INTO public.team_invitations
    (college_id, event_id, invitee_user_id, invitee_email, inviter_user_id, role, position, message)
  VALUES
    (_college_id, _event_id, _invitee.user_id, lower(trim(_invitee_email)), _inviter_id, _role, _position, _message)
  RETURNING id, token INTO _inv_id, _inv_token;

  -- Notify the student in-app if they have an account
  IF _invitee.user_id IS NOT NULL THEN
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
        'inviter_id',     _inviter_id,
        'token',          _inv_token
      )
    );
  END IF;

  RETURN jsonb_build_object(
    'ok',            true,
    'invitation_id', _inv_id,
    'token',         _inv_token,
    'invitee_name',  COALESCE(_invitee.full_name, ''),
    'invitee_email', lower(trim(_invitee_email)),
    'college_name',  _college.name
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.send_team_invitation(uuid, text, text, text, text, uuid) TO authenticated;

-- 8. Drop and Re-create get_college_team_invitations RPC
DROP FUNCTION IF EXISTS public.get_college_team_invitations(uuid);
CREATE OR REPLACE FUNCTION public.get_college_team_invitations(_college_id uuid)
RETURNS TABLE (
  id              uuid,
  college_id      uuid,
  invitee_user_id uuid,
  inviter_user_id uuid,
  role            text,
  "position"      text,
  message         text,
  status          text,
  created_at      timestamptz,
  responded_at    timestamptz,
  invitee_name    text,
  invitee_email   text,
  token           text
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
    COALESCE(
      NULLIF(trim(p.full_name), ''),
      NULLIF(trim(sp.full_name), ''),
      ti.invitee_email,
      'Invited member'
    ) AS invitee_name,
    ti.invitee_email,
    ti.token
  FROM public.team_invitations ti
  LEFT JOIN public.profiles p ON p.user_id = ti.invitee_user_id
  LEFT JOIN public.student_profiles sp ON sp.id = ti.invitee_user_id
  WHERE ti.college_id = _college_id
    AND (
      ti.inviter_user_id = auth.uid()
      OR public.is_college_member(_college_id, auth.uid())
    )
  ORDER BY ti.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_college_team_invitations(uuid) TO authenticated;

-- 9. Drop and Create accept_team_invitation_by_token RPC
DROP FUNCTION IF EXISTS public.accept_team_invitation_by_token(text);
CREATE OR REPLACE FUNCTION public.accept_team_invitation_by_token(_token text)
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
  _display       jsonb;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to accept an invitation';
  END IF;

  SELECT * INTO _inv
  FROM public.team_invitations
  WHERE token = _token
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'This invitation is no longer available. It may have expired or already been answered.';
  END IF;

  -- Verify the email matches the logged-in user
  IF lower(_inv.invitee_email) != lower((SELECT email FROM auth.users WHERE id = _user_id)) THEN
    RAISE EXCEPTION 'This invitation was sent to a different email address. Please sign in with the correct account.';
  END IF;

  PERFORM public.ensure_user_profile(_user_id);
  _display := public.resolve_team_member_display(_user_id);

  UPDATE public.team_invitations
  SET status = 'accepted', responded_at = now(), invitee_user_id = _user_id
  WHERE id = _inv.id;

  INSERT INTO public.college_members (
    college_id, user_id, role, position, is_approved, display_name, display_email
  )
  VALUES (
    _inv.college_id,
    _user_id,
    _inv.role::public.college_internal_role,
    _inv.position,
    true,
    _display->>'full_name',
    _display->>'email'
  )
  ON CONFLICT (college_id, user_id) DO UPDATE
    SET role = EXCLUDED.role,
        position = EXCLUDED.position,
        is_approved = true,
        display_name = EXCLUDED.display_name,
        display_email = EXCLUDED.display_email;

  SELECT name INTO _college_name FROM public.colleges WHERE id = _inv.college_id;
  _role_label := public.team_role_label(_inv.role, _inv.position);

  -- Update any notification logs that existed for this invitation
  UPDATE public.notification_logs
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
        'responded', true,
        'response', 'accepted',
        'responded_at', now()
      )
  WHERE user_id = _user_id
    AND type = 'team_invite'
    AND metadata->>'invitation_id' = _inv.id::text;

  INSERT INTO public.notification_logs (user_id, title, body, type, metadata)
  VALUES (
    _inv.inviter_user_id,
    'Team member joined',
    format('%s joined %s as %s.',
      _display->>'full_name',
      COALESCE(_college_name, 'your committee'),
      _role_label
    ),
    'team_response',
    jsonb_build_object(
      'invitation_id', _inv.id,
      'college_id', _inv.college_id,
      'accepted', true,
      'member_user_id', _user_id,
      'member_name', _display->>'full_name',
      'role', _inv.role,
      'position', _inv.position
    )
  );

  RETURN jsonb_build_object(
    'ok',           true,
    'college_id',   _inv.college_id,
    'college_name', COALESCE(_college_name, 'your committee'),
    'role',         _inv.role,
    'position',     _inv.position,
    'role_label',   _role_label
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_team_invitation_by_token(text) TO authenticated;

-- 10. Drop and Create decline_team_invitation_by_token RPC
DROP FUNCTION IF EXISTS public.decline_team_invitation_by_token(text);
CREATE OR REPLACE FUNCTION public.decline_team_invitation_by_token(_token text)
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
  WHERE token = _token
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'This invitation is no longer available. It may have expired or already been answered.';
  END IF;

  UPDATE public.team_invitations
  SET status = 'declined', responded_at = now()
  WHERE id = _inv.id;

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
    AND metadata->>'invitation_id' = _inv.id::text;

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
      'invitation_id', _inv.id,
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

GRANT EXECUTE ON FUNCTION public.decline_team_invitation_by_token(text) TO authenticated;

-- 11. Drop and Create/replace get_invitation_by_token to check college/organizer invitations
DROP FUNCTION IF EXISTS public.get_invitation_by_token(text);
CREATE OR REPLACE FUNCTION public.get_invitation_by_token(_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _college_inv record;
  _college     record;
BEGIN
  -- Check college invitations
  SELECT * INTO _college_inv FROM public.team_invitations WHERE token = _token;
  IF FOUND THEN
    SELECT name INTO _college FROM public.colleges WHERE id = _college_inv.college_id;
    RETURN jsonb_build_object(
      'ok',            true,
      'type',          'organizer',
      'status',        _college_inv.status,
      'company_name',  _college.name,
      'role',          _college_inv.role,
      'position',      _college_inv.position,
      'message',       _college_inv.message,
      'invitee_email', _college_inv.invitee_email,
      'expires_at',    COALESCE(_college_inv.created_at + interval '7 days', now() + interval '7 days'),
      'expired',       COALESCE(_college_inv.created_at + interval '7 days', now() + interval '7 days') < now()
    );
  END IF;

  RETURN jsonb_build_object('ok', false, 'error', 'Invitation not found');
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_invitation_by_token(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_invitation_by_token(text) TO anon;
