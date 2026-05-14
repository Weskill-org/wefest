import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useWallet, a as useWalletTransactions, W as WalletTopupDialog } from "./wallet-topup-dialog-BrbwmaT1.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription } from "./dialog-CO1OYTv6.mjs";
import { a as Button, t as cn } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { coinsToInr, redeemGiftCard } from "./wallet.functions-Bc2Nw_Yv.mjs";
import { I as Coins, a3 as LoaderCircle, ak as Plus, a as ArrowDownRight, d as ArrowUpRight, T as Gift, aJ as Ticket } from "../_libs/lucide-react.mjs";
function RedeemGiftCardDialog({ open, onOpenChange }) {
  const [code, setCode] = reactExports.useState("");
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: async (giftCode) => {
      if (!giftCode.trim()) throw new Error("Please enter a code");
      const { data: { session } } = await (await import("./router-C5_6oBDd.mjs").then((n) => n.s)).supabase.auth.getSession();
      return redeemGiftCard({
        data: { code: giftCode.trim() },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    onSuccess: (res) => {
      const amount = res?.amount ?? 0;
      toast.success(`${amount.toLocaleString()} WeCoins added to your wallet!`);
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet-transactions"] });
      setCode("");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to redeem code");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-rose-500" }),
        " Redeem Gift Card"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Enter your 8-12 character alphanumeric code to add WeCoins instantly." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "code", children: "Gift Card Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "code",
              placeholder: "WF-XXXX-XXXX",
              value: code,
              onChange: (e) => setCode(e.target.value.toUpperCase()),
              className: "pl-10 font-mono tracking-widest uppercase",
              disabled: m.isPending
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          disabled: m.isPending || !code.trim(),
          onClick: () => m.mutate(code),
          className: "w-full bg-rose-600 hover:bg-rose-700 text-white",
          size: "lg",
          children: m.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Redeem Now"
        }
      )
    ] })
  ] }) });
}
const TYPE_LABEL = {
  topup: "Top-up",
  purchase: "Purchase",
  sale: "Sale",
  refund: "Refund",
  sponsorship: "Sponsorship sent",
  sponsorship_received: "Sponsorship received",
  withdrawal: "Withdrawal",
  withdrawal_hold: "Withdrawal pending",
  withdrawal_release: "Withdrawal cancelled",
  admin_adjustment: "Adjustment"
};
function WalletPanel({ showTopup = true }) {
  const wallet = useWallet();
  const tx = useWalletTransactions(50);
  const [topupOpen, setTopupOpen] = reactExports.useState(false);
  const [redeemOpen, setRedeemOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-3.5 w-3.5 text-amber-500" }),
          " WeCoin Wallet"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-end gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl sm:text-6xl font-black tracking-tight", children: wallet.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin" }) : (wallet.balanceCoins ?? 0).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-2", children: [
            "≈ ₹",
            coinsToInr(wallet.balanceCoins ?? 0).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: showTopup && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setTopupOpen(true), className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Money"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setRedeemOpen(true), variant: "outline", className: "gap-2 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 text-rose-500 hover:text-rose-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Redeem Code"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3 max-w-sm text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/40 border border-white/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Lifetime credited" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-base mt-0.5", children: (wallet.data?.lifetime_credited ?? 0).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/40 border border-white/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Lifetime debited" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-base mt-0.5", children: (wallet.data?.lifetime_debited ?? 0).toLocaleString() })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-3", children: "Recent Transactions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden", children: [
        tx.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin inline mr-2" }),
          "Loading…"
        ] }),
        !tx.isLoading && (tx.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No transactions yet. Add money to get started." }),
        Array.isArray(tx.data) && tx.data.map((t) => {
          const credit = t.amount_coins > 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 hover:bg-white/[0.02]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
              credit ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            ), children: credit ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold truncate", children: t.description ?? TYPE_LABEL[t.type] ?? t.type }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                TYPE_LABEL[t.type] ?? t.type,
                " · ",
                new Date(t.created_at).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("text-sm font-bold", credit ? "text-emerald-500" : "text-rose-500"), children: [
                credit ? "+" : "",
                t.amount_coins.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                "bal ",
                t.balance_after.toLocaleString()
              ] })
            ] })
          ] }, t.id);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WalletTopupDialog, { open: topupOpen, onOpenChange: setTopupOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RedeemGiftCardDialog, { open: redeemOpen, onOpenChange: setRedeemOpen })
  ] });
}
export {
  WalletPanel as W
};
