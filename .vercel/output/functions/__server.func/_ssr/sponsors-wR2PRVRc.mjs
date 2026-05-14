import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CO1OYTv6.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { T as Textarea } from "./textarea-D6eI1C7e.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-Zp0RaQmE.mjs";
import { aW as UsersRound, i as Building2, aL as TrendingUp, aF as Sparkles, y as CircleCheck, Z as IndianRupee, a3 as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function Sponsors() {
  const [selectedEvent, setSelectedEvent] = reactExports.useState(null);
  const [isDialogOpen, setIsDialogOpen] = reactExports.useState(false);
  const [tier, setTier] = reactExports.useState("Gold");
  const [amount, setAmount] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
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
    }).sort((a, b) => b.aiScore - a.aiScore);
  }, [events]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-[2fr_1fr] md:items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-primary", children: "Sponsor marketplace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-2 font-display text-4xl font-black md:text-5xl", children: [
          "Reach ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "2M+ Gen-Z" }),
          " on campus."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-muted-foreground", children: "Filter fests by reach, demographics and category. Send proposals in one click. Track ROI live." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: UsersRound, label: "Reach", value: "2.1M" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Building2, label: "Colleges", value: "120" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: TrendingUp, label: "Avg ROI", value: "6.4×" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-14 font-display text-2xl font-bold", children: "Sponsorship tiers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-4 md:grid-cols-4", children: sponsorshipTiers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        t.name,
        " sponsor"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-2xl font-bold text-gradient", children: [
        "₹",
        (t.price / 1e5).toFixed(1),
        "L+"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-1.5 text-sm text-muted-foreground", children: t.perks.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        "• ",
        p
      ] }, p)) })
    ] }, t.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-14 font-display text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary" }),
      " AI Smart Matches"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-4", children: isLoading ? [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 glass rounded-2xl animate-pulse" }, i)) : scoredEvents?.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between relative overflow-hidden transition hover:border-primary/40", children: [
      e.aiScore > 90 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 rounded-bl-xl bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-500 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
        " HIGH MATCH"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-14 w-14 rounded-xl bg-gradient-to-br ${e.cover} relative`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-2 -right-2 bg-background rounded-full p-0.5 border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary text-primary-foreground text-[9px] font-bold h-6 w-6 flex items-center justify-center rounded-full", children: [
          e.aiScore,
          "%"
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: e.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            e.college_name,
            " • ",
            e.city,
            " • ",
            (e.attendees / 1e3).toFixed(0),
            "k expected"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 md:mt-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary", children: e.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          setSelectedEvent(e);
          const defaultTier = sponsorshipTiers.find((t) => t.name === "Gold");
          setTier("Gold");
          setAmount(defaultTier.price.toString());
          setMessage(`We are interested in sponsoring ${e.title} as a Gold partner.`);
          setIsDialogOpen(true);
        }, className: "bg-brand-gradient text-primary-foreground shadow-glow hover:opacity-90", children: "Create proposal" })
      ] })
    ] }, e.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[500px] glass border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendProposal, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-2xl", children: [
          "Sponsor ",
          selectedEvent?.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Send a custom sponsorship proposal directly to the college organizers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tier", children: "Sponsorship Tier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: tier, onValueChange: (val) => {
            setTier(val);
            const found = sponsorshipTiers.find((t) => t.name === val);
            if (found) setAmount(found.price.toString());
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "tier", className: "bg-background/50 border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a tier" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sponsorshipTiers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: t.name, children: [
              t.name,
              " (from ₹",
              (t.price / 1e5).toFixed(1),
              "L)"
            ] }, t.name)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", children: "Offer Amount (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "amount", type: "number", min: "10000", required: true, value: amount, onChange: (e) => setAmount(e.target.value), className: "pl-9 bg-background/50 border-border/60" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "Message to Organizer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", required: true, rows: 4, value: message, onChange: (e) => setMessage(e.target.value), className: "bg-background/50 border-border/60 resize-none", placeholder: "Introduce your brand and expectations..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setIsDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: proposalMutation.isPending, className: "bg-brand-gradient text-primary-foreground", children: proposalMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Send Proposal" })
      ] })
    ] }) }) })
  ] });
}
function Kpi({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-bold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: label })
  ] });
}
export {
  Sponsors as component
};
