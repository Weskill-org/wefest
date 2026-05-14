import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button, t as cn } from "./router-C5_6oBDd.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-BK_SLcQl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent } from "./dialog-CO1OYTv6.mjs";
import { W as Handshake, au as Search, H as Clock, y as CircleCheck, F as CircleX, i as Building2, a8 as MapPin, k as CalendarDays, Z as IndianRupee, ad as MessagesSquare, d as ArrowUpRight, aW as UsersRound, N as ExternalLink } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
function CompanyProposals() {
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = reactExports.useState(null);
  const {
    data: user
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: {
          user: user2
        }
      } = await supabase.auth.getUser();
      if (!user2) throw new Error("Unauthorized");
      return user2;
    }
  });
  const {
    data: proposals,
    isLoading
  } = useQuery({
    queryKey: ["my-proposals-detailed"],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sponsorship_proposals").select("*, event:event_id(*)").eq("company_user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel("company_proposals_updates").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "sponsorship_proposals",
      filter: `company_user_id=eq.${user.id}`
    }, () => {
      queryClient.invalidateQueries({
        queryKey: ["my-proposals-detailed"]
      });
      queryClient.invalidateQueries({
        queryKey: ["my-proposals"]
      });
      toast.success("Proposal status updated in real-time!");
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Handshake, { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground animate-pulse", children: "Loading your proposals..." })
    ] });
  }
  const allProposals = proposals || [];
  const pending = allProposals.filter((p) => p.status === "pending");
  const confirmed = allProposals.filter((p) => p.status === "accepted");
  const rejected = allProposals.filter((p) => p.status === "rejected");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 bg-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-primary uppercase tracking-[0.2em]", children: "Sponsorships" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70", children: "Manage Proposals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm max-w-lg", children: "Track your sponsorship requests, review pending negotiations, and view details for confirmed partnerships." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-brand-gradient text-white rounded-xl shadow-glow transition-all hover:-translate-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/company/marketplace", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 mr-2" }),
        "Find New Events"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[24px] p-6 border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mb-2", children: "Total Sent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black", children: allProposals.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[24px] p-6 border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase font-black tracking-widest text-amber-500/60 mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-amber-500" }),
          " Pending"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black text-amber-500", children: pending.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[24px] p-6 border-white/5 bg-emerald-500/5 border-emerald-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase font-black tracking-widest text-emerald-500/60 mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-500" }),
          " Confirmed"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black text-emerald-500", children: confirmed.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[24px] p-6 border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase font-black tracking-widest text-rose-500/60 mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 text-rose-500" }),
          " Rejected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black text-rose-500", children: rejected.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "all", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-white/5 border border-white/5 h-12 p-1 rounded-2xl mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "all", className: "rounded-xl px-6 text-xs font-bold data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-lg", children: [
          "All (",
          allProposals.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pending", className: "rounded-xl px-6 text-xs font-bold data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500 data-[state=active]:shadow-lg", children: [
          "Pending (",
          pending.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "confirmed", className: "rounded-xl px-6 text-xs font-bold data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500 data-[state=active]:shadow-lg", children: [
          "Confirmed (",
          confirmed.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "rejected", className: "rounded-xl px-6 text-xs font-bold data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-500 data-[state=active]:shadow-lg", children: [
          "Rejected (",
          rejected.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "all", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProposalList, { proposals: allProposals, onViewDetails: setSelectedProposal }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pending", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProposalList, { proposals: pending, onViewDetails: setSelectedProposal, emptyMessage: "No pending proposals right now." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "confirmed", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProposalList, { proposals: confirmed, onViewDetails: setSelectedProposal, emptyMessage: "No confirmed sponsorships yet." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rejected", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProposalList, { proposals: rejected, onViewDetails: setSelectedProposal, emptyMessage: "No rejected proposals." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedProposal, onOpenChange: (open) => !open && setSelectedProposal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "glass border-white/10 p-0 overflow-hidden max-w-2xl", children: selectedProposal && selectedProposal.event && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 w-full overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedProposal.event.cover, className: "w-full h-full object-cover", alt: "Event Cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 border-none shadow-xl", selectedProposal.status === "accepted" ? "bg-emerald-500 text-white" : selectedProposal.status === "rejected" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"), children: selectedProposal.status === "accepted" ? "Confirmed" : selectedProposal.status }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-black mb-2", children: selectedProposal.event.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
              " ",
              selectedProposal.event.college_name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
              " ",
              selectedProposal.event.city
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4" }),
              " ",
              format(new Date(selectedProposal.event.date), "MMM dd, yyyy")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 rounded-2xl p-4 border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Tier Requested" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-xl text-primary", children: selectedProposal.tier })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 rounded-2xl p-4 border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Committed Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black text-xl flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4 text-muted-foreground" }),
              (selectedProposal.amount / 1e5).toFixed(1),
              "L"
            ] })
          ] })
        ] }),
        selectedProposal.message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 rounded-2xl p-5 border border-primary/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesSquare, { className: "h-4 w-4" }),
            " Your Message"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-relaxed text-foreground/80 italic", children: [
            '"',
            selectedProposal.message,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setSelectedProposal(null), children: "Close" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-primary text-primary-foreground font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events/$eventId", params: {
            eventId: selectedProposal.event.id
          }, children: "View Event Page" }) })
        ] })
      ] })
    ] }) }) })
  ] });
}
function ProposalList({
  proposals,
  emptyMessage = "No proposals found.",
  onViewDetails
}) {
  if (proposals.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[32px] p-16 text-center border-dashed border-white/10 bg-white/[0.01]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-12 w-12 mx-auto text-muted-foreground/20 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: emptyMessage }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "mt-6 rounded-xl border-white/10 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/company/marketplace", children: [
        "Browse Marketplace ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: proposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group glass rounded-[24px] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-6 transition-all hover:bg-white/[0.03] border-white/5 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5 flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-16 w-24 shrink-0 rounded-xl overflow-hidden border border-white/10 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.event?.cover, className: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-500", alt: "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/20" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg truncate pr-4", children: p.event?.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3" }),
            " ",
            p.event?.college_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-3 w-3" }),
            " ",
            (p.event?.attendees || 0).toLocaleString(),
            " Attendees"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 rounded-xl px-4 py-2 border border-white/5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-0.5", children: p.tier }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold flex items-center justify-center gap-1", children: [
          "₹",
          (p.amount / 1e5).toFixed(1),
          "L"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[120px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cn("w-full justify-center py-1.5 border-none font-black uppercase text-[10px] tracking-widest", p.status === "accepted" ? "bg-emerald-500/10 text-emerald-500" : p.status === "rejected" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"), children: p.status === "accepted" ? "Confirmed" : p.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-center text-muted-foreground mt-1", children: format(new Date(p.created_at), "MMM dd, yyyy") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => onViewDetails(p), className: "h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all ml-auto md:ml-0 border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" }) })
    ] })
  ] }, p.id)) });
}
export {
  CompanyProposals as component
};
