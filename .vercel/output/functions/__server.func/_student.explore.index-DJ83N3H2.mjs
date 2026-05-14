import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button, t as cn } from "./_ssr/router-C5_6oBDd.mjs";
import { E as EventCard } from "./_ssr/event-card-CQnXWFrQ.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { I as Input } from "./_ssr/input-DfdhTZrH.mjs";
import "./_libs/sonner.mjs";
import { aD as ShieldCheck, V as GraduationCap, a8 as MapPin, aL as TrendingUp, c as ArrowRight, au as Search, n as CalendarRange, H as Clock, aF as Sparkles, av as SearchX, m as CalendarPlus } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
function EmptyState({ onReset, hasSearch }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 px-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-full bg-primary/10 blur-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/50 border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchX, { className: "h-10 w-10 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold tracking-tight text-foreground", children: hasSearch ? "No matching festivals found" : "No upcoming festivals" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-sm text-muted-foreground", children: hasSearch ? "Try adjusting your search terms or category to find what you're looking for." : "New college festivals will appear here soon. Check back later for upcoming events." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: [
      hasSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onReset,
          className: "rounded-xl border-border/60 hover:bg-muted/50",
          children: "Reset Filters"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "rounded-xl bg-brand-gradient text-primary-foreground shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/organizer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "mr-2 h-4 w-4" }),
        "Organize Your Fest"
      ] }) })
    ] })
  ] });
}
const CATEGORIES = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"];
function ProfessionalExplorePage() {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("All");
  const {
    data: userProfile
  } = useQuery({
    queryKey: ["student-profile-scoped"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      const {
        data
      } = await supabase.from("student_profiles").select("*, colleges(id, name, city)").eq("id", user.id).maybeSingle();
      return data;
    }
  });
  const {
    data: rawEvents,
    isLoading
  } = useQuery({
    queryKey: ["scoped-events", userProfile?.college_id],
    enabled: !!userProfile,
    queryFn: async () => {
      let query = supabase.from("events").select("*").eq("status", "published").order("date", {
        ascending: true
      });
      if (userProfile?.college_id) {
        query = query.eq("college_id", userProfile.college_id);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data;
    }
  });
  const filteredEvents = reactExports.useMemo(() => {
    if (!rawEvents) return [];
    return rawEvents.map((e) => ({
      id: e.id,
      title: e.title,
      college: e.college_name,
      collegeId: e.college_id || "",
      date: e.date,
      city: e.city,
      category: e.category,
      cover: e.cover,
      attendees: e.attendees,
      priceFrom: e.price_from,
      description: e.description,
      organizer: e.organizer,
      isVerified: true
    })).filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || e.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [rawEvents, searchQuery, activeCategory]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 sm:px-8 py-10 max-w-[1400px] mx-auto space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 w-full rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[420px] rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" }, i)) })
    ] });
  }
  const collegeName = userProfile?.colleges?.name || "Your Institution";
  const city = userProfile?.colleges?.city || "Your City";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-20 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative px-6 sm:px-8 pt-10 pb-16 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 h-[400px] w-[400px] bg-indigo-500/5 blur-[100px] rounded-full -ml-32 -mb-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1400px] mx-auto relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
            " Institutional Access"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-2", children: [
            "Explore Exclusive ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Campus Festivals" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base text-muted-foreground font-medium max-w-lg", children: [
            "Verified events only for students of ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: collegeName }),
            ". Experience the best of culture, tech, and sports."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: collegeName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: city })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden xl:block w-72 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 relative group overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: filteredEvents.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-widest", children: "Active Fests" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-medium", children: "Coming Soon" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "2+ Events" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-white/5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary w-2/3 rounded-full" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "w-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all", children: [
              "Request Event Access ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-3 w-3" })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 sm:px-8 py-6 sticky top-0 z-30 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1400px] mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 backdrop-blur-2xl rounded-[2rem] p-3 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search for festivals, competitions, or guest stars...", className: "h-14 pl-12 rounded-[1.5rem] bg-black/20 border-white/10 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground font-medium" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-px bg-white/10 hidden md:block" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide px-2 w-full md:w-auto", children: CATEGORIES.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveCategory(category), className: cn("h-11 px-5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 relative group", activeCategory === category ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"), children: [
        category,
        activeCategory === category && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-black animate-pulse" })
      ] }, category)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 sm:px-8 py-12 max-w-[1400px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-brand-gradient shadow-glow flex items-center justify-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black tracking-tight uppercase", children: "Institution Calendar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1", children: [
              "Upcoming events at ",
              collegeName
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
          " Updated 5m ago"
        ] })
      ] }),
      filteredEvents.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3", children: filteredEvents.map((event, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both", style: {
        animationDelay: `${index * 150}ms`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event }) }, event.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onReset: () => {
        setSearchQuery("");
        setActiveCategory("All");
      }, hasSearch: searchQuery !== "" || activeCategory !== "All" }) })
    ] }),
    filteredEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 sm:px-8 mt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto relative rounded-[3rem] overflow-hidden bg-brand-gradient p-12 lg:p-20 text-white shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-[-20deg] translate-x-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-2xl space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-8 w-8 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl lg:text-6xl font-black tracking-tighter leading-none", children: [
          "Don't Miss Out ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "On The Action."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg text-white/80 font-medium leading-relaxed", children: [
          "Stay updated with your institution's latest happenings. Join 50,000+ students from ",
          collegeName,
          " who are already using WeFest to build memories."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "h-14 px-10 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl", children: "Get Exclusive Invites" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "h-14 px-8 rounded-2xl border-2 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all", children: "Join Campus Network" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-10 -right-10 h-64 w-64 bg-white/10 rounded-full blur-[80px]" })
    ] }) })
  ] });
}
export {
  ProfessionalExplorePage as component
};
