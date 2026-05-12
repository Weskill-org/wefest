-- Auto-approve colleges on signup.
-- When a college registers, they are immediately verified and visible.

-- 1. Update trigger: new colleges get status = 'approved' (not 'pending')
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger language plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role public.app_role;
  _role_text text;
  _college_id uuid;
  _college_name text;
  _temp_slug text;
  _email_domain text;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );

  -- Determine role
  _role_text := COALESCE(new.raw_user_meta_data->>'role', 'student');
  IF _role_text NOT IN ('student','college','company') THEN
    _role_text := 'student';
  END IF;
  _role := _role_text::public.app_role;

  -- Insert role
  INSERT INTO public.user_roles (user_id, role) VALUES (new.id, _role)
  ON CONFLICT DO NOTHING;

  -- College logic
  IF _role = 'college' THEN
    _college_name := new.raw_user_meta_data->>'full_name';

    -- Extract domain from email
    _email_domain := split_part(new.email, '@', 2);

    -- Check if college already exists
    SELECT id INTO _college_id FROM public.colleges WHERE name = _college_name LIMIT 1;

    IF _college_id IS NULL THEN
      -- Generate slug from name
      _temp_slug := lower(regexp_replace(_college_name, '[^a-zA-Z0-9]', '-', 'g'))
                    || '-' || substr(gen_random_uuid()::text, 1, 8);

      -- Create new college — APPROVED immediately on signup
      INSERT INTO public.colleges (name, slug, status, domain, city)
      VALUES (_college_name, _temp_slug, 'approved', _email_domain, 'Not Specified')
      RETURNING id INTO _college_id;

      -- Add creator as admin
      INSERT INTO public.college_members (college_id, user_id, role, is_approved)
      VALUES (_college_id, new.id, 'admin', true);
    ELSE
      -- College exists, add as pending member
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
$$;

-- 2. Approve all existing pending colleges (they already have real accounts)
UPDATE public.colleges
SET status = 'approved'
WHERE status = 'pending';
