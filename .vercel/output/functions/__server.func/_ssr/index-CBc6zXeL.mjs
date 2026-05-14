import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { E as EventCard } from "./event-card-CQnXWFrQ.mjs";
import "../_libs/sonner.mjs";
import { aF as Sparkles, c as ArrowRight, a3 as LoaderCircle, C as Calendar, aJ as Ticket, aL as TrendingUp, aD as ShieldCheck, aW as UsersRound, an as Quote, aG as Star } from "../_libs/lucide-react.mjs";
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
function AdBanner({ title, description, ctaText, type = "standard" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative overflow-hidden rounded-3xl p-8 mb-12 ${type === "premium" ? "bg-slate-950 text-white border border-white/10" : "bg-brand-gradient text-primary-foreground"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center justify-between gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " Featured"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black mb-2 font-display tracking-tight", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 max-w-xl", children: description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: `${type === "premium" ? "bg-white text-slate-900 hover:bg-white/90" : "bg-white text-primary hover:bg-white/90"} font-bold rounded-full px-8`, children: [
        ctaText,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-2" })
      ] })
    ] })
  ] });
}
function Home() {
  const {
    data: events,
    isLoading: loadingEvents
  } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("events").select("*").eq("status", "published").limit(6).order("attendees", {
        ascending: false
      });
      if (error) throw error;
      return data.map((e) => ({
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
    }
  });
  const {
    data: colleges,
    isLoading: loadingColleges
  } = useQuery({
    queryKey: ["featured-colleges"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("colleges").select("*").limit(4).order("fests", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const {
    data: testimonials
  } = useQuery({
    queryKey: ["featured-testimonials"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("testimonials").select("*").eq("is_featured", true).limit(3);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: partners
  } = useQuery({
    queryKey: ["partner-brands"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("partner_brands").select("*").eq("is_active", true).limit(6);
      if (error) throw error;
      return data;
    }
  });
  const featured = events || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden bg-hero", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container relative mx-auto grid gap-12 px-6 py-24 md:grid-cols-2 md:py-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
          "India's college-first event ecosystem"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-display text-5xl font-black leading-[1.05] tracking-tight md:text-7xl", children: [
          "The digital ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "backbone" }),
          " of college festivals."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-lg text-muted-foreground", children: "From planning to sponsorship to ticketing — WeFest powers every fest in your college network. Verified identity, zero fakes, infinite reach." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-brand-gradient text-primary-foreground shadow-glow hover:opacity-90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", children: [
            "Join with college email ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events", children: "Browse fests" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-3 gap-6 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Colleges", value: "120+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Fests hosted", value: "450+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Tickets sold", value: "2.1M" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-3xl bg-brand-gradient opacity-30 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative grid gap-4", children: loadingEvents ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 glass rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : featured.slice(0, 3).map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `glass overflow-hidden rounded-2xl ${i === 1 ? "ml-8" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-4 p-4`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br ${e.cover}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: e.college }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-semibold", children: e.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-primary", children: [
              "From ₹",
              e.priceFrom
            ] })
          ] })
        ] }) }, e.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-6 py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-primary", children: "One platform. Every workflow." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl", children: "Built for organizers, sponsors and students." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Calendar, title: "Plan & host", desc: "Multi-day, multi-event scheduling with sub-event hierarchies, volunteers and approvals." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Ticket, title: "Sell tickets", desc: "Branded ticket tiers, QR check-in, real-time scanning and instant settlement." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: TrendingUp, title: "Win sponsors", desc: "A live marketplace where sponsors discover fests by reach, demographics and category." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: ShieldCheck, title: "Verified identity", desc: "Email-domain verified students. No fake signups, no scalper bots, ever." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: UsersRound, title: "College network", desc: "Cross-campus discovery. Your fest, seen by 100+ colleges from day one." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Sparkles, title: "Live analytics", desc: "Footfall, conversion, sponsor ROI dashboards. Data that wins next year's pitch." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdBanner, { title: "Boost your fest to 100k+ students", description: "Get featured on the homepage, email newsletters and college community feeds across India. Verified reach for maximum ROI.", ctaText: "Promote now", type: "premium" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold md:text-4xl", children: "Featured festivals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events", className: "text-sm text-primary hover:underline", children: "View all →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: loadingEvents ? [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 glass rounded-2xl animate-pulse" }, i)) : featured.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: e }, e.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-6 py-12 border-y border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8", children: "Trusted by global brands for campus outreach" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500", children: partners?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black italic tracking-tighter text-foreground/80", children: p.name }, p.id)) || /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-12", children: ["Red Bull", "Adobe", "Reliance Jio", "Zomato", "OnePlus"].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black italic tracking-tighter text-foreground/80", children: n }, n)) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-6 py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl font-bold md:text-5xl", children: [
          "Success stories from the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "network" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Hear from the organizers and sponsors who powered their fests with WeFest." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8 md:grid-cols-3", children: (testimonials || [{
        name: "Arjun Mehta",
        role: "Fest Coordinator",
        organization: "IIT Bombay",
        content: "WeFest transformed Mood Indigo. Handling 100k+ registrations without a single server hiccup was a dream come true."
      }, {
        name: "Sara Khan",
        role: "Marketing Head",
        organization: "Red Bull India",
        content: "The real-time ROI tracking and verified student leads make WeFest our go-to for campus activations."
      }, {
        name: "Dr. Ramesh Iyer",
        role: "Dean of Student Affairs",
        organization: "BITS Pilani",
        content: "Digital transparency in budgeting and sponsorship is exactly what college administrations needed."
      }]).map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[2rem] p-8 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "absolute top-6 right-8 h-10 w-10 text-primary/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 text-amber-400 mb-4", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg italic leading-relaxed text-foreground/90", children: [
          '"',
          t.content,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-brand-gradient p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-bold", children: t.name.slice(0, 1) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: t.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              t.role,
              ", ",
              t.organization
            ] })
          ] })
        ] })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-6 py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold md:text-4xl", children: "Trusted by India's top colleges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "From Tier-1 engineering colleges to premier management institutes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/colleges", children: "See all colleges" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 md:grid-cols-4", children: loadingColleges ? [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 glass rounded-xl animate-pulse" }, i)) : colleges?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/colleges", className: "glass rounded-xl p-4 transition hover:border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          c.city,
          " • ",
          c.fests,
          " active fests"
        ] })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-6 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-3xl bg-brand-gradient p-10 text-primary-foreground shadow-glow md:p-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-[2fr_1fr] md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl font-black md:text-5xl", children: "Run your next fest on WeFest." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-primary-foreground/80", children: "Onboard your college, set up sub-events in minutes, open sponsorship outreach instantly." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex md:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "secondary", className: "bg-background text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/organizer", children: [
        "Open organizer suite ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) }) })
    ] }) }) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-gradient", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
  ] });
}
function Feature({
  icon: Icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass group rounded-2xl p-6 transition hover:border-primary/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: desc })
  ] });
}
export {
  Home as component
};
