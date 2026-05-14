import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, u as useMatchRoute, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { b as Route$V, a as Button, t as cn, x as supabase } from "./router-C5_6oBDd.mjs";
import { A as Avatar, a as AvatarFallback } from "./avatar-CftWrQC9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { H as Clock, u as ChevronRight, t as ChevronLeft, aY as X, ab as Menu, B as BadgeCheck, a1 as LayoutDashboard, n as CalendarRange, m as CalendarPlus, as as ScanLine, aV as Users, Y as Image, p as ChartColumn, aZ as Zap, Z as IndianRupee, aE as ShoppingBag, ax as Settings, a6 as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
const sidebarLinks = [{
  to: "/organizer",
  label: "Dashboard",
  icon: LayoutDashboard,
  exact: true
}, {
  to: "/organizer/events",
  label: "Events",
  icon: CalendarRange
}, {
  to: "/organizer/new",
  label: "Create Event",
  icon: CalendarPlus
}, {
  to: "/organizer/scan",
  label: "Scan Tickets",
  icon: ScanLine
}, {
  to: "/organizer/team",
  label: "Team",
  icon: Users
}, {
  to: "/organizer/sponsor-assets",
  label: "Sponsor Assets",
  icon: Image
}];
function OrganizerLayout() {
  const ctx = Route$V.useRouteContext();
  const membership = ctx?.membership;
  const user = ctx?.user;
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  if (membership && !membership.is_approved) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-10 w-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tight mb-3", children: "Membership Pending" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground max-w-md mx-auto", children: [
        "Your request to join ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: membership.colleges?.name }),
        " is currently pending approval from the College Admin."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "mt-8 text-primary font-bold", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Back to Home" }) })
    ] });
  }
  const collegeName = membership?.colleges?.name || user?.user_metadata?.full_name || "Organizer";
  const isVerified = membership?.colleges?.status === "approved";
  const initials = collegeName.substring(0, 2).toUpperCase();
  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({
      to: "/"
    });
  };
  const SidebarContent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3 px-5 pt-6 pb-4", collapsed && "justify-center px-3"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-sm shadow-glow", children: initials }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold truncate", children: "Organizer" }),
          isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium uppercase tracking-widest", children: collegeName })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 h-px bg-border/50 my-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 px-3 py-4 space-y-1", children: [
      sidebarLinks.map((link) => {
        const isActive = link.exact ? matchRoute({
          to: link.to,
          fuzzy: false
        }) : matchRoute({
          to: link.to,
          fuzzy: true
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: link.to, onClick: () => setMobileOpen(false), className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200", collapsed && "justify-center px-2", isActive ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { className: cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary") }),
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: link.label }),
          isActive && !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary" })
        ] }, link.to);
      }),
      (() => {
        const match = matchRoute({
          to: "/organizer/events/$eventId",
          fuzzy: true
        });
        if (match) {
          const eventId = match.eventId;
          const isConsoleActive = matchRoute({
            to: "/organizer/events/$eventId",
            fuzzy: false
          });
          const search = Route$V.useSearch();
          const activeTab = search?.tab || "analytics";
          const eventSubLinks = [{
            tab: "analytics",
            label: "Analytics",
            icon: ChartColumn
          }, {
            tab: "sponsors",
            label: "Sponsors",
            icon: Zap
          }, {
            tab: "volunteers",
            label: "Volunteers",
            icon: Users
          }, {
            tab: "finance",
            label: "Finance",
            icon: IndianRupee
          }, {
            tab: "merch",
            label: "Merchandise",
            icon: ShoppingBag
          }];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 mt-4 border-t border-border/40", children: [
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mb-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest", children: "Current Fest" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/organizer/events/$eventId", params: {
              eventId
            }, search: {
              tab: "analytics"
            }, onClick: () => setMobileOpen(false), className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200", collapsed && "justify-center px-2", isConsoleActive && activeTab === "analytics" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: cn("h-[18px] w-[18px] shrink-0", isConsoleActive && activeTab === "analytics" && "text-primary") }),
              !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Event Console" })
            ] }),
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 space-y-1 ml-4 pl-4 border-l border-border/40", children: eventSubLinks.map((sub) => {
              const isSubActive = isConsoleActive && activeTab === sub.tab;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/organizer/events/$eventId", params: {
                eventId
              }, search: {
                tab: sub.tab
              }, className: cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200", isSubActive ? "text-primary bg-primary/5 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/20"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(sub.icon, { className: cn("h-3.5 w-3.5", isSubActive && "text-primary") }),
                sub.label
              ] }, sub.tab);
            }) })
          ] });
        }
        return null;
      })()
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("px-3 pb-2", collapsed && "px-2"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/organizer/settings", onClick: () => setMobileOpen(false), className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200", collapsed && "justify-center px-2", matchRoute({
      to: "/organizer/settings",
      fuzzy: false
    }) ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: cn("h-[18px] w-[18px] shrink-0", matchRoute({
        to: "/organizer/settings",
        fuzzy: false
      }) && "text-primary") }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Settings" }),
      matchRoute({
        to: "/organizer/settings",
        fuzzy: false
      }) && !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("border-t border-border/50 p-4", collapsed && "p-3"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3", collapsed && "justify-center"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-muted text-xs font-bold", children: (user?.user_metadata?.full_name || user?.email || "U").substring(0, 1).toUpperCase() }) }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold truncate", children: user?.user_metadata?.full_name || user?.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "text-[10px] text-muted-foreground hover:text-destructive font-medium flex items-center gap-1 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
          " Sign out"
        ] })
      ] })
    ] }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: cn("hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed(!collapsed), className: "absolute -right-3 top-20 h-6 w-6 rounded-full border border-border/60 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors", children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3 w-3" }) })
    ] }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: () => setMobileOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "absolute inset-y-0 left-0 w-[280px] border-r border-border/50 bg-background shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(false), className: "absolute top-5 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: cn("flex-1 min-h-screen transition-all duration-300", collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3 lg:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(true), className: "h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-[10px] font-black shrink-0", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold truncate", children: "Organizer" }),
              isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium truncate", children: collegeName })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, { context: {
        user,
        membership
      } })
    ] })
  ] });
}
export {
  OrganizerLayout as component
};
