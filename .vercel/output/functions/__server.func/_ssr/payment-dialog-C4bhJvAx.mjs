import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription } from "./dialog-CO1OYTv6.mjs";
import { u as useWallet, W as WalletTopupDialog, o as openRazorpayCheckout } from "./wallet-topup-dialog-BrbwmaT1.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, t as cn } from "./router-C5_6oBDd.mjs";
import { coinsToInr, COINS_PER_INR } from "./wallet.functions-Bc2Nw_Yv.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as Switch } from "./switch-CKkXT9Zh.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { aX as Wallet, a5 as LogIn, c as ArrowRight, I as Coins, ak as Plus, a3 as LoaderCircle, aF as Sparkles } from "../_libs/lucide-react.mjs";
function PaymentDialog({
  open,
  onOpenChange,
  amountInr,
  itemTitle,
  itemDescription,
  purchase,
  onSuccess
}) {
  const [topupOpen, setTopupOpen] = reactExports.useState(false);
  const [processing, setProcessing] = reactExports.useState(false);
  const [useCoins, setUseCoins] = reactExports.useState(true);
  const qc = useQueryClient();
  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => (await supabase.auth.getSession()).data.session
  });
  const isLoggedIn = !!session;
  const wallet = useWallet();
  const totalCoins = Math.round(amountInr * COINS_PER_INR);
  const balance = wallet.balanceCoins ?? 0;
  const walletApplyCoins = Math.min(balance, totalCoins);
  const walletApplyInr = walletApplyCoins / COINS_PER_INR;
  const effectiveUseCoins = useCoins && balance > 0;
  const discountInr = effectiveUseCoins ? walletApplyInr : 0;
  const finalAmountInr = amountInr - discountInr;
  const isFullWalletPay = effectiveUseCoins && balance >= totalCoins;
  reactExports.useEffect(() => {
    if (!open) {
      setProcessing(false);
      setUseCoins(true);
    }
  }, [open]);
  const invalidateAfter = () => {
    qc.invalidateQueries({ queryKey: ["wallet"] });
    qc.invalidateQueries({ queryKey: ["wallet-transactions"] });
    if (purchase.kind === "ticket") {
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
      qc.invalidateQueries({ queryKey: ["has-ticket", purchase.eventId] });
    } else {
      qc.invalidateQueries({ queryKey: ["shop-products"] });
    }
  };
  const handlePay = async () => {
    if (isFullWalletPay) {
      await payFullWallet();
    } else {
      await payRazorpay(effectiveUseCoins);
    }
  };
  const payFullWallet = async () => {
    setProcessing(true);
    try {
      const { payForTicketWithWallet, payForProductWithWallet } = await import("./wallet.functions-Bc2Nw_Yv.mjs");
      if (purchase.kind === "ticket") {
        const res = await payForTicketWithWallet({ eventId: purchase.eventId, tier: purchase.tier });
        toast.success(`Ticket booked! Code: ${res.ticketCode}`);
      } else {
        await payForProductWithWallet({
          productId: purchase.productId,
          quantity: purchase.quantity,
          shippingAddress: purchase.shippingAddress ?? "Pickup at Campus"
        });
        toast.success(`Order placed!`);
      }
      invalidateAfter();
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      toast.error(e?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };
  const payRazorpay = async (useWalletPart) => {
    setProcessing(true);
    try {
      const { data: { session: session2 } } = await supabase.auth.getSession();
      if (!session2) throw new Error("Please sign in");
      const walletCoinsToUse = useWalletPart ? walletApplyCoins : 0;
      const body = {
        purpose: purchase.kind === "ticket" ? "ticket_purchase" : "product_purchase",
        walletCoinsToUse
      };
      if (purchase.kind === "ticket") {
        body.eventId = purchase.eventId;
        body.tier = purchase.tier;
      } else {
        body.productId = purchase.productId;
        body.quantity = purchase.quantity;
        body.shippingAddress = purchase.shippingAddress ?? "Pickup at Campus";
      }
      const { data: order, error } = await supabase.functions.invoke("razorpay-create-order", { body });
      if (error || !order) throw new Error(error?.message || "Failed to create order");
      await new Promise((resolve, reject) => {
        openRazorpayCheckout({
          keyId: order.keyId,
          orderId: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "WeFest",
          description: itemTitle,
          prefill: {
            email: session2.user?.email ?? void 0,
            name: session2.user?.user_metadata?.full_name
          },
          onSuccess: async (resp) => {
            const { data: vData, error: vErr } = await supabase.functions.invoke(
              "razorpay-verify",
              { body: resp }
            );
            if (vErr || vData?.error) {
              return reject(new Error(vErr?.message || vData?.error || "Verification failed"));
            }
            if (purchase.kind === "ticket" && vData?.ticketCode) {
              toast.success(`Ticket booked! Code: ${vData.ticketCode}`);
            } else {
              toast.success("Payment successful — order placed!");
            }
            resolve();
          },
          onDismiss: () => reject(new Error("Payment cancelled"))
        }).catch(reject);
      });
      invalidateAfter();
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      if (e?.message !== "Payment cancelled") toast.error(e?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md border-white/5 bg-slate-950/95 backdrop-blur-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold tracking-tight", children: "Complete Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-slate-400", children: [
          itemTitle,
          itemDescription ? ` · ${itemDescription}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-12 w-12" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold", children: "Total Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-4xl font-black text-white", children: [
              "₹",
              amountInr.toLocaleString()
            ] }),
            effectiveUseCoins && discountInr > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-emerald-400 font-medium animate-in fade-in slide-in-from-left-2", children: [
              "(-₹",
              discountInr.toFixed(2),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 mt-1", children: [
            totalCoins.toLocaleString(),
            " WeCoins equivalent"
          ] })
        ] })
      ] }),
      !isLoggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/login",
          className: "group block w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition-all mt-4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-6 w-6 text-amber-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-200", children: "Login to continue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: "Sign in to pay & track your purchases" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-5 w-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" })
          ] })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
          "rounded-2xl border p-4 transition-all duration-300",
          useCoins && balance > 0 ? "border-amber-500/30 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.05)]" : "border-white/5 bg-white/[0.01]",
          balance === 0 && "opacity-40 scale-[0.96] pointer-events-none select-none"
        ), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                useCoins && balance > 0 ? "bg-amber-500/20" : "bg-slate-800"
              ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: cn("h-5 w-5", useCoins && balance > 0 ? "text-amber-500" : "text-slate-500") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "use-coins", className: "text-sm font-bold text-slate-200 cursor-pointer", children: "Apply WeCoins" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500", children: [
                  "Balance: ",
                  balance.toLocaleString(),
                  " (₹",
                  coinsToInr(balance).toFixed(2),
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "use-coins",
                checked: useCoins && balance > 0,
                onCheckedChange: setUseCoins,
                disabled: balance === 0 || processing,
                className: "data-[state=checked]:bg-amber-500"
              }
            )
          ] }),
          balance > 0 && useCoins && balance < totalCoins && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-white/5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500", children: "Top up to pay fully with coins" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setTopupOpen(true);
                },
                className: "text-[10px] font-black text-amber-500 hover:text-amber-400 flex items-center gap-1 uppercase tracking-wider",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                  " Top up"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              disabled: processing || wallet.isLoading,
              onClick: handlePay,
              className: "group relative w-full h-16 overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x opacity-80 group-hover:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-[1px] rounded-[15px] bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-full flex items-center justify-center gap-3", children: processing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-amber-300 animate-pulse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-black text-white tracking-tight", children: [
                    "Pay ₹",
                    finalAmountInr.toLocaleString()
                  ] })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-slate-600 text-center uppercase tracking-widest font-bold", children: isFullWalletPay ? "Instant confirmation via WeCoin" : "Secure payment powered by Razorpay" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-700 text-center mt-2 border-t border-white/5 pt-4", children: [
        "WeCoins issued at 1 ₹ = ",
        COINS_PER_INR,
        " coins · Zero platform fees"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WalletTopupDialog,
      {
        open: topupOpen,
        onOpenChange: setTopupOpen,
        defaultAmount: Math.max(100, Math.ceil((totalCoins - balance) / COINS_PER_INR))
      }
    )
  ] });
}
export {
  PaymentDialog as P
};
