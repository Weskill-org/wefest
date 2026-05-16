-- Team member display: store name/email on membership, resolve via SECURITY DEFINER

ALTER TABLE public.college_members
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS display_email text;

-- Resolve display info (bypasses RLS; may read auth.users for email)
CREATE OR REPLACE FUNCTION public.resolve_team_member_display(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _name  text;
  _email text;
BEGIN
  SELECT
    COALESCE(NULLIF(trim(p.full_name), ''), NULLIF(trim(sp.full_name), '')),
    NULLIF(trim(p.email), '')
  INTO _name, _email
  FROM (SELECT _user_id AS uid) x
  LEFT JOIN public.profiles p ON p.user_id = x.uid
  LEFT JOIN public.student_profiles sp ON sp.id = x.uid;

  RETURN jsonb_build_object(
    'full_name', COALESCE(
      _name,
      NULLIF(split_part(COALESCE(_email, ''), '@', 1), ''),
      'Team Member'
    ),
    'email', COALESCE(_email, '')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_team_member_display(uuid) TO authenticated;

-- Backfill existing members
UPDATE public.college_members cm
SET
  display_name = COALESCE(
    NULLIF(trim(cm.display_name), ''),
    (public.resolve_team_member_display(cm.user_id)->>'full_name')
  ),
  display_email = COALESCE(
    NULLIF(trim(cm.display_email), ''),
    (public.resolve_team_member_display(cm.user_id)->>'email')
  )
WHERE cm.user_id IS NOT NULL;

-- Auto-fill on insert/update
CREATE OR REPLACE FUNCTION public.college_members_set_display()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _d jsonb;
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NULLIF(trim(NEW.display_name), '') IS NOT NULL
     AND NULLIF(trim(NEW.display_email), '') IS NOT NULL THEN
    RETURN NEW;
  END IF;

  _d := public.resolve_team_member_display(NEW.user_id);

  NEW.display_name := COALESCE(NULLIF(trim(NEW.display_name), ''), _d->>'full_name');
  NEW.display_email := COALESCE(NULLIF(trim(NEW.display_email), ''), _d->>'email');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_college_members_set_display ON public.college_members;
CREATE TRIGGER trg_college_members_set_display
  BEFORE INSERT OR UPDATE ON public.college_members
  FOR EACH ROW
  EXECUTE FUNCTION public.college_members_set_display();

-- Organizers can view student_profiles of teammates
DROP POLICY IF EXISTS "college_team_view_teammate_student_profiles" ON public.student_profiles;
CREATE POLICY "college_team_view_teammate_student_profiles"
  ON public.student_profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.college_members mine
      JOIN public.college_members peer
        ON peer.college_id = mine.college_id
       AND peer.user_id = student_profiles.id
      WHERE mine.user_id = auth.uid()
        AND mine.is_approved = true
    )
  );

-- Team list RPC (no auth.users — email from profiles + display columns)
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
    COALESCE(
      NULLIF(trim(cm.display_name), ''),
      NULLIF(trim(p.full_name), ''),
      NULLIF(trim(sp.full_name), ''),
      'Team Member'
    ) AS full_name,
    COALESCE(
      NULLIF(trim(cm.display_email), ''),
      NULLIF(trim(p.email), ''),
      ''
    ) AS email,
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

-- Accept invitation: persist display + role on membership
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
  _display       jsonb;
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
  _display := public.resolve_team_member_display(_user_id);

  UPDATE public.team_invitations
  SET status = 'accepted', responded_at = now()
  WHERE id = _invitation_id;

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
    format('%s joined %s as %s.',
      _display->>'full_name',
      COALESCE(_college_name, 'your committee'),
      _role_label
    ),
    'team_response',
    jsonb_build_object(
      'invitation_id', _invitation_id,
      'college_id', _inv.college_id,
      'accepted', true,
      'member_user_id', _user_id,
      'member_name', _display->>'full_name',
      'role', _inv.role,
      'position', _inv.position
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

-- Refresh one member's cached display (after profile edit)
CREATE OR REPLACE FUNCTION public.refresh_college_member_display(_member_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row record;
  _d jsonb;
BEGIN
  SELECT cm.id, cm.user_id, cm.college_id INTO _row
  FROM public.college_members cm
  WHERE cm.id = _member_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found';
  END IF;

  IF NOT public.is_college_member(_row.college_id, auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  _d := public.resolve_team_member_display(_row.user_id);

  UPDATE public.college_members
  SET display_name = _d->>'full_name',
      display_email = _d->>'email'
  WHERE id = _member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refresh_college_member_display(uuid) TO authenticated;
