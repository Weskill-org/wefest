import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import "../_libs/sonner.mjs";
import { aD as ShieldCheck, i as Building2, aN as Trophy, C as Calendar, au as Search, V as GraduationCap, a8 as MapPin, U as Globe, aF as Sparkles, c as ArrowRight } from "../_libs/lucide-react.mjs";
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
function CollegesIndexPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedCity, setSelectedCity] = reactExports.useState("all");
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
    data: colleges,
    isLoading
  } = useQuery({
    queryKey: ["colleges-approved"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("colleges").select(`
          *,
          events (
            id,
            title,
            date,
            description,
            category
          )
        `).eq("status", "approved").order("name");
      if (error) throw error;
      return data;
    }
  });
  const realColleges = colleges || [];
  const cities = reactExports.useMemo(() => {
    const citySet = new Set(realColleges.map((c) => c.city).filter((c) => !!c && c !== "Pending"));
    return Array.from(citySet).sort();
  }, [realColleges]);
  const filtered = reactExports.useMemo(() => {
    return realColleges.filter((c) => {
      const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.city?.toLowerCase().includes(searchQuery.toLowerCase()) || c.domain?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === "all" || c.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [realColleges, searchQuery, selectedCity]);
  const totalFests = realColleges?.reduce((acc, c) => acc + (c.fests || 0), 0) || 0;
  const totalEvents = realColleges?.reduce((acc, c) => acc + (c.events?.length || 0), 0) || 0;
  const gradients = ["from-fuchsia-500/20 to-violet-500/20", "from-blue-500/20 to-cyan-500/20", "from-emerald-500/20 to-teal-500/20", "from-amber-500/20 to-orange-500/20", "from-rose-500/20 to-pink-500/20", "from-indigo-500/20 to-purple-500/20"];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-muted/20 p-12 animate-pulse h-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl h-56 animate-pulse" }, i)) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white shadow-2xl md:p-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold backdrop-blur-md mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
          " Verified Institutions"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-black tracking-tight md:text-6xl", children: "College Network" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-lg text-white/80", children: "India's most vibrant campus communities — verified colleges hosting festivals, cultural events, and more." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-white/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: realColleges?.length || 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/60 font-medium", children: "Institutions" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 text-yellow-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: totalFests }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/60 font-medium", children: "Total Festivals" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-white/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black", children: totalEvents }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/60 font-medium", children: "Active Events" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-4 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "college-search", placeholder: "Search colleges by name, city, or domain…", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "h-11 rounded-xl pl-10 border-border/50 bg-background/60 backdrop-blur-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto pb-1 scrollbar-hide", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCity("all"), className: `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${selectedCity === "all" ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`, children: "All Cities" }),
        cities.map((city) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCity(city), className: `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${selectedCity === city ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`, children: city }, city))
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 flex flex-col items-center justify-center py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-10 w-10 text-muted-foreground/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: "No colleges found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-sm", children: "Try adjusting your search or filters." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((c, i) => {
      const upcomingEvents = c.events?.filter((e) => new Date(e.date) >= /* @__PURE__ */ new Date()) || [];
      const gradientClass = gradients[i % gradients.length];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/colleges/$collegeSlug", params: {
        collegeSlug: c.slug
      }, className: "group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 w-full bg-gradient-to-r ${gradientClass}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-11 w-11 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground/80", children: c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base leading-tight group-hover:text-primary transition-colors truncate", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-0.5", children: c.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                  " ",
                  c.city
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" })
          ] }),
          c.domain && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
              "@",
              c.domain
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-primary/10 text-primary border-none text-[10px] font-bold gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3 w-3" }),
              c.fests,
              " ",
              c.fests === 1 ? "fest" : "fests"
            ] }),
            upcomingEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-bold gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
              upcomingEvents.length,
              " upcoming"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-border/30 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors", children: "View college profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" })
          ] })
        ] })
      ] }, c.id);
    }) }),
    !currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass inline-flex flex-col items-center rounded-3xl p-8 md:p-10 border border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-10 w-10 text-primary mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold", children: "Want your college on WeFest?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-md", children: "Register your institution to start hosting festivals, managing events, and joining India's largest college network." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate({
        to: "/signup"
      }), className: "mt-5 bg-brand-gradient text-white shadow-glow rounded-xl font-bold px-8", children: [
        "Get Started ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] })
    ] }) })
  ] });
}
export {
  CollegesIndexPage as component
};
