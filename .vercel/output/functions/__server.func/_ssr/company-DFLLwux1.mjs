import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, u as useMatchRoute, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { d as Route$R, x as supabase, t as cn } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { u as ChevronRight, t as ChevronLeft, aY as X, ab as Menu, a1 as LayoutDashboard, W as Handshake, au as Search, as as ScanLine, Y as Image, ax as Settings, h as Briefcase, a6 as LogOut } from "../_libs/lucide-react.mjs";
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
const sidebarLinks = [{
  to: "/company",
  label: "Dashboard",
  icon: LayoutDashboard,
  exact: true
}, {
  to: "/company/proposals",
  label: "Proposals",
  icon: Handshake
}, {
  to: "/company/marketplace",
  label: "Marketplace",
  icon: Search
}, {
  to: "/company/scan",
  label: "Booth Scanner",
  icon: ScanLine
}, {
  to: "/company/brand-assets",
  label: "Brand Assets",
  icon: Image
}];
const bottomLinks = [{
  to: "/company/settings",
  label: "Settings",
  icon: Settings
}];
function CompanyLayout() {
  const ctx = Route$R.useRouteContext();
  const user = ctx?.user;
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const {
    data: companyProfile
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
  const companyName = companyProfile?.company_name || user?.user_metadata?.full_name || "Company";
  const industry = companyProfile?.industry || "Brand";
  const initials = companyName.substring(0, 2).toUpperCase();
  const isApproved = companyProfile?.status === "approved";
  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({
      to: "/"
    });
  };
  const NavItem = ({
    link,
    onClick
  }) => {
    const isActive = link.exact ? matchRoute({
      to: link.to,
      fuzzy: false
    }) : matchRoute({
      to: link.to,
      fuzzy: true
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: link.to, onClick, className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 relative group", collapsed && "justify-center px-2.5", isActive ? "bg-brand-gradient text-white shadow-glow font-bold" : "text-muted-foreground hover:text-foreground hover:bg-white/5"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { className: cn("h-[18px] w-[18px] shrink-0 transition-colors", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground") }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: link.label }),
      isActive && !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-white/40" })
    ] });
  };
  const SidebarInner = ({
    onNavigate
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("px-4 pt-5 pb-3", collapsed && "px-2.5"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3", collapsed && "justify-center"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-sm shadow-glow", children: initials }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold truncate", children: companyName }),
          isApproved && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-emerald-500/10 text-emerald-500 border-none text-[9px] px-1.5 py-0", children: "Verified" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium uppercase tracking-widest", children: industry })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mx-4 border-t border-white/5 my-1", collapsed && "mx-2.5") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: cn("flex-1 px-3 py-3 space-y-0.5 overflow-y-auto hide-scrollbar", collapsed && "px-2"), children: sidebarLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { link, onClick: onNavigate }, link.to)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("px-3 py-3 space-y-0.5 border-t border-white/5", collapsed && "px-2"), children: bottomLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { link, onClick: onNavigate }, link.to)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("border-t border-white/5 px-4 py-3", collapsed && "px-2.5"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3", collapsed && "justify-center"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 shrink-0 rounded-lg bg-white/5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold text-muted-foreground", children: "Company Portal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "text-[10px] text-muted-foreground/60 hover:text-destructive font-medium flex items-center gap-1 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-2.5 w-2.5" }),
          " Sign out"
        ] })
      ] })
    ] }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: cn("hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-white/5 bg-background/95 backdrop-blur-2xl transition-all duration-300", collapsed ? "w-[68px]" : "w-[250px]"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarInner, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed(!collapsed), className: "absolute -right-3 top-16 h-6 w-6 rounded-full border border-white/10 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all shadow-sm", children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3 w-3" }) })
    ] }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: () => setMobileOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "absolute inset-y-0 left-0 w-[260px] border-r border-white/5 bg-background shadow-2xl animate-in slide-in-from-left duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(false), className: "absolute top-4 right-3 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarInner, { onNavigate: () => setMobileOpen(false) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: cn("flex-1 min-h-screen transition-all duration-300 flex flex-col", collapsed ? "lg:ml-[68px]" : "lg:ml-[250px]"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-background/90 backdrop-blur-xl px-4 py-2.5 lg:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(true), className: "h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-[9px] font-bold shrink-0", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold truncate block leading-tight", children: companyName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium truncate block leading-tight", children: industry })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  CompanyLayout as component
};
