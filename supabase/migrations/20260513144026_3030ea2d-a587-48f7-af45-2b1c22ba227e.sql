
DO $$ BEGIN
  CREATE TYPE public.wallet_tx_type AS ENUM (
    'topup',          -- credit from Razorpay
    'purchase',       -- debit for ticket/product
    'sale',           -- credit for college/organizer (other side of purchase)
    'refund',         -- credit back
    'sponsorship',    -- debit (company → event)
    'sponsorship_received', -- credit (college receives sponsorship)
    'withdrawal',     -- debit when payout processed
    'withdrawal_hold',-- debit (held while withdrawal pending)
    'withdrawal_release', -- credit (release hold if rejected)
    'admin_adjustment'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.razorpay_order_status AS ENUM ('created', 'paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'processed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ========== WALLETS ==========
CREATE TABLE IF NOT EXISTS public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance_coins bigint NOT NULL DEFAULT 0 CHECK (balance_coins >= 0),
  held_coins bigint NOT NULL DEFAULT 0 CHECK (held_coins >= 0),
  lifetime_credited bigint NOT NULL DEFAULT 0,
  lifetime_debited bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users view own wallet" ON public.wallets;
CREATE POLICY "users view own wallet" ON public.wallets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admins view all wallets" ON public.wallets;
CREATE POLICY "admins view all wallets" ON public.wallets
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

DROP TRIGGER IF EXISTS wallets_updated_at ON public.wallets;
CREATE TRIGGER wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== WALLET TRANSACTIONS (LEDGER) ==========
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount_coins bigint NOT NULL, -- positive = credit, negative = debit
  balance_after bigint NOT NULL,
  type public.wallet_tx_type NOT NULL,
  description text,
  reference_type text,  -- e.g. 'ticket','order','sponsorship','razorpay'
  reference_id text,
  counterparty_user_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS wallet_tx_wallet_idx;
CREATE INDEX wallet_tx_wallet_idx ON public.wallet_transactions(wallet_id, created_at DESC);
DROP INDEX IF EXISTS wallet_tx_user_idx;
CREATE INDEX wallet_tx_user_idx ON public.wallet_transactions(user_id, created_at DESC);
DROP INDEX IF EXISTS wallet_tx_ref_idx;
CREATE INDEX wallet_tx_ref_idx ON public.wallet_transactions(reference_type, reference_id);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users view own transactions" ON public.wallet_transactions;
CREATE POLICY "users view own transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admins view all transactions" ON public.wallet_transactions;
CREATE POLICY "admins view all transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ========== RAZORPAY ORDERS ==========
CREATE TABLE IF NOT EXISTS public.razorpay_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  razorpay_order_id text NOT NULL UNIQUE,
  razorpay_payment_id text,
  razorpay_signature text,
  amount_paise bigint NOT NULL, -- amount in paise (INR * 100)
  coins_to_credit bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status public.razorpay_order_status NOT NULL DEFAULT 'created',
  purpose text NOT NULL DEFAULT 'wallet_topup', -- wallet_topup
  notes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  credited_at timestamptz
);

DROP INDEX IF EXISTS rzp_orders_user_idx;
CREATE INDEX rzp_orders_user_idx ON public.razorpay_orders(user_id, created_at DESC);

ALTER TABLE public.razorpay_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users view own razorpay orders" ON public.razorpay_orders;
CREATE POLICY "users view own razorpay orders" ON public.razorpay_orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admins view all razorpay orders" ON public.razorpay_orders;
CREATE POLICY "admins view all razorpay orders" ON public.razorpay_orders
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ========== WITHDRAWAL REQUESTS ==========
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_coins bigint NOT NULL CHECK (amount_coins > 0),
  amount_inr_paise bigint NOT NULL,
  status public.withdrawal_status NOT NULL DEFAULT 'pending',
  bank_account_name text NOT NULL,
  bank_account_number text NOT NULL,
  bank_ifsc text NOT NULL,
  notes text,
  rejection_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  processed_at timestamptz,
  payout_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users view own withdrawals" ON public.withdrawal_requests;
CREATE POLICY "users view own withdrawals" ON public.withdrawal_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admins view all withdrawals" ON public.withdrawal_requests;
CREATE POLICY "admins view all withdrawals" ON public.withdrawal_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins update withdrawals" ON public.withdrawal_requests;
CREATE POLICY "admins update withdrawals" ON public.withdrawal_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

DROP TRIGGER IF EXISTS withdrawal_requests_updated_at ON public.withdrawal_requests;
CREATE TRIGGER withdrawal_requests_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== AUTO-CREATE WALLET ON PROFILE CREATION ==========
CREATE OR REPLACE FUNCTION public.ensure_wallet_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (user_id) VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_create_wallet ON public.profiles;
CREATE TRIGGER profiles_create_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_wallet_for_user();

-- Backfill existing users
INSERT INTO public.wallets (user_id)
SELECT user_id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- ========== CORE WALLET FUNCTIONS ==========

-- Credit wallet (atomic)
CREATE OR REPLACE FUNCTION public.wallet_credit(
  _user_id uuid,
  _amount_coins bigint,
  _type public.wallet_tx_type,
  _description text DEFAULT NULL,
  _reference_type text DEFAULT NULL,
  _reference_id text DEFAULT NULL,
  _counterparty uuid DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _wallet_id uuid;
  _new_balance bigint;
  _tx_id uuid;
BEGIN
  IF _amount_coins <= 0 THEN
    RAISE EXCEPTION 'Credit amount must be positive';
  END IF;

  INSERT INTO public.wallets (user_id) VALUES (_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.wallets
  SET balance_coins = balance_coins + _amount_coins,
      lifetime_credited = lifetime_credited + _amount_coins,
      updated_at = now()
  WHERE user_id = _user_id
  RETURNING id, balance_coins INTO _wallet_id, _new_balance;

  INSERT INTO public.wallet_transactions
    (wallet_id, user_id, amount_coins, balance_after, type, description,
     reference_type, reference_id, counterparty_user_id, metadata)
  VALUES (_wallet_id, _user_id, _amount_coins, _new_balance, _type, _description,
          _reference_type, _reference_id, _counterparty, _metadata)
  RETURNING id INTO _tx_id;

  RETURN _tx_id;
END;
$$;

-- Debit wallet (atomic; raises if insufficient)
CREATE OR REPLACE FUNCTION public.wallet_debit(
  _user_id uuid,
  _amount_coins bigint,
  _type public.wallet_tx_type,
  _description text DEFAULT NULL,
  _reference_type text DEFAULT NULL,
  _reference_id text DEFAULT NULL,
  _counterparty uuid DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _wallet_id uuid;
  _current_balance bigint;
  _new_balance bigint;
  _tx_id uuid;
BEGIN
  IF _amount_coins <= 0 THEN
    RAISE EXCEPTION 'Debit amount must be positive';
  END IF;

  INSERT INTO public.wallets (user_id) VALUES (_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id, balance_coins INTO _wallet_id, _current_balance
  FROM public.wallets WHERE user_id = _user_id FOR UPDATE;

  IF _current_balance < _amount_coins THEN
    RAISE EXCEPTION 'INSUFFICIENT_BALANCE: have %, need %', _current_balance, _amount_coins
      USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.wallets
  SET balance_coins = balance_coins - _amount_coins,
      lifetime_debited = lifetime_debited + _amount_coins,
      updated_at = now()
  WHERE id = _wallet_id
  RETURNING balance_coins INTO _new_balance;

  INSERT INTO public.wallet_transactions
    (wallet_id, user_id, amount_coins, balance_after, type, description,
     reference_type, reference_id, counterparty_user_id, metadata)
  VALUES (_wallet_id, _user_id, -_amount_coins, _new_balance, _type, _description,
          _reference_type, _reference_id, _counterparty, _metadata)
  RETURNING id INTO _tx_id;

  RETURN _tx_id;
END;
$$;

-- Atomic transfer wallet→wallet
CREATE OR REPLACE FUNCTION public.wallet_transfer(
  _from_user uuid,
  _to_user uuid,
  _amount_coins bigint,
  _debit_type public.wallet_tx_type,
  _credit_type public.wallet_tx_type,
  _description text DEFAULT NULL,
  _reference_type text DEFAULT NULL,
  _reference_id text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _debit_tx uuid;
  _credit_tx uuid;
BEGIN
  _debit_tx := public.wallet_debit(_from_user, _amount_coins, _debit_type, _description,
    _reference_type, _reference_id, _to_user, _metadata);
  _credit_tx := public.wallet_credit(_to_user, _amount_coins, _credit_type, _description,
    _reference_type, _reference_id, _from_user, _metadata);
  RETURN jsonb_build_object('debit_tx', _debit_tx, 'credit_tx', _credit_tx);
END;
$$;
