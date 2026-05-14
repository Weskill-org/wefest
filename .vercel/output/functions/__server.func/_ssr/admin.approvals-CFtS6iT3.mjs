import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase } from "./router-C5_6oBDd.mjs";
import "../_libs/sonner.mjs";
import { a3 as LoaderCircle, at as School, i as Building2, j as CalendarCheck, c as ArrowRight } from "../_libs/lucide-react.mjs";
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
function AdminApprovals() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-approvals-counts"],
    queryFn: async () => {
      const [colleges, companies, events] = await Promise.all([supabase.from("colleges").select("id", {
        count: "exact",
        head: true
      }).eq("status", "pending"), supabase.from("company_profiles").select("id", {
        count: "exact",
        head: true
      }).eq("status", "pending"), supabase.from("events").select("id", {
        count: "exact",
        head: true
      }).eq("status", "pending")]);
      return {
        colleges: colleges.count ?? 0,
        companies: companies.count ?? 0,
        events: events.count ?? 0
      };
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-60 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) });
  }
  const cards = [{
    to: "/admin/colleges",
    label: "Colleges",
    icon: School,
    count: data?.colleges ?? 0,
    desc: "New college applications waiting for verification."
  }, {
    to: "/admin/companies",
    label: "Companies",
    icon: Building2,
    count: data?.companies ?? 0,
    desc: "Sponsor & brand accounts awaiting approval."
  }, {
    to: "/admin/events",
    label: "Fests & Events",
    icon: CalendarCheck,
    count: data?.events ?? 0,
    desc: "Events submitted by organizers pending review."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Pending Approvals" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "All items waiting on your decision in one place." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-3", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: c.to, className: "glass rounded-2xl p-6 hover:border-primary/40 transition group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-primary/10 grid place-items-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-display font-black", children: c.count })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 font-semibold flex items-center gap-2", children: [
        c.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 opacity-0 group-hover:opacity-100 transition" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: c.desc })
    ] }, c.to)) })
  ] });
}
export {
  AdminApprovals as component
};
