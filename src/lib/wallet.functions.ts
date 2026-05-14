import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Conversion: 1 WeCoin = ₹0.10  →  ₹1 = 10 coins
export const COINS_PER_INR = 10;
export const inrToCoins = (inr: number) => Math.round(inr * COINS_PER_INR);
export const coinsToInr = (coins: number) => coins / COINS_PER_INR;

/** Get the current user's wallet (auto-creates if missing). */
export const getMyWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    let { data, error } = await supabase
      .from("wallets")
      .select("balance_coins, held_coins, lifetime_credited, lifetime_debited, updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) {
      // Server-side ensure
      await supabaseAdmin.from("wallets").insert({ user_id: userId }).select().single();
      data = { balance_coins: 0, held_coins: 0, lifetime_credited: 0, lifetime_debited: 0, updated_at: new Date().toISOString() } as any;
    }
    return data!;
  });

/** Recent wallet transactions for current user. */
export const getMyWalletTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { limit?: number } | undefined) => ({ limit: Math.min(d?.limit ?? 50, 200) }))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("wallet_transactions")
      .select("id, amount_coins, balance_after, type, description, reference_type, reference_id, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

/** Pay for a ticket using WeCoin balance. Atomic: debit student → credit organizer → insert ticket. */
const payForTicketInput = z.object({
  eventId: z.string().uuid(),
  tier: z.string().min(1).max(50),
});
export const payForTicketWithWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => payForTicketInput.parse(d))
  .handler(async ({ context, data }) => {
    const { userId } = context;

    // Load event server-side (admin client to bypass any read constraints; events are public anyway)
    const { data: event, error: evErr } = await supabaseAdmin
      .from("events")
      .select("id, title, organizer_user_id, college_id, college_name, pass_settings")
      .eq("id", data.eventId)
      .maybeSingle();
    if (evErr) throw new Error(evErr.message);
    if (!event) throw new Error("Event not found");
    if (!event.organizer_user_id) throw new Error("Event has no organizer wallet to receive payment");

    // Resolve price (INR) from pass_settings
    const settings = (event.pass_settings ?? {}) as any;
    let priceInr = 0;
    const tierLower = data.tier.toLowerCase();
    if (tierLower.includes("vip") && settings.vip?.enabled) priceInr = Number(settings.vip.price ?? 0);
    else if (settings.normal?.enabled) priceInr = Number(settings.normal.price ?? 0);

    if (!priceInr || priceInr <= 0) throw new Error("This pass has no price configured");

    if (event.college_id) {
      // Optional eligibility check
      const { data: profile } = await supabaseAdmin
        .from("student_profiles").select("college_id").eq("id", userId).maybeSingle();
      if (profile?.college_id && profile.college_id !== event.college_id) {
        throw new Error(`This event is exclusive to students of ${event.college_name}.`);
      }
    }

    const coins = inrToCoins(priceInr);
    const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Atomic transfer
    const { error: trErr } = await supabaseAdmin.rpc("wallet_transfer", {
      _from_user: userId,
      _to_user: event.organizer_user_id,
      _amount_coins: coins,
      _debit_type: "purchase",
      _credit_type: "sale",
      _description: `Ticket: ${event.title} (${data.tier})`,
      _reference_type: "ticket",
      _reference_id: event.id,
      _metadata: { tier: data.tier, code: ticketCode, price_inr: priceInr },
    });
    if (trErr) {
      if (trErr.message?.includes("INSUFFICIENT_BALANCE")) {
        throw new Error("Insufficient WeCoin balance");
      }
      throw new Error(trErr.message);
    }

    // Insert ticket
    const { error: tkErr } = await supabaseAdmin.from("tickets").insert({
      user_id: userId,
      event_id: event.id,
      tier: data.tier,
      code: ticketCode,
    });
    if (tkErr) {
      // Refund on failure
      await supabaseAdmin.rpc("wallet_transfer", {
        _from_user: event.organizer_user_id,
        _to_user: userId,
        _amount_coins: coins,
        _debit_type: "refund",
        _credit_type: "refund",
        _description: `Refund: ticket creation failed (${event.title})`,
        _reference_type: "ticket_refund",
        _reference_id: event.id,
        _metadata: { reason: tkErr.message },
      });
      throw new Error(`Ticket creation failed: ${tkErr.message}`);
    }

    return { ok: true, ticketCode, tier: data.tier, coinsDebited: coins };
  });

