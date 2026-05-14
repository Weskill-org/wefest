import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const COINS_PER_INR = 10;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keyId || !keySecret) throw new Error("Razorpay keys not configured");

    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supaUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = await req.json();
    const amountInr = Math.floor(Number(body?.amountInr));
    if (!Number.isFinite(amountInr) || amountInr < 10 || amountInr > 500_000) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const amountPaise = amountInr * 100;
    const coins = Math.round(amountInr * COINS_PER_INR);

    const auth = "Basic " + btoa(`${keyId}:${keySecret}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `topup_${userId.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: userId, purpose: "wallet_topup", coins: String(coins) },
      }),
    });
    if (!rzpRes.ok) {
      const txt = await rzpRes.text();
      throw new Error(`Razorpay order failed: ${txt}`);
    }
    const order = await rzpRes.json() as { id: string; amount: number; currency: string };

    const admin = createClient(supaUrl, serviceKey);
    await admin.from("razorpay_orders").insert({
      user_id: userId,
      razorpay_order_id: order.id,
      amount_paise: amountPaise,
      coins_to_credit: coins,
      currency: "INR",
      status: "created",
      purpose: "wallet_topup",
      notes: {},
    });

    return new Response(
      JSON.stringify({ orderId: order.id, amount: order.amount, currency: order.currency, keyId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
