
-- This migration fixes the recursive RLS policy on admin_users which was causing 500 errors.

-- 1. Drop the problematic recursive policy if it exists
DROP POLICY IF EXISTS "superadmin manage admins" ON public.admin_users;

-- 2. Ensure the helper function exists (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = _user_id AND rank = 'Superadmin'
  );
END;
$$;

-- 3. Re-create the management policy using the helper function to avoid recursion
-- This policy is for writing (insert/update/delete)
CREATE POLICY "superadmin manage admins" ON public.admin_users
FOR ALL TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- 4. Ensure there is a simple non-recursive select policy for everyone authenticated
DROP POLICY IF EXISTS "admin_users read" ON public.admin_users;
CREATE POLICY "admin_users read" ON public.admin_users 
FOR SELECT TO authenticated 
USING (true);

-- 5. Fix policies on other tables that might be recursive or causing issues
-- Ensure broadcast_messages policy is clean
DROP POLICY IF EXISTS "admins can read all broadcasts" ON public.broadcast_messages;
CREATE POLICY "admins can read all broadcasts" ON public.broadcast_messages 
FOR SELECT TO authenticated
USING (public.is_super_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Wait, using EXISTS in the policy again might still be risky if there's any other policy.
-- Let's just use a helper function for "is_admin" as well.

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = _user_id
  );
END;
$$;

DROP POLICY IF EXISTS "admins can read all broadcasts" ON public.broadcast_messages;
CREATE POLICY "admins can read all broadcasts" ON public.broadcast_messages 
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admins can insert broadcasts" ON public.broadcast_messages;
CREATE POLICY "admins can insert broadcasts" ON public.broadcast_messages 
FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admins can update broadcasts" ON public.broadcast_messages;
CREATE POLICY "admins can update broadcasts" ON public.broadcast_messages 
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));
