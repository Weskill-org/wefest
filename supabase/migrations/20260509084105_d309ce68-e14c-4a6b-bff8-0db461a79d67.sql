
-- Company approval flow
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  company_name text NOT NULL,
  industry text,
  website_url text,
  status text NOT NULL DEFAULT 'pending',
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users view own company profile" ON public.company_profiles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users insert own company profile" ON public.company_profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own company profile" ON public.company_profiles
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "admins view all company profiles" ON public.company_profiles
FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "admins update company profiles" ON public.company_profiles
FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE TRIGGER trg_company_profiles_updated_at
BEFORE UPDATE ON public.company_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update handle_new_user to also create pending company profile for company role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _role public.app_role;
  _role_text text;
  _college_id uuid;
  _college_name text;
  _temp_slug text;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));

  _role_text := COALESCE(new.raw_user_meta_data->>'role', 'student');
  IF _role_text NOT IN ('student','college','company') THEN
    _role_text := 'student';
  END IF;
  _role := _role_text::public.app_role;

  INSERT INTO public.user_roles (user_id, role) VALUES (new.id, _role)
  ON CONFLICT DO NOTHING;

  IF _role = 'college' THEN
    _college_name := new.raw_user_meta_data->>'full_name';
    SELECT id INTO _college_id FROM public.colleges WHERE name = _college_name LIMIT 1;
    IF _college_id IS NULL THEN
      _temp_slug := lower(regexp_replace(_college_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 8);
      INSERT INTO public.colleges (name, slug, status, domain, city)
      VALUES (_college_name, _temp_slug, 'pending', 'pending.edu', 'Pending')
      RETURNING id INTO _college_id;
      INSERT INTO public.college_members (college_id, user_id, role, is_approved)
      VALUES (_college_id, new.id, 'admin', true);
    ELSE
      INSERT INTO public.college_members (college_id, user_id, role, is_approved)
      VALUES (_college_id, new.id, 'member', false);
    END IF;
  ELSIF _role = 'company' THEN
    INSERT INTO public.company_profiles (user_id, company_name, status)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name',''), 'pending')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN new;
END;
$function$;

-- Allow admins to insert and delete admin_users (Superadmin only via app), but enable RLS write
CREATE POLICY "superadmin manage admins" ON public.admin_users
FOR ALL TO authenticated
USING (EXISTS(SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid() AND a.rank = 'Superadmin'))
WITH CHECK (EXISTS(SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid() AND a.rank = 'Superadmin'));

-- Helper function to check super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM admin_users WHERE user_id = _user_id AND rank = 'Superadmin')
$$;
