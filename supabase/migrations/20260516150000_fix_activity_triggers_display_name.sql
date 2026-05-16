-- student_profiles has full_name, not display_name (fixes order + student activity triggers)

CREATE OR REPLACE FUNCTION public.trg_fn_log_order_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_name text;
  _product_name text;
  _college_id uuid;
BEGIN
  SELECT full_name INTO _user_name
  FROM public.student_profiles
  WHERE id = NEW.user_id;

  IF _user_name IS NULL THEN
    SELECT full_name INTO _user_name
    FROM public.profiles
    WHERE user_id = NEW.user_id;
  END IF;

  SELECT p.name, e.college_id INTO _product_name, _college_id
  FROM public.products p
  JOIN public.events e ON e.id = p.event_id
  WHERE p.id = NEW.product_id;

  PERFORM public.log_activity(
    'order_created',
    'New Order Placed',
    COALESCE(_user_name, 'A student') || ' ordered ' || NEW.quantity || 'x ' || COALESCE(_product_name, 'merchandise'),
    NEW.user_id,
    NULL,
    jsonb_build_object('quantity', NEW.quantity, 'product_name', _product_name),
    _college_id
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_fn_log_student_joined()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _college_name text;
BEGIN
  SELECT name INTO _college_name FROM public.colleges WHERE id = NEW.college_id;

  PERFORM public.log_activity(
    'student_joined',
    'New Community Member',
    COALESCE(NEW.full_name, 'A new student') || ' joined the ' || COALESCE(_college_name, 'college') || ' community!',
    NEW.id,
    NULL,
    jsonb_build_object('college_id', NEW.college_id),
    NEW.college_id
  );
  RETURN NEW;
END;
$$;
