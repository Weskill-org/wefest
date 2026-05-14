import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as Route$5, x as supabase, a as Button, t as cn } from "./_ssr/router-C5_6oBDd.mjs";
import { I as Input } from "./_ssr/input-DfdhTZrH.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { a3 as LoaderCircle, aD as ShieldCheck, n as CalendarRange, aJ as Ticket, y as CircleCheck, aG as Star, C as Calendar, c as ArrowRight, aF as Sparkles, H as Clock, F as CircleX, u as ChevronRight, am as QrCode, aX as Wallet, aZ as Zap, f as Bell, g as BellOff, aL as TrendingUp } from "./_libs/lucide-react.mjs";
import { i as isFuture, b as isPast, d as differenceInDays, f as format } from "./_libs/date-fns.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
function StudentDashboard() {
  const {
    profile
  } = Route$5.useRouteContext();
  useQueryClient();
  const {
    data: currentUser
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
    data: tickets,
    isLoading
  } = useQuery({
    queryKey: ["dashboard-tickets", profile?.college_id],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login");
      const {
        data: ticketsData,
        error
      } = await supabase.from("tickets").select(`*, events (*)`).eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      let visits = [];
      try {
        const {
          data
        } = await supabase.from("sponsor_booth_visits").select("*").eq("student_user_id", user.id);
        visits = data || [];
      } catch (_) {
      }
      let notifications = [];
      try {
        const {
          data
        } = await supabase.from("notification_logs").select("*").eq("user_id", user.id).order("created_at", {
          ascending: false
        }).limit(10);
        notifications = data || [];
      } catch (_) {
      }
      let campusActivity = [];
      if (profile?.college_id) {
        try {
          const {
            data: activityData
          } = await supabase.from("recent_activity").select(`
              *,
              events!inner (
                college_id
              )
            `).eq("events.college_id", profile.college_id).order("created_at", {
            ascending: false
          }).limit(10);
          if (activityData) {
            campusActivity = activityData.map((a) => ({
              id: a.id,
              title: a.title,
              body: a.description,
              created_at: a.created_at,
              type: a.type,
              is_read: true,
              is_campus: true
            }));
          }
        } catch (_) {
        }
      }
      const combinedFeed = [...notifications.map((n) => ({
        ...n,
        is_campus: false
      })), ...campusActivity].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
      return {
        tickets: ticketsData || [],
        visits: visits || [],
        notifications: combinedFeed
      };
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Loading dashboard…" })
    ] });
  }
  const myTickets = tickets?.tickets || [];
  const myVisits = tickets?.visits || [];
  const myNotifications = tickets?.notifications || [];
  const festPoints = myTickets.length * 100 + myVisits.length * 50;
  const currentLevel = Math.floor(festPoints / 300) + 1;
  const xpInLevel = festPoints % 300;
  const xpPercent = xpInLevel / 300 * 100;
  const upcoming = myTickets.filter((t) => t.events?.date && isFuture(new Date(t.events.date)));
  const past = myTickets.filter((t) => t.events?.date && isPast(new Date(t.events.date)));
  const attended = myTickets.filter((t) => t.scanned_at);
  const studentName = currentUser?.user_metadata?.full_name || "Student";
  const greeting = getGreeting();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 sm:px-8 py-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium mb-1", children: greeting }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: studentName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LevelPill, { level: currentLevel, xp: xpInLevel, percent: xpPercent }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-emerald-500 uppercase tracking-wider", children: "Verified" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CalendarRange, label: "Upcoming", value: upcoming.length, accent: "blue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Ticket, label: "Total Passes", value: myTickets.length, accent: "purple" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheck, label: "Attended", value: attended.length, accent: "emerald" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Star, label: "Points", value: festPoints, accent: "amber" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        upcoming.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSection, { title: "Active Passes", action: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/tickets", className: "text-xs font-semibold text-primary hover:underline flex items-center gap-1", children: [
          "View all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
        ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: upcoming.slice(0, 4).map((t) => {
          const days = differenceInDays(new Date(t.events?.date), /* @__PURE__ */ new Date());
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore/$eventId", params: {
            eventId: t.event_id
          }, className: "group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all duration-200 hover:border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md", children: [
                t.tier,
                " pass"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold leading-none", children: days }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] font-bold text-muted-foreground uppercase tracking-widest", children: "days" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm leading-tight line-clamp-1 mb-1.5 group-hover:text-primary transition-colors", children: t.events?.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
              format(new Date(t.events?.date), "EEE, MMM dd")
            ] })
          ] }) }, t.id);
        }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSection, { title: "Active Passes", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-dashed border-white/10 py-12 px-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-muted-foreground/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-1", children: "No upcoming festivals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-5 max-w-[240px] mx-auto", children: "Discover amazing college fests and book your first pass." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "bg-brand-gradient text-white rounded-lg font-semibold shadow-lg text-xs h-9 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/explore", children: [
            "Browse Fests ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })
          ] }) })
        ] }) }),
        past.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSection, { title: "Past Events", muted: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: past.slice(0, 4).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore/$eventId", params: {
          eventId: t.event_id
        }, className: "group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium truncate group-hover:text-foreground transition-colors", children: t.events?.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: format(new Date(t.events?.date), "MMM dd, yyyy") })
          ] }),
          t.scanned_at ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            " Attended"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-bold text-muted-foreground/40 uppercase tracking-wider flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
            " Missed"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/60 transition-colors shrink-0" })
        ] }) }, t.id)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-brand-gradient p-5 text-white relative overflow-hidden group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-24 w-24" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Digital Wallet" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/70 mb-4 leading-relaxed", children: "QR passes & certificates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "secondary", size: "sm", className: "w-full font-semibold bg-white/15 hover:bg-white/25 text-white border-0 text-xs h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tickets", children: "Open Wallet" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSection, { title: "Quick Scan", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-amber-500" }), subtitle: "Earn +50 pts per booth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuickScan, { userId: currentUser?.id }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col max-h-[380px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-white/5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground", children: "Activity" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto hide-scrollbar flex-1", children: myNotifications.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/5", children: myNotifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("px-4 py-3", !n.is_read && "bg-primary/5"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5", !n.is_read ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold leading-tight", children: n.title }),
                n.is_campus && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20", children: "Campus" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground line-clamp-1 mt-0.5", children: n.body }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground/50 mt-1 font-medium", children: format(new Date(n.created_at), "MMM dd, hh:mm a") })
            ] })
          ] }) }, n.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-10 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "mx-auto h-6 w-6 text-muted-foreground/15 mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/50 font-medium", children: "No notifications yet" })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
