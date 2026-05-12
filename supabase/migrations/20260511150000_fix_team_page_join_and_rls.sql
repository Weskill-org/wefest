
-- 1. Add foreign key to fix join between college_members and profiles
ALTER TABLE public.college_members
ADD CONSTRAINT college_members_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
ON DELETE CASCADE;

-- 2. Create a helper function to check membership without recursion
CREATE OR REPLACE FUNCTION public.is_college_member(_college_id uuid, _user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.college_members
    WHERE college_id = _college_id
    AND user_id = _user_id
    AND is_approved = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- 3. Loosen SELECT policy to allow all members to see their team
DROP POLICY IF EXISTS "members_select_own_or_same_college" ON public.college_members;

CREATE POLICY "members_select_own_or_same_college"
  ON public.college_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    public.is_college_member(college_id, auth.uid())
  );
