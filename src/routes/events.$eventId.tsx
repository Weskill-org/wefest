import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
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

export const Route = createFileRoute("/events/$eventId")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw redirect({
        to: "/signup",
      });
    }
  },
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
  errorComponent: ({ error }) => <div className="container py-20">{error.message}</div>,
  notFoundComponent: () => <div className="container py-20 text-center">
    <h1 className="text-2xl font-bold">Event not found</h1>
    <Link to="/events" className="mt-4 text-primary hover:underline inline-block">Return to events</Link>
  </div>,
  component: EventDetail,
});

const tiers = [
  { name: "Day Pass", price: 499, perks: ["Single day access", "All open events"] },
  { name: "Pro Pass", price: 1499, perks: ["All 4 days", "Priority entry", "Pro shows"] },
  { name: "VIP", price: 3999, perks: ["All access", "Backstage tour", "Merch kit"] },
];

function EventDetail() {
  const event = Route.useLoaderData();
  const [selected, setSelected] = useState(1);
  const [chatMsg, setChatMsg] = useState("");
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
        .select("*, auth_users:user_id(id)") // Note: user metadata might be hidden, so we just get ID
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

  // Real-time Chat Subscription
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id, queryClient]);

  // Scroll to bottom on new messages
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
    onSuccess: () => {
      setChatMsg("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Must have a ticket to chat!");
    }
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
    onError: (err: any) => {
      toast.error(err.message || "One vote per student allowed.");
    }
  });

  const buyMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("Please login to book tickets");

      // Institutional Restriction Check
      if (event.college_id && studentProfile?.college_id !== event.college_id) {
        throw new Error(`This event is exclusive to students of ${event.college_name}.`);
      }

      const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      const { error } = await supabase.from("tickets").insert({
        user_id: currentUser.id,
        event_id: event.id,
        tier: tiers[selected].name,
        code: ticketCode,
      });

      if (error) throw error;
      return { tier: tiers[selected].name, code: ticketCode };
    },
    onSuccess: (data) => {
      toast.success(`Success! ${data.tier} booked. Your code: ${data.code}`);
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["has-ticket", event.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to book ticket");
    },
  });

  return (
    <div>
      <div className={`relative h-[400px] bg-gradient-to-br ${event.cover}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="container relative mx-auto h-full px-6 flex flex-col justify-between py-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group">
            <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Explore
          </Link>
          <div>
            <div className="flex gap-2 mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                <Sparkles className="h-3 w-3 text-amber-400" /> Premium Fest Experience
              </div>
              {event.college_id && (
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-indigo-500/20">
                  <UserCheck className="h-3 w-3" /> Institutional Event
                </div>
              )}
            </div>
            <div className="text-sm font-bold text-white/60 uppercase tracking-tighter mb-2">{event.college_name} Presents</div>
            <h1 className="font-display text-6xl font-black text-white md:text-8xl tracking-tight leading-[0.9]">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-10 px-6 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-16">
          <section>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/40 inline-flex">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(event.date).toDateString()}</span>
              <span className="flex items-center gap-2 border-l border-border/40 pl-6"><MapPin className="h-4 w-4 text-primary" />{event.city}</span>
              <span className="flex items-center gap-2 border-l border-border/40 pl-6"><Users className="h-4 w-4 text-primary" />{event.attendees.toLocaleString("en-IN")} capacity</span>
            </div>
            <p className="mt-8 text-xl leading-relaxed text-foreground/80 font-medium">{event.description}</p>
          </section>

          <section>
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 border border-border/40">
                <TabsTrigger value="events" className="rounded-xl px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold">Schedule</TabsTrigger>
                <TabsTrigger value="community" className="rounded-xl px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Community & Live
                  </div>
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-xl px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm h-full font-bold">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Gallery & AI Tags
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="events" className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Headliner Concert", "Battle of Bands", "Stand-up Night", "Dance Showdown", "Hackathon", "Esports Arena"].map((s) => (
                    <div key={s} className="glass group rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-lg">{s}</div>
                        <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">Multiple sessions • Open to all pass holders</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-8">
                {!hasTicket ? (
                  <div className="p-16 text-center glass rounded-[3rem] border-dashed border-2 border-primary/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-gradient opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700" />
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <TicketIcon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-display font-black">Unlock Community Hub</h3>
                    <p className="mt-4 text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">Purchase any pass to join the real-time chat, vote for your favorite performers, and engage with other students.</p>
                  </div>
                ) : (
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Live Chat */}
                    <div className="flex flex-col h-[550px] glass rounded-[3rem] overflow-hidden border border-border/60 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-50 z-0" />
                      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/10 dark:bg-white/5 backdrop-blur-md relative z-10">
                        <div className="font-bold flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                          <span className="text-lg">Live Crowd Chat</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Real-time</span>
                      </div>
                      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-hide">
                        {chatMessages?.length === 0 && (
                          <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
                            <MessageSquare className="h-12 w-12 mb-4" />
                            <p className="font-medium">Be the first to say something!</p>
                          </div>
                        )}
                        {chatMessages?.map((msg) => (
                          <div key={msg.id} className={`flex flex-col ${msg.user_id === currentUser?.id ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                            <div className={`max-w-[80%] rounded-[1.5rem] px-5 py-3 text-sm shadow-sm ${
                              msg.user_id === currentUser?.id 
                                ? 'bg-brand-gradient text-white rounded-tr-none shadow-primary/20' 
                                : 'bg-background/80 backdrop-blur-md text-foreground rounded-tl-none border border-border/60'
                            }`}>
                              {msg.message}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1.5 font-medium px-1">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-white/5 bg-black/10 dark:bg-white/5 backdrop-blur-md relative z-10">
                        <div className="flex gap-3">
                          <Input 
                            placeholder="Type a message..." 
                            value={chatMsg}
                            onChange={(e) => setChatMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendChatMutation.mutate()}
                            className="bg-background/60 backdrop-blur-md border-border/60 rounded-[1.5rem] h-12 px-5 focus:ring-2 focus:ring-primary/30 transition-all"
                          />
                          <Button 
                            size="icon" 
                            onClick={() => sendChatMutation.mutate()}
                            disabled={sendChatMutation.isPending || !chatMsg.trim()}
                            className="rounded-[1.2rem] h-12 w-12 bg-brand-gradient shadow-glow hover:scale-105 transition-transform"
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Live Voting */}
                    <div className="glass rounded-[3rem] p-10 border border-border/60 relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-40 w-40 bg-amber-400/10 blur-3xl rounded-full" />
                      <div className="flex items-center gap-3 font-bold text-2xl mb-10 relative z-10">
                        <div className="h-10 w-10 bg-amber-400/20 rounded-xl flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-amber-400" /> 
                        </div>
                        Competition Polls
                      </div>
                      <div className="space-y-8 relative z-10">
                        {candidates.map((c) => {
                          const count = voteStats[c] || 0;
                          const total = Object.values(voteStats).reduce((a: any, b: any) => a + b, 0) as number || 1;
                          const percent = Math.round((count / total) * 100);

                          return (
                            <div key={c} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-lg">{c}</span>
                                <span className="text-sm font-medium text-muted-foreground bg-background/50 px-3 py-1 rounded-full border border-border/60 shadow-sm">{count} votes ({percent}%)</span>
                              </div>
                              <div className="relative h-14 w-full rounded-[1.5rem] bg-black/5 dark:bg-white/5 overflow-hidden group cursor-pointer border border-border/60 hover:border-primary/40 transition-colors" onClick={() => voteMutation.mutate(c)}>
                                <div 
                                  className="absolute inset-y-0 left-0 bg-brand-gradient transition-all duration-1000 ease-out" 
                                  style={{ width: `${Math.max(percent, 2)}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12" style={{backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'}} />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[2px]">
                                  Click to Vote
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-12 p-8 rounded-[2rem] bg-primary/5 border border-primary/10 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Crowd Pulse</h4>
                          <span className="text-sm text-foreground font-medium flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live voting active
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-10 rounded-full bg-muted border-2 border-background shadow-sm" />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="gallery" className="mt-8">
                <div className="glass rounded-[3rem] p-10 border border-border/60">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                      <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                        <Camera className="h-6 w-6 text-primary" /> Live Event Gallery
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Photos from official photographers and crowd contributions.</p>
                    </div>
                    <Button className="bg-brand-gradient text-white rounded-xl shadow-glow">
                      <Scan className="h-4 w-4 mr-2" /> Find My Photos (AI)
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-muted/50 border border-border/40 overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="secondary" className="rounded-full text-[10px] font-bold uppercase tracking-widest">View Full</Button>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-background/80 backdrop-blur-md rounded-lg p-1.5 border border-white/10">
                            <UserCheck className="h-3 w-3 text-emerald-500" />
                          </div>
                        </div>
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-transparent" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="font-bold">Facial Recognition Enabled</div>
                      <p className="text-xs text-muted-foreground mt-1">Our AI is automatically tagging students in photos. Upload a selfie to instantly find every photo you're in across the entire festival!</p>
                    </div>
                    <Button variant="outline" className="md:ml-auto rounded-xl font-bold">Setup AI Tagging</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        <aside className="sticky top-24 h-fit">
          <div className="glass rounded-[2.5rem] p-8 border border-border/60 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-primary mb-8">
              <TicketIcon className="h-5 w-5" /> Select Your Pass
            </div>
            <div className="space-y-4">
              {tiers.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setSelected(i)}
                  className={`w-full rounded-3xl border-2 p-6 text-left transition-all ${
                    selected === i 
                      ? "border-primary bg-primary/5 shadow-glow" 
                      : "border-border/60 hover:border-primary/40 bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-lg">{t.name}</div>
                    <div className="font-black text-xl text-primary">{formatPrice(t.price)}</div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                        <div className="h-1 w-1 rounded-full bg-primary" /> {p}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            {!isEligible && !hasTicket && (
              <div className="mt-6 rounded-2xl bg-destructive/10 p-4 border border-destructive/20">
                <p className="text-xs text-destructive font-bold text-center leading-tight">
                  Exclusive to students of {event.college_name}.<br/>
                  <span className="opacity-70 font-medium">Verify your profile to gain access.</span>
                </p>
              </div>
            )}
            <Button 
              onClick={() => buyMutation.mutate()} 
              disabled={buyMutation.isPending || hasTicket || !isEligible}
              size="lg" 
              className="mt-8 h-16 w-full rounded-2xl bg-brand-gradient text-white font-bold text-lg shadow-glow hover:opacity-90 disabled:opacity-50"
            >
              {buyMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : hasTicket ? "Ticket Booked ✅" : !isEligible ? "Restricted Access" : "Get Pass Now"}
            </Button>
            <p className="mt-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Instant QR • Secured via WeFest Escrow
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
