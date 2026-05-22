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
      // Wallet is created on first credit/debit; show zero until then
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
    const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${crypto.randomUUID().replace(/-/g, '').substring(0, 5).toUpperCase()}`;

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
    const { supabase } = context;

    const { data: result, error: rpcErr } = await supabase.rpc("purchase_product_with_wallet", {
      _product_id: data.productId,
      _quantity: data.quantity,
      _shipping_address: data.shippingAddress,
    });

    if (rpcErr) {
      const msg = rpcErr.message ?? "Purchase failed";
      if (msg.includes("INSUFFICIENT_BALANCE")) throw new Error("Insufficient WeCoin balance");
      if (msg.includes("Insufficient stock")) throw new Error("Insufficient stock");
      if (msg.includes("Product not found")) throw new Error("Product not found");
      if (msg.includes("no seller wallet")) throw new Error("Product has no seller wallet");
      throw new Error(msg);
    }

    const payload = result as {
      order_id?: string;
      coins_debited?: number;
      balance_after?: number;
    };

    return {
      ok: true,
      orderId: payload.order_id!,
      coinsDebited: Number(payload.coins_debited ?? 0),
      balanceAfter: Number(payload.balance_after ?? 0),
    };
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

export const REFERRAL_REWARD_COINS = 150;

const applyReferralCodeInput = z.object({
  referralCode: z.string().min(4).max(20),
});
/** Apply a referral code for the current user (e.g. after signup). */
export const applyReferralCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => applyReferralCodeInput.parse(d))
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const code = data.referralCode.trim().toUpperCase();
    const { data: result, error } = await supabaseAdmin.rpc("process_referral", {
      _referred_user_id: userId,
      _referral_code: code,
    });
    if (error) {
      if (error.message?.includes("SELF_REFERRAL")) {
        throw new Error("You cannot use your own referral code");
      }
      if (error.message?.includes("ALREADY_REFERRED")) {
        throw new Error("You have already used a referral code");
      }
      if (error.message?.includes("INVALID_REFERRAL")) {
        throw new Error("Invalid referral code");
      }
      throw new Error(error.message);
    }
    const payload = result as { success?: boolean; reward_coins?: number };
    return {
      success: !!payload?.success,
      rewardCoins: Number(payload?.reward_coins ?? REFERRAL_REWARD_COINS),
    };
  });

const processPendingReferralInput = z.object({
  referralCode: z.string().min(4).max(20).optional(),
});

/** Process referral from signup metadata on first student login (server-side). */
export const processPendingReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => processPendingReferralInput.parse(d ?? {}))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    let code = data.referralCode?.trim().toUpperCase();
    if (!code) {
      const { data: authUser, error: adminErr } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (!adminErr && authUser?.user) {
        const meta = authUser.user.user_metadata?.referral_code;
        if (typeof meta === "string" && meta.trim()) code = meta.trim().toUpperCase();
      }
    }
    if (!code) {
      const { data: userData } = await supabase.auth.getUser();
      const meta = userData?.user?.user_metadata?.referral_code;
      if (typeof meta === "string" && meta.trim()) code = meta.trim().toUpperCase();
    }
    if (!code) return { processed: false as const, reason: "no_code" as const };

    const { data: profile } = await supabase
      .from("student_profiles")
      .select("referred_by")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.referred_by) return { processed: false as const, reason: "already_referred" as const };

    const { data: result, error } = await supabaseAdmin.rpc("process_referral", {
      _referred_user_id: userId,
      _referral_code: code,
    });
    if (error) {
      if (
        error.message?.includes("ALREADY_REFERRED") ||
        error.message?.includes("SELF_REFERRAL") ||
        error.message?.includes("INVALID_REFERRAL")
      ) {
        return { processed: false as const, reason: error.message };
      }
      throw new Error(error.message);
    }
    const payload = result as { success?: boolean; reward_coins?: number };
    return {
      processed: !!payload?.success,
      rewardCoins: Number(payload?.reward_coins ?? REFERRAL_REWARD_COINS),
    };
  });

/** Referral code, stats, and history for the current student. */
export const getMyReferralInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile, error: profileErr } = await supabase
      .from("student_profiles")
      .select("referral_code, referred_by")
      .eq("id", userId)
      .maybeSingle();
    if (profileErr) {
      if (profileErr.message?.includes("referral_code")) {
        throw new Error(
          "Referral system is not set up yet. Apply the latest Supabase migrations (referral_system)."
        );
      }
      throw new Error(profileErr.message);
    }

    if (!profile) {
      throw new Error("Student profile not found. Try refreshing or signing in again.");
    }

    let referralCode = profile.referral_code?.trim() || null;
    if (!referralCode) {
      const { data: ensured, error: ensureErr } = await supabaseAdmin.rpc(
        "ensure_student_referral_code",
        { _user_id: userId }
      );
      if (ensureErr) {
        if (ensureErr.message?.includes("ensure_student_referral_code")) {
          throw new Error(
            "Referral system is not set up yet. Apply the latest Supabase migrations (ensure_referral_code)."
          );
        }
        throw new Error(ensureErr.message);
      }
      referralCode = typeof ensured === "string" ? ensured : null;
    }

    let referrals: Array<{
      id: string;
      referred_id: string;
      referral_code: string;
      reward_coins: number;
      status: string;
      created_at: string;
    }> = [];

    const { data: referralRows, error: refErr } = await supabase
      .from("referrals")
      .select("id, referred_id, referral_code, reward_coins, status, created_at")
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (!refErr) {
      referrals = referralRows ?? [];
    } else if (!refErr.message?.includes("referrals")) {
      throw new Error(refErr.message);
    }

    const credited = referrals.filter((r) => r.status === "credited");
    const totalCoinsEarned = credited.reduce((sum, r) => sum + Number(r.reward_coins ?? 0), 0);

    const referredIds = credited.map((r) => r.referred_id);
    let referredNames: Record<string, string> = {};
    if (referredIds.length > 0) {
      const { data: profiles } = await supabase
        .from("student_profiles")
        .select("id, full_name")
        .in("id", referredIds);
      referredNames = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, p.full_name || "Student"])
      );
    }

    return {
      referralCode,
      referredBy: profile.referred_by ?? null,
      totalReferrals: credited.length,
      totalCoinsEarned,
      referrals: referrals.map((r) => ({
        id: r.id,
        referredId: r.referred_id,
        referredName: referredNames[r.referred_id] ?? "Student",
        referralCode: r.referral_code,
        rewardCoins: Number(r.reward_coins ?? REFERRAL_REWARD_COINS),
        status: r.status,
        createdAt: r.created_at,
      })),
    };
  });
