import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Users, ArrowLeft, Ticket as TicketIcon, 
  Loader2, MessageSquare, Trophy, Send, Sparkles, TrendingUp,
  Image as ImageIcon, Camera, Scan, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { useRegion } from "@/contexts/RegionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PaymentDialog } from "@/components/wallet/payment-dialog";
import { payForTicketWithWallet } from "@/lib/wallet.functions";

export const Route = createFileRoute("/_student/explore/$eventId")({
  loader: async ({ params }) => {
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.eventId)
      .single();
    
    if (error || !event) throw notFound();
    return event;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — WeFest` : "Event — WeFest" },
      { name: "description", content: loaderData?.description ?? "Festival on WeFest" },
    ],
  }),
  errorComponent: ({ error }) => <div className="px-6 py-20">{error.message}</div>,
  notFoundComponent: () => <div className="px-6 py-20 text-center">
    <h1 className="text-2xl font-bold">Event not found</h1>
    <Link to="/explore" className="mt-4 text-primary hover:underline inline-block">Return to explore</Link>
  </div>,
  component: StudentEventDetail,
});

function StudentEventDetail() {
  const event = Route.useLoaderData();
  
  const tiers = useMemo(() => {
    const settings = (event as any).pass_settings;
    if (!settings) {
      return [
        { name: "Day Pass", price: 499, perks: ["Single day access", "All open events"] },
        { name: "Pro Pass", price: 1499, perks: ["All 4 days", "Priority entry", "Pro shows"] },
        { name: "VIP", price: 3999, perks: ["All access", "Backstage tour", "Merch kit"] },
      ];
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

  const [selected, setSelected] = useState(0);
  const [chatMsg, setChatMsg] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const queryClient = useQueryClient();
  const { formatPrice } = useRegion();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: studentProfile } = useQuery({
    queryKey: ["student-profile", currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("college_id")
        .eq("id", currentUser!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  const { data: hasTicket } = useQuery({
    queryKey: ["has-ticket", event.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const { data } = await supabase.from("tickets").select("id").eq("event_id", event.id).eq("user_id", currentUser!.id);
      return (data?.length || 0) > 0;
    }
  });

  const isEligible = !event.college_id || (studentProfile?.college_id === event.college_id);

  const { data: chatMessages } = useQuery({
    queryKey: ["event-chat", event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_chat_messages")
        .select("*")
        .eq("event_id", event.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: votes } = useQuery({
    queryKey: ["competition-votes", event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competition_votes")
        .select("candidate_name")
        .eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const voteStats = useMemo(() => {
    if (!votes) return {};
    return votes.reduce((acc: any, v) => {
      acc[v.candidate_name] = (acc[v.candidate_name] || 0) + 1;
      return acc;
    }, {});
  }, [votes]);

  const candidates = ["DJ Spark", "The Neon Band", "Zenith Dance Crew"];

  // If studentProfile is loaded and they are not eligible, show access denied
  if (studentProfile !== undefined && !isEligible) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <UserCheck className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Access Restricted</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          This event is exclusively for students of <span className="font-semibold text-foreground">{event.college_name}</span>. You do not have permission to view or participate in this festival.
        </p>
        <Button asChild className="bg-brand-gradient text-white font-bold shadow-glow">
          <Link to="/explore">Return to Explore</Link>
        </Button>
      </div>
    );
  }

  useEffect(() => {
    const channel = supabase
      .channel(`event-chat-${event.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'event_chat_messages',
        filter: `event_id=eq.${event.id}` 
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["event-chat", event.id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [event.id, queryClient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendChatMutation = useMutation({
    mutationFn: async () => {
      if (!chatMsg.trim()) return;
      const { error } = await supabase.from("event_chat_messages").insert({
        event_id: event.id,
        user_id: currentUser!.id,
        message: chatMsg.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => setChatMsg(""),
    onError: (err: any) => toast.error(err.message || "Must have a ticket to chat!"),
  });

  const voteMutation = useMutation({
    mutationFn: async (candidate: string) => {
      const { error } = await supabase.from("competition_votes").insert({
        event_id: event.id,
        voter_id: currentUser!.id,
        candidate_name: candidate,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competition-votes", event.id] });
      toast.success("Vote cast successfully!");
    },
    onError: (err: any) => toast.error(err.message || "One vote per student allowed."),
  });

  // Purchase flow is fully owned by <PaymentDialog/> (wallet-only / split / razorpay).

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero */}
      <div className={`relative h-[300px] bg-gradient-to-br ${event.cover}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="relative h-full px-6 sm:px-8 flex flex-col justify-between py-8 max-w-[1200px] mx-auto">
          <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group w-fit">
            <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Explore
          </Link>
          <div>
            <div className="flex gap-2 mb-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                <Sparkles className="h-3 w-3 text-amber-400" /> Premium Fest
              </div>
              {event.college_id && (
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-indigo-500/20">
                  <UserCheck className="h-3 w-3" /> Institutional
                </div>
              )}
            </div>
            <div className="text-xs font-bold text-white/60 uppercase tracking-tighter mb-1">{event.college_name} Presents</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.9]">{event.title}</h1>
            {(event as any).tags && (event as any).tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {(event as any).tags.map((tag: string) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-8 py-10 max-w-[1200px] mx-auto grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          <section>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/40 inline-flex">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(event.date).toDateString()}</span>
              {(event as any).time && (
                <span className="flex items-center gap-2 border-l border-border/40 pl-4"><Calendar className="h-4 w-4 text-primary" />{(event as any).time}</span>
              )}
              <span className="flex items-center gap-2 border-l border-border/40 pl-4"><MapPin className="h-4 w-4 text-primary" />{event.city}</span>
              {(event as any).venue && (
                <span className="flex items-center gap-2 border-l border-border/40 pl-4"><MapPin className="h-4 w-4 text-primary" />{(event as any).venue}</span>
              )}
              <span className="flex items-center gap-2 border-l border-border/40 pl-4"><Users className="h-4 w-4 text-primary" />{event.attendees.toLocaleString("en-IN")} capacity</span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-foreground/80 font-medium">{event.description}</p>
          </section>

          <section>
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="bg-muted/50 p-1 rounded-2xl h-12 border border-border/40">
                <TabsTrigger value="events" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold text-xs">Schedule</TabsTrigger>
                <TabsTrigger value="community" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold text-xs">
                  <div className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Community</div>
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold text-xs">
                  <div className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Gallery</div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="events" className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Headliner Concert", "Battle of Bands", "Stand-up Night", "Dance Showdown", "Hackathon", "Esports Arena"].map((s) => (
                    <div key={s} className="glass group rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="font-bold">{s}</div>
                        <div className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <TrendingUp className="h-3.5 w-3.5 text-primary" />
                        </div>
                      </div>
                      <div className="mt-1.5 text-xs text-muted-foreground">Multiple sessions • Open to all pass holders</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-6">
                {!hasTicket ? (
                  <div className="p-12 text-center glass rounded-2xl border-dashed border-2 border-primary/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-gradient opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700" />
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TicketIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Unlock Community Hub</h3>
                    <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">Purchase any pass to join real-time chat, vote for performers, and engage with other students.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Live Chat */}
                    <div className="flex flex-col h-[450px] glass rounded-2xl overflow-hidden border border-border/60 relative">
                      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/10 dark:bg-white/5 backdrop-blur-md relative z-10">
                        <div className="font-bold flex items-center gap-2 text-sm">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          Live Chat
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">Real-time</span>
                      </div>
                      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-hide">
                        {chatMessages?.length === 0 && (
                          <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
                            <MessageSquare className="h-10 w-10 mb-3" />
                            <p className="font-medium text-sm">Be the first to say something!</p>
                          </div>
                        )}
                        {chatMessages?.map((msg) => (
                          <div key={msg.id} className={`flex flex-col ${msg.user_id === currentUser?.id ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                              msg.user_id === currentUser?.id 
                                ? 'bg-brand-gradient text-white rounded-tr-none shadow-primary/20' 
                                : 'bg-background/80 backdrop-blur-md text-foreground rounded-tl-none border border-border/60'
                            }`}>
                              {msg.message}
                            </div>
                            <span className="text-[9px] text-muted-foreground mt-1 font-medium px-1">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-white/5 bg-black/10 dark:bg-white/5 backdrop-blur-md relative z-10">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Type a message..." 
                            value={chatMsg}
                            onChange={(e) => setChatMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendChatMutation.mutate()}
                            className="bg-background/60 backdrop-blur-md border-border/60 rounded-xl h-10 px-4 focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                          />
                          <Button 
                            size="icon" 
                            onClick={() => sendChatMutation.mutate()}
                            disabled={sendChatMutation.isPending || !chatMsg.trim()}
                            className="rounded-xl h-10 w-10 bg-brand-gradient shadow-glow hover:scale-105 transition-transform shrink-0"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Live Voting */}
                    <div className="glass rounded-2xl p-6 border border-border/60 relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-32 w-32 bg-amber-400/10 blur-3xl rounded-full" />
                      <div className="flex items-center gap-2.5 font-bold text-lg mb-6 relative z-10">
                        <div className="h-8 w-8 bg-amber-400/20 rounded-xl flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-amber-400" /> 
                        </div>
                        Competition Polls
                      </div>
                      <div className="space-y-5 relative z-10">
                        {candidates.map((c) => {
                          const count = voteStats[c] || 0;
                          const total = Object.values(voteStats).reduce((a: any, b: any) => a + b, 0) as number || 1;
                          const percent = Math.round((count / total) * 100);
                          return (
                            <div key={c} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">{c}</span>
                                <span className="text-xs font-medium text-muted-foreground bg-background/50 px-2.5 py-0.5 rounded-full border border-border/60">{count} ({percent}%)</span>
                              </div>
                              <div className="relative h-10 w-full rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden group cursor-pointer border border-border/60 hover:border-primary/40 transition-colors" onClick={() => voteMutation.mutate(c)}>
                                <div className="absolute inset-y-0 left-0 bg-brand-gradient transition-all duration-1000 ease-out" style={{ width: `${Math.max(percent, 2)}%` }} />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[2px]">
                                  Click to Vote
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <div className="glass rounded-2xl p-6 border border-border/60">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Camera className="h-5 w-5 text-primary" /> Live Event Gallery
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Photos from official photographers and crowd contributions.</p>
                    </div>
                    <Button size="sm" className="bg-brand-gradient text-white rounded-xl shadow-glow text-xs">
                      <Scan className="h-3.5 w-3.5 mr-1.5" /> Find My Photos (AI)
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square rounded-xl bg-muted/50 border border-border/40 overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="secondary" className="rounded-full text-[9px] font-bold uppercase tracking-widest">View</Button>
                        </div>
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-transparent" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">Facial Recognition Enabled</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">AI auto-tags students in photos. Upload a selfie to find yours!</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs shrink-0">Setup</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        {/* Ticket Sidebar */}
        <aside className="lg:sticky lg:top-4 h-fit">
          <div className="glass rounded-2xl p-6 border border-border/60 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 blur-3xl -mr-12 -mt-12" />
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-6">
              <TicketIcon className="h-4 w-4" /> Select Your Pass
            </div>
            <div className="space-y-3">
              {tiers.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setSelected(i)}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                    selected === i 
                      ? "border-primary bg-primary/5 shadow-glow" 
                      : "border-border/60 hover:border-primary/40 bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold">{t.name}</div>
                    <div className="font-black text-lg text-primary">{formatPrice(t.price)}</div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                        <div className="h-1 w-1 rounded-full bg-primary" /> {p}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            {!isEligible && !hasTicket && (
              <div className="mt-4 rounded-xl bg-destructive/10 p-3 border border-destructive/20">
                <p className="text-[10px] text-destructive font-bold text-center leading-tight">
                  Exclusive to students of {event.college_name}.<br/>
                  <span className="opacity-70 font-medium">Verify your profile to gain access.</span>
                </p>
              </div>
            )}
            <Button
              onClick={() => setPaymentOpen(true)}
              disabled={hasTicket || !isEligible}
              size="lg"
              className="mt-6 h-14 w-full rounded-xl bg-brand-gradient text-white font-bold text-base shadow-glow hover:opacity-90 disabled:opacity-50"
            >
              {hasTicket ? "Ticket Booked ✅" : !isEligible ? "Restricted Access" : "Get Pass Now"}
            </Button>
            <p className="mt-3 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              Instant QR • Secured via WeFest Escrow
            </p>
          </div>
        </aside>
      </div>

      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amountInr={tiers[selected].price}
        itemTitle={`${event.title} - ${tiers[selected].name}`}
        itemDescription="Event Pass"
        purchase={{ kind: "ticket", eventId: event.id, tier: tiers[selected].name }}
      />
    </div>
  );
}
