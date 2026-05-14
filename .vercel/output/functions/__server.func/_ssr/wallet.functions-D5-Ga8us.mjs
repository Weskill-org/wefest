import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-HN75ZaUg.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL || "https://vpganqviwrtmnrfvrrrx.supabase.co";
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || void 0;
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...[],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Local service role operations will fail.`;
    console.warn(`[Supabase Warning] ${message}`);
    return {
      from: () => {
        throw new Error(message);
      },
      rpc: () => {
        throw new Error(message);
      },
      auth: { admin: { getUserById: () => {
        throw new Error(message);
      } } }
    };
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const COINS_PER_INR = 10;
const inrToCoins = (inr) => Math.round(inr * COINS_PER_INR);
const getMyWallet_createServerFn_handler = createServerRpc({
  id: "350f5a32c4d4e75fb92a5d3e86f1d4a377b70a50e7167b6228da6903c9665510",
  name: "getMyWallet",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => getMyWallet.__executeServer(opts));
const getMyWallet = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyWallet_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  let {
    data,
    error
  } = await supabase.from("wallets").select("balance_coins, held_coins, lifetime_credited, lifetime_debited, updated_at").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    await supabaseAdmin.from("wallets").insert({
      user_id: userId
    }).select().single();
    data = {
      balance_coins: 0,
      held_coins: 0,
      lifetime_credited: 0,
      lifetime_debited: 0,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  return data;
});
const getMyWalletTransactions_createServerFn_handler = createServerRpc({
  id: "33b36e30b6bb7dc5322b6aa43077176bf5956dc60458ccd34e2c31f427e79b56",
  name: "getMyWalletTransactions",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => getMyWalletTransactions.__executeServer(opts));
const getMyWalletTransactions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => ({
  limit: Math.min(d?.limit ?? 50, 200)
})).handler(getMyWalletTransactions_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase
  } = context;
  const {
    data: rows,
    error
  } = await supabase.from("wallet_transactions").select("id, amount_coins, balance_after, type, description, reference_type, reference_id, created_at").order("created_at", {
    ascending: false
  }).limit(data.limit);
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const payForTicketInput = objectType({
  eventId: stringType().uuid(),
  tier: stringType().min(1).max(50)
});
const payForTicketWithWallet_createServerFn_handler = createServerRpc({
  id: "8abaf323b8cc05a6685d69ca5d7255d2d41790f0ca6f2660080f814696053f09",
  name: "payForTicketWithWallet",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => payForTicketWithWallet.__executeServer(opts));
const payForTicketWithWallet = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => payForTicketInput.parse(d)).handler(payForTicketWithWallet_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    userId
  } = context;
  const {
    data: event,
    error: evErr
  } = await supabaseAdmin.from("events").select("id, title, organizer_user_id, college_id, college_name, pass_settings").eq("id", data.eventId).maybeSingle();
  if (evErr) throw new Error(evErr.message);
  if (!event) throw new Error("Event not found");
  if (!event.organizer_user_id) throw new Error("Event has no organizer wallet to receive payment");
  const settings = event.pass_settings ?? {};
  let priceInr = 0;
  const tierLower = data.tier.toLowerCase();
  if (tierLower.includes("vip") && settings.vip?.enabled) priceInr = Number(settings.vip.price ?? 0);
  else if (settings.normal?.enabled) priceInr = Number(settings.normal.price ?? 0);
  if (!priceInr || priceInr <= 0) throw new Error("This pass has no price configured");
  if (event.college_id) {
    const {
      data: profile
    } = await supabaseAdmin.from("student_profiles").select("college_id").eq("id", userId).maybeSingle();
    if (profile?.college_id && profile.college_id !== event.college_id) {
      throw new Error(`This event is exclusive to students of ${event.college_name}.`);
    }
  }
  const coins = inrToCoins(priceInr);
  const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const {
    error: trErr
  } = await supabaseAdmin.rpc("wallet_transfer", {
    _from_user: userId,
    _to_user: event.organizer_user_id,
    _amount_coins: coins,
    _debit_type: "purchase",
    _credit_type: "sale",
    _description: `Ticket: ${event.title} (${data.tier})`,
    _reference_type: "ticket",
    _reference_id: event.id,
    _metadata: {
      tier: data.tier,
      code: ticketCode,
      price_inr: priceInr
    }
  });
  if (trErr) {
    if (trErr.message?.includes("INSUFFICIENT_BALANCE")) {
      throw new Error("Insufficient WeCoin balance");
    }
    throw new Error(trErr.message);
  }
  const {
    error: tkErr
  } = await supabaseAdmin.from("tickets").insert({
    user_id: userId,
    event_id: event.id,
    tier: data.tier,
    code: ticketCode
  });
  if (tkErr) {
    await supabaseAdmin.rpc("wallet_transfer", {
      _from_user: event.organizer_user_id,
      _to_user: userId,
      _amount_coins: coins,
      _debit_type: "refund",
      _credit_type: "refund",
      _description: `Refund: ticket creation failed (${event.title})`,
      _reference_type: "ticket_refund",
      _reference_id: event.id,
      _metadata: {
        reason: tkErr.message
      }
    });
    throw new Error(`Ticket creation failed: ${tkErr.message}`);
  }
  return {
    ok: true,
    ticketCode,
    tier: data.tier,
    coinsDebited: coins
  };
});
const payForProductInput = objectType({
  productId: stringType().uuid(),
  quantity: numberType().int().min(1).max(20),
  shippingAddress: stringType().min(5).max(500)
});
const payForProductWithWallet_createServerFn_handler = createServerRpc({
  id: "cced05aa6cdc7624d9d305a17b6f3e85857f2c999a6034ac2dbb3227d5aed381",
  name: "payForProductWithWallet",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => payForProductWithWallet.__executeServer(opts));
const payForProductWithWallet = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => payForProductInput.parse(d)).handler(payForProductWithWallet_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    userId
  } = context;
  const {
    data: product,
    error: pErr
  } = await supabaseAdmin.from("products").select("id, name, price, stock, event_id, events:event_id(organizer_user_id, title)").eq("id", data.productId).maybeSingle();
  if (pErr) throw new Error(pErr.message);
  if (!product) throw new Error("Product not found");
  if (product.stock < data.quantity) throw new Error("Insufficient stock");
  const organizerId = product.events?.organizer_user_id;
  if (!organizerId) throw new Error("Product has no seller wallet");
  const totalInr = Number(product.price) * data.quantity;
  const coins = inrToCoins(totalInr);
  const {
    error: trErr
  } = await supabaseAdmin.rpc("wallet_transfer", {
    _from_user: userId,
    _to_user: organizerId,
    _amount_coins: coins,
    _debit_type: "purchase",
    _credit_type: "sale",
    _description: `Shop: ${product.name} x${data.quantity}`,
    _reference_type: "order",
    _reference_id: product.id,
    _metadata: {
      quantity: data.quantity,
      total_inr: totalInr
    }
  });
  if (trErr) {
    if (trErr.message?.includes("INSUFFICIENT_BALANCE")) throw new Error("Insufficient WeCoin balance");
    throw new Error(trErr.message);
  }
  const {
    error: oErr,
    data: order
  } = await supabaseAdmin.from("orders").insert({
    user_id: userId,
    product_id: product.id,
    quantity: data.quantity,
    total_amount: totalInr,
    shipping_address: data.shippingAddress,
    status: "paid"
  }).select("id").single();
  if (oErr) {
    await supabaseAdmin.rpc("wallet_transfer", {
      _from_user: organizerId,
      _to_user: userId,
      _amount_coins: coins,
      _debit_type: "refund",
      _credit_type: "refund",
      _description: `Refund: order failed (${product.name})`,
      _reference_type: "order_refund",
      _reference_id: product.id
    });
    throw new Error(oErr.message);
  }
  await supabaseAdmin.from("products").update({
    stock: product.stock - data.quantity
  }).eq("id", product.id);
  return {
    ok: true,
    orderId: order.id,
    coinsDebited: coins
  };
});
const sponsorInput = objectType({
  eventId: stringType().uuid(),
  amountInr: numberType().int().min(1).max(1e7),
  tier: stringType().min(1).max(50),
  message: stringType().max(1e3).optional()
});
const sponsorEventWithWallet_createServerFn_handler = createServerRpc({
  id: "de213bb2a3b807d91bd13cf31987248e6b93eb4de42de7ffbc0a69443aadaddd",
  name: "sponsorEventWithWallet",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => sponsorEventWithWallet.__executeServer(opts));
const sponsorEventWithWallet = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => sponsorInput.parse(d)).handler(sponsorEventWithWallet_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    userId
  } = context;
  const {
    data: event
  } = await supabaseAdmin.from("events").select("id, title, organizer_user_id").eq("id", data.eventId).maybeSingle();
  if (!event?.organizer_user_id) throw new Error("Event/organizer not found");
  const coins = inrToCoins(data.amountInr);
  const {
    error: trErr
  } = await supabaseAdmin.rpc("wallet_transfer", {
    _from_user: userId,
    _to_user: event.organizer_user_id,
    _amount_coins: coins,
    _debit_type: "sponsorship",
    _credit_type: "sponsorship_received",
    _description: `Sponsorship (${data.tier}) for ${event.title}`,
    _reference_type: "sponsorship",
    _reference_id: event.id,
    _metadata: {
      tier: data.tier,
      amount_inr: data.amountInr,
      message: data.message ?? null
    }
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
    status: "approved"
  });
  return {
    ok: true,
    coinsDebited: coins
  };
});
const withdrawalInput = objectType({
  amountInr: numberType().int().min(100).max(1e7),
  bankAccountName: stringType().min(2).max(100),
  bankAccountNumber: stringType().min(6).max(30),
  bankIfsc: stringType().min(8).max(20),
  notes: stringType().max(500).optional()
});
const requestWithdrawal_createServerFn_handler = createServerRpc({
  id: "36025196498f272e4529bd0ce3f249f1edd4e6399467f6fdd4207731f59573f9",
  name: "requestWithdrawal",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => requestWithdrawal.__executeServer(opts));
const requestWithdrawal = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => withdrawalInput.parse(d)).handler(requestWithdrawal_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    userId
  } = context;
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "college" || r.role === "company");
  if (!allowed) throw new Error("Only colleges and companies can request withdrawals.");
  const coins = inrToCoins(data.amountInr);
  const {
    error: dErr
  } = await supabaseAdmin.rpc("wallet_debit", {
    _user_id: userId,
    _amount_coins: coins,
    _type: "withdrawal_hold",
    _description: `Withdrawal hold (₹${data.amountInr})`,
    _reference_type: "withdrawal"
  });
  if (dErr) {
    if (dErr.message?.includes("INSUFFICIENT_BALANCE")) throw new Error("Insufficient WeCoin balance");
    throw new Error(dErr.message);
  }
  const {
    data: req,
    error: rErr
  } = await supabaseAdmin.from("withdrawal_requests").insert({
    user_id: userId,
    amount_coins: coins,
    amount_inr_paise: data.amountInr * 100,
    bank_account_name: data.bankAccountName,
    bank_account_number: data.bankAccountNumber,
    bank_ifsc: data.bankIfsc.toUpperCase(),
    notes: data.notes ?? null
  }).select("id").single();
  if (rErr) {
    await supabaseAdmin.rpc("wallet_credit", {
      _user_id: userId,
      _amount_coins: coins,
      _type: "withdrawal_release",
      _description: "Release: withdrawal request failed",
      _reference_type: "withdrawal"
    });
    throw new Error(rErr.message);
  }
  return {
    ok: true,
    requestId: req.id
  };
});
const getMyWithdrawals_createServerFn_handler = createServerRpc({
  id: "6bc3d9a2e3696c49c50acee525e610576f929b6d9d0231942e8ec9dd3854780e",
  name: "getMyWithdrawals",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => getMyWithdrawals.__executeServer(opts));
const getMyWithdrawals = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyWithdrawals_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("withdrawal_requests").select("id, amount_coins, amount_inr_paise, status, rejection_reason, created_at, processed_at").order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const redeemGiftCardInput = objectType({
  code: stringType().min(4).max(50)
});
const redeemGiftCard_createServerFn_handler = createServerRpc({
  id: "5a29c5caa99ba8439e6e4d9e309722da2fe60dba2d7da3e5bc90f797600b3546",
  name: "redeemGiftCard",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => redeemGiftCard.__executeServer(opts));
const redeemGiftCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => redeemGiftCardInput.parse(d)).handler(redeemGiftCard_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: result,
    error
  } = await supabase.rpc("redeem_gift_card", {
    _code: data.code,
    _user_id: userId
  });
  if (error) {
    console.error("Redemption error:", error);
    if (error.message?.includes("INVALID_OR_REDEEMED_CODE")) {
      throw new Error("Invalid or already redeemed gift card code");
    }
    throw new Error(error.message);
  }
  return result;
});
const createGiftCardInput = objectType({
  code: stringType().min(4).max(50),
  amountCoins: numberType().int().min(1)
});
const createGiftCard_createServerFn_handler = createServerRpc({
  id: "d620d153cd9e36c1ac0605b31f3f436682089008024af316ece0fc394e64fbda",
  name: "createGiftCard",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => createGiftCard.__executeServer(opts));
const createGiftCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => createGiftCardInput.parse(d)).handler(createGiftCard_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: isAdmin
  } = await supabase.rpc("is_admin", {
    _user_id: userId
  });
  if (!isAdmin) throw new Error("Unauthorized: Admin access required");
  const {
    data: gc,
    error
  } = await supabase.from("gift_cards").insert({
    code: data.code.toUpperCase(),
    amount_coins: data.amountCoins,
    created_by: userId
  }).select().single();
  if (error) throw new Error(error.message);
  return gc;
});
const getAllGiftCards_createServerFn_handler = createServerRpc({
  id: "dde7d1105dfe1a43ec26de193009fa4abab348c1264bd9da23c636530a2ced62",
  name: "getAllGiftCards",
  filename: "src/lib/wallet.functions.ts"
}, (opts) => getAllGiftCards.__executeServer(opts));
const getAllGiftCards = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAllGiftCards_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: isAdmin
  } = await supabase.rpc("is_admin", {
    _user_id: userId
  });
  if (!isAdmin) throw new Error("Unauthorized: Admin access required");
  const {
    data,
    error
  } = await supabase.from("gift_cards").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
export {
  createGiftCard_createServerFn_handler,
  getAllGiftCards_createServerFn_handler,
  getMyWalletTransactions_createServerFn_handler,
  getMyWallet_createServerFn_handler,
  getMyWithdrawals_createServerFn_handler,
  payForProductWithWallet_createServerFn_handler,
  payForTicketWithWallet_createServerFn_handler,
  redeemGiftCard_createServerFn_handler,
  requestWithdrawal_createServerFn_handler,
  sponsorEventWithWallet_createServerFn_handler
};