/** Pay for a shop product with WeCoin. */
const payForProductInput = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  shippingAddress: z.string().min(5).max(500),
});
export const payForProductWithWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => payForProductInput.parse(d))
  .handler(async ({ context, data }) => {
    const { userId } = context;

    const { data: product, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock, event_id, events:event_id(organizer_user_id, title)")
      .eq("id", data.productId)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    if (!product) throw new Error("Product not found");
    if (product.stock < data.quantity) throw new Error("Insufficient stock");

    const organizerId = (product.events as any)?.organizer_user_id;
    if (!organizerId) throw new Error("Product has no seller wallet");

    const totalInr = Number(product.price) * data.quantity;
    const coins = inrToCoins(totalInr);

    const { error: trErr } = await supabaseAdmin.rpc("wallet_transfer", {
      _from_user: userId,
      _to_user: organizerId,
      _amount_coins: coins,
      _debit_type: "purchase",
      _credit_type: "sale",
      _description: `Shop: ${product.name} x${data.quantity}`,
      _reference_type: "order",
      _reference_id: product.id,
      _metadata: { quantity: data.quantity, total_inr: totalInr },
    });
    if (trErr) {
      if (trErr.message?.includes("INSUFFICIENT_BALANCE")) throw new Error("Insufficient WeCoin balance");
      throw new Error(trErr.message);
    }

    const { error: oErr, data: order } = await supabaseAdmin.from("orders").insert({
      user_id: userId,
      product_id: product.id,
      quantity: data.quantity,
      total_amount: totalInr,
      shipping_address: data.shippingAddress,
      status: "paid",
    }).select("id").single();
    if (oErr) {
      await supabaseAdmin.rpc("wallet_transfer", {
        _from_user: organizerId, _to_user: userId, _amount_coins: coins,
        _debit_type: "refund", _credit_type: "refund",
        _description: `Refund: order failed (${product.name})`,
        _reference_type: "order_refund", _reference_id: product.id,
      });
      throw new Error(oErr.message);
    }

    // Decrement stock
    await supabaseAdmin.from("products").update({ stock: product.stock - data.quantity }).eq("id", product.id);

    return { ok: true, orderId: order.id, coinsDebited: coins };
  });

/** Company sponsors an event using WeCoin. */
const sponsorInput = z.object({
  eventId: z.string().uuid(),
  amountInr: z.number().int().min(1).max(10_000_000),
  tier: z.string().min(1).max(50),
  message: z.string().max(1000).optional(),
});
export const sponsorEventWithWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => sponsorInput.parse(d))
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { data: event } = await supabaseAdmin
      .from("events").select("id, title, organizer_user_id").eq("id", data.eventId).maybeSingle();
    if (!event?.organizer_user_id) throw new Error("Event/organizer not found");

    const coins = inrToCoins(data.amountInr);
    const { error: trErr } = await supabaseAdmin.rpc("wallet_transfer", {
      _from_user: userId,
      _to_user: event.organizer_user_id,
      _amount_coins: coins,
      _debit_type: "sponsorship",
      _credit_type: "sponsorship_received",
      _description: `Sponsorship (${data.tier}) for ${event.title}`,
      _reference_type: "sponsorship",
      _reference_id: event.id,
      _metadata: { tier: data.tier, amount_inr: data.amountInr, message: data.message ?? null },
    });
    if (trErr) {
      if (trErr.message?.includes("INSUFFICIENT_BALANCE")) throw new Error("Insufficient WeCoin balance");
      throw new Error(trErr.message);
    }

    await supabaseAdmin.from("sponsorship_proposals").insert({
      company_user_id: userId,
      event_id: event.id,
      tier: data.tier,
      amount: data.amountInr,
      message: data.message ?? "",
      status: "approved",
    });

    return { ok: true, coinsDebited: coins };
  });

