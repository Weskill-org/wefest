import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { q as Route$1, y as useRegion, x as supabase, a as Button } from "./_ssr/router-C5_6oBDd.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./_ssr/tabs-BK_SLcQl.mjs";
import { I as Input } from "./_ssr/input-DfdhTZrH.mjs";
import { P as PaymentDialog } from "./_ssr/payment-dialog-C4bhJvAx.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { aR as UserCheck, b as ArrowLeft, aF as Sparkles, C as Calendar, a8 as MapPin, aV as Users, ac as MessageSquare, Y as Image, aL as TrendingUp, aJ as Ticket, aw as Send, aN as Trophy, o as Camera, ar as Scan } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
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
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_ssr/dialog-CO1OYTv6.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_ssr/wallet-topup-dialog-BrbwmaT1.mjs";
import "./_ssr/wallet.functions-Bc2Nw_Yv.mjs";
import "./_ssr/auth-middleware-HN75ZaUg.mjs";
import "./_libs/zod.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/label-Dd0kFXLk.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_ssr/switch-CKkXT9Zh.mjs";
import "./_libs/radix-ui__react-switch.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
function StudentEventDetail() {
  const event = Route$1.useLoaderData();
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
        perks: ["All 4 days", "Priority entry", "Pro shows"]
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
    return result;
  }, [event]);
  const [selected, setSelected] = reactExports.useState(0);
  const [chatMsg, setChatMsg] = reactExports.useState("");
  const [paymentOpen, setPaymentOpen] = reactExports.useState(false);
  const queryClient = useQueryClient();
  const {
    formatPrice
  } = useRegion();
  const scrollRef = reactExports.useRef(null);
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
    data: studentProfile
  } = useQuery({
    queryKey: ["student-profile", currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("student_profiles").select("college_id").eq("id", currentUser.id).maybeSingle();
      if (error) throw error;
      return data;
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
  const isEligible = !event.college_id || studentProfile?.college_id === event.college_id;
  const {
    data: chatMessages
  } = useQuery({
    queryKey: ["event-chat", event.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("event_chat_messages").select("*").eq("event_id", event.id).order("created_at", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const {
    data: votes
  } = useQuery({
    queryKey: ["competition-votes", event.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("competition_votes").select("candidate_name").eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });
  const voteStats = reactExports.useMemo(() => {
    if (!votes) return {};
    return votes.reduce((acc, v) => {
      acc[v.candidate_name] = (acc[v.candidate_name] || 0) + 1;
      return acc;
    }, {});
  }, [votes]);
  const candidates = ["DJ Spark", "The Neon Band", "Zenith Dance Crew"];
  if (studentProfile !== void 0 && !isEligible) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[80vh] flex flex-col items-center justify-center text-center px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-10 w-10 text-destructive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-foreground mb-3", children: "Access Restricted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground max-w-md mb-8", children: [
        "This event is exclusively for students of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: event.college_name }),
        ". You do not have permission to view or participate in this festival."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-brand-gradient text-white font-bold shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", children: "Return to Explore" }) })
    ] });
  }
  reactExports.useEffect(() => {
    const channel = supabase.channel(`event-chat-${event.id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "event_chat_messages",
      filter: `event_id=eq.${event.id}`
    }, () => {
      queryClient.invalidateQueries({
        queryKey: ["event-chat", event.id]
      });
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id, queryClient]);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);
  const sendChatMutation = useMutation({
    mutationFn: async () => {
      if (!chatMsg.trim()) return;
      const {
        error
      } = await supabase.from("event_chat_messages").insert({
        event_id: event.id,
        user_id: currentUser.id,
        message: chatMsg.trim()
      });
      if (error) throw error;
    },
    onSuccess: () => setChatMsg(""),
    onError: (err) => toast.error(err.message || "Must have a ticket to chat!")
  });
  const voteMutation = useMutation({
    mutationFn: async (candidate) => {
      const {
        error
      } = await supabase.from("competition_votes").insert({
        event_id: event.id,
        voter_id: currentUser.id,
        candidate_name: candidate
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competition-votes", event.id]
      });
      toast.success("Vote cast successfully!");
    },
    onError: (err) => toast.error(err.message || "One vote per student allowed.")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative h-[300px] bg-gradient-to-br ${event.cover}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full px-6 sm:px-8 flex flex-col justify-between py-8 max-w-[1200px] mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/explore", className: "inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group w-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:-translate-x-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
          "Back to Explore"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-amber-400" }),
              " Premium Fest"
            ] }),
            event.college_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-indigo-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-indigo-500/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-3 w-3" }),
              " Institutional"
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 sm:px-8 py-10 max-w-[1200px] mx-auto grid gap-8 lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/40 inline-flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
              new Date(event.date).toDateString()
            ] }),
            event.time && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 border-l border-border/40 pl-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
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
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg leading-relaxed text-foreground/80 font-medium", children: event.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "events", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/50 p-1 rounded-2xl h-12 border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "events", className: "rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold text-xs", children: "Schedule" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "community", className: "rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
              " Community"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "gallery", className: "rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3.5 w-3.5" }),
              " Gallery"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "events", className: "mt-6 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: ["Headliner Concert", "Battle of Bands", "Stand-up Night", "Dance Showdown", "Hackathon", "Esports Arena"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass group rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-all cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: s }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-primary" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 text-xs text-muted-foreground", children: "Multiple sessions • Open to all pass holders" })
          ] }, s)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "community", className: "mt-6", children: !hasTicket ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center glass rounded-2xl border-dashed border-2 border-primary/20 relative overflow-hidden group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-brand-gradient opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-8 w-8 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: "Unlock Community Hub" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground max-w-md mx-auto text-sm", children: "Purchase any pass to join real-time chat, vote for performers, and engage with other students." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[450px] glass rounded-2xl overflow-hidden border border-border/60 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-white/5 flex items-center justify-between bg-black/10 dark:bg-white/5 backdrop-blur-md relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold flex items-center gap-2 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" }),
                  "Live Chat"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20", children: "Real-time" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-hide", children: [
                chatMessages?.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center text-center opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-10 w-10 mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "Be the first to say something!" })
                ] }),
                chatMessages?.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col ${msg.user_id === currentUser?.id ? "items-end" : "items-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.user_id === currentUser?.id ? "bg-brand-gradient text-white rounded-tr-none shadow-primary/20" : "bg-background/80 backdrop-blur-md text-foreground rounded-tl-none border border-border/60"}`, children: msg.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground mt-1 font-medium px-1", children: new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  }) })
                ] }, msg.id))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-white/5 bg-black/10 dark:bg-white/5 backdrop-blur-md relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Type a message...", value: chatMsg, onChange: (e) => setChatMsg(e.target.value), onKeyDown: (e) => e.key === "Enter" && sendChatMutation.mutate(), className: "bg-background/60 backdrop-blur-md border-border/60 rounded-xl h-10 px-4 focus:ring-2 focus:ring-primary/30 transition-all text-sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", onClick: () => sendChatMutation.mutate(), disabled: sendChatMutation.isPending || !chatMsg.trim(), className: "rounded-xl h-10 w-10 bg-brand-gradient shadow-glow hover:scale-105 transition-transform shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 border border-border/60 relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-32 w-32 bg-amber-400/10 blur-3xl rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 font-bold text-lg mb-6 relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 bg-amber-400/20 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-4 w-4 text-amber-400" }) }),
                "Competition Polls"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5 relative z-10", children: candidates.map((c) => {
                const count = voteStats[c] || 0;
                const total = Object.values(voteStats).reduce((a, b) => a + b, 0) || 1;
                const percent = Math.round(count / total * 100);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm", children: c }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground bg-background/50 px-2.5 py-0.5 rounded-full border border-border/60", children: [
                      count,
                      " (",
                      percent,
                      "%)"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-10 w-full rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden group cursor-pointer border border-border/60 hover:border-primary/40 transition-colors", onClick: () => voteMutation.mutate(c), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 bg-brand-gradient transition-all duration-1000 ease-out", style: {
                      width: `${Math.max(percent, 2)}%`
                    } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center font-bold text-xs text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[2px]", children: "Click to Vote" })
                  ] })
                ] }, c);
              }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "gallery", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 border border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5 text-primary" }),
                  " Live Event Gallery"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Photos from official photographers and crowd contributions." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-brand-gradient text-white rounded-xl shadow-glow text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Scan, { className: "h-3.5 w-3.5 mr-1.5" }),
                " Find My Photos (AI)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square rounded-xl bg-muted/50 border border-border/40 overflow-hidden relative group cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "secondary", className: "rounded-full text-[9px] font-bold uppercase tracking-widest", children: "View" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-gradient-to-br from-primary/10 to-transparent" })
            ] }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: "Facial Recognition Enabled" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "AI auto-tags students in photos. Upload a selfie to find yours!" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "rounded-xl font-bold text-xs shrink-0", children: "Setup" })
            ] })
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:sticky lg:top-4 h-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 border border-border/60 shadow-xl relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-24 w-24 bg-primary/10 blur-3xl -mr-12 -mt-12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-4 w-4" }),
          " Select Your Pass"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: tiers.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(i), className: `w-full rounded-2xl border-2 p-4 text-left transition-all ${selected === i ? "border-primary bg-primary/5 shadow-glow" : "border-border/60 hover:border-primary/40 bg-muted/10"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: t.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg text-primary", children: formatPrice(t.price) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1", children: t.perks.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-1 rounded-full bg-primary" }),
            " ",
            p
          ] }, p)) })
        ] }, t.name)) }),
        !isEligible && !hasTicket && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-xl bg-destructive/10 p-3 border border-destructive/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-destructive font-bold text-center leading-tight", children: [
          "Exclusive to students of ",
          event.college_name,
          ".",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70 font-medium", children: "Verify your profile to gain access." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setPaymentOpen(true), disabled: hasTicket || !isEligible, size: "lg", className: "mt-6 h-14 w-full rounded-xl bg-brand-gradient text-white font-bold text-base shadow-glow hover:opacity-90 disabled:opacity-50", children: hasTicket ? "Ticket Booked ✅" : !isEligible ? "Restricted Access" : "Get Pass Now" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest", children: "Instant QR • Secured via WeFest Escrow" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentDialog, { open: paymentOpen, onOpenChange: setPaymentOpen, amountInr: tiers[selected].price, itemTitle: `${event.title} - ${tiers[selected].name}`, itemDescription: "Event Pass", purchase: {
      kind: "ticket",
      eventId: event.id,
      tier: tiers[selected].name
    } })
  ] });
}
export {
  StudentEventDetail as component
};
