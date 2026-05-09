
-- Fix colleges table constraints to allow pending registrations via signup trigger

ALTER TABLE public.colleges ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE public.colleges ALTER COLUMN domain DROP NOT NULL;
ALTER TABLE public.colleges ALTER COLUMN city DROP NOT NULL;

-- Also update the handle_new_user trigger to generate a temporary slug if possible
-- or just leave it null as it's now optional.

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
    _college_name := new.raw_user_meta_data->>'full_name'; -- For college role, 'full_name' is the college name
    
    -- Check if college exists
    SELECT id INTO _college_id FROM public.colleges WHERE name = _college_name LIMIT 1;
    
    IF _college_id IS NULL THEN
      -- Generate temp slug from name
      _temp_slug := lower(regexp_replace(_college_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 8);

      -- Create new college (status: pending)
      INSERT INTO public.colleges (name, slug, status, domain, city)
      VALUES (_college_name, _temp_slug, 'pending', 'pending.edu', 'Pending')
      RETURNING id INTO _college_id;
      
      -- Add as admin (approved)
      INSERT INTO public.college_members (college_id, user_id, role, is_approved)
      VALUES (_college_id, new.id, 'admin', true);
    ELSE
      -- College exists, add as pending member
      INSERT INTO public.college_members (college_id, user_id, role, is_approved)
      VALUES (_college_id, new.id, 'member', false);
    END IF;
  END IF;

  RETURN new;
END;
$$;
