import { c as createServerFn, T as TSS_SERVER_FUNCTION, a as getServerFnById } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-HN75ZaUg.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const COINS_PER_INR = 10;
const inrToCoins = (inr) => Math.round(inr * COINS_PER_INR);
const coinsToInr = (coins) => coins / COINS_PER_INR;
const getMyWallet = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("350f5a32c4d4e75fb92a5d3e86f1d4a377b70a50e7167b6228da6903c9665510"));
const getMyWalletTransactions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => ({
  limit: Math.min(d?.limit ?? 50, 200)
})).handler(createSsrRpc("33b36e30b6bb7dc5322b6aa43077176bf5956dc60458ccd34e2c31f427e79b56"));
const payForTicketInput = objectType({
  eventId: stringType().uuid(),
  tier: stringType().min(1).max(50)
});
const payForTicketWithWallet = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => payForTicketInput.parse(d)).handler(createSsrRpc("8abaf323b8cc05a6685d69ca5d7255d2d41790f0ca6f2660080f814696053f09"));
const payForProductInput = objectType({
  productId: stringType().uuid(),
  quantity: numberType().int().min(1).max(20),
  shippingAddress: stringType().min(5).max(500)
});
const payForProductWithWallet = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => payForProductInput.parse(d)).handler(createSsrRpc("cced05aa6cdc7624d9d305a17b6f3e85857f2c999a6034ac2dbb3227d5aed381"));
const sponsorInput = objectType({
  eventId: stringType().uuid(),
  amountInr: numberType().int().min(1).max(1e7),
  tier: stringType().min(1).max(50),
  message: stringType().max(1e3).optional()
});
const sponsorEventWithWallet = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => sponsorInput.parse(d)).handler(createSsrRpc("de213bb2a3b807d91bd13cf31987248e6b93eb4de42de7ffbc0a69443aadaddd"));
const withdrawalInput = objectType({
  amountInr: numberType().int().min(100).max(1e7),
  bankAccountName: stringType().min(2).max(100),
  bankAccountNumber: stringType().min(6).max(30),
  bankIfsc: stringType().min(8).max(20),
  notes: stringType().max(500).optional()
});
const requestWithdrawal = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => withdrawalInput.parse(d)).handler(createSsrRpc("36025196498f272e4529bd0ce3f249f1edd4e6399467f6fdd4207731f59573f9"));
const getMyWithdrawals = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("6bc3d9a2e3696c49c50acee525e610576f929b6d9d0231942e8ec9dd3854780e"));
const redeemGiftCardInput = objectType({
  code: stringType().min(4).max(50)
});
const redeemGiftCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => redeemGiftCardInput.parse(d)).handler(createSsrRpc("5a29c5caa99ba8439e6e4d9e309722da2fe60dba2d7da3e5bc90f797600b3546"));
const createGiftCardInput = objectType({
  code: stringType().min(4).max(50),
  amountCoins: numberType().int().min(1)
});
const createGiftCard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => createGiftCardInput.parse(d)).handler(createSsrRpc("d620d153cd9e36c1ac0605b31f3f436682089008024af316ece0fc394e64fbda"));
const getAllGiftCards = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("dde7d1105dfe1a43ec26de193009fa4abab348c1264bd9da23c636530a2ced62"));
export {
  COINS_PER_INR,
  coinsToInr,
  createGiftCard,
  getAllGiftCards,
  getMyWallet,
  getMyWalletTransactions,
  getMyWithdrawals,
  inrToCoins,
  payForProductWithWallet,
  payForTicketWithWallet,
  redeemGiftCard,
  requestWithdrawal,
  sponsorEventWithWallet
};
