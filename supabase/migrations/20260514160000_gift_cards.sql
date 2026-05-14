
-- ========== GIFT CARDS ==========
CREATE TABLE IF NOT EXISTS public.gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  amount_coins bigint NOT NULL CHECK (amount_coins > 0),
  is_redeemed boolean NOT NULL DEFAULT false,
  redeemed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for fast lookup by code
CREATE INDEX IF NOT EXISTS gift_cards_code_idx ON public.gift_cards(code);

ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

-- Admins can manage gift cards
DROP POLICY IF EXISTS "admins manage gift cards" ON public.gift_cards;
CREATE POLICY "admins manage gift cards" ON public.gift_cards
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Users can view their own redemptions (optional, but good for UI)
DROP POLICY IF EXISTS "users view own redemptions" ON public.gift_cards;
CREATE POLICY "users view own redemptions" ON public.gift_cards
  FOR SELECT TO authenticated
  USING (redeemed_by = auth.uid());

-- ========== REDEMPTION FUNCTION ==========
CREATE OR REPLACE FUNCTION public.redeem_gift_card(_code text, _user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _gift_card_id uuid;
  _amount bigint;
  _tx_id uuid;
BEGIN
  -- Find and lock the gift card row
  SELECT id, amount_coins INTO _gift_card_id, _amount
  FROM public.gift_cards
  WHERE code = _code AND is_redeemed = false
  FOR UPDATE;

  IF _gift_card_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_OR_REDEEMED_CODE' USING ERRCODE = 'P0001';
  END IF;

  -- Mark as redeemed
  UPDATE public.gift_cards
  SET is_redeemed = true,
      redeemed_by = _user_id,
      redeemed_at = now()
  WHERE id = _gift_card_id;

  -- Credit the wallet using the existing wallet_credit function
  -- We use 'topup' type as it fits best, or you could add a 'gift_card' type to the enum
  _tx_id := public.wallet_credit(
    _user_id, 
    _amount, 
    'topup', 
    'Gift Card Redemption: ' || _code, 
    'gift_card', 
    _gift_card_id::text
  );

  RETURN jsonb_build_object(
    'success', true, 
    'amount', _amount, 
    'tx_id', _tx_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;
