import { a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouter } from "../_libs/tanstack__react-router.mjs";
import { v as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { coinsToInr, COINS_PER_INR, getMyWallet, getMyWalletTransactions } from "./wallet.functions-Bc2Nw_Yv.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription } from "./dialog-CO1OYTv6.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as Coins, aF as Sparkles, a3 as LoaderCircle } from "../_libs/lucide-react.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
function useWallet() {
  const fetchWallet = useServerFn(getMyWallet);
  const q = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return fetchWallet({
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    staleTime: 1e4
  });
  return {
    ...q,
    balanceCoins: q.data?.balance_coins ?? 0,
    balanceInr: coinsToInr(q.data?.balance_coins ?? 0)
  };
}
function useWalletTransactions(limit = 50) {
  const fetchTx = useServerFn(getMyWalletTransactions);
  return useQuery({
    queryKey: ["wallet-transactions", limit],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return fetchTx({
        data: { limit },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    staleTime: 5e3
  });
}
let scriptLoading = null;
function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("client only"));
  if (window.Razorpay) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptLoading = null;
      reject(new Error("Failed to load Razorpay"));
    };
    document.head.appendChild(s);
  });
  return scriptLoading;
}
async function openRazorpayCheckout(opts) {
  await loadRazorpayScript();
  if (!window.Razorpay) throw new Error("Razorpay SDK not available");
  const rzp = new window.Razorpay({
    key: opts.keyId,
    order_id: opts.orderId,
    amount: opts.amount,
    currency: opts.currency,
    name: opts.name,
    description: opts.description,
    prefill: opts.prefill,
    theme: { color: "#7c3aed" },
    handler: opts.onSuccess,
    modal: { ondismiss: opts.onDismiss }
  });
  rzp.open();
}
const QUICK = [100, 250, 500, 1e3, 2500, 5e3];
function WalletTopupDialog({ open, onOpenChange, defaultAmount = 500 }) {
  const [amount, setAmount] = reactExports.useState(defaultAmount);
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: async (amountInr) => {
      if (amountInr < 10) throw new Error("Minimum top-up is ₹10");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in to top up");
      const user = session.user;
      const { data: order, error: orderErr } = await supabase.functions.invoke("razorpay-create-order", { body: { amountInr } });
      if (orderErr || !order) throw new Error(orderErr?.message || "Failed to create order");
      return new Promise((resolve, reject) => {
        openRazorpayCheckout({
          keyId: order.keyId,
          orderId: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "WeFest Wallet",
          description: `Add ₹${amountInr} to WeCoin wallet`,
          prefill: {
            email: user?.email ?? void 0,
            name: user?.user_metadata?.full_name
          },
          onSuccess: async (resp) => {
            const { error: vErr } = await supabase.functions.invoke("razorpay-verify", { body: resp });
            if (vErr) return reject(new Error(vErr.message || "Verification failed"));
            resolve({ ok: true });
          },
          onDismiss: () => reject(new Error("Payment cancelled"))
        }).catch(reject);
      });
    },
    onSuccess: () => {
      toast.success(`₹${amount} added to your WeCoin wallet`);
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet-transactions"] });
      onOpenChange(false);
    },
    onError: (err) => {
      if (err?.message !== "Payment cancelled") toast.error(err?.message || "Top-up failed");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-5 w-5 text-amber-500" }),
        " Top up WeCoin Wallet"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "1 WeCoin = ₹0.10 · Powered by Razorpay (UPI, cards, netbanking)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: QUICK.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setAmount(v),
          className: `rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${amount === v ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-white/20"}`,
          children: [
            "₹",
            v
          ]
        },
        v
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amt", children: "Custom amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "amt",
            type: "number",
            min: 10,
            max: 5e5,
            value: amount,
            onChange: (e) => setAmount(Math.max(0, parseInt(e.target.value) || 0)),
            className: "mt-1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-amber-500" }),
          "You'll receive ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            (amount * COINS_PER_INR).toLocaleString(),
            " WeCoins"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          disabled: m.isPending || amount < 10,
          onClick: () => m.mutate(amount),
          className: "w-full",
          size: "lg",
          children: m.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : `Pay ₹${amount} with Razorpay`
        }
      )
    ] })
  ] }) });
}
export {
  WalletTopupDialog as W,
  useWalletTransactions as a,
  openRazorpayCheckout as o,
  useWallet as u
};
