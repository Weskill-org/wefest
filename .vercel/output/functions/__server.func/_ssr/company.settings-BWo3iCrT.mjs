import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a3 as LoaderCircle, ay as Settings2, r as Check, i as Building2, h as Briefcase, U as Globe, Y as Image, c as ArrowRight, aA as Shield, aF as Sparkles } from "../_libs/lucide-react.mjs";
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
function CompanySettings() {
  const qc = useQueryClient();
  const {
    data: user
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: {
          user: user2
        }
      } = await supabase.auth.getUser();
      if (!user2) throw new Error("Unauthorized");
      return user2;
    }
  });
  const {
    data: profile,
    isLoading
  } = useQuery({
    queryKey: ["company-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("company_profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    }
  });
  const {
    data: subscription
  } = useQuery({
    queryKey: ["my-subscription"],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    }
  });
  const [companyName, setCompanyName] = reactExports.useState("");
  const [industry, setIndustry] = reactExports.useState("");
  const [website, setWebsite] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name || user?.user_metadata?.full_name || "");
      setIndustry(profile.industry || "");
      setWebsite(profile.website_url || "");
    }
  }, [profile, user]);
  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!profile?.id) throw new Error("Profile not found");
      const {
        error
      } = await supabase.from("company_profiles").update({
        company_name: companyName,
        industry,
        website_url: website,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      qc.invalidateQueries({
        queryKey: ["company-profile"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const handleUpgrade = (plan) => {
    toast.success(`Redirecting to payment for ${plan} plan...`, {
      description: "Secure payment processing powered by WeFest Billing Engine."
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 max-w-[1000px] mx-auto space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-primary uppercase tracking-widest", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-black tracking-tight", children: "Company Profile & Plan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm", children: "Manage your company information, brand assets, and subscription plan." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: "Company Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Update your business details visible to organizers" })
        ] }),
        profile?.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto bg-emerald-500/10 text-emerald-500 border-none text-[9px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-2.5 w-2.5 mr-1" }),
          " Verified"
        ] }),
        profile?.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto bg-amber-500/10 text-amber-500 border-none text-[9px]", children: "Pending Review" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Company Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: companyName, onChange: (e) => setCompanyName(e.target.value), className: "pl-9 glass border-white/10 h-10" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Industry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: industry, onChange: (e) => setIndustry(e.target.value), placeholder: "e.g. Technology, FMCG, Education", className: "pl-9 glass border-white/10 h-10" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Website" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: website, onChange: (e) => setWebsite(e.target.value), placeholder: "https://your-company.com", className: "pl-9 glass border-white/10 h-10" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => updateProfile.mutate(), disabled: updateProfile.isPending, className: "bg-brand-gradient text-white shadow-glow text-xs", children: [
        updateProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : null,
        "Save Changes"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: "Brand Assets & Creatives" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage your banners, logos, and guidelines from the dedicated assets page." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/company/brand-assets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-brand-gradient text-white text-xs whitespace-nowrap", children: [
        "Manage Assets ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 ml-1.5" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Subscription Plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Choose a plan that fits your sponsorship goals." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PricingCard, { name: "Explorer", price: "Free", desc: "Perfect for local brands.", active: !subscription, features: ["3 fests per month", "Basic profile", "Standard dashboard"], onUpgrade: () => handleUpgrade("Explorer") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PricingCard, { name: "Growth", price: "₹9,999", period: "/yr", desc: "Serious brand partners.", featured: true, active: subscription?.plan_type === "Growth", features: ["Unlimited fests", "Priority proposals", "Booth heatmap", "Lead export", "Direct chat"], onUpgrade: () => handleUpgrade("Growth") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PricingCard, { name: "Enterprise", price: "Custom", desc: "Multi-campus activation.", active: subscription?.plan_type === "Enterprise", features: ["Dedicated manager", "Global access", "API & CRM sync", "24/7 support"], onUpgrade: () => handleUpgrade("Enterprise") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: "Verified ROI Guarantee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Identity-verified student network. Every booth scan is a verified lead." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "shrink-0 text-xs", children: [
          "Schedule Demo ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 ml-1" })
        ] })
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
  active,
  onUpgrade
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 ${featured ? "bg-brand-gradient text-primary-foreground shadow-glow border-none" : "glass border-white/5"}`, children: [
    featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-foreground text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 text-primary" }),
      " Popular"
    ] }),
    active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-emerald-500/10 text-emerald-500 border-none text-[9px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-2.5 w-2.5 mr-0.5" }),
      " Current"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-baseline gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black", children: price }),
        period && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-70", children: period })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-2 text-xs ${featured ? "text-primary-foreground/70" : "text-muted-foreground"}`, children: desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-2.5 mb-6", children: features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-4 w-4 shrink-0 rounded-full flex items-center justify-center ${featured ? "bg-white/20" : "bg-primary/10"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: `h-2.5 w-2.5 ${featured ? "text-white" : "text-primary"}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: featured ? "text-primary-foreground/90" : "text-foreground/80", children: f })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onUpgrade, size: "sm", variant: featured ? "secondary" : "default", className: `w-full text-xs font-bold ${featured ? "bg-white text-primary hover:bg-white/90" : ""}`, disabled: active, children: active ? "Current Plan" : price === "Custom" ? "Contact Sales" : "Get Started" })
  ] });
}
export {
  CompanySettings as component
};
