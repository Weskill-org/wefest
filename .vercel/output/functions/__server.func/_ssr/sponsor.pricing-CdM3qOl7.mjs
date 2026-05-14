import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { aA as Shield, c as ArrowRight, aF as Sparkles, r as Check } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function SponsorPricing() {
  const handleUpgrade = (plan) => {
    toast.success(`Redirecting to payment for ${plan} plan...`, {
      description: "Secure payment processing powered by WeFest Billing Engine."
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-black md:text-6xl", children: [
        "Scale your ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Brand Impact" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-lg text-muted-foreground max-w-2xl mx-auto", children: "Choose a plan that fits your sponsorship goals. From basic visibility to deep analytics and lead generation." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 grid gap-8 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PricingCard, { name: "Explorer", price: "Free", desc: "Perfect for local brands testing the waters.", features: ["Apply to 3 fests per month", "Basic profile listing", "Standard ROI dashboard", "Public proposals only"], onUpgrade: () => handleUpgrade("Explorer") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PricingCard, { name: "Growth", price: "₹9,999", period: "/year", desc: "The standard for serious brand partners.", featured: true, features: ["Unlimited fest applications", "Priority proposal review", "Real-time booth heatmap", "Lead export (CSV/Excel)", "Direct organizer chat", "Promoted brand status"], onUpgrade: () => handleUpgrade("Growth") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PricingCard, { name: "Enterprise", price: "Custom", desc: "Full-scale multi-campus activation.", features: ["Dedicated account manager", "Global campus network access", "White-labeled event microsites", "API access for CRM sync", "Custom footprint analytics", "24/7 priority support"], onUpgrade: () => handleUpgrade("Enterprise") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 glass rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-primary" }),
          " Verified ROI Guarantee"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground max-w-xl", children: "Our identity-verified student network ensures you are reaching real, target-demographic users. Every booth scan is a verified student lead." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "outline", className: "shrink-0", children: [
        "Schedule Demo ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] })
  ] });
}
function PricingCard({
  name,
  price,
  period,
  desc,
  features,
  featured,
  onUpgrade
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative flex flex-col rounded-3xl p-8 transition-all hover:-translate-y-1 ${featured ? "bg-brand-gradient text-primary-foreground shadow-glow border-none" : "glass border-border/60"}`, children: [
    featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
      " Most Popular"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-baseline gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-black", children: price }),
        period && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm opacity-80", children: period })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-4 text-sm ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`, children: desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-4 mb-8", children: features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-5 w-5 shrink-0 rounded-full flex items-center justify-center ${featured ? "bg-white/20" : "bg-primary/10"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: `h-3 w-3 ${featured ? "text-white" : "text-primary"}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: featured ? "text-primary-foreground/90" : "text-foreground/90", children: f })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onUpgrade, size: "lg", variant: featured ? "secondary" : "default", className: `w-full font-bold ${featured ? "bg-white text-primary hover:bg-white/90" : ""}`, children: price === "Custom" ? "Contact Sales" : "Get Started" })
  ] });
}
export {
  SponsorPricing as component
};
