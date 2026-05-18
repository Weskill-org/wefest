-- Discount Coupons Feature
-- Adds discount coupon management for subscription plans

-- 1. Discount Coupons table
CREATE TABLE IF NOT EXISTS public.discount_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL DEFAULT '',
  discount_amount integer NOT NULL DEFAULT 0,
  min_plan_amount integer NOT NULL DEFAULT 0,
  usage_limit integer, -- NULL means unlimited
  used_count integer NOT NULL DEFAULT 0,
  expiry_date timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint on code (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS discount_coupons_code_unique ON public.discount_coupons (UPPER(code));

ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read active coupons (for validation)
CREATE POLICY "authenticated can read active coupons"
  ON public.discount_coupons FOR SELECT TO authenticated
  USING (is_active = true);

-- Admins can do everything
CREATE POLICY "admins can manage coupons"
  ON public.discount_coupons FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 2. Coupon Usages table (one use per user per coupon)
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.discount_coupons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(coupon_id, user_id)
);

ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- Users can see their own usages
CREATE POLICY "users can view own coupon usages"
  ON public.coupon_usages FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can see all usages
CREATE POLICY "admins can view all coupon usages"
  ON public.coupon_usages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Service role inserts usages (edge function)
CREATE POLICY "service can insert coupon usages"
  ON public.coupon_usages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Extend subscriptions table with coupon fields
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS discount_amount integer DEFAULT 0;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS original_amount integer DEFAULT 0;

-- 4. Validate Coupon RPC
CREATE OR REPLACE FUNCTION public.validate_coupon(
  _code text,
  _user_id uuid,
  _plan_amount integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _coupon record;
  _already_used boolean;
BEGIN
  -- Find coupon (case-insensitive)
  SELECT * INTO _coupon
  FROM public.discount_coupons
  WHERE UPPER(code) = UPPER(_code);

  -- Check if coupon exists
  IF _coupon IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'discount_amount', 0, 'message', 'Invalid coupon code');
  END IF;

  -- Check if active
  IF NOT _coupon.is_active THEN
    RETURN jsonb_build_object('valid', false, 'discount_amount', 0, 'message', 'This coupon is no longer active');
  END IF;

  -- Check expiry
  IF _coupon.expiry_date IS NOT NULL AND _coupon.expiry_date < now() THEN
    RETURN jsonb_build_object('valid', false, 'discount_amount', 0, 'message', 'This coupon has expired');
  END IF;

  -- Check usage limit
  IF _coupon.usage_limit IS NOT NULL AND _coupon.used_count >= _coupon.usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'discount_amount', 0, 'message', 'This coupon has reached its usage limit');
  END IF;

  -- Check if user already used this coupon
  SELECT EXISTS(
    SELECT 1 FROM public.coupon_usages
    WHERE coupon_id = _coupon.id AND user_id = _user_id
  ) INTO _already_used;

  IF _already_used THEN
    RETURN jsonb_build_object('valid', false, 'discount_amount', 0, 'message', 'You have already used this coupon');
  END IF;

  -- Check minimum plan amount
  IF _coupon.min_plan_amount > 0 AND _plan_amount < _coupon.min_plan_amount THEN
    RETURN jsonb_build_object('valid', false, 'discount_amount', 0, 'message',
      'Minimum plan amount of ₹' || _coupon.min_plan_amount || ' required for this coupon');
  END IF;

  -- Coupon is valid
  RETURN jsonb_build_object(
    'valid', true,
    'discount_amount', _coupon.discount_amount,
    'coupon_id', _coupon.id,
    'coupon_name', _coupon.name,
    'message', 'Coupon applied successfully! You save ₹' || _coupon.discount_amount
  );
END;
$$;
