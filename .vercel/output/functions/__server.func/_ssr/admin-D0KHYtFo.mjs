import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase } from "./router-C5_6oBDd.mjs";
import "../_libs/sonner.mjs";
import { a3 as LoaderCircle, a1 as LayoutDashboard, G as ClipboardCheck, j as CalendarCheck, az as Share2, i as Building2, aV as Users, aD as ShieldCheck, aL as TrendingUp, a8 as MapPin, aa as Megaphone, T as Gift } from "../_libs/lucide-react.mjs";
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
const adminLinks = [{
  to: "/admin",
  icon: LayoutDashboard,
  label: "Overview",
  exact: true
}, {
  to: "/admin/approvals",
  icon: ClipboardCheck,
  label: "Approvals"
}, {
  to: "/admin/events",
  icon: CalendarCheck,
  label: "Events"
}, {
  to: "/admin/colleges",
  icon: Share2,
  label: "Colleges"
}, {
  to: "/admin/companies",
  icon: Building2,
  label: "Companies"
}, {
  to: "/admin/users",
  icon: Users,
  label: "Users"
}, {
  to: "/admin/admins",
  icon: ShieldCheck,
  label: "Admin Team"
}, {
  to: "/admin/analytics",
  icon: TrendingUp,
  label: "Analytics"
}, {
  to: "/admin/integrations",
  icon: Share2,
  label: "Integrations"
}, {
  to: "/admin/cities",
  icon: MapPin,
  label: "Cities"
}, {
  to: "/admin/broadcasts",
  icon: Megaphone,
  label: "Broadcasts"
}, {
  to: "/admin/gift-cards",
  icon: Gift,
  label: "Gift Cards"
}];
function AdminLayout() {
  const {
    data: adminData,
    isLoading
  } = useQuery({
    queryKey: ["check-admin"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      const {
        data,
        error
      } = await supabase.from("admin_users").select("id, rank").eq("user_id", user.id).single();
      if (error && error.code !== "PGRST116") {
        console.error("Error checking admin status:", error);
      }
      return data;
    }
  });
  const isAdmin = !!adminData;
  const adminRank = adminData?.rank;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "You do not have administrative privileges." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 inline-block rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-primary-foreground", children: "Return Home" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-6 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-[240px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "glass rounded-2xl p-4 h-fit sticky top-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-primary uppercase tracking-wider", children: "Control Panel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold mt-1", children: "Admin Hub" }),
        adminRank && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider", children: adminRank })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-1", children: adminLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: link.to, activeOptions: link.exact ? {
        exact: true
      } : void 0, className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent/50 hover:text-foreground", activeProps: {
        className: "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { className: "h-4 w-4" }),
        link.label
      ] }, link.to)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] }) });
}
export {
  AdminLayout as component
};
