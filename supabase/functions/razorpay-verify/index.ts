import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const COINS_PER_INR = 10;
const inrToCoins = (inr: number) => Math.round(inr * COINS_PER_INR);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const secret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!secret) throw new Error("Razorpay not configured");

    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supaUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json({ error: "Missing fields" }, 400);
    }

    const expected = createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expected !== razorpay_signature) return json({ error: "Invalid signature" }, 400);

    const admin = createClient(supaUrl, serviceKey, {
      auth: { persistSession: false }
    });
    const { data: order, error } = await admin
      .from("razorpay_orders")
      .select("id, user_id, status, coins_to_credit, purpose, notes, amount_paise")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) return json({ error: "Order not found" }, 404);
    if (order.user_id !== userId) return json({ error: "Order does not belong to user" }, 403);
    if (order.status === "paid") return json({ ok: true, alreadyProcessed: true });

    const purpose = order.purpose as string;
    const notes = (order.notes ?? {}) as Record<string, any>;

    // Mark as paid first to prevent duplicate processing if any sub-step fails partially.
    await admin.from("razorpay_orders").update({
      status: "paid",
      razorpay_payment_id,
      razorpay_signature,
      paid_at: new Date().toISOString(),
    }).eq("id", order.id);

    const result: Record<string, unknown> = { ok: true, purpose };

    if (purpose === "wallet_topup") {
      await admin.rpc("wallet_credit", {
        _user_id: userId,
        _amount_coins: order.coins_to_credit,
        _type: "topup",
        _description: "Razorpay top-up",
        _reference_type: "razorpay",
        _reference_id: razorpay_payment_id,
      });
      await admin.from("razorpay_orders").update({ credited_at: new Date().toISOString() }).eq("id", order.id);
      result.coinsCredited = order.coins_to_credit;

    } else if (purpose === "ticket_purchase") {
      const totalInr = Number(notes.totalInr);
      const organizerId = notes.organizerId as string;
      const eventId = notes.eventId as string;
      const tier = notes.tier as string;
      const eventTitle = (notes.eventTitle as string) ?? "Event";
      const walletCoinsToUse = Math.max(0, Number(notes.walletCoinsToUse ?? 0));
      const totalCoins = inrToCoins(totalInr);

      // Debit user wallet portion (if any)
      if (walletCoinsToUse > 0) {
        const { error: dErr } = await admin.rpc("wallet_debit", {
          _user_id: userId,
          _amount_coins: walletCoinsToUse,
          _type: "purchase",
          _description: `Ticket (wallet portion): ${eventTitle} (${tier})`,
          _reference_type: "ticket",
          _reference_id: eventId,
          _counterparty: organizerId,
        });
        if (dErr) throw new Error(`Wallet debit failed: ${dErr.message}`);
      }

      // Credit organizer with full total coins (sale)
      console.log(`[Verify] Crediting organizer ${organizerId} with ${totalCoins} coins`);
      if (totalCoins > 0) {
        const { error: cErr } = await admin.rpc("wallet_credit", {
          _user_id: organizerId,
          _amount_coins: totalCoins,
          _type: "sale",
          _description: `Sale: ${eventTitle} (${tier})`,
          _reference_type: "ticket",
          _reference_id: eventId,
          _counterparty: userId,
          _metadata: { tier, payment_id: razorpay_payment_id, wallet_portion_coins: walletCoinsToUse },
        });
        if (cErr) throw new Error(`Organizer credit failed: ${cErr.message}`);
      }

      // Insert ticket
      const code = `${eventTitle.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const { error: tkErr } = await admin.from("tickets").insert({
        user_id: userId, event_id: eventId, tier, code,
      });
      if (tkErr) throw new Error(`Ticket creation failed: ${tkErr.message}`);

      await admin.from("razorpay_orders").update({ credited_at: new Date().toISOString() }).eq("id", order.id);
      result.ticketCode = code;
      result.tier = tier;

    } else if (purpose === "product_purchase") {
      const totalInr = Number(notes.totalInr);
      const organizerId = notes.organizerId as string;
      if (!organizerId) throw new Error("Missing organizerId in payment notes");

      const productId = notes.productId as string;
      const productName = (notes.productName as string) ?? "Product";
      const quantity = Math.max(1, Number(notes.quantity ?? 1));
      const shippingAddress = (notes.shippingAddress as string) ?? "Pickup at Campus";
      const walletCoinsToUse = Math.max(0, Number(notes.walletCoinsToUse ?? 0));
      const totalCoins = inrToCoins(totalInr);

      console.log(`[Verify] Processing product purchase. Total: ${totalInr} INR, Coins: ${totalCoins}, Wallet Use: ${walletCoinsToUse}`);

      if (walletCoinsToUse > 0) {
        console.log(`[Verify] Debiting user ${userId} for ${walletCoinsToUse} coins`);
        const { error: dErr } = await admin.rpc("wallet_debit", {
          _user_id: userId,
          _amount_coins: walletCoinsToUse,
          _type: "purchase",
          _description: `Shop (wallet portion): ${productName} x${quantity}`,
          _reference_type: "order",
          _reference_id: productId,
          _counterparty: organizerId,
        });
        if (dErr) throw new Error(`Wallet debit failed: ${dErr.message}`);
      }

      if (totalCoins > 0) {
        console.log(`[Verify] Crediting organizer ${organizerId} for ${totalCoins} coins`);
        const { error: cErr } = await admin.rpc("wallet_credit", {
          _user_id: organizerId,
          _amount_coins: totalCoins,
          _type: "sale",
          _description: `Sale: ${productName} x${quantity}`,
          _reference_type: "order",
          _reference_id: productId,
          _counterparty: userId,
          _metadata: { quantity, payment_id: razorpay_payment_id, wallet_portion_coins: walletCoinsToUse },
        });
        if (cErr) throw new Error(`Organizer credit failed: ${cErr.message}`);
      }

      console.log(`[Verify] Creating order for user ${userId}, product ${productId}`);
      const { data: orderRow, error: oErr } = await admin.from("orders").insert({
        user_id: userId,
        product_id: productId,
        quantity,
        total_amount: totalInr,
        shipping_address: shippingAddress,
        status: "paid",
      }).select("id").single();
      if (oErr) throw new Error(oErr.message);

      // Decrement stock atomically-ish
      const { data: prod } = await admin.from("products").select("stock").eq("id", productId).maybeSingle();
      if (prod) {
        await admin.from("products").update({
          stock: Math.max(0, Number(prod.stock) - quantity),
        }).eq("id", productId);
      }

      await admin.from("razorpay_orders").update({ credited_at: new Date().toISOString() }).eq("id", order.id);
      result.orderId = orderRow.id;
    } else if (purpose === "subscription_purchase") {
      const planType = notes.planType as string;
      const couponCode = (notes.couponCode as string) || null;
      const discountAmount = Number(notes.discountAmount ?? 0);
      const originalAmount = Number(notes.originalAmount ?? notes.totalInr ?? 0);
      const couponId = (notes.couponId as string) || null;
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

      // Upsert the subscription with coupon details
      const { data: existingSub } = await admin
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      const subData = {
        plan_type: planType,
        status: "active",
        current_period_end: currentPeriodEnd.toISOString(),
        coupon_code: couponCode,
        discount_amount: discountAmount,
        original_amount: originalAmount,
      };

      if (existingSub) {
        const { error: subErr } = await admin.from("subscriptions").update(subData).eq("id", existingSub.id);
        if (subErr) throw new Error(`Subscription update failed: ${subErr.message}`);
      } else {
        const { error: subErr } = await admin.from("subscriptions").insert({ user_id: userId, ...subData });
        if (subErr) throw new Error(`Subscription creation failed: ${subErr.message}`);
      }

      // Record coupon usage if coupon was applied
      if (couponId && couponCode) {
        console.log(`[Verify] Recording coupon usage: ${couponCode} by user ${userId}`);
        await admin.from("coupon_usages").insert({ coupon_id: couponId, user_id: userId }).catch(() => {});
        const { data: cd } = await admin.from("discount_coupons").select("used_count").eq("id", couponId).single();
        if (cd) {
          await admin.from("discount_coupons").update({ used_count: cd.used_count + 1 }).eq("id", couponId);
        }
      }

      await admin.from("razorpay_orders").update({ credited_at: new Date().toISOString() }).eq("id", order.id);

      // Record transaction history for billing section
      console.log(`[Verify] Logging paid subscription transaction for plan ${planType}`);
      const paidAmountInr = Math.round(order.amount_paise / 100);
      const { error: txErr } = await admin.from("transactions").insert({
        user_id: userId,
        amount: paidAmountInr,
        currency: "INR",
        status: "completed",
        description: `${planType} Plan Subscription Purchase`,
        metadata: {
          purpose,
          planType,
          couponCode,
          discountAmount,
          originalAmount,
          razorpay_order_id,
          razorpay_payment_id
        },
      });
      if (txErr) {
        console.error("[Verify] Failed to insert subscription transaction record:", txErr);
      }

      result.planType = planType;
      if (couponCode) result.couponCode = couponCode;
      if (discountAmount > 0) result.discountAmount = discountAmount;
    }

    // Mark razorpay order as completed
    console.log(`[Verify] Marking razorpay_order ${order.id} as completed`);
    const { error: finalUpErr } = await admin.from("razorpay_orders").update({
      status: "completed",
      verified_at: new Date().toISOString(),
    }).eq("id", order.id);
    if (finalUpErr) console.error("[Verify] Final update error:", finalUpErr);

    return json(result);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