function DashboardSection({
  title,
  action,
  icon,
  subtitle,
  muted,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-white/5 bg-white/[0.02] p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: cn("text-sm font-semibold", muted && "text-muted-foreground"), children: title })
        ] }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: subtitle })
      ] }),
      action
    ] }),
    children
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  accent
}) {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10",
    purple: "text-primary bg-primary/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10"
  };
  const c = colors[accent] || colors.blue;
  const [textColor, bgColor] = c.split(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3", bgColor, textColor), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold tracking-tight leading-none mb-0.5", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-medium", children: label })
  ] });
}
function LevelPill({
  level,
  xp,
  percent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", children: [
        "Lv. ",
        level
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-brand-gradient rounded-full transition-all duration-1000", style: {
        width: `${percent}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground font-medium whitespace-nowrap", children: [
        xp,
        "/300"
      ] })
    ] })
  ] });
}
function QuickScan({
  userId
}) {
  const [code, setCode] = reactExports.useState("");
  const queryClient = useQueryClient();
  const scanMutation = useMutation({
    mutationFn: async (boothCode) => {
      if (!userId) throw new Error("Please login");
      const {
        data: booth,
        error
      } = await supabase.from("sponsor_booths").select("id, sponsor_name").eq("code", boothCode.trim().toUpperCase()).maybeSingle();
      if (error) throw error;
      if (!booth) throw new Error("Booth not found");
      const {
        error: visitError
      } = await supabase.from("sponsor_booth_visits").insert({
        student_user_id: userId,
        booth_id: booth.id
      });
      if (visitError) {
        if (visitError.code === "23505") throw new Error("Already visited");
        throw visitError;
      }
      return booth;
    },
    onSuccess: (booth) => {
      toast.success(`+50 pts — ${booth.sponsor_name}`);
      setCode("");
      queryClient.invalidateQueries({
        queryKey: ["dashboard-tickets"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
    e.preventDefault();
    if (code.trim()) scanMutation.mutate(code);
  }, className: "flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), placeholder: "BOOTH CODE", disabled: scanMutation.isPending, className: "h-9 rounded-lg bg-white/5 border-white/10 font-mono text-xs text-center tracking-widest placeholder:tracking-normal placeholder:font-sans", maxLength: 8 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: scanMutation.isPending || !code.trim(), size: "sm", className: "bg-brand-gradient text-white rounded-lg font-semibold px-3 h-9 shrink-0 text-xs", children: scanMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : "Scan" })
  ] });
}
function getGreeting() {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}
export {
  StudentDashboard as component
};
