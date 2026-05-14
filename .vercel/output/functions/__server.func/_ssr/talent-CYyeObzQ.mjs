import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import "../_libs/sonner.mjs";
import { ae as MicVocal, af as Music2, au as Search, aG as Star, y as CircleCheck, Z as IndianRupee, aD as ShieldCheck } from "../_libs/lucide-react.mjs";
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
function TalentMarketplace() {
  const [q, setQ] = reactExports.useState("");
  const [genre, setGenre] = reactExports.useState("All");
  const {
    data: artists,
    isLoading
  } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("artist_profiles").select("*").order("rating", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const filtered = reactExports.useMemo(() => {
    if (!artists) return [];
    return artists.filter((a) => (genre === "All" || a.genre === genre) && (a.name.toLowerCase().includes(q.toLowerCase()) || a.genre?.toLowerCase().includes(q.toLowerCase())));
  }, [artists, q, genre]);
  const genres = ["All", "DJ", "Band", "Singer", "Speaker", "Comedian"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative mb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 md:grid-cols-2 md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-bold text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "h-3.5 w-3.5" }),
          " Verified Talent Network"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-display text-5xl font-black leading-tight md:text-7xl", children: [
          "Book the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Star" }),
          " of your next fest."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground max-w-xl", children: "Browse and book India's most talented student and professional artists. Secure payments, verified ratings, and direct communication." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-brand-gradient hover:opacity-90 rounded-full px-8 shadow-glow", children: "Explore Talent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "rounded-full px-8", children: "Register as Artist" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 bg-brand-gradient opacity-10 blur-3xl -z-10 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-64 rounded-3xl bg-slate-900 border border-white/5 overflow-hidden relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white/10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-4 text-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-primary", children: "DJs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Electronic Vibes" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-64 mt-12 rounded-3xl bg-brand-gradient overflow-hidden relative group shadow-glow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-4 text-white font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-white/60", children: "Live" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Singer Songwriters" })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold", children: "Artist Directory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Discover verified talent for your festival" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search artists...", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9 bg-background/50 border-border/60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: genres.slice(0, 4).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setGenre(g), variant: "outline", size: "sm", className: `rounded-full ${genre === g ? "border-primary bg-primary/5" : "border-border/60"}`, children: g }, g)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: isLoading ? [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 glass rounded-[2rem] animate-pulse" }, i)) : filtered.length > 0 ? filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass group overflow-hidden rounded-[2rem] border border-border/60 hover:border-primary/40 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-brand-gradient p-0.5 shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-[14px] bg-background flex items-center justify-center font-display text-xl font-black", children: a.name.slice(0, 1) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold", children: a.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: a.genre }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-amber-400 text-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: Number(a.rating).toFixed(1) })
              ] })
            ] })
          ] })
        ] }),
        (a.rating ?? 0) > 4.5 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-primary/10 p-1 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-sm text-muted-foreground line-clamp-2 leading-relaxed", children: a.bio || "No bio available." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-8 border-t border-border/40 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Starting from" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-black text-primary flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4" }),
            ((a.base_price ?? 0) / 1e3).toFixed(0),
            "k"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-brand-gradient text-white rounded-full px-6 shadow-glow", children: "Book Now" })
      ] })
    ] }) }, a.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-20 text-center glass rounded-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { className: "mx-auto h-12 w-12 text-muted-foreground opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-lg font-bold", children: "No artists found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We are constantly adding new talent. Stay tuned!" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-24 p-12 glass rounded-[3rem] border border-primary/10 overflow-hidden relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 md:grid-cols-[1fr_2fr] items-center relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-24 w-24 place-items-center rounded-3xl bg-brand-gradient shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-12 w-12 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl font-bold", children: "Why book through WeFest?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-6 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SafetyPoint, { title: "Secure Escrow", desc: "Funds are only released once the performance is confirmed and completed." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SafetyPoint, { title: "Verified Talent", desc: "We check IDs, portfolios and past performance records for every artist." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SafetyPoint, { title: "Standard Contracts", desc: "Professional legal agreements automatically generated for every booking." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SafetyPoint, { title: "Support", desc: "Dedicated dispute resolution and on-ground coordination support." })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function SafetyPoint({
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }),
      " ",
      title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground leading-relaxed", children: desc })
  ] });
}
export {
  TalentMarketplace as component
};
