
-- College Management Refactor

-- 1. Internal Roles Enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'college_internal_role') THEN
    CREATE TYPE public.college_internal_role AS ENUM ('admin', 'coordinator', 'ticket_poc', 'member');
  END IF;
END
$$;

-- 2. College Members Table
CREATE TABLE IF NOT EXISTS public.college_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.college_internal_role NOT NULL DEFAULT 'member',
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(college_id, user_id)
);

-- Enable RLS
ALTER TABLE public.college_members ENABLE ROW LEVEL SECURITY;

-- Policies for college_members
CREATE POLICY "Users can view members of their own college"
  ON public.college_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.college_members m
      WHERE m.college_id = college_members.college_id
      AND m.user_id = auth.uid()
      AND m.is_approved = true
    )
    OR
    user_id = auth.uid()
  );

CREATE POLICY "Admins can manage members of their own college"
  ON public.college_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.college_members m
      WHERE m.college_id = college_members.college_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
      AND m.is_approved = true
    )
  );

-- 3. Update Colleges Table
ALTER TABLE public.colleges ALTER COLUMN status SET DEFAULT 'pending';

-- 4. Trigger to handle college creation and membership
CREATE OR REPLACE FUNCTION public.handle_college_membership()
RETURNS trigger AS $$
BEGIN
  -- If a new college is created, add the creator as the admin
  -- We'll assume the creator is the one linked via 'approved_by' initially 
  -- or we'll handle this in the signup RPC/logic.
  -- Actually, let's make it simpler: when a college is inserted, 
  -- the creator's ID should be in a temporary column or metadata.
  -- For now, we'll rely on the application logic to insert into college_members.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Helper function to check if user is college admin
CREATE OR REPLACE FUNCTION public.is_college_admin(_college_id uuid, _user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.college_members
    WHERE college_id = _college_id
    AND user_id = _user_id
    AND role = 'admin'
    AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
