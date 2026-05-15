import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const COINS_PER_INR = 10;
const inrToCoins = (inr: number) => Math.round(inr * COINS_PER_INR);

type Purpose = "wallet_topup" | "ticket_purchase" | "product_purchase" | "subscription_purchase";

interface Body {
  purpose: Purpose;
  // wallet_topup
  amountInr?: number;
  // purchases — how many of user's existing coins to apply (server clamps to balance & total)
  walletCoinsToUse?: number;
  // ticket_purchase
  eventId?: string;
  tier?: string;
  // product_purchase
  productId?: string;
  quantity?: number;
  shippingAddress?: string;
  // subscription_purchase
  planType?: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;
    const admin = createClient(supaUrl, serviceKey);

    const body = (await req.json()) as Body;
    const purpose: Purpose = body.purpose ?? "wallet_topup";

    let totalInr = 0;
    let organizerId: string | null = null;
    let notes: Record<string, unknown> = { purpose };

    if (purpose === "wallet_topup") {
      const a = Math.floor(Number(body.amountInr));
      if (!Number.isFinite(a) || a < 10 || a > 500_000) return json({ error: "Invalid amount" }, 400);
      totalInr = a;
      notes = { purpose };
    } else if (purpose === "ticket_purchase") {
      if (!body.eventId || !body.tier) return json({ error: "Missing eventId/tier" }, 400);
      const { data: event, error } = await admin
        .from("events")
        .select("id, title, organizer_user_id, college_id, college_name, pass_settings")
        .eq("id", body.eventId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!event) return json({ error: "Event not found" }, 404);
      if (!event.organizer_user_id) return json({ error: "Event has no organizer wallet" }, 400);

      // College eligibility
      if (event.college_id) {
        const { data: prof } = await admin
          .from("student_profiles").select("college_id").eq("id", userId).maybeSingle();
        if (prof?.college_id && prof.college_id !== event.college_id) {
          return json({ error: `This event is exclusive to students of ${event.college_name}.` }, 403);
        }
      }

      const settings = (event.pass_settings ?? {}) as any;
      const tierLower = body.tier.toLowerCase();
      let priceInr = 0;
      if (tierLower.includes("vip") && settings.vip?.enabled) priceInr = Number(settings.vip.price ?? 0);
      else if (settings.normal?.enabled) priceInr = Number(settings.normal.price ?? 0);
      if (!priceInr || priceInr <= 0) return json({ error: "This pass has no price configured" }, 400);

      totalInr = Math.round(priceInr);
      organizerId = event.organizer_user_id;
      notes = { purpose, eventId: event.id, eventTitle: event.title, tier: body.tier, organizerId, totalInr };
    } else if (purpose === "product_purchase") {
      if (!body.productId || !body.quantity) return json({ error: "Missing productId/quantity" }, 400);
      const qty = Math.floor(Number(body.quantity));
      if (qty < 1 || qty > 20) return json({ error: "Invalid quantity" }, 400);

      const { data: product, error } = await admin
        .from("products")
        .select("id, name, price, stock, event_id, events:event_id(organizer_user_id, title)")
        .eq("id", body.productId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!product) return json({ error: "Product not found" }, 404);
      if (product.stock < qty) return json({ error: "Insufficient stock" }, 400);

      organizerId = (product.events as any)?.organizer_user_id ?? null;
      if (!organizerId) return json({ error: "Product has no seller wallet" }, 400);

      totalInr = Math.round(Number(product.price) * qty);
      notes = {
        purpose,
        productId: product.id,
        productName: product.name,
        quantity: qty,
        organizerId,
        shippingAddress: body.shippingAddress ?? "Pickup at Campus",
        totalInr,
      };
    } else if (purpose === "subscription_purchase") {
      if (!body.planType) return json({ error: "Missing planType" }, 400);
      if (body.planType === "Growth") {
        totalInr = 9999;
      } else {
        return json({ error: "This plan cannot be purchased via Razorpay directly" }, 400);
      }
      notes = {
        purpose,
        planType: body.planType,
        totalInr
      };
    } else {
      return json({ error: "Invalid purpose" }, 400);
    }

    // --- Wallet split (purchases only) ---
    let walletCoinsToUse = 0;
    if (purpose !== "wallet_topup") {
      const requested = Math.max(0, Math.floor(Number(body.walletCoinsToUse ?? 0)));
      if (requested > 0) {
        const { data: wallet } = await admin
          .from("wallets").select("balance_coins").eq("user_id", userId).maybeSingle();
        const balance = Number(wallet?.balance_coins ?? 0);
        const totalCoins = inrToCoins(totalInr);
        walletCoinsToUse = Math.min(requested, balance, totalCoins);
      }
      notes.walletCoinsToUse = walletCoinsToUse;
    }

    const walletInr = walletCoinsToUse / COINS_PER_INR;
    const remainderInr = Math.max(0, totalInr - walletInr);
    const remainderPaise = Math.round(remainderInr * 100);

    if (remainderPaise < 100) {
      return json({
        error: "Remainder too small for Razorpay (minimum ₹1). Use wallet-only flow.",
      }, 400);
    }

    // Coins to credit to BUYER's wallet (only for wallet_topup). For purchases this is 0.
    const coinsToCreditBuyer = purpose === "wallet_topup" ? inrToCoins(totalInr) : 0;

    const auth = "Basic " + btoa(`${keyId}:${keySecret}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        amount: remainderPaise,
        currency: "INR",
        receipt: `${purpose.slice(0, 8)}_${userId.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: userId, purpose },
      }),
    });
    if (!rzpRes.ok) {
      const txt = await rzpRes.text();
      throw new Error(`Razorpay order failed: ${txt}`);
    }
    const order = await rzpRes.json() as { id: string; amount: number; currency: string };

    await admin.from("razorpay_orders").insert({
      user_id: userId,
      razorpay_order_id: order.id,
      amount_paise: remainderPaise,
      coins_to_credit: coinsToCreditBuyer,
      currency: "INR",
      status: "created",
      purpose,
      notes,
    });

    return json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      remainderInr,
      walletCoinsToUse,
      totalInr,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
