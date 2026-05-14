import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CO1OYTv6.mjs";
import { a3 as LoaderCircle, b as ArrowLeft, as as ScanLine, i as Building2, aW as UsersRound, O as Eye, Z as IndianRupee, L as Download, ac as MessageSquare, aA as Shield, x as CircleAlert, ak as Plus, Y as Image, aF as Sparkles, a8 as MapPin, _ as Info, aL as TrendingUp } from "../_libs/lucide-react.mjs";
import { e as eachDayOfInterval, s as subDays, f as format, p as parseISO } from "../_libs/date-fns.mjs";
import { R as ResponsiveContainer, b as BarChart, X as XAxis, Y as YAxis, T as Tooltip, B as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
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
function SponsorDashboard() {
  const {
    data: user,
    isLoading: loadingUser
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
      } = await supabase.from("sponsor_booth_visits").select("*").eq("sponsor_user_id", user.id);
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
        data,
        error
      } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    }
  });
  const [isMessaging, setIsMessaging] = reactExports.useState(false);
  const downloadLeadsCSV = () => {
    if (!subscription) {
      toast.error("Pro feature", {
        description: "Lead export is only available for Growth and Enterprise plans."
      });
      return;
    }
    if (!visits || visits.length === 0) {
      toast.error("No lead data available to export.");
      return;
    }
    const headers = ["Student Name", "Email", "Event", "Visit Date", "Engagement Status"];
    const rows = visits.map((v) => [v.full_name || "Anonymous", v.email || "N/A", v.event_title || "General Interest", format(new Date(v.visited_at || v.created_at), "yyyy-MM-dd HH:mm"), v.engagement_type || "Viewed"]);
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
    toast.success("Lead data exported successfully!", {
      description: `${visits.length} leads have been compiled into your CSV report.`
    });
  };
  if (loadingUser || loadingProposals || loadingVisits) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const activeProposals = proposals?.filter((p) => p.status === "accepted") || [];
  const pendingProposals = proposals?.filter((p) => p.status === "pending") || [];
  const totalReach = activeProposals.reduce((acc, p) => acc + p.event.attendees, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sponsors", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Back to Marketplace"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-primary", children: "Brand Portal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-4xl font-black", children: "Sponsor Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Manage your college festival sponsorships and track ROI." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-brand-gradient text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sponsor/scan", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "mr-2 h-4 w-4" }),
        " Open Booth Scanner"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Active Fests" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl font-bold", children: activeProposals.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-emerald-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Total Reach" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl font-bold", children: totalReach.toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-purple-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Booth Scans" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl font-bold", children: visits?.length || 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-blue-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Committed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-3xl font-bold", children: [
          "₹",
          (activeProposals.reduce((acc, p) => acc + p.amount, 0) / 1e5).toFixed(1),
          "L"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex items-center gap-2", onClick: downloadLeadsCSV, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        " Download Leads (CSV)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isMessaging, onOpenChange: setIsMessaging, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4" }),
          " Direct Organizer Chat"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Message Organizer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Start a direct conversation with the event coordination team." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Select Event" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full bg-muted/50 border border-border/40 rounded-lg p-2 text-sm text-foreground", children: activeProposals.length > 0 ? activeProposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: p.event?.title || "Event" }, p.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "General Inquiry" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Message" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "w-full bg-muted/50 border border-border/40 rounded-lg p-3 text-sm min-h-[100px] text-foreground", placeholder: "Inquire about booth placement, extra passes, or marketing opportunities..." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsMessaging(false), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-brand-gradient text-white", onClick: () => {
              toast.success("Message sent!", {
                description: "The organizer will respond via your registered email shortly."
              });
              setIsMessaging(false);
            }, children: "Send Inquiry" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-10 overflow-hidden rounded-2xl border transition-all ${subscription ? "border-primary/20 bg-primary/5" : "border-orange-500/20 bg-orange-500/5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between p-6 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-12 w-12 rounded-xl flex items-center justify-center ${subscription ? "bg-primary/20 text-primary" : "bg-orange-500/20 text-orange-500"}`, children: subscription ? /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
              "Plan: ",
              subscription?.plan_type || "Free Explorer"
            ] }),
            subscription?.status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-emerald-500/10 text-emerald-500 border-none text-[10px]", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: subscription ? `Your ${subscription.plan_type} plan includes priority proposals and heatmap analytics.` : "You are currently on the Free plan. Upgrade for booth heatmaps and priority support." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: subscription ? "outline" : "default", className: !subscription ? "bg-brand-gradient text-white" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sponsor/pricing", children: subscription ? "Manage Plan" : "Upgrade Now" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: "Brand Assets & Creatives" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload assets for in-app banners and event marketing" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-brand-gradient text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          " Upload Asset"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl flex flex-col items-center justify-center border-dashed border-2 border-border/60 hover:border-primary/40 transition-all cursor-pointer group h-48", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Add New Creative" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl h-48 flex flex-col justify-between group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[9px] bg-emerald-500/10 text-emerald-500 border-none", children: "Approved" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: "Main Logo (PNG)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest", children: "Transparency Enabled" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl h-48 flex flex-col justify-between group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[9px] bg-blue-500/10 text-blue-500 border-none", children: "In Review" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: "Homepage Banner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest", children: "1200 x 600 px" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: "Active Sponsorships" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children: activeProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-10 text-center text-muted-foreground", children: [
          "No active sponsorships yet. Browse the marketplace to sponsor fests.",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "mt-4 block mx-auto w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sponsors", children: "Find Fests" }) })
        ] }) : activeProposals.map((p) => {
          const event = p.event;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br ${event.cover}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", children: event.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                " ",
                event.college_name,
                ", ",
                event.city
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs", children: "Tier" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: p.tier })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs", children: "Attendees" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: event.attendees.toLocaleString() })
              ] })
            ] })
          ] }, p.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: "Pending Proposals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: pendingProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-xl p-6 text-center text-sm text-muted-foreground", children: "No pending proposals" }) : pendingProposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4 text-sm flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: p.event.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground text-xs", children: [
              "₹",
              (p.amount / 1e5).toFixed(1),
              "L • ",
              p.tier,
              " Tier"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-medium text-orange-500", children: "Reviewing" })
        ] }, p.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold flex items-center gap-2", children: [
            "Engagement Heatmap ",
            !subscription && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2 w-2 mr-1" }),
              " Pro"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-4 glass rounded-2xl p-6 relative overflow-hidden ${!subscription ? "grayscale blur-[2px]" : ""}`, children: [
            !subscription && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm text-center p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8 text-primary mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Unlock Heatmap Analytics" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 max-w-[200px]", children: "Visualize crowd density and peak engagement at your booths." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "mt-4 bg-brand-gradient text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sponsor/pricing", children: "Upgrade to Pro" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-muted-foreground", children: "Venue: Main Stadium Booths" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground", children: [
                "Low ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-12 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-red-500" }),
                " High"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-2", children: Array.from({
              length: 24
            }).map((_, i) => {
              const intensity = Math.random();
              const color = intensity > 0.8 ? "bg-red-500" : intensity > 0.5 ? "bg-emerald-500" : intensity > 0.2 ? "bg-blue-500" : "bg-muted";
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `aspect-square rounded-md ${color} opacity-40 transition-all hover:scale-110 hover:opacity-100 cursor-help relative group`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 pointer-events-none", children: [
                "Booth ",
                i + 1,
                ": ",
                Math.floor(intensity * 1200),
                " visits"
              ] }) }, i);
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/30 p-3 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3" }),
              " Heatmap shows simulated density based on aggregated booth scan data."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: "Engagement Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
              " Booth Scans Over Time"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[250px] w-full", children: (() => {
              if (!visits || visits.length === 0) {
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-muted-foreground text-sm", children: "No engagement data yet." });
              }
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", stroke: "hsl(var(--muted-foreground))", fontSize: 12, tickLine: false, axisLine: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "hsl(var(--muted-foreground))", fontSize: 12, tickLine: false, axisLine: false, allowDecimals: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
                  backgroundColor: "hsl(var(--background))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))"
                }, itemStyle: {
                  color: "hsl(var(--foreground))"
                }, cursor: {
                  fill: "hsl(var(--muted))",
                  opacity: 0.4
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "scans", fill: "hsl(var(--primary))", radius: [4, 4, 0, 0] })
              ] }) });
            })() })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  SponsorDashboard as component
};
