import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { f as Route$K, x as supabase, a as Button, t as cn } from "./router-C5_6oBDd.mjs";
import { a as OrganizerEventCard, O as OrganizerEmptyState, S as Skeleton } from "./skeleton-ePafwk9m.mjs";
import "../_libs/sonner.mjs";
import { Z as IndianRupee, aJ as Ticket, aV as Users, aL as TrendingUp, m as CalendarPlus, as as ScanLine, Q as FileText, c as ArrowRight, a3 as LoaderCircle, H as Clock, at as School, ap as RefreshCw, D as CirclePlus } from "../_libs/lucide-react.mjs";
import { a as formatDistanceToNow } from "../_libs/date-fns.mjs";
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
import "./badge-KECkP8lB.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const iconMap = {
  ticket_purchased: { icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
  event_created: { icon: CirclePlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  event_status_updated: { icon: RefreshCw, color: "text-amber-500", bg: "bg-amber-500/10" },
  college_approved: { icon: School, color: "text-purple-500", bg: "bg-purple-500/10" },
  default: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted/10" }
};
function RecentActivity() {
  const queryClient = useQueryClient();
  const [realtimeActivities, setRealtimeActivities] = reactExports.useState([]);
  const { data: initialActivities, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recent_activity").select("*").order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data || [];
    }
  });
  reactExports.useEffect(() => {
    const channel = supabase.channel("public:recent_activity").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "recent_activity" },
      (payload) => {
        const newActivity = payload.new;
        setRealtimeActivities((prev) => [newActivity, ...prev].slice(0, 10));
        queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  const displayActivities = realtimeActivities.length > 0 ? [...realtimeActivities, ...(initialActivities || []).filter((a) => !realtimeActivities.find((ra) => ra.id === a.id))].slice(0, 10) : initialActivities || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-border/50 bg-muted/20 p-8 transition-all duration-500 ease-in-out", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold tracking-tight", children: "Recent Activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-[10px] font-black text-primary uppercase tracking-[0.2em] gap-2 bg-primary/10 px-3 py-1 rounded-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" }),
        "Live"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 gap-4 opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-widest", children: "Loading Feed..." })
    ] }) : displayActivities.length > 0 ? displayActivities.map((item) => {
      const config = iconMap[item.type] || iconMap.default;
      const Icon = config.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative flex items-start gap-4 transition-all hover:translate-x-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
          config.bg,
          config.color
        ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-0.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground truncate", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground whitespace-nowrap", children: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: item.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-4 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all group-hover:opacity-100" })
      ] }, item.id);
    }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-10 w-10 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-widest max-w-[150px] leading-relaxed", children: "No activity yet. Your feed will update as you manage events." })
    ] }) }),
    displayActivities.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-8 w-full rounded-2xl border border-border/50 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:bg-muted hover:text-primary hover:border-primary/20", children: "View All Logs" })
  ] });
}
function OrganizerDashboard() {
  const ctx = Route$K.useRouteContext();
  const membership = ctx.membership;
  const {
    data: userData,
    isLoading: loadingUser
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      return user;
    }
  });
  const {
    data: myEvents,
    isLoading: loadingEvents
  } = useQuery({
    queryKey: ["my-college-events", userData?.id, membership?.college_id],
    enabled: !!userData?.id,
    queryFn: async () => {
      let query = supabase.from("events").select("*").order("created_at", {
        ascending: false
      });
      if (membership?.college_id) {
        query = query.or(`organizer_user_id.eq.${userData.id},college_id.eq.${membership.college_id}`);
      } else {
        query = query.eq("organizer_user_id", userData.id);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data;
    }
  });
  const {
    data: proposals
  } = useQuery({
    queryKey: ["event-proposals", myEvents?.map((e) => e.id)],
    enabled: !!myEvents && myEvents.length > 0,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sponsorship_proposals").select("*").in("event_id", myEvents.map((e) => e.id));
      if (error) throw error;
      return data;
    }
  });
  if (loadingUser || loadingEvents) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(OrganizerSkeleton, {});
  }
  const totalAttendees = myEvents?.reduce((acc, e) => acc + (e.attendees || 0), 0) || 0;
  const totalRevenue = myEvents?.reduce((acc, e) => acc + (e.attendees || 0) * (e.price_from || 0) * 0.15, 0) || 0;
  const sponsorPipeline = proposals?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
  const totalTickets = Math.floor(totalAttendees * 0.15);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 lg:px-10 lg:py-10 max-w-[1400px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight lg:text-3xl", children: "Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Monitor performance across all your college festivals." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: IndianRupee, label: "Revenue (est.)", value: `₹${(totalRevenue / 1e5).toFixed(2)}L`, color: "text-emerald-500", bg: "bg-emerald-500/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Ticket, label: "Tickets Sold", value: totalTickets.toLocaleString(), color: "text-blue-500", bg: "bg-blue-500/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Attendees", value: totalAttendees.toLocaleString(), color: "text-purple-500", bg: "bg-purple-500/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: TrendingUp, label: "Sponsor Pipeline", value: `₹${(sponsorPipeline / 1e5).toFixed(2)}L`, color: "text-amber-500", bg: "bg-amber-500/10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionBtn, { to: "/organizer/new", icon: CalendarPlus, label: "Create Event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionBtn, { to: "/organizer/scan", icon: ScanLine, label: "Scan Tickets" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionBtn, { to: "/organizer/events", icon: FileText, label: "All Events" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionBtn, { to: "/organizer/team", icon: Users, label: "Team" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 xl:grid-cols-[1fr_380px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold tracking-tight", children: "Recent Events" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-primary font-bold text-xs", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/organizer/events", children: [
            "View All ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: myEvents && myEvents.length > 0 ? myEvents.slice(0, 4).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrganizerEventCard, { id: e.id, title: e.title, date: e.date, city: e.city, cover: e.cover, status: e.status || "Published", ticketsSold: Math.floor((e.attendees || 0) * 0.15), revenue: (e.attendees || 0) * (e.price_from || 0) * 0.15 }, e.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(OrganizerEmptyState, {}) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecentActivity, {}) })
    ] })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-muted/10 p-5 transition-all hover:bg-muted/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-9 w-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black tracking-tight", children: value })
  ] });
}
function QuickActionBtn({
  to,
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, className: "rounded-xl border-border/50 bg-muted/10 hover:bg-muted/30 gap-2 h-9 px-4 text-xs font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" }),
    label
  ] }) });
}
function OrganizerSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 lg:px-10 lg:py-10 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-2xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 xl:grid-cols-[1fr_380px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-80 rounded-2xl" })
    ] })
  ] });
}
export {
  OrganizerDashboard as component
};
