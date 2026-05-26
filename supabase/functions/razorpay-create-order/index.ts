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
  couponCode?: string;
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
    const admin = createClient(supaUrl, serviceKey, {
      auth: { persistSession: false }
    });

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

      console.log(`[CreateOrder] Querying product ID: ${body.productId}`);
      const { data: product, error: pErr } = await admin
        .from("products")
        .select(`
          *,
          event:event_id (
            id,
            title,
            organizer_user_id
          )
        `)
        .eq("id", body.productId)
        .maybeSingle();

      if (pErr) {
        console.error("[CreateOrder] Product fetch error:", pErr);
        return json({ error: `Database error: ${pErr.message}` }, 500);
      }
      if (!product) {
        console.error("[CreateOrder] Product not found in DB for ID:", body.productId);
        return json({ error: "Product not found. Please refresh the page." }, 404);
      }

      console.log("[CreateOrder] Product data:", JSON.stringify(product));
      
      if (product.stock < qty) {
        return json({ error: "Insufficient stock" }, 400);
      }

      organizerId = (product.event as any)?.organizer_user_id;
      if (!organizerId) {
        // Fallback: check if it's an array (sometimes joins return arrays in older client versions)
        const eventData = product.event;
        if (Array.isArray(eventData) && eventData.length > 0) {
          organizerId = (eventData[0] as any).organizer_user_id;
        } else if (typeof eventData === 'object' && eventData !== null) {
          organizerId = (eventData as any).organizer_user_id;
        }
      }

      if (!organizerId) {
        console.error("[CreateOrder] Seller ID missing for product:", body.productId, "Event:", JSON.stringify(product.event));
        return json({ error: "This product's seller is not correctly configured." }, 400);
      }

      totalInr = Math.round(Number(product.price) * qty);
      console.log(`[CreateOrder] Total INR: ${totalInr} (Price: ${product.price}, Qty: ${qty})`);
      
      notes = {
        purpose,
        productId: body.productId,
        productName: product.name,
        quantity: qty,
        organizerId,
        totalInr,
        shippingAddress: body.shippingAddress ?? "Pickup at Campus",
      };
    } else if (purpose === "subscription_purchase") {
      if (!body.planType) return json({ error: "Missing planType" }, 400);

      let planPrice = 0;
      if (body.planType === "Growth") {
        planPrice = 9999;
      } else if (body.planType === "premium_monthly") {
        planPrice = 3000;
      } else if (body.planType === "premium_yearly") {
        planPrice = 30000;
      } else {
        return json({ error: "This plan cannot be purchased via Razorpay directly" }, 400);
      }

      // --- Coupon validation ---
      let couponCode: string | null = null;
      let discountAmount = 0;
      let couponId: string | null = null;

      if (body.couponCode && body.couponCode.trim() !== "") {
        couponCode = body.couponCode.trim();
        console.log(`[CreateOrder] Validating coupon: ${couponCode}`);

        const { data: couponResult, error: couponErr } = await admin.rpc("validate_coupon", {
          _code: couponCode,
          _user_id: userId,
          _plan_amount: planPrice,
        });

        if (couponErr) {
          console.error("[CreateOrder] Coupon validation error:", couponErr);
          return json({ error: "Failed to validate coupon" }, 500);
        }

        const result = couponResult as { valid: boolean; discount_amount: number; message: string; coupon_id?: string };
        if (!result.valid) {
          return json({ error: result.message, couponError: true }, 400);
        }

        discountAmount = result.discount_amount;
        couponId = result.coupon_id ?? null;
        console.log(`[CreateOrder] Coupon valid! Discount: ${discountAmount}`);
      }

      totalInr = Math.max(0, planPrice - discountAmount);

      notes = {
        purpose,
        planType: body.planType,
        originalAmount: planPrice,
        discountAmount,
        couponCode,
        couponId,
        totalInr,
      };

      // If total is 0 after discount, handle free subscription (no Razorpay needed)
      if (totalInr <= 0) {
        console.log("[CreateOrder] Full discount applied, creating free subscription");

        const currentPeriodEnd = new Date();
        if (body.planType === "premium_monthly") {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        } else {
          currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
        }

        const { data: existingSub, error: findSubErr } = await admin
          .from("subscriptions").select("id").eq("user_id", userId).maybeSingle();
        if (findSubErr) {
          console.error("[CreateOrder] Error querying existing subscription:", findSubErr);
          throw new Error(`Failed to query existing subscription: ${findSubErr.message}`);
        }

        const subData = {
          plan_type: body.planType, status: "active",
          current_period_end: currentPeriodEnd.toISOString(),
          coupon_code: couponCode, discount_amount: discountAmount, original_amount: planPrice,
        };

        if (existingSub) {
          console.log(`[CreateOrder] Updating existing subscription ${existingSub.id} to ${body.planType}`);
          const { error: updErr } = await admin.from("subscriptions").update(subData).eq("id", existingSub.id);
          if (updErr) {
            console.error("[CreateOrder] Error updating subscription:", updErr);
            throw new Error(`Failed to update subscription: ${updErr.message}`);
          }
        } else {
          console.log(`[CreateOrder] Inserting new subscription for user ${userId} with plan ${body.planType}`);
          const { error: insErr } = await admin.from("subscriptions").insert({ user_id: userId, ...subData });
          if (insErr) {
            console.error("[CreateOrder] Error inserting subscription:", insErr);
            throw new Error(`Failed to insert subscription: ${insErr.message}`);
          }
        }

        // Record coupon usage
        if (couponId) {
          console.log(`[CreateOrder] Recording coupon usage for coupon ${couponId} by user ${userId}`);
          const { error: usageErr } = await admin.from("coupon_usages").insert({ coupon_id: couponId, user_id: userId });
          if (usageErr) {
            console.error("[CreateOrder] Error inserting coupon usage:", usageErr);
            throw new Error(`Failed to record coupon usage: ${usageErr.message}`);
          }

          const { data: cd, error: getCdErr } = await admin.from("discount_coupons").select("used_count").eq("id", couponId).single();
          if (getCdErr) {
            console.error("[CreateOrder] Error getting coupon usage count:", getCdErr);
            throw new Error(`Failed to fetch coupon usage count: ${getCdErr.message}`);
          }

          if (cd) {
            const { error: updCerr } = await admin.from("discount_coupons").update({ used_count: cd.used_count + 1 }).eq("id", couponId);
            if (updCerr) {
              console.error("[CreateOrder] Error incrementing coupon count:", updCerr);
              throw new Error(`Failed to increment coupon count: ${updCerr.message}`);
            }
          }
        }

        console.log(`[CreateOrder] Logging free transaction for plan ${body.planType}`);
        const { error: txErr } = await admin.from("transactions").insert({
          user_id: userId, amount: 0, currency: "INR", status: "completed",
          description: `${body.planType} Plan - 100% discount (${couponCode})`,
          metadata: { purpose, planType: body.planType, couponCode, discountAmount, originalAmount: planPrice },
        });
        if (txErr) {
          console.error("[CreateOrder] Error logging transaction:", txErr);
          throw new Error(`Failed to insert transaction log: ${txErr.message}`);
        }

        return json({ freeSubscription: true, planType: body.planType, couponCode, discountAmount, totalInr: 0 });
      }
    } else {
      return json({ error: "Invalid purpose" }, 400);
    }

    // --- Wallet split (purchases only) ---
    let walletCoinsToUse = 0;
    if (purpose !== "wallet_topup") {
      const requested = Math.max(0, Math.floor(Number(body.walletCoinsToUse ?? 0)));
      console.log(`[CreateOrder] Requested wallet coins: ${requested}`);
      if (requested > 0) {
        const { data: wallet } = await admin
          .from("wallets").select("balance_coins").eq("user_id", userId).maybeSingle();
        const balance = Number(wallet?.balance_coins ?? 0);
        const totalCoins = inrToCoins(totalInr);
        walletCoinsToUse = Math.min(requested, balance, totalCoins);
        console.log(`[CreateOrder] Clamped wallet coins: ${walletCoinsToUse} (Balance: ${balance}, Total: ${totalCoins})`);
      }
      notes.walletCoinsToUse = walletCoinsToUse;
    }

    const walletInr = walletCoinsToUse / COINS_PER_INR;
    const remainderInr = Math.max(0, totalInr - walletInr);
    const remainderPaise = Math.round(remainderInr * 100);

    console.log(`[CreateOrder] Remainder INR: ${remainderInr}, Remainder Paise: ${remainderPaise}`);

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
