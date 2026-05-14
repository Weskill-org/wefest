import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { E as EventCard } from "./event-card-CQnXWFrQ.mjs";
import "../_libs/sonner.mjs";
import { aF as Sparkles, C as Calendar, R as Flame, aV as Users, aL as TrendingUp, au as Search, H as Clock, aJ as Ticket, a8 as MapPin, S as Funnel, c as ArrowRight } from "../_libs/lucide-react.mjs";
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
const categories = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"];
function EventsIndexPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("All");
  const [selectedCity, setSelectedCity] = reactExports.useState("all");
  const [sortBy, setSortBy] = reactExports.useState("date");
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
    data: events,
    isLoading
  } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("events").select("*").eq("status", "published").order("date", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const mappedEvents = reactExports.useMemo(() => {
    if (!events) return [];
    return events.map((e) => ({
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
      organizer: e.organizer
    }));
  }, [events]);
  const cities = reactExports.useMemo(() => {
    const citySet = new Set(mappedEvents.map((e) => e.city).filter((c) => !!c));
    return Array.from(citySet).sort();
  }, [mappedEvents]);
  const filtered = reactExports.useMemo(() => {
    let result = mappedEvents.filter((e) => {
      const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.college.toLowerCase().includes(searchQuery.toLowerCase()) || e.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
      const matchesCity = selectedCity === "all" || e.city === selectedCity;
      return matchesSearch && matchesCategory && matchesCity;
    });
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.attendees - a.attendees);
    } else if (sortBy === "price") {
      result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
    } else {
      result = [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return result;
  }, [mappedEvents, searchQuery, selectedCategory, selectedCity, sortBy]);
  const trending = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    return mappedEvents.filter((e) => new Date(e.date) >= now).sort((a, b) => b.attendees - a.attendees).slice(0, 3);
  }, [mappedEvents]);
  const totalEvents = mappedEvents.length;
  const upcomingCount = mappedEvents.filter((e) => new Date(e.date) >= /* @__PURE__ */ new Date()).length;
  const totalAttendees = mappedEvents.reduce((a, e) => a + e.attendees, 0);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-muted/20 p-12 animate-pulse h-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl h-80 animate-pulse" }, i)) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white shadow-2xl md:p-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold backdrop-blur-md mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          " Live Events Marketplace"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-black tracking-tight md:text-6xl", children: "Discover College Festivals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-lg text-white/80", children: "Find, explore, and book tickets to the most exciting festivals happening across India's top colleges." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-white/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: totalEvents }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/60 font-medium", children: "Total Events" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: upcomingCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/60 font-medium", children: "Upcoming" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-white/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: totalAttendees > 1e3 ? `${(totalAttendees / 1e3).toFixed(0)}k+` : totalAttendees }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/60 font-medium", children: "Total Attendees" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" })
    ] }),
    trending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-amber-400/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-amber-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: "Trending Now" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "The most popular festivals right now." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: trending.map((e, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-in slide-in-from-bottom-4 fade-in duration-500", style: {
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: e }) }, `trending-${e.id}`)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "event-search", placeholder: "Search events by name, college, or city…", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "h-11 rounded-xl pl-10 border-border/50 bg-background/60 backdrop-blur-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm p-1", children: [{
          value: "date",
          icon: Clock,
          label: "Latest"
        }, {
          value: "popular",
          icon: TrendingUp,
          label: "Popular"
        }, {
          value: "price",
          icon: Ticket,
          label: "Price"
        }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSortBy(s.value), className: `flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${sortBy === s.value ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-3.5 w-3.5" }),
          s.label
        ] }, s.value)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCategory(c), className: `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`, children: c }, c)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-px bg-border/40 mx-1 self-center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedCity("all"), className: `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${selectedCity === "all" ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "inline h-3 w-3 mr-1" }),
          "All Cities"
        ] }),
        cities.map((city) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCity(city), className: `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${selectedCity === city ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`, children: city }, city))
      ] }),
      (searchQuery || selectedCategory !== "All" || selectedCity !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            filtered.length,
            " ",
            filtered.length === 1 ? "result" : "results"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setSearchQuery("");
          setSelectedCategory("All");
          setSelectedCity("all");
        }, className: "text-xs font-bold text-primary hover:underline", children: "Clear all filters" })
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 flex flex-col items-center justify-center py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-10 w-10 text-muted-foreground/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: "No events found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-sm", children: "Try adjusting your search, category, or city filters to find events." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSelectedCity("all");
      }, variant: "outline", className: "mt-6 rounded-xl", children: "Reset Filters" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: e }, e.id)) }),
    !currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass inline-flex flex-col items-center rounded-3xl p-8 md:p-12 border border-border/40 max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-7 w-7 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold", children: "Ready to attend your first fest?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-md", children: "Sign up with your college email to get verified access, exclusive discounts, and join the community of 100k+ festival-goers." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate({
          to: "/signup"
        }), className: "bg-brand-gradient text-white shadow-glow rounded-xl font-bold px-8", children: [
          "Get Started ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => navigate({
          to: "/login"
        }), className: "rounded-xl font-bold", children: "Sign In" })
      ] })
    ] }) })
  ] });
}
export {
  EventsIndexPage as component
};
