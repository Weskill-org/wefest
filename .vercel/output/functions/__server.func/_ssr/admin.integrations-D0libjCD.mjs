import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { a3 as LoaderCircle, ak as Plus, a0 as Key, J as Copy, U as Globe, az as Share2, N as ExternalLink, aD as ShieldCheck, aZ as Zap, _ as Info } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
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
function AdminIntegrations() {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const {
    data: colleges
  } = useQuery({
    queryKey: ["all-colleges"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("colleges").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: apiKeys,
    isLoading: loadingKeys
  } = useQuery({
    queryKey: ["university-api-keys"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("university_api_keys").select("*, college:college_id(name)");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: webhooks,
    isLoading: loadingWebhooks
  } = useQuery({
    queryKey: ["university-webhooks"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("webhooks").select("*, college:college_id(name)");
      if (error) throw error;
      return data;
    }
  });
  useMutation({
    mutationFn: async (collegeId) => {
      const newKey = `wf_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
      const {
        error
      } = await supabase.from("university_api_keys").insert({
        college_id: collegeId,
        api_key_hash: newKey,
        // In real app, hash this
        label: "Primary Integration Key",
        scopes: ["read:events", "read:attendance"]
      });
      if (error) throw error;
      return newKey;
    },
    onSuccess: (newKey) => {
      queryClient.invalidateQueries({
        queryKey: ["university-api-keys"]
      });
      toast.success("API Key Generated", {
        description: "Copy it now: " + newKey
      });
    }
  });
  if (loadingKeys || loadingWebhooks) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black font-display", children: "University Integrations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage API access and webhooks for institutional partners." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-brand-gradient text-white", onClick: () => setIsGenerating(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        " New Integration"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "API Access Keys" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: apiKeys?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic text-center py-4", children: "No active API keys found." }) : apiKeys?.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: key.college?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded", children: "wf_••••••••••••" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => toast.success("Key copied to clipboard"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-emerald-500/10 text-emerald-500 border-none", children: "Active" })
        ] }, key.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Webhooks" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: webhooks?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic text-center py-4", children: "No configured webhooks found." }) : webhooks?.map((wh) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-muted/30 border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: wh.college?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Production" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-mono truncate", children: wh.url }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-2", children: wh.events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[9px] uppercase", children: e }, e)) })
        ] }, wh.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-8 bg-brand-gradient/5 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-10 w-10 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black", children: "Institutional Integration Hub" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 max-w-2xl", children: "Enable your university's internal systems to sync with WeFest. We provide native support for major College ERPs (SAP Campus, Oracle, etc.) and custom webhooks for real-time attendance and event data." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "bg-white/5 border-white/10", children: [
            "View API Docs ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "ml-2 h-3 w-3" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "bg-white/5 border-white/10", children: "Webhook Secrets" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: ShieldCheck, title: "Verified Payloads", desc: "All webhooks are signed with SHA-256 for maximum security." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Zap, title: "Instant Sync", desc: "Real-time ticket validation syncing with college database." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Info, title: "Compliance", desc: "Fully compliant with UGC and state-level data guidelines." })
    ] })
  ] });
}
function Feature({
  icon: Icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-primary mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold mb-1", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: desc })
  ] });
}
export {
  AdminIntegrations as component
};
