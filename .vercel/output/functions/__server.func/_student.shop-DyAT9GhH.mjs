import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { m as Route$8, x as supabase, y as useRegion } from "./_ssr/router-C5_6oBDd.mjs";
import { P as PaymentDialog } from "./_ssr/payment-dialog-C4bhJvAx.mjs";
import { I as Input } from "./_ssr/input-DfdhTZrH.mjs";
import "./_libs/sonner.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { aE as ShoppingBag, au as Search, aG as Star } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/dialog-CO1OYTv6.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_ssr/wallet-topup-dialog-BrbwmaT1.mjs";
import "./_ssr/wallet.functions-Bc2Nw_Yv.mjs";
import "./_ssr/auth-middleware-HN75ZaUg.mjs";
import "./_libs/zod.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/label-Dd0kFXLk.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_ssr/switch-CKkXT9Zh.mjs";
import "./_libs/radix-ui__react-switch.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
function ProductCard({ product }) {
  const { formatPrice } = useRegion();
  const [paymentOpen, setPaymentOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "perspective-1000 group w-full h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-[2.5rem] border border-white/10 glass transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-64 overflow-hidden bg-black/5 dark:bg-white/5 border-b border-white/5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0" }),
        product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.image_url,
            alt: product.name,
            className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center bg-brand-gradient opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-30 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-16 w-16 text-white drop-shadow-xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-4 rounded-full border border-white/20 bg-background/50 backdrop-blur-md px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-foreground shadow-sm z-20", children: product.event_name }),
        product.stock <= 5 && product.stock > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute right-4 top-4 rounded-full bg-red-500/90 backdrop-blur px-3 py-1.5 text-[9px] font-black text-white uppercase tracking-widest animate-pulse shadow-sm z-20", children: [
          "Only ",
          product.stock,
          " left"
        ] }),
        product.stock === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 z-30 grid place-items-center bg-black/80 backdrop-blur-sm text-2xl font-black text-white uppercase tracking-widest", children: "Sold Out" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 right-4 z-20 bg-background/80 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-foreground", children: formatPrice(product.price) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed", children: product.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between pt-6 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-amber-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-muted-foreground font-bold text-xs", children: "(12)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPaymentOpen(true),
              disabled: product.stock === 0,
              className: "flex items-center gap-2 rounded-xl bg-primary/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-brand-gradient hover:text-white disabled:opacity-50 disabled:hover:bg-primary/10 disabled:hover:text-primary shadow-sm hover:shadow-glow group-hover:scale-105",
              children: "Buy Now"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentDialog,
      {
        open: paymentOpen,
        onOpenChange: setPaymentOpen,
        amountInr: product.price,
        itemTitle: product.name,
        itemDescription: "Official Merchandise",
        purchase: {
          kind: "product",
          productId: product.id,
          quantity: 1,
          shippingAddress: "Pickup at Campus"
        }
      }
    )
  ] });
}
function Shop() {
  const [q, setQ] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("All");
  const {
    profile
  } = Route$8.useRouteContext();
  const collegeId = profile?.college_id;
  const {
    data: products,
    isLoading
  } = useQuery({
    queryKey: ["shop-products", collegeId],
    queryFn: async () => {
      if (!collegeId) return [];
      const {
        data,
        error
      } = await supabase.from("products").select("*, event:event_id!inner(title, college_id)").eq("event.college_id", collegeId).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data.map((p) => ({
        ...p,
        event_name: p.event?.title || "Official WeFest"
      }));
    }
  });
  const filtered = reactExports.useMemo(() => {
    if (!products) return [];
    return products.filter((p) => (activeTab === "All" || p.event_name.includes(activeTab)) && (p.name.toLowerCase().includes(q.toLowerCase()) || p.event_name.toLowerCase().includes(q.toLowerCase())));
  }, [products, q, activeTab]);
  const categories = ["All", "Hoodies", "T-Shirts", "Accessories", "Tickets"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 sm:px-8 py-8 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: "Campus Store" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Official merchandise from India's top college festivals." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/orders", className: "flex items-center gap-2 text-xs text-foreground font-semibold px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "My Orders" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search gear...", value: q, onChange: (e) => setQ(e.target.value), className: "h-10 pl-9 rounded-xl bg-white/[0.03] border-white/10 text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab(c), className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === c ? "bg-brand-gradient text-white shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/5"}`, children: c }, c)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: isLoading ? [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[380px] rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" }, i)) : filtered.length > 0 ? filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: {
      ...p,
      description: p.description ?? "",
      image_url: p.image_url ?? ""
    } }, p.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-6 w-6 text-muted-foreground/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-1", children: "No gear found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-[280px] mx-auto", children: "Try exploring other categories or check back later for new drops." })
    ] }) })
  ] });
}
export {
  Shop as component
};
