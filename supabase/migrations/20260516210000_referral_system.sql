-- ========== REFERRAL SYSTEM ==========

-- Extend wallet transaction type for referral rewards
ALTER TYPE public.wallet_tx_type ADD VALUE IF NOT EXISTS 'referral';

-- Student profile referral fields
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS student_profiles_referral_code_idx
  ON public.student_profiles (referral_code)
  WHERE referral_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS student_profiles_referred_by_idx
  ON public.student_profiles (referred_by)
  WHERE referred_by IS NOT NULL;

-- Referral events ledger
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  reward_coins bigint NOT NULL DEFAULT 150 CHECK (reward_coins > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'credited')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referrals_referred_id_unique UNIQUE (referred_id),
  CONSTRAINT referrals_no_self_referral CHECK (referrer_id <> referred_id)
);

CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON public.referrals (referrer_id);
CREATE INDEX IF NOT EXISTS referrals_created_at_idx ON public.referrals (created_at DESC);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own referrals" ON public.referrals;
CREATE POLICY "users read own referrals" ON public.referrals
  FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

DROP POLICY IF EXISTS "admins read all referrals" ON public.referrals;
CREATE POLICY "admins read all referrals" ON public.referrals
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Generate unique referral codes (WF-XXXXXX)
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  _chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  _code text;
  _i int;
  _attempt int := 0;
BEGIN
  LOOP
    _code := 'WF-';
    FOR _i IN 1..6 LOOP
      _code := _code || substr(_chars, 1 + floor(random() * length(_chars))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.student_profiles WHERE referral_code = _code
    );
    _attempt := _attempt + 1;
    IF _attempt > 50 THEN
      RAISE EXCEPTION 'Failed to generate unique referral code';
    END IF;
  END LOOP;
  RETURN _code;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_student_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_student_referral_code ON public.student_profiles;
CREATE TRIGGER trg_set_student_referral_code
  BEFORE INSERT ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_student_referral_code();

-- Backfill referral codes for existing students
UPDATE public.student_profiles
SET referral_code = public.generate_referral_code()
WHERE referral_code IS NULL OR referral_code = '';

-- Process referral: credit both parties once per referred user
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
BEGIN
  IF _referred_user_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_REFERRAL' USING ERRCODE = 'P0001',
      MESSAGE = 'Referred user is required';
  END IF;

  _code := upper(trim(_referral_code));
  IF _code IS NULL OR _code = '' THEN
    RAISE EXCEPTION 'INVALID_REFERRAL' USING ERRCODE = 'P0001',
      MESSAGE = 'Referral code is required';
  END IF;

  -- Already referred (profile or ledger)
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
    RAISE EXCEPTION 'INVALID_REFERRAL' USING ERRCODE = 'P0001',
      MESSAGE = 'Referral code not found';
  END IF;

  IF _referrer_id = _referred_user_id THEN
    RAISE EXCEPTION 'SELF_REFERRAL' USING ERRCODE = 'P0001';
  END IF;

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

-- Allow students to update their own referral code if it is currently null (fail-safe)
CREATE POLICY "Students can set their own referral code once" ON public.student_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id AND (referral_code IS NULL OR referral_code = ''))
  WITH CHECK (auth.uid() = id);

GRANT EXECUTE ON FUNCTION public.process_referral(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_referral(uuid, text) TO service_role;