/** Request a bank withdrawal (colleges & companies only). */
const withdrawalInput = z.object({
  amountInr: z.number().int().min(100).max(10_000_000),
  bankAccountName: z.string().min(2).max(100),
  bankAccountNumber: z.string().min(6).max(30),
  bankIfsc: z.string().min(8).max(20),
  notes: z.string().max(500).optional(),
});
export const requestWithdrawal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => withdrawalInput.parse(d))
  .handler(async ({ context, data }) => {
    const { userId } = context;

    // Eligibility: must have role college or company
    const { data: roles } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", userId);
    const allowed = (roles ?? []).some(r => r.role === "college" || r.role === "company");
    if (!allowed) throw new Error("Only colleges and companies can request withdrawals.");

    const coins = inrToCoins(data.amountInr);

    // Hold the balance by debiting now (refund on rejection)
    const { error: dErr } = await supabaseAdmin.rpc("wallet_debit", {
      _user_id: userId,
      _amount_coins: coins,
      _type: "withdrawal_hold",
      _description: `Withdrawal hold (₹${data.amountInr})`,
      _reference_type: "withdrawal",
      
    });
    if (dErr) {
      if (dErr.message?.includes("INSUFFICIENT_BALANCE")) throw new Error("Insufficient WeCoin balance");
      throw new Error(dErr.message);
    }

    const { data: req, error: rErr } = await supabaseAdmin.from("withdrawal_requests").insert({
      user_id: userId,
      amount_coins: coins,
      amount_inr_paise: data.amountInr * 100,
      bank_account_name: data.bankAccountName,
      bank_account_number: data.bankAccountNumber,
      bank_ifsc: data.bankIfsc.toUpperCase(),
      notes: data.notes ?? null,
    }).select("id").single();
    if (rErr) {
      // Release hold
      await supabaseAdmin.rpc("wallet_credit", {
        _user_id: userId, _amount_coins: coins, _type: "withdrawal_release",
        _description: "Release: withdrawal request failed", _reference_type: "withdrawal", 
      });
      throw new Error(rErr.message);
    }
    return { ok: true, requestId: req.id };
  });

/** List own withdrawal requests. */
export const getMyWithdrawals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("withdrawal_requests")
      .select("id, amount_coins, amount_inr_paise, status, rejection_reason, created_at, processed_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Redeem a gift card code. */
const redeemGiftCardInput = z.object({
  code: z.string().min(4).max(50),
});
export const redeemGiftCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => redeemGiftCardInput.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: result, error } = await supabase.rpc("redeem_gift_card", {
      _code: data.code,
      _user_id: userId,
    });
    if (error) {
      console.error("Redemption error:", error);
      if (error.message?.includes("INVALID_OR_REDEEMED_CODE")) {
        throw new Error("Invalid or already redeemed gift card code");
      }
      throw new Error(error.message);
    }
    return result as { success: boolean; amount: number; tx_id: string };
  });

/** Create a new gift card (Admin only). */
const createGiftCardInput = z.object({
  code: z.string().min(4).max(50),
  amountCoins: z.number().int().min(1),
});
export const createGiftCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createGiftCardInput.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: userId });
    if (!isAdmin) throw new Error("Unauthorized: Admin access required");

    const { data: gc, error } = await supabase.from("gift_cards").insert({
      code: data.code.toUpperCase(),
      amount_coins: data.amountCoins,
      created_by: userId,
    }).select().single();

    if (error) throw new Error(error.message);
    return gc;
  });

/** List all gift cards (Admin only). */
export const getAllGiftCards = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: userId });
    if (!isAdmin) throw new Error("Unauthorized: Admin access required");

    const { data, error } = await supabase
      .from("gift_cards")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw new Error(error.message);
    return data ?? [];
  });
