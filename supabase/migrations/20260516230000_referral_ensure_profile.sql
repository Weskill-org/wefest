-- Ensure referred user has a student_profiles row before applying referral
CREATE OR REPLACE FUNCTION public.process_referral(
  _referred_user_id uuid,
  _referral_code text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _code text;
  _referrer_id uuid;
  _reward bigint := 150;
  _referral_id uuid;
  _referrer_tx uuid;
  _referred_tx uuid;
  _full_name text;
BEGIN
  IF _referred_user_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_REFERRAL' USING ERRCODE = 'P0001';
  END IF;

  _code := upper(trim(_referral_code));
  IF _code IS NULL OR _code = '' THEN
    RAISE EXCEPTION 'INVALID_REFERRAL' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.student_profiles
    WHERE id = _referred_user_id AND referred_by IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'ALREADY_REFERRED' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.referrals WHERE referred_id = _referred_user_id
  ) THEN
    RAISE EXCEPTION 'ALREADY_REFERRED' USING ERRCODE = 'P0001';
  END IF;

  SELECT id INTO _referrer_id
  FROM public.student_profiles
  WHERE referral_code = _code;

  IF _referrer_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_REFERRAL' USING ERRCODE = 'P0001';
  END IF;

  IF _referrer_id = _referred_user_id THEN
    RAISE EXCEPTION 'SELF_REFERRAL' USING ERRCODE = 'P0001';
  END IF;

  SELECT COALESCE(raw_user_meta_data->>'full_name', '') INTO _full_name
  FROM auth.users
  WHERE id = _referred_user_id;

  INSERT INTO public.student_profiles (id, full_name)
  VALUES (_referred_user_id, _full_name)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.referrals (
    referrer_id,
    referred_id,
    referral_code,
    reward_coins,
    status
  ) VALUES (
    _referrer_id,
    _referred_user_id,
    _code,
    _reward,
    'credited'
  )
  RETURNING id INTO _referral_id;

  UPDATE public.student_profiles
  SET referred_by = _referrer_id
  WHERE id = _referred_user_id;

  _referrer_tx := public.wallet_credit(
    _referrer_id,
    _reward,
    'referral',
    'Referral reward — friend joined WeFest',
    'referral',
    _referral_id::text,
    _referred_user_id,
    jsonb_build_object('referral_code', _code, 'role', 'referrer')
  );

  _referred_tx := public.wallet_credit(
    _referred_user_id,
    _reward,
    'referral',
    'Welcome bonus — referral signup',
    'referral',
    _referral_id::text,
    _referrer_id,
    jsonb_build_object('referral_code', _code, 'role', 'referred')
  );

  RETURN jsonb_build_object(
    'success', true,
    'referral_id', _referral_id,
    'reward_coins', _reward,
    'referrer_id', _referrer_id,
    'referrer_tx_id', _referrer_tx,
    'referred_tx_id', _referred_tx
  );
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'ALREADY_REFERRED' USING ERRCODE = 'P0001';
END;
$$;
