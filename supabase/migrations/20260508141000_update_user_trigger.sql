
-- Update handle_new_user trigger to handle college creation/membership

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger language plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role public.app_role;
  _role_text text;
  _college_id uuid;
  _college_name text;
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
      -- Create new college (status: pending)
      INSERT INTO public.colleges (name, status)
      VALUES (_college_name, 'pending')
      RETURNING id INTO _college_id;
      
      -- Add as admin (approved)
      INSERT INTO public.college_members (college_id, user_id, role, is_approved)
      VALUES (_college_id, new.id, 'admin', true);
    ELSE
      -- College exists, add as pending member
      INSERT INTO public.college_members (college_id, user_id, role, is_approved)
      VALUES (_college_id, new.id, 'member', false);
    END IF;
  ELSIF _role = 'student' THEN
    _college_id := (new.raw_user_meta_data->>'college_id')::uuid;
    IF _college_id IS NOT NULL THEN
      -- Optional: track students in college_members too? 
      -- The requirement says "Fest Cordinator, Ticket POC and more" are internal roles.
      -- Students probably don't need to be in college_members unless they become coordinators.
    END IF;
  END IF;

  RETURN new;
END;
$$;
