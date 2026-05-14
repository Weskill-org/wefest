import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { j as Route$v, y as useRegion, x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as ArrowLeft, aF as Sparkles, H as Clock, B as BadgeCheck, C as Calendar, a8 as MapPin, aV as Users, aL as TrendingUp, aJ as Ticket, a3 as LoaderCircle, c as ArrowRight, az as Share2, X as Heart } from "../_libs/lucide-react.mjs";
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
function PublicEventDetail() {
  const event = Route$v.useLoaderData();
  const navigate = useNavigate();
  const {
    formatPrice
  } = useRegion();
  const queryClient = useQueryClient();
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
    data: hasTicket
  } = useQuery({
    queryKey: ["has-ticket", event.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("tickets").select("id").eq("event_id", event.id).eq("user_id", currentUser.id);
      return (data?.length || 0) > 0;
    }
  });
  const tiers = reactExports.useMemo(() => {
    const settings = event.pass_settings;
    if (!settings) {
      return [{
        name: "Day Pass",
        price: 499,
        perks: ["Single day access", "All open events"]
      }, {
        name: "Pro Pass",
        price: 1499,
        perks: ["All days", "Priority entry", "Pro shows"]
      }, {
        name: "VIP",
        price: 3999,
        perks: ["All access", "Backstage tour", "Merch kit"]
      }];
    }
    const result = [];
    if (settings.normal?.enabled) {
      result.push({
        name: "Normal Pass",
        price: settings.normal.price,
        perks: [`${settings.normal.days} Day(s) access`, "All open events", `Single day: ₹${settings.normal.single_day_price}`]
      });
    }
    if (settings.vip?.enabled) {
      result.push({
        name: "VIP Pass",
        price: settings.vip.price,
        perks: ["Priority Entry", "Backstage Access", "VIP Lounge", `Multi-day: ₹${settings.vip.multi_day_price}`]
      });
    }
    return result.length > 0 ? result : [{
      name: "General Entry",
      price: event.price_from || 0,
      perks: ["Standard access"]
    }];
  }, [event]);
  const [selected, setSelected] = reactExports.useState(0);
  const buyMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        navigate({
          to: "/signup"
        });
        throw new Error("redirect");
      }
      const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const {
        error
      } = await supabase.from("tickets").insert({
        user_id: currentUser.id,
        event_id: event.id,
        tier: tiers[selected].name,
        code: ticketCode
      });
      if (error) throw error;
      return {
        tier: tiers[selected].name,
        code: ticketCode
      };
    },
    onSuccess: (data) => {
      toast.success(`Success! ${data.tier} booked. Your code: ${data.code}`);
      queryClient.invalidateQueries({
        queryKey: ["my-tickets"]
      });
      queryClient.invalidateQueries({
        queryKey: ["has-ticket", event.id]
      });
    },
    onError: (error) => {
      if (error.message === "redirect") return;
      toast.error(error.message || "Failed to book ticket");
    }
  });
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= /* @__PURE__ */ new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
  const subEvents = ["Headliner Concert", "Battle of Bands", "Stand-up Night", "Dance Showdown", "Hackathon", "Esports Arena"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative h-[340px] md:h-[400px] bg-gradient-to-br ${event.cover}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full container mx-auto px-6 flex flex-col justify-between py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", className: "inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group w-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:-translate-x-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
          "All Events"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-amber-400" }),
              " ",
              event.category || "Festival"
            ] }),
            isUpcoming && daysUntil <= 30 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200 border border-emerald-500/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              " ",
              daysUntil === 0 ? "Today!" : `${daysUntil} day${daysUntil !== 1 ? "s" : ""} left`
            ] }),
            event.college_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-indigo-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-indigo-500/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3" }),
              " Verified"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-white/60 uppercase tracking-tighter mb-1", children: [
            event.college_name,
            " Presents"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.9]", children: event.title }),
          event.tags && event.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-4", children: event.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10", children: [
            "#",
            tag
          ] }, tag)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-10 grid gap-8 lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
            eventDate.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          ] }),
          event.time && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 border-l border-border/40 pl-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
            event.time
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 border-l border-border/40 pl-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
            event.city
          ] }),
          event.venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 border-l border-border/40 pl-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
            event.venue
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 border-l border-border/40 pl-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
            event.attendees.toLocaleString("en-IN"),
            " capacity"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight mb-4", children: "About this event" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg leading-relaxed text-foreground/80 font-medium", children: event.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold tracking-tight mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary" }),
            " Event Schedule"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: subEvents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass group rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: s }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-primary" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 text-xs text-muted-foreground", children: "Multiple sessions • Open to all pass holders" })
          ] }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight mb-4", children: "Organized by" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 border border-border/60 flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black text-primary-foreground", children: event.college_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-lg", children: event.college_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3.5 w-3.5 text-blue-400" }),
                " Verified Institution on WeFest"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lg:sticky lg:top-20 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 border border-border/60 shadow-xl relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-24 w-24 bg-primary/10 blur-3xl -mr-12 -mt-12" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-4 w-4" }),
            " Select Your Pass"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: tiers.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(i), className: `w-full rounded-2xl border-2 p-4 text-left transition-all ${selected === i ? "border-primary bg-primary/5 shadow-glow" : "border-border/60 hover:border-primary/40 bg-muted/10"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg text-primary", children: t.price === 0 ? "Free" : formatPrice(t.price) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1", children: t.perks.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-1 rounded-full bg-primary" }),
              " ",
              p
            ] }, p)) })
          ] }, t.name)) }),
          currentUser ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => buyMutation.mutate(), disabled: buyMutation.isPending || hasTicket, size: "lg", className: "mt-6 h-14 w-full rounded-xl bg-brand-gradient text-white font-bold text-base shadow-glow hover:opacity-90 disabled:opacity-50", children: buyMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : hasTicket ? "Ticket Booked ✅" : "Get Pass Now" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate({
              to: "/signup"
            }), size: "lg", className: "h-14 w-full rounded-xl bg-brand-gradient text-white font-bold text-base shadow-glow hover:opacity-90", children: [
              "Sign Up to Book ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[10px] text-muted-foreground", children: [
              "Already have an account?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary font-bold hover:underline", children: "Sign in" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest", children: "Instant QR • Secured via WeFest Escrow" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
          }, className: "flex-1 glass rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
            " Share"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toast.success("Added to wishlist!"), className: "flex-1 glass rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4" }),
            " Save"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  PublicEventDetail as component
};
