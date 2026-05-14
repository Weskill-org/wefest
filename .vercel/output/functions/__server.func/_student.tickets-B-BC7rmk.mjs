import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button, t as cn } from "./_ssr/router-C5_6oBDd.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent } from "./_ssr/dialog-CO1OYTv6.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./_ssr/tabs-BK_SLcQl.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { a3 as LoaderCircle, aL as TrendingUp, aG as Star, Y as Image, f as Bell, C as Calendar, N as ExternalLink, am as QrCode, aJ as Ticket, e as Award, aD as ShieldCheck, L as Download, aF as Sparkles, g as BellOff, aZ as Zap, aN as Trophy, a9 as Medal } from "./_libs/lucide-react.mjs";
import { f as format } from "./_libs/date-fns.mjs";
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
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
function CertificateTemplate({ studentName, eventName, date, certificateId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "certificate-container p-12 bg-white text-slate-900 font-serif border-[16px] border-double border-slate-200 relative overflow-hidden", id: "certificate-print-area", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full -ml-32 -mb-32 opacity-50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 border-4 border-slate-100 p-12 flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-white mx-auto shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-8 w-8" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold uppercase tracking-[0.2em] text-slate-800 mb-2", children: "Certificate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-medium text-slate-500 mb-12", children: "OF PARTICIPATION" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg italic text-slate-500 mb-2", children: "This is to certify that" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-5xl font-black text-slate-900 mb-8 font-display", children: studentName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg text-slate-600 max-w-lg mb-12", children: [
        "has successfully participated in the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800", children: eventName }),
        "organized by WeFest on ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800", children: date }),
        ". Your contribution to the vibrant festival ecosystem is highly valued."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full mt-12 pt-12 border-t border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-emerald-600 font-bold text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
            " VERIFIED BY WEFEST"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-400 font-mono", children: [
            "ID: ",
            certificateId
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-800 underline decoration-slate-300 underline-offset-8", children: "Antigravity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Lead AI, WeFest" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 text-slate-200" }) })
  ] });
}
function Tickets() {
  const queryClient = useQueryClient();
  const {
    data: tickets,
    isLoading,
    error
  } = useQuery({
    queryKey: ["my-tickets-full"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to view tickets");
      const {
        data: ticketsData,
        error: ticketsError
      } = await supabase.from("tickets").select(`
          *,
          events (*)
        `).eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (ticketsError) throw ticketsError;
      const {
        data: visits
      } = await supabase.from("sponsor_booth_visits").select("*").eq("student_user_id", user.id);
      const {
        data: memories
      } = await supabase.from("digital_memories").select("*").eq("user_id", user.id);
      const {
        data: notificationLogs
      } = await supabase.from("notification_logs").select("*").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      return {
        tickets: ticketsData,
        visits: visits || [],
        memories: memories || [],
        notifications: notificationLogs || []
      };
    }
  });
  const {
    data: currentUser
  } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      return user;
    }
  });
  const mintMutation = useMutation({
    mutationFn: async (eventId) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      const serialNumber = Math.floor(Math.random() * 1e3) + 1;
      const {
        error: error2
      } = await supabase.from("digital_memories").insert({
        user_id: user.id,
        event_id: eventId,
        metadata: {
          rarity: serialNumber < 10 ? "Legendary" : serialNumber < 100 ? "Epic" : "Common",
          edition: "Genesis",
          serial: `#${serialNumber}`,
          verified_by: "WeFest Blockchain Registry"
        }
      });
      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-tickets-full"]
      });
      toast.success("Memory Minted!", {
        description: "Your digital souvenir is now live."
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to mint memory.");
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Loading your tickets…" })
    ] });
  }
  const myTickets = tickets?.tickets || [];
  const myVisits = tickets?.visits || [];
  const myMemories = tickets?.memories || [];
  const festPoints = myTickets.length * 100 + myVisits.length * 50 + myMemories.length * 200;
  const currentLevel = Math.floor(festPoints / 300) + 1;
  const progressToNext = festPoints % 300 / 300 * 100;
  const badges = [];
  if (myTickets.length >= 1) badges.push({
    name: "Early Bird",
    icon: Zap,
    color: "text-amber-400"
  });
  if (myTickets.length >= 3) badges.push({
    name: "Fest Hopper",
    icon: Trophy,
    color: "text-emerald-400"
  });
  if (myVisits.length >= 1) badges.push({
    name: "Social Butterfly",
    icon: Star,
    color: "text-blue-400"
  });
  if (myMemories.length >= 1) badges.push({
    name: "Collector",
    icon: Sparkles,
    color: "text-primary"
  });
  if (festPoints > 1e3) badges.push({
    name: "Campus Legend",
    icon: Medal,
    color: "text-purple-400"
  });
  const studentName = currentUser?.user_metadata?.full_name || "Student";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 sm:px-8 py-8 max-w-[900px] mx-auto space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: "My Wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Tickets, certificates, and digital memories." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", children: [
            "Lv. ",
            currentLevel
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-1.5 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-brand-gradient rounded-full transition-all duration-1000", style: {
            width: `${progressToNext}%`
          } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary", children: [
            festPoints,
            " pts"
          ] })
        ] })
      ] })
    ] }),
    badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: badges.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[10px] font-bold transition-transform hover:scale-105 cursor-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(b.icon, { className: `h-3 w-3 ${b.color}` }),
      " ",
      b.name
    ] }, b.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "tickets", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-white/[0.03] p-1 rounded-xl h-10 border border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "tickets", className: "rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm", children: "Tickets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "certificates", className: "rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm", children: "Certificates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "memories", className: "rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3" }),
          " Memories"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "notifications", className: "rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3 w-3" }),
          " Alerts"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tickets", className: "mt-6 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: myTickets.length > 0 ? myTickets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-5 md:pr-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20", children: t.tier }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest", children: [
              "#",
              t.id.slice(0, 8).toUpperCase()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg leading-tight group-hover:text-primary transition-colors", children: t.events?.title || "Unknown Event" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
            " ",
            t.events?.date ? format(new Date(t.events.date), "EEE, MMM dd, yyyy") : "No date"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore/$eventId", params: {
            eventId: t.event_id
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary px-3 h-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "mr-1.5 h-3 w-3" }),
            " View Event"
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-5 md:pl-8 flex flex-col items-center justify-center bg-white/[0.01] border-t md:border-t-0 md:border-l border-dashed border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background hidden md:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-28 w-28 place-items-center rounded-2xl bg-white text-black p-2.5 shadow-inner group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-full w-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "mt-3 rounded-lg bg-white/5 px-3 py-1 text-xs font-bold tracking-widest text-foreground border border-white/10 text-center", children: t.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground/50 mt-1.5 font-medium uppercase tracking-widest", children: "Scan at entry" })
        ] })
      ] }) }, t.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-6 w-6 text-muted-foreground/40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-1", children: "No tickets yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-[280px] mx-auto mb-5", children: "Browse upcoming festivals and secure your spot." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "bg-brand-gradient text-white rounded-lg font-semibold shadow-glow text-xs h-9 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", children: "Browse Fests" }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "certificates", className: "mt-6 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: myTickets.length > 0 ? myTickets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm group-hover:text-primary transition-colors", children: t.events?.title || "Unknown Event" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3 text-emerald-500" }),
              " Verified Participation"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "rounded-lg font-semibold text-xs h-8 border-white/10 bg-white/[0.02]", children: "Preview" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-4xl border-none bg-transparent p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CertificateTemplate, { studentName, eventName: t.events?.title || "Event Participant", date: t.events?.date ? format(new Date(t.events.date), "MMMM dd, yyyy") : "2026", certificateId: `CERT-${t.id.slice(0, 8).toUpperCase()}` }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-brand-gradient text-white rounded-lg font-semibold shadow-glow text-xs h-8 px-4", onClick: () => {
            toast.success("Certificate download started");
            window.print();
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3 mr-1.5" }),
            " Download"
          ] })
        ] })
      ] }) }, `cert-${t.id}`)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-6 w-6 text-muted-foreground/40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-1", children: "No certificates yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-[280px] mx-auto", children: "Attend events to unlock verified certificates." })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "memories", className: "mt-6 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: myTickets.map((t) => {
        const memoryRow = myMemories.find((m) => m.event_id === t.id);
        const memory = memoryRow ? {
          ...memoryRow,
          metadata: memoryRow.metadata || {}
        } : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-5 flex flex-col", children: memory ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border", memory.metadata.rarity === "Legendary" ? "bg-amber-400/10 border-amber-400/30 text-amber-500" : memory.metadata.rarity === "Epic" ? "bg-purple-400/10 border-purple-400/30 text-purple-500" : "bg-primary/10 border-primary/30 text-primary"), children: memory.metadata.rarity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground/60", children: memory.metadata.serial })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square rounded-xl bg-black/40 border border-white/10 overflow-hidden mb-4 flex items-center justify-center relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-10 w-10 text-white/15" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 right-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-white/50 uppercase tracking-widest truncate", children: t.events?.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold text-white/80 mt-0.5", children: "Genesis Edition" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: memory.metadata.edition }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3 text-emerald-500" }),
              " Verified"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center flex-1 text-center py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm mb-1", children: "Mint Memory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-4", children: t.events?.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "w-full rounded-lg bg-brand-gradient text-white font-semibold text-xs h-8 shadow-glow", onClick: () => mintMutation.mutate(t.id), disabled: mintMutation.isPending, children: mintMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Mint ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "ml-1 h-3 w-3" })
          ] }) })
        ] }) }, `memory-${t.id}`);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "notifications", className: "mt-6 animate-in fade-in duration-300 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground", children: "Recent Alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground h-7 px-2", children: "Mark all read" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: tickets?.notifications && tickets.notifications.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/5", children: tickets.notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex gap-3 px-5 py-4", !n.is_read && "bg-primary/5"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", !n.is_read ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold leading-tight", children: n.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground line-clamp-1 mt-0.5", children: n.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground/50 mt-1 font-medium", children: format(new Date(n.created_at), "MMM dd, hh:mm a") })
          ] })
        ] }, n.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "mx-auto h-6 w-6 text-muted-foreground/15 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/50 font-medium", children: "No notifications yet" })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  Tickets as component
};
