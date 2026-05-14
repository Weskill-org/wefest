import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { getAllGiftCards, createGiftCard } from "./wallet.functions-Bc2Nw_Yv.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { ak as Plus, ap as RefreshCw, a3 as LoaderCircle, au as Search, F as CircleX, y as CircleCheck } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "./auth-middleware-HN75ZaUg.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function AdminGiftCards() {
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [newCode, setNewCode] = reactExports.useState("");
  const [newAmount, setNewAmount] = reactExports.useState(500);
  const {
    data: cards,
    isLoading
  } = useQuery({
    queryKey: ["admin-gift-cards"],
    queryFn: async () => {
      const {
        data: {
          session
        }
      } = await (await import("./router-C5_6oBDd.mjs").then((n) => n.s)).supabase.auth.getSession();
      return getAllGiftCards({
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    }
  });
  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "WF-";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3) result += "-";
    }
    setNewCode(result);
  };
  const createMutation = useMutation({
    mutationFn: async () => {
      const {
        data: {
          session
        }
      } = await (await import("./router-C5_6oBDd.mjs").then((n) => n.s)).supabase.auth.getSession();
      return createGiftCard({
        data: {
          code: newCode,
          amountCoins: newAmount
        },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    onSuccess: () => {
      toast.success("Gift card created successfully");
      setNewCode("");
      setNewAmount(500);
      qc.invalidateQueries({
        queryKey: ["admin-gift-cards"]
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create gift card");
    }
  });
  const filteredCards = cards?.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()) || c.redeemed_by?.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 p-6 sm:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Gift Cards" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Generate and manage redeemable WeCoin codes." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-primary" }),
          " Create New Code"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "code", children: "Gift Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "code", value: newCode, onChange: (e) => setNewCode(e.target.value.toUpperCase()), placeholder: "WF-XXXX-XXXX", className: "font-mono" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: generateRandomCode, title: "Generate random", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", children: "Amount (WeCoins)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "amount", type: "number", value: newAmount, onChange: (e) => setNewAmount(parseInt(e.target.value) || 0), min: 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              "≈ ₹",
              (newAmount / 10).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full mt-2", disabled: !newCode || newAmount <= 0 || createMutation.isPending, onClick: () => createMutation.mutate(), children: createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Create Gift Card" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by code or user ID...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl border border-white/10 overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : filteredCards?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-20 text-center text-muted-foreground", children: "No gift cards found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold text-right", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Redeemed At" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: filteredCards?.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/[0.02] transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-mono font-medium", children: card.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-emerald-500", children: [
              "+",
              card.amount_coins.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: card.is_redeemed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full text-[10px] w-fit font-bold uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
              " Redeemed"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-[10px] w-fit font-bold uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
              " Active"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground", children: card.is_redeemed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(card.redeemed_at).toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] truncate max-w-[150px]", children: card.redeemed_by })
            ] }) : "-" })
          ] }, card.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  AdminGiftCards as component
};
