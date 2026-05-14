-- Helper function to get current user's college_id
CREATE OR REPLACE FUNCTION public.get_my_college_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT college_id FROM public.student_profiles WHERE id = auth.uid();
$$;

-- Update student_profiles policies to only allow viewing same college profiles
DROP POLICY IF EXISTS "anyone can view public profiles" ON public.student_profiles;
CREATE POLICY "view_same_college_profiles" ON public.student_profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() OR
    college_id = public.get_my_college_id()
  );

-- Update follows policies to only allow following same college students
DROP POLICY IF EXISTS "users can follow others" ON public.follows;
CREATE POLICY "follow_same_college_students" ON public.follows
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = follower_id AND
    (SELECT college_id FROM public.student_profiles WHERE id = follower_id) = 
    (SELECT college_id FROM public.student_profiles WHERE id = following_id)
  );

-- Also update select policy for follows to be more consistent
DROP POLICY IF EXISTS "anyone can view follows" ON public.follows;
CREATE POLICY "view_same_college_follows" ON public.follows
  FOR SELECT TO authenticated
  USING (
    follower_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.student_profiles sp
        WHERE sp.id = follows.following_id AND sp.college_id = public.get_my_college_id()
    )
  );
