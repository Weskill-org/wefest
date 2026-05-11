-- Allow college admins to update their own college details
CREATE POLICY "college_admins_can_update_own_college"
  ON public.colleges
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.college_members m
      WHERE m.college_id = colleges.id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
      AND m.is_approved = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.college_members m
      WHERE m.college_id = colleges.id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
      AND m.is_approved = true
    )
  );
