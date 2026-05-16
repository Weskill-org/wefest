-- Ensure every student has a referral code (callable from app when missing)
CREATE OR REPLACE FUNCTION public.ensure_student_referral_code(_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _code text;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;

  SELECT referral_code INTO _code
  FROM public.student_profiles
  WHERE id = _user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STUDENT_PROFILE_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  IF _code IS NOT NULL AND trim(_code) <> '' THEN
    RETURN _code;
  END IF;

  _code := public.generate_referral_code();

  UPDATE public.student_profiles
  SET referral_code = _code
  WHERE id = _user_id
    AND (referral_code IS NULL OR trim(referral_code) = '');

  IF NOT FOUND THEN
    SELECT referral_code INTO _code
    FROM public.student_profiles
    WHERE id = _user_id;
  END IF;

  RETURN _code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_student_referral_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_student_referral_code(uuid) TO service_role;
