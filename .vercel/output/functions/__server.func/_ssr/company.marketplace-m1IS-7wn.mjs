import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CO1OYTv6.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { T as Textarea } from "./textarea-D6eI1C7e.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-Zp0RaQmE.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { aW as UsersRound, i as Building2, aL as TrendingUp, au as Search, S as Funnel, aF as Sparkles, y as CircleCheck, d as ArrowUpRight, Z as IndianRupee, a3 as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const sponsorshipTiers = [{
  name: "Title",
  price: 25e5,
  perks: ["Naming rights", "Stage branding", "Hero placement", "5 keynote slots"]
}, {
  name: "Platinum",
  price: 12e5,
  perks: ["Logo on all assets", "Dedicated booth", "2 keynote slots"]
}, {
  name: "Gold",
  price: 6e5,
  perks: ["Logo placement", "Booth", "Social shoutouts"]
}, {
  name: "Silver",
  price: 25e4,
  perks: ["Logo placement", "Combined booth"]
}];
function CompanyMarketplace() {
  const [selectedEvent, setSelectedEvent] = reactExports.useState(null);
  const [isDialogOpen, setIsDialogOpen] = reactExports.useState(false);
  const [tier, setTier] = reactExports.useState("Gold");
  const [amount, setAmount] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const {
    data: events,
    isLoading
  } = useQuery({
    queryKey: ["sponsorship-events"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("events").select("*").order("attendees", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const proposalMutation = useMutation({
    mutationFn: async ({
      eventId,
      eventTitle,
      tier: tier2,
      amount: amount2,
      message: message2
    }) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to send proposals");
      const {
        error
      } = await supabase.from("sponsorship_proposals").insert({
        company_user_id: user.id,
        event_id: eventId,
        tier: tier2,
        amount: amount2,
        message: message2
      });
      if (error) throw error;
      return eventTitle;
    },
    onSuccess: (title) => {
      toast.success(`Proposal sent to ${title}`);
      setIsDialogOpen(false);
      setSelectedEvent(null);
      setMessage("");
      setAmount("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send proposal");
    }
  });
  const handleSendProposal = (e) => {
    e.preventDefault();
    if (!selectedEvent || !amount) return;
    proposalMutation.mutate({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      tier,
      amount: parseInt(amount),
      message
    });
  };
  const categories = reactExports.useMemo(() => {
    if (!events) return [];
    const cats = [...new Set(events.map((e) => e.category))].filter(Boolean);
    return cats.sort();
  }, [events]);
  const scoredEvents = reactExports.useMemo(() => {
    if (!events) return [];
    return [...events].map((e) => {
      let score = 65;
      if (e.attendees > 2e3) score += 10;
      if (e.attendees > 5e3) score += 10;
      if (e.attendees > 1e4) score += 12;
      score += e.title.length % 5;
      return {
        ...e,
        aiScore: Math.min(score, 99)
      };
    }).filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.college_name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => b.aiScore - a.aiScore);
  }, [events, searchQuery, categoryFilter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 max-w-[1400px] mx-auto space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-primary uppercase tracking-widest", children: "Sponsor Marketplace" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 font-display text-3xl md:text-4xl font-black tracking-tight", children: [
        "Reach ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "2M+ Gen-Z" }),
        " on campus."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm max-w-xl", children: "Discover festivals by reach, demographics, and category. Send proposals instantly and track ROI live." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiMini, { icon: UsersRound, label: "Network Reach", value: "2.1M" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiMini, { icon: Building2, label: "Colleges", value: "120+" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiMini, { icon: TrendingUp, label: "Avg ROI", value: "6.4×" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-4", children: "Sponsorship Tiers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 grid-cols-2 md:grid-cols-4", children: sponsorshipTiers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 transition-all hover:border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-medium", children: [
          t.name,
          " sponsor"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xl font-black text-gradient", children: [
          "₹",
          (t.price / 1e5).toFixed(1),
          "L+"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 text-[11px] text-muted-foreground", children: t.perks.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          p
        ] }, p)) })
      ] }, t.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search fests by name, college, or city…", className: "pl-9 glass border-white/10 h-10" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[180px] glass border-white/10 h-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 mr-2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Category" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Categories" }),
          categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        " AI Smart Matches",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-muted-foreground ml-1", children: [
          "(",
          scoredEvents.length,
          " fests)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: isLoading ? [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 glass rounded-2xl animate-pulse" }, i)) : scoredEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-10 text-center text-muted-foreground text-sm", children: "No matching festivals found. Try adjusting your search." }) : scoredEvents.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between relative overflow-hidden transition-all hover:border-primary/20", children: [
        e.aiScore > 90 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 rounded-bl-xl bg-emerald-500/10 px-3 py-1 text-[9px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
          " High Match"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-12 w-12 rounded-xl bg-gradient-to-br ${e.cover} relative shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1.5 -right-1.5 bg-background rounded-full p-0.5 border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary text-primary-foreground text-[8px] font-black h-5 w-5 flex items-center justify-center rounded-full", children: [
            e.aiScore,
            "%"
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: e.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
              e.college_name,
              " · ",
              e.city,
              " · ",
              (e.attendees / 1e3).toFixed(0),
              "k expected"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] bg-white/5", children: e.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => {
            setSelectedEvent(e);
            setTier("Gold");
            setAmount(sponsorshipTiers.find((t) => t.name === "Gold").price.toString());
            setMessage(`We are interested in sponsoring ${e.title} as a Gold partner.`);
            setIsDialogOpen(true);
          }, className: "bg-brand-gradient text-white shadow-glow hover:opacity-90 text-xs", children: [
            "Create Proposal ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3 ml-1" })
          ] })
        ] })
      ] }, e.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[480px] glass border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendProposal, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl", children: [
          "Sponsor ",
          selectedEvent?.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs", children: "Send a custom sponsorship proposal directly to the organizers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 py-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tier", className: "text-xs font-bold", children: "Sponsorship Tier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: tier, onValueChange: (val) => {
            setTier(val);
            const found = sponsorshipTiers.find((t) => t.name === val);
            if (found) setAmount(found.price.toString());
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "tier", className: "bg-background/50 border-border/60 h-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a tier" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sponsorshipTiers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: t.name, children: [
              t.name,
              " (from ₹",
              (t.price / 1e5).toFixed(1),
              "L)"
            ] }, t.name)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", className: "text-xs font-bold", children: "Offer Amount (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "amount", type: "number", min: "10000", required: true, value: amount, onChange: (e) => setAmount(e.target.value), className: "pl-9 bg-background/50 border-border/60 h-10" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", className: "text-xs font-bold", children: "Message to Organizer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", required: true, rows: 3, value: message, onChange: (e) => setMessage(e.target.value), className: "bg-background/50 border-border/60 resize-none text-sm", placeholder: "Introduce your brand and expectations..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setIsDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", disabled: proposalMutation.isPending, className: "bg-brand-gradient text-white", children: proposalMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Send Proposal" })
      ] })
    ] }) }) })
  ] });
}
function KpiMini({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-black", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-medium", children: label })
  ] });
}
export {
  CompanyMarketplace as component
};
