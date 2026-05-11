import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CertificateTemplate } from "@/components/certificate-template";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  QrCode, Loader2, Trophy, Star, Medal, Zap, Award, 
  Download, ExternalLink, Image as ImageIcon, Sparkles, ShieldCheck,
  Bell, BellOff, Calendar, Settings, Ticket
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/_student/tickets")({
  head: () => ({ meta: [{ title: "My tickets — WeFest" }, { name: "description", content: "Your WeFest tickets and QR codes." }] }),
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }
    }
  },
  component: Tickets,
});

function Tickets() {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ["my-tickets-full"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to view tickets");

      const { data: ticketsData, error: ticketsError } = await supabase
        .from("tickets")
        .select(`
          *,
          events (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (ticketsError) throw ticketsError;
      
      const { data: visits } = await supabase
        .from("sponsor_booth_visits")
        .select("*")
        .eq("student_user_id", user.id);

      const { data: memories } = await supabase
        .from("digital_memories")
        .select("*")
        .eq("user_id", user.id);

      const { data: notificationLogs } = await supabase
        .from("notification_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      return { 
        tickets: ticketsData, 
        visits: visits || [], 
        memories: memories || [],
        notifications: notificationLogs || []
      };
    }
  });

  const { data: currentUser } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const mintMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      const serialNumber = Math.floor(Math.random() * 1000) + 1;
      const { error } = await supabase.from("digital_memories").insert({
        user_id: user!.id,
        event_id: eventId,
        metadata: {
          rarity: serialNumber < 10 ? "Legendary" : serialNumber < 100 ? "Epic" : "Common",
          edition: "Genesis",
          serial: `#${serialNumber}`,
          verified_by: "WeFest Blockchain Registry"
        }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tickets-full"] });
      toast.success("Memory Minted!", { description: "Your digital souvenir is now live." });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to mint memory.");
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-6 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your tickets...</p>
      </div>
    );
  }

  const myTickets = tickets?.tickets || [];
  const myVisits = tickets?.visits || [];
  const myMemories = tickets?.memories || [];
  
  const festPoints = (myTickets.length * 100) + (myVisits.length * 50) + (myMemories.length * 200);
  const currentLevel = Math.floor(festPoints / 300) + 1;
  const progressToNext = (festPoints % 300) / 300 * 100;

  const badges = [];
  if (myTickets.length >= 1) badges.push({ name: "Early Bird", icon: Zap, color: "text-amber-400" });
  if (myTickets.length >= 3) badges.push({ name: "Fest Hopper", icon: Trophy, color: "text-emerald-400" });
  if (myVisits.length >= 1) badges.push({ name: "Social Butterfly", icon: Star, color: "text-blue-400" });
  if (myMemories.length >= 1) badges.push({ name: "Collector", icon: Sparkles, color: "text-primary" });
  if (festPoints > 1000) badges.push({ name: "Campus Legend", icon: Medal, color: "text-purple-400" });

  return (
    <div className="container mx-auto max-w-3xl px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass rounded-[2.5rem] p-10 mb-10 overflow-hidden relative border border-white/5 group">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gradient opacity-10 blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary opacity-10 blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start justify-between relative z-10">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-brand-gradient blur-md opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="h-24 w-24 relative rounded-[2rem] bg-brand-gradient p-1 shadow-glow flex-shrink-0">
                <div className="h-full w-full rounded-[1.8rem] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground -mb-1">Level</div>
                  <div className="text-4xl font-black bg-brand-gradient bg-clip-text text-transparent">{currentLevel}</div>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-4xl font-black tracking-tight truncate">{currentUser?.user_metadata?.full_name || "Student"}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="text-primary font-bold text-sm flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
                  <Star className="h-3.5 w-3.5" /> {festPoints} Fest Points
                </div>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{myTickets.length} Festivals attended</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 pt-4 glass-panel p-4 rounded-2xl border-white/5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              <span className="text-foreground">L{currentLevel} Progress</span>
              <span>L{currentLevel + 1}</span>
            </div>
            <div className="h-3 w-full bg-background/50 overflow-hidden rounded-full border border-white/5 p-0.5 shadow-inner">
              <div className="h-full bg-brand-gradient transition-all duration-1000 ease-out rounded-full shadow-glow relative" style={{ width: `${progressToNext}%` }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="text-[10px] font-bold text-primary mt-2 text-right">{300 - (festPoints % 300)} pts to next rank</div>
          </div>
        </div>

        {badges.length > 0 && (
          <div className="mt-10 pt-10 border-t border-border/40">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Achievements Unlocked</div>
            <div className="flex flex-wrap gap-3">
              {badges.map(b => (
                <div key={b.name} className="flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/20 px-4 py-2 text-xs font-bold transition-transform hover:scale-105 cursor-default">
                  <b.icon className={`h-4 w-4 ${b.color}`} /> {b.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="tickets" className="mt-8">
        <TabsList className="mb-8 bg-muted/50 p-1 rounded-2xl h-14 border border-border/40">
          <TabsTrigger value="tickets" className="rounded-xl px-6 h-full font-bold data-[state=active]:bg-background">My Tickets</TabsTrigger>
          <TabsTrigger value="certificates" className="rounded-xl px-6 h-full font-bold data-[state=active]:bg-background">Certificates</TabsTrigger>
          <TabsTrigger value="memories" className="rounded-xl px-6 h-full font-bold data-[state=active]:bg-background">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Digital Memories
            </div>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 h-full font-bold data-[state=active]:bg-background">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6">
            {myTickets.length > 0 ? (
              myTickets.map((t: any) => (
                <div key={t.id} className="relative group perspective-1000">
                  {/* Ticket Container */}
                  <div className="glass overflow-hidden rounded-[2.5rem] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
                    <div className="flex flex-col md:flex-row">
                      {/* Left Side: Event Details */}
                      <div className="flex-1 p-8 md:pr-12 relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                          <Ticket className="h-32 w-32 rotate-12" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 shadow-sm">
                            {t.tier}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background/50 backdrop-blur-md px-3 py-1 rounded-lg">
                            No. {t.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="mt-2 font-display text-3xl font-black group-hover:text-primary transition-colors duration-300 drop-shadow-sm">{t.events?.title || "Unknown Event"}</h3>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 opacity-70" /> {t.events?.date ? format(new Date(t.events.date), "EEE, MMM dd, yyyy") : "No date"}</span>
                        </div>
                        
                        <div className="mt-8 flex items-center gap-3">
                          <Button size="sm" variant="secondary" className="rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <ExternalLink className="mr-2 h-3.5 w-3.5" /> View Event Details
                          </Button>
                          <Button size="icon" variant="ghost" className="rounded-xl h-9 w-9 text-muted-foreground hover:text-primary bg-muted/30" title="Reminder Settings">
                            <Bell className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Right Side: QR Code (Separated by dashed line in CSS visually) */}
                      <div className="relative p-8 md:pl-12 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 border-t md:border-t-0 md:border-l border-dashed border-border/40">
                        {/* Perforations (decorative) */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background hidden md:block border-r border-border/40" />
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background md:hidden border-b border-border/40" />
                        
                        <div className="grid h-36 w-36 shrink-0 place-items-center rounded-[2rem] bg-white text-black p-3 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          <QrCode className="h-full w-full" />
                        </div>
                        <code className="mt-4 rounded-xl bg-background/80 backdrop-blur-md px-4 py-2 text-sm font-black tracking-widest text-foreground border border-border/40 shadow-sm text-center">
                          {t.code}
                        </code>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-3 text-center">
                          Scan at entry
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass rounded-[3rem] p-16 text-center border-dashed border-2 border-border/60">
                <div className="mx-auto h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <Ticket className="h-10 w-10 text-primary opacity-50" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Your wallet is empty</h3>
                <p className="text-muted-foreground font-medium mb-8 max-w-md mx-auto">You haven't booked any tickets yet. Browse upcoming festivals and secure your spot.</p>
                <Link to="/events" className="inline-flex items-center gap-2 bg-brand-gradient text-white px-8 py-3 rounded-full font-bold shadow-glow hover:scale-105 transition-transform">
                  Browse Festivals <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6">
            {myTickets.length > 0 ? (
              myTickets.map((t: any) => (
                <div key={`cert-${t.id}`} className="glass group overflow-hidden rounded-[2.5rem] border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-8 gap-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-[1.2rem] blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="h-16 w-16 relative rounded-[1.2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner group-hover:scale-105">
                          <Award className="h-8 w-8" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors">{t.events?.title || "Unknown Event"}</h3>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Participation Certificate
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="rounded-xl font-bold bg-background/50 backdrop-blur-sm border-white/10 hover:bg-muted/50">
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl border-none bg-transparent p-0">
                          <CertificateTemplate 
                            studentName={currentUser?.user_metadata?.full_name || "Student"}
                            eventName={t.events?.title || "Event Participant"}
                            date={t.events?.date ? format(new Date(t.events.date), "MMMM dd, yyyy") : "2026"}
                            certificateId={`CERT-${t.id.slice(0, 8).toUpperCase()}`}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow px-6 hover:scale-105 transition-transform" onClick={() => {
                        toast.success("Certificate download started");
                        window.print();
                      }}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass rounded-[3rem] p-16 text-center border-dashed border-2 border-border/60">
                <div className="mx-auto h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <Award className="h-10 w-10 text-primary opacity-50" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">No certificates yet</h3>
                <p className="text-muted-foreground font-medium mb-8 max-w-md mx-auto">Attend an event and complete your participation to unlock verified certificates here.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="memories" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myTickets.map((t: any) => {
              const memoryRow: any = myMemories.find((m: any) => m.event_id === t.id);
              const memory = memoryRow ? { ...memoryRow, metadata: (memoryRow.metadata || {}) as any } : null;
              
              return (
                <div key={`memory-${t.id}`} className="group perspective-1000">
                  <div className="glass rounded-[2.5rem] p-6 border border-white/10 overflow-hidden relative transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 h-full flex flex-col">
                    {memory ? (
                      <>
                        <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700" />
                        <div className="relative z-10 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-6">
                            <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${
                              memory.metadata.rarity === 'Legendary' ? 'bg-amber-400/10 border-amber-400/30 text-amber-500' : 
                              memory.metadata.rarity === 'Epic' ? 'bg-purple-400/10 border-purple-400/30 text-purple-500' : 
                              'bg-primary/10 border-primary/30 text-primary'
                            }`}>
                              {memory.metadata.rarity}
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
                              {memory.metadata.serial}
                            </span>
                          </div>
                          
                          <div className="aspect-square rounded-[2rem] bg-black/80 dark:bg-black/40 border border-white/10 overflow-hidden mb-6 flex items-center justify-center relative shadow-inner group-hover:rotate-1 transition-transform duration-700">
                            <div className={`absolute inset-0 opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-50 ${
                               memory.metadata.rarity === 'Legendary' ? 'bg-amber-400' : 
                               memory.metadata.rarity === 'Epic' ? 'bg-purple-400' : 
                               'bg-primary'
                            }`} />
                            <ImageIcon className="h-16 w-16 text-white/20 group-hover:scale-110 transition-transform duration-700 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 z-20 shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 line-clamp-1">{t.events?.title}</div>
                              <div className="text-sm font-bold text-white drop-shadow-md">Official Genesis Edition</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span className="text-foreground/80">{memory.metadata.edition} Edition</span>
                            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                        <div className="h-20 w-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 text-muted-foreground border border-white/5 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          <Sparkles className="h-10 w-10 opacity-30 group-hover:text-primary group-hover:opacity-100 transition-colors duration-500" />
                        </div>
                        <h4 className="font-display text-xl font-bold mb-2">Mint This Memory</h4>
                        <p className="text-sm text-muted-foreground mb-8">Create a permanent digital record of your attendance at <span className="font-medium text-foreground">{t.events?.title}</span>.</p>
                        <Button 
                          size="lg" 
                          className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest bg-brand-gradient text-white hover:scale-105 transition-transform shadow-glow border border-white/10"
                          onClick={() => mintMutation.mutate(t.id)}
                          disabled={mintMutation.isPending}
                        >
                          {mintMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Minting...</> : <>Mint Memory <Sparkles className="ml-2 h-4 w-4" /></>}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <div className="glass rounded-[2.5rem] p-8 border border-border/60">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl font-bold">Recent Alerts</h3>
              <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mark all as read</Button>
            </div>
            <div className="space-y-4">
              {tickets?.notifications && tickets.notifications.length > 0 ? (
                tickets.notifications.map((n: any) => (
                  <div key={n.id} className={`flex gap-4 p-4 rounded-2xl border ${n.is_read ? 'bg-muted/20 border-border/40' : 'bg-primary/5 border-primary/20'} transition-all`}>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${n.is_read ? 'bg-muted text-muted-foreground' : 'bg-primary text-white shadow-glow'}`}>
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{n.title}</div>
                      <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
                      <div className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest">{format(new Date(n.created_at), "MMM dd, hh:mm a")}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <BellOff className="h-8 w-8 opacity-20" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">No new notifications.</p>
                  <p className="text-xs text-muted-foreground mt-1">We'll alert you about upcoming fests and ticket updates!</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border border-border/60">
            <h3 className="font-display text-xl font-bold mb-6">Preference Center</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">Push Notifications</div>
                  <div className="text-xs text-muted-foreground">Get real-time alerts for schedule changes</div>
                </div>
                <div className="h-6 w-10 rounded-full bg-primary p-1 flex justify-end cursor-pointer">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-6">
                <div>
                  <div className="font-bold text-sm">Email Digest</div>
                  <div className="text-xs text-muted-foreground">Weekly summary of upcoming campus fests</div>
                </div>
                <div className="h-6 w-10 rounded-full bg-muted p-1 flex justify-start cursor-pointer">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
