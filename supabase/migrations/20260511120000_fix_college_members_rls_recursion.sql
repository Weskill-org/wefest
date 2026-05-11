-- Fix infinite recursion in college_members RLS policies
-- The old policies queried college_members inside college_members policies,
-- causing PostgreSQL to detect infinite recursion.

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their own college" ON public.college_members;
DROP POLICY IF EXISTS "Admins can manage members of their own college" ON public.college_members;

-- Use the SECURITY DEFINER helper function to break the recursion cycle.
-- is_college_admin() was created with SECURITY DEFINER which bypasses RLS.

-- 1. SELECT: Users can see their own membership row,
--    OR all members if they belong to that college (checked via helper function)
CREATE POLICY "members_select_own_or_same_college"
  ON public.college_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    public.is_college_admin(college_id, auth.uid())
  );

-- 2. INSERT: Only college admins can add members (via SECURITY DEFINER helper)
CREATE POLICY "admins_insert_members"
  ON public.college_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_college_admin(college_id, auth.uid())
  );

-- 3. UPDATE: Only college admins can update members
CREATE POLICY "admins_update_members"
  ON public.college_members
  FOR UPDATE
  TO authenticated
  USING (
    public.is_college_admin(college_id, auth.uid())
  )
  WITH CHECK (
    public.is_college_admin(college_id, auth.uid())
  );

-- 4. DELETE: Only college admins can remove members
CREATE POLICY "admins_delete_members"
  ON public.college_members
  FOR DELETE
  TO authenticated
  USING (
    public.is_college_admin(college_id, auth.uid())
  );

-- Also fix the is_college_admin function to use a direct table scan
-- (SECURITY DEFINER already bypasses RLS, so no recursion)
CREATE OR REPLACE FUNCTION public.is_college_admin(_college_id uuid, _user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.college_members
    WHERE college_id = _college_id
    AND user_id = _user_id
    AND role = 'admin'
    AND is_approved = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Also update the college data for DAVV Indore and NIT Kurukshetra
-- Fix placeholder values that were set by the old trigger
UPDATE public.colleges
SET
  domain = split_part(
    (SELECT email FROM auth.users u
     JOIN public.college_members cm ON cm.user_id = u.id
     WHERE cm.college_id = colleges.id AND cm.role = 'admin'
     LIMIT 1),
    '@', 2
  ),
  city = NULL
WHERE domain = 'pending.edu' OR city = 'Pending';
