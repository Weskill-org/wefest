-- Fix team list RPCs: do not join auth.users (permission denied in hosted Supabase)

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
    COALESCE(NULLIF(trim(p.email), ''), '') AS invitee_email
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
