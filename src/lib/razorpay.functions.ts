import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createHmac, timingSafeEqual } from "crypto";
import { inrToCoins } from "./wallet.functions";

const RZP_BASE = "https://api.razorpay.com/v1";

function authHeader() {
  const id = process.env.RAZORPAY_KEY_ID!;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  if (!id || !secret) throw new Error("Razorpay keys not configured");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

/** Returns the public Razorpay key id for the browser checkout SDK. */
export const getRazorpayKeyId = createServerFn({ method: "GET" }).handler(async () => {
  const id = process.env.RAZORPAY_KEY_ID;
  if (!id) throw new Error("Razorpay not configured");
  return { keyId: id };
});

/** Create a Razorpay order to top up wallet. amountInr in rupees. */
const topupInput = z.object({ amountInr: z.number().int().min(10).max(500_000) });
export const createWalletTopupOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => topupInput.parse(d))
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const amountPaise = data.amountInr * 100;
    const coins = inrToCoins(data.amountInr);

    const res = await fetch(`${RZP_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader() },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `topup_${userId.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: userId, purpose: "wallet_topup", coins: String(coins) },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay order failed: ${err}`);
    }
    const order = (await res.json()) as { id: string; amount: number; currency: string };

    await supabaseAdmin.from("razorpay_orders").insert({
      user_id: userId,
      razorpay_order_id: order.id,
      amount_paise: amountPaise,
      coins_to_credit: coins,
      currency: "INR",
      status: "created",
      purpose: "wallet_topup",
      notes: {},
    });

    return { orderId: order.id, amount: order.amount, currency: order.currency };
  });

/** Verify Razorpay payment signature and credit wallet. */
const verifyInput = z.object({
  razorpay_order_id: z.string().min(5),
  razorpay_payment_id: z.string().min(5),
  razorpay_signature: z.string().min(10),
});
export const verifyTopupAndCredit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => verifyInput.parse(d))
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expected = createHmac("sha256", secret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    const sigBuf = Buffer.from(data.razorpay_signature, "utf8");
    const expBuf = Buffer.from(expected, "utf8");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      throw new Error("Invalid payment signature");
    }

    const { data: order, error } = await supabaseAdmin
      .from("razorpay_orders")
      .select("id, user_id, status, coins_to_credit, purpose")
      .eq("razorpay_order_id", data.razorpay_order_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    if (order.user_id !== userId) throw new Error("Order does not belong to user");
    if (order.status === "paid") return { ok: true, alreadyCredited: true };

    // Credit the wallet
    await supabaseAdmin.rpc("wallet_credit", {
      _user_id: userId,
      _amount_coins: order.coins_to_credit,
      _type: "topup",
      _description: `Razorpay top-up`,
      _reference_type: "razorpay",
      _reference_id: data.razorpay_payment_id,
    });

    await supabaseAdmin
      .from("razorpay_orders")
      .update({
        status: "paid",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        paid_at: new Date().toISOString(),
        credited_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return { ok: true, coinsCredited: order.coins_to_credit };
  });
