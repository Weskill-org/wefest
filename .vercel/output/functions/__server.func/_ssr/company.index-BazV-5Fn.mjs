import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button, t as cn } from "./router-C5_6oBDd.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as Provider, R as Root3, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { A as Avatar, a as AvatarFallback } from "./avatar-CftWrQC9.mjs";
import { i as Building2, L as Download, as as ScanLine, aW as UsersRound, O as Eye, Z as IndianRupee, aA as Shield, aF as Sparkles, aL as TrendingUp, aZ as Zap, q as ChartPie, au as Search, d as ArrowUpRight, a8 as MapPin, N as ExternalLink, aR as UserCheck, u as ChevronRight, k as CalendarDays } from "../_libs/lucide-react.mjs";
import { e as eachDayOfInterval, s as subDays, f as format, p as parseISO } from "../_libs/date-fns.mjs";
import { R as ResponsiveContainer, b as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip$1, B as Bar, d as PieChart, P as Pie, c as Cell } from "../_libs/recharts.mjs";
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
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const TooltipProvider = Provider;
const Tooltip = Root3;
const TooltipTrigger = Trigger;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = Content2.displayName;
const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#EC4899"];
function CompanyDashboard() {
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
    data: proposals,
    isLoading: loadingProposals
  } = useQuery({
    queryKey: ["my-proposals"],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sponsorship_proposals").select("*, event:event_id(*)").eq("company_user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const {
    data: visits,
    isLoading: loadingVisits
  } = useQuery({
    queryKey: ["my-booth-visits"],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sponsor_booth_visits").select(`
          *,
          student:student_user_id(
            full_name, 
            email
          ),
          event:event_id(title)
        `).eq("sponsor_user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
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
  const {
    data: recommendedEvents
  } = useQuery({
    queryKey: ["recommended-events"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("events").select("*").eq("status", "published").eq("is_featured", true).limit(3);
      return data;
    }
  });
  const downloadLeadsCSV = () => {
    if (!subscription || subscription.plan_type === "Free") {
      toast.error("Premium Feature", {
        description: "Lead export is available on Growth and Enterprise plans.",
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/company/settings"
        }
      });
      return;
    }
    if (!visits || visits.length === 0) {
      toast.error("No lead data available to export.");
      return;
    }
    const headers = ["Student Name", "Email", "Event", "Visit Date"];
    const rows = visits.map((v) => [v.student?.full_name || "Anonymous", v.student?.email || "N/A", v.event?.title || "N/A", format(new Date(v.created_at), "yyyy-MM-dd HH:mm")]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wefest_leads_${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Lead data exported successfully!");
  };
  if (loadingProposals || loadingVisits) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground animate-pulse", children: "Syncing your dashboard..." })
    ] });
  }
  const activeProposals = proposals?.filter((p) => p.status === "accepted") || [];
  const pendingProposals = proposals?.filter((p) => p.status === "pending") || [];
  const totalReach = activeProposals.reduce((acc, p) => acc + (p.event?.attendees || 0), 0);
  const totalCommitted = activeProposals.reduce((acc, p) => acc + p.amount, 0);
  const interestData = [{
    name: "Tech",
    value: 400
  }, {
    name: "Music",
    value: 300
  }, {
    name: "Gaming",
    value: 300
  }, {
    name: "Fashion",
    value: 200
  }, {
    name: "Sports",
    value: 278
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 bg-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-primary uppercase tracking-[0.2em]", children: "Partner Dashboard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70", children: "Welcome back 👋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm max-w-lg leading-relaxed", children: "Your command center for campus partnerships. Monitor your ROI, manage leads, and discover your next big opportunity." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "lg", onClick: downloadLeadsCSV, className: "rounded-xl border-white/10 hover:bg-white/5 transition-all group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2 group-hover:-translate-y-0.5 transition-transform" }),
          "Export Leads"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-brand-gradient text-white rounded-xl shadow-glow hover:shadow-glow-lg transition-all group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/company/scan", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4 mr-2 group-hover:scale-110 transition-transform" }),
          "Open Scanner"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: Building2, label: "Active Fests", value: activeProposals.length.toString(), color: "text-blue-400", trend: "+12%", description: "Live partnerships" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: UsersRound, label: "Total Reach", value: totalReach > 1e3 ? `${(totalReach / 1e3).toFixed(1)}k` : totalReach.toString(), color: "text-emerald-400", trend: "+5.4k", description: "Potential impressions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: Eye, label: "Booth Scans", value: (visits?.length || 0).toString(), color: "text-purple-400", trend: "New", description: "Direct lead captures" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: IndianRupee, label: "Committed", value: `₹${(totalCommitted / 1e5).toFixed(1)}L`, color: "text-amber-400", trend: "Total", description: "Sponsorship volume" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8 space-y-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative group overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-brand-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col sm:flex-row sm:items-center justify-between p-8 gap-8 rounded-[28px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-6", subscription ? "bg-primary/20 text-primary shadow-primary/20" : "bg-amber-500/20 text-amber-500 shadow-amber-500/20"), children: subscription ? /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-8 w-8" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-xl tracking-tight", children: subscription?.plan_type || "Free Explorer" }),
                  subscription?.status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-none text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-widest", children: "Verified" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-md", children: subscription ? `Your Growth plan is active. You have full access to lead demographics and CRM exports.` : "Unlock powerful analytics, heatmaps, and priority event access with our Growth plan." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: subscription ? "outline" : "default", size: "lg", className: cn("shrink-0 rounded-2xl px-10 h-12 font-bold", !subscription && "bg-brand-gradient text-white border-none shadow-glow hover:shadow-glow-lg transition-all"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/company/settings", children: subscription ? "Manage Plan" : "Upgrade Now" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[32px] p-8 border-white/5 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Footfall" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-widest", children: "Last 7 Days" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] w-full", children: visits && visits.length > 0 ? (() => {
              const last7Days = eachDayOfInterval({
                start: subDays(/* @__PURE__ */ new Date(), 6),
                end: /* @__PURE__ */ new Date()
              }).map((d) => format(d, "MMM dd"));
              const scansByDate = visits.reduce((acc, v) => {
                const dateStr = format(parseISO(v.created_at), "MMM dd");
                acc[dateStr] = (acc[dateStr] || 0) + 1;
                return acc;
              }, {});
              const chartData = last7Days.map((date) => ({
                date,
                scans: scansByDate[date] || 0
              }));
              return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "barGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "hsl(var(--primary))", stopOpacity: 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "hsl(var(--primary))", stopOpacity: 0.2 })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.03)", vertical: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", hide: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { hide: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { contentStyle: {
                  backgroundColor: "rgba(10,10,10,0.9)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)"
                }, cursor: {
                  fill: "rgba(255,255,255,0.02)",
                  radius: 8
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "scans", fill: "url(#barGradient)", radius: [8, 8, 8, 8], barSize: 32 })
              ] }) });
            })() : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full items-center justify-center flex-col gap-2 text-muted-foreground opacity-30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-10 w-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Waiting for data..." })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Avg. 124 scans/day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
                " +12%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[32px] p-8 border-white/5 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { className: "h-5 w-5 text-purple-400" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Interests" })
              ] }),
              !subscription && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[8px] tracking-widest h-5 bg-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2 w-2 mr-1" }),
                "PRO"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[200px] w-full relative", children: [
              !subscription && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[4px] rounded-2xl text-center p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-xs", children: "Unlock Demographics" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "See what your leads care about." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: interestData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: interestData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { contentStyle: {
                  backgroundColor: "#000",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "10px"
                } })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-y-2 pt-2", children: interestData.slice(0, 4).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full", style: {
                backgroundColor: COLORS[i]
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: item.name })
            ] }, item.name)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-blue-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: "Active Sponsorships" })
            ] }),
            activeProposals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-white/5 text-muted-foreground border-none text-[10px] px-3 py-1 uppercase tracking-widest", children: [
              activeProposals.length,
              " live"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: activeProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[32px] p-16 text-center border-dashed border-white/10 bg-white/[0.01]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-16 w-16 mx-auto text-muted-foreground/10 mb-6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-xl", children: "No active partnerships" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed", children: "Explore the marketplace to discover upcoming festivals and start your first sponsorship journey." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "mt-8 rounded-2xl border-white/10 h-12 px-8 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/company/marketplace", className: "flex items-center font-bold", children: [
              "Browse Marketplace ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })
            ] }) })
          ] }) : activeProposals.map((p) => {
            const event = p.event;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group glass rounded-[32px] p-6 flex flex-col md:flex-row md:items-center gap-8 transition-all hover:border-primary/30 hover:bg-white/[0.04] relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl shadow-2xl border border-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: event?.cover || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80", className: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-700", alt: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/90 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5", children: p.tier }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-xl group-hover:text-primary transition-colors tracking-tight", children: event?.title || "Event" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-primary/60" }),
                    " ",
                    event?.college_name
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-3.5 w-3.5 text-primary/60" }),
                    " ",
                    (event?.attendees || 0).toLocaleString(),
                    " Attendees"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 shrink-0 pr-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1", children: "Total Investment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black text-2xl tracking-tighter", children: [
                    "₹",
                    (p.amount / 1e5).toFixed(1),
                    "L"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group/btn border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-5 w-5 group-hover/btn:scale-110 transition-transform" }) })
              ] })
            ] }, p.id);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lg:col-span-4 space-y-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-5 w-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Recent Leads" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/company/scan", className: "flex items-center gap-1", children: [
              "Scanner ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-[32px] overflow-hidden border-white/5 bg-white/[0.01]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: visits && visits.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: visits.slice(0, 6).map((visit, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all rounded-2xl cursor-default", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-12 w-12 border-2 border-white/5 group-hover:border-primary/40 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/5 text-primary text-sm font-black uppercase", children: visit.student?.full_name?.substring(0, 2) || "??" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border border-white/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-2.5 w-2.5 text-amber-400" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm group-hover:text-primary transition-colors truncate max-w-[120px]", children: visit.student?.full_name || "Anonymous" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate max-w-[120px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5 opacity-50" }),
                  " ",
                  visit.event?.title || "Booth Visit"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter", children: format(new Date(visit.created_at), "h:mm a") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-primary mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity", children: "View Profile" })
            ] })
          ] }, visit.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-16 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 rotate-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-10 w-10 text-muted-foreground/20" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg leading-tight", children: "No leads yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 leading-relaxed", children: "Start scanning QR codes to build your lead database." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "mt-8 rounded-xl h-10 px-6 border-white/10", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/company/scan", className: "font-bold text-[11px] uppercase tracking-widest", children: "Get Started" }) })
          ] }) }) })
        ] }),
        pendingProposals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold px-2 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-amber-500 animate-pulse" }),
            "Under Review"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: pendingProposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[28px] p-6 transition-all hover:bg-white/[0.03] border-white/5 relative group overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-12 w-12" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-base mb-1", children: p.event?.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary", children: [
                  "₹",
                  (p.amount / 1e5).toFixed(1),
                  "L"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-1 rounded-full bg-white/10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-black uppercase tracking-widest", children: [
                  p.tier,
                  " Tier"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-white/5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full", children: "Pending Approval" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/40 font-mono", children: [
                  "ID: ",
                  p.id.substring(0, 6)
                ] })
              ] })
            ] })
          ] }, p.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Smart Matches" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, className: "text-[10px] font-black uppercase tracking-widest text-primary hover:bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/company/marketplace", children: "Marketplace" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: recommendedEvents?.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events/$eventId", params: {
            eventId: event.id
          }, className: "group flex items-center gap-5 glass rounded-[28px] p-4 transition-all hover:border-primary/40 hover:bg-white/[0.04] border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: event.cover, className: "h-full w-full object-cover group-hover:scale-125 transition-transform duration-700", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm truncate group-hover:text-primary transition-colors", children: event.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-3 w-3 opacity-50" }),
                " ",
                (event.attendees / 1e3).toFixed(1),
                "k Expected"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-primary" }) })
          ] }, event.id)) })
        ] })
      ] })
    ] })
  ] });
}
function KpiCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
  description
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group glass rounded-[32px] p-8 transition-all hover:border-primary/30 hover:bg-white/[0.04] hover:-translate-y-2 duration-500 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-24 w-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", color.replace("text", "bg").replace("400", "500/10"), "border border-white/5"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-6 w-6", color) }) }),
        trend && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-[10px] font-black px-3 py-1 rounded-full tracking-widest", trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"), children: trend })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-black tracking-tighter", children: value })
    ] }) }),
    description && /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipContent, { side: "bottom", className: "bg-popover/90 backdrop-blur-2xl border-white/10 text-xs py-3 px-4 rounded-xl shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold mb-1", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] leading-relaxed", children: description })
    ] })
  ] }) });
}
export {
  CompanyDashboard as component
};
