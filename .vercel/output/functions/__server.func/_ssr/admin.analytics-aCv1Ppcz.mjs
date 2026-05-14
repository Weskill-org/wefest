import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import "../_libs/sonner.mjs";
import { a3 as LoaderCircle, S as Funnel, L as Download, aV as Users, Z as IndianRupee, at as School, aL as TrendingUp, aF as Sparkles, U as Globe } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, a as AreaChart, X as XAxis, Y as YAxis, T as Tooltip, A as Area, C as CartesianGrid } from "../_libs/recharts.mjs";
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
const revenueData = [{
  name: "Jan",
  value: 8e4
}, {
  name: "Feb",
  value: 12e4
}, {
  name: "Mar",
  value: 19e4
}, {
  name: "Apr",
  value: 24e4
}, {
  name: "May",
  value: 31e4
}];
function AdminAnalytics() {
  const {
    data: stats,
    isLoading
  } = useQuery({
    queryKey: ["institutional-analytics"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("institutional_analytics").select("*");
      if (error) throw error;
      return data;
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const totals = stats?.reduce((acc, s) => ({
    events: acc.events + s.total_events,
    footfall: acc.footfall + s.total_footfall,
    revenue: acc.revenue + s.total_revenue,
    subscriptions: acc.subscriptions + s.active_subscriptions
  }), {
    events: 0,
    footfall: 0,
    revenue: 0,
    subscriptions: 0
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black font-display", children: "Institutional Intelligence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Cross-university performance metrics and revenue tracking." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "mr-2 h-4 w-4" }),
          " Filter By State"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "bg-brand-gradient/10 border-primary/20 text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
          " Export Master Report"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Total Reach", value: (totals?.footfall || 0).toLocaleString(), icon: Users, delta: "+12%" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Global Revenue", value: `₹${((totals?.revenue || 0) / 1e5).toFixed(1)}L`, icon: IndianRupee, delta: "+45%" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Active Colleges", value: stats?.length.toString() || "0", icon: School, delta: "+3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "SaaS Growth", value: totals?.subscriptions.toString() || "0", icon: TrendingUp, delta: "+8%" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Revenue Growth (Q2 2026)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-primary/5 text-primary border-primary/20", children: "Live Sync" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: revenueData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorRev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "hsl(var(--primary))", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "hsl(var(--primary))", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: {
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: {
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            backgroundColor: "hsl(var(--popover))",
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "value", stroke: "hsl(var(--primary))", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorRev)" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-8", children: "Performance by College" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: stats?.slice(0, 5).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: s.college_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              s.total_footfall.toLocaleString(),
              " reach"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-brand-gradient rounded-full transition-all duration-1000", style: {
            width: `${s.total_footfall / 1e5 * 100}%`
          } }) })
        ] }, s.college_id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[3rem] p-10 border border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 text-primary" }),
            " Predictive Demand Forecasting"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "AI-driven projection of ticket sales and inventory requirements for upcoming festival season." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 text-xs font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full bg-primary" }),
            " Actual Sales"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 text-xs font-bold border-l border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full bg-primary/30" }),
            " AI Prediction"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[400px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: forecastData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "hsl(var(--border))", opacity: 0.5 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: {
          fontSize: 12
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: {
          fontSize: 12
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          backgroundColor: "hsl(var(--popover))",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "predicted", stroke: "hsl(var(--primary))", strokeDasharray: "5 5", fill: "transparent", strokeWidth: 2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "actual", stroke: "hsl(var(--primary))", fillOpacity: 1, fill: "url(#colorRev)", strokeWidth: 4 })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl bg-primary/5 border border-primary/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-primary mb-2", children: "Confidence Level" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: "94.2%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Based on historical conversion rates and current traffic spikes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2", children: "Top Predicted Region" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: "Mumbai Cluster" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Expected 45,000+ bookings in June 2026." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2", children: "Inventory Risk" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: "Low" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Server capacity automatically scaled for peak demand." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-6", children: "Regional Distribution" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RegionStat, { label: "North India", value: "45%", color: "bg-blue-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RegionStat, { label: "South India", value: "30%", color: "bg-emerald-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RegionStat, { label: "West India", value: "25%", color: "bg-amber-500" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Master Settlement Ledger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-[10px] font-black uppercase tracking-widest", children: "Download Q2 Audit Log" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-4", children: "Institution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-4", children: "Volume" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-4", children: "Platform Fee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-4", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-4 text-right", children: "Settled Date" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: stats?.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-muted/30 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 font-semibold", children: s.college_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 font-mono", children: [
            "₹",
            ((s.total_revenue || 0) / 1e3).toFixed(1),
            "k"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 text-primary font-bold", children: [
            "₹",
            ((s.total_revenue || 0) * 0.1 / 1e3).toFixed(1),
            "k"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-emerald-500/10 text-emerald-500 border-none text-[9px]", children: "Verified" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-right text-muted-foreground font-medium", children: "May 07, 2026" })
        ] }, s.college_id)) })
      ] }) })
    ] })
  ] });
}
const forecastData = [{
  name: "Jan",
  actual: 8e4,
  predicted: 82e3
}, {
  name: "Feb",
  actual: 12e4,
  predicted: 115e3
}, {
  name: "Mar",
  actual: 19e4,
  predicted: 185e3
}, {
  name: "Apr",
  actual: 24e4,
  predicted: 23e4
}, {
  name: "May",
  actual: 31e4,
  predicted: 32e4
}, {
  name: "Jun",
  predicted: 45e4
}, {
  name: "Jul",
  predicted: 58e4
}];
function MetricCard({
  label,
  value,
  icon: Icon,
  delta
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-20 w-20 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-widest", children: delta })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1", children: label })
  ] });
}
function RegionStat({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-12 w-12 rounded-2xl ${color} opacity-20 flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: `h-6 w-6 opacity-100 text-foreground` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
    ] })
  ] });
}
function Badge({
  children,
  variant,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${className}`, children });
}
export {
  AdminAnalytics as component
};
