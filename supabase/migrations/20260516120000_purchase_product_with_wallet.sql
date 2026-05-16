-- Atomic campus-store purchase: debit buyer → credit seller → order → stock (single transaction)

CREATE OR REPLACE FUNCTION public.purchase_product_with_wallet(
  _user_id uuid,
  _product_id uuid,
  _quantity int,
  _shipping_address text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _product record;
  _organizer_id uuid;
  _total_inr int;
  _coins bigint;
  _order_id uuid;
  _balance_after bigint;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  IF _quantity < 1 OR _quantity > 20 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  IF char_length(trim(_shipping_address)) < 5 THEN
    RAISE EXCEPTION 'Shipping address too short';
  END IF;

  SELECT p.id, p.name, p.price, p.stock, e.organizer_user_id
  INTO _product
  FROM public.products p
  INNER JOIN public.events e ON e.id = p.event_id
  WHERE p.id = _product_id
  FOR UPDATE OF p;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  IF _product.stock < _quantity THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;

  _organizer_id := _product.organizer_user_id;
  IF _organizer_id IS NULL THEN
    RAISE EXCEPTION 'Product has no seller wallet';
  END IF;

  _total_inr := _product.price * _quantity;
  _coins := (_total_inr * 10)::bigint;

  IF _coins <= 0 THEN
    RAISE EXCEPTION 'Invalid product price';
  END IF;

  PERFORM public.wallet_transfer(
    _from_user := _user_id,
    _to_user := _organizer_id,
    _amount_coins := _coins,
    _debit_type := 'purchase',
    _credit_type := 'sale',
    _description := format('Shop: %s x%s', _product.name, _quantity),
    _reference_type := 'order',
    _reference_id := _product_id::text,
    _metadata := jsonb_build_object('quantity', _quantity, 'total_inr', _total_inr)
  );

  INSERT INTO public.orders (user_id, product_id, quantity, total_amount, shipping_address, status)
  VALUES (_user_id, _product_id, _quantity, _total_inr, _shipping_address, 'paid')
  RETURNING id INTO _order_id;

  UPDATE public.products
  SET stock = _product.stock - _quantity
  WHERE id = _product_id;

  SELECT COALESCE(balance_coins, 0) INTO _balance_after
  FROM public.wallets
  WHERE user_id = _user_id;

  RETURN jsonb_build_object(
    'order_id', _order_id,
    'coins_debited', _coins,
    'balance_after', _balance_after
  );
END;
$$;

REVOKE ALL ON FUNCTION public.purchase_product_with_wallet(uuid, uuid, int, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purchase_product_with_wallet(uuid, uuid, int, text) TO service_role;

-- Orders must be created by trusted server paths only (wallet RPC / edge functions)
DROP POLICY IF EXISTS "users can create orders" ON public.orders;
