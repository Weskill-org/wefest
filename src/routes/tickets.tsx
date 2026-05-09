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
  Bell, BellOff, Calendar, Settings
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "My tickets — WeFest" }, { name: "description", content: "Your WeFest tickets and QR codes." }] }),
  beforeLoad: async ({ location }) => {
    // Skip redirect on server to prevent redirect-on-refresh bug
    if (typeof window === 'undefined') return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
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
    <div className="container mx-auto max-w-3xl px-6 py-12">
      <div className="glass rounded-[2.5rem] p-10 mb-10 overflow-hidden relative border border-white/5">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gradient opacity-10 blur-3xl" />
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-[2rem] bg-brand-gradient p-1 shadow-glow flex-shrink-0">
              <div className="h-full w-full rounded-[1.8rem] bg-background flex flex-col items-center justify-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground -mb-1">Level</div>
                <div className="text-3xl font-black">{currentLevel}</div>
              </div>
            </div>
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight">{currentUser?.user_metadata?.full_name || "Student"}</h1>
              <div className="mt-2 flex items-center gap-3">
                <div className="text-primary font-bold text-sm flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Star className="h-3.5 w-3.5" /> {festPoints} Fest Points
                </div>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{myTickets.length} Festivals attended</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 pt-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              <span>L{currentLevel} Progress</span>
              <span>L{currentLevel + 1}</span>
            </div>
            <div className="h-3 w-full bg-muted overflow-hidden rounded-full border border-white/5 p-0.5">
              <div className="h-full bg-brand-gradient transition-all rounded-full shadow-glow" style={{ width: `${progressToNext}%` }} />
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

        <TabsContent value="tickets">
          <div className="grid gap-6">
            {myTickets.length > 0 ? (
              myTickets.map((t: any) => (
                <div key={t.id} className="glass flex items-center gap-8 rounded-3xl p-6 border border-border/60 group">
                  <div className="grid h-32 w-32 shrink-0 place-items-center rounded-2xl bg-white text-black p-2 shadow-xl group-hover:rotate-3 transition-transform">
                    <QrCode className="h-full w-full" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 rounded-md bg-primary/5 border border-primary/20">
                        {t.tier}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">ID: {t.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-black">{t.events?.title || "Unknown Event"}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Calendar className="h-4 w-4" /> {t.events?.date ? format(new Date(t.events.date), "EEE, MMM dd, yyyy") : "No date"}
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <code className="rounded-xl bg-muted px-4 py-2 text-xs font-black tracking-widest text-foreground/80 border border-border/40">
                        {t.code}
                      </code>
                      <Button size="sm" variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:text-primary">
                        Share Ticket
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary ml-auto" title="Reminder Settings">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass rounded-[3rem] p-16 text-center border-dashed border-2 border-border/60">
                <p className="text-muted-foreground font-medium">Your ticket wallet is empty.</p>
                <Link to="/events" className="mt-6 inline-flex items-center gap-2 bg-brand-gradient text-white px-8 py-3 rounded-full font-bold shadow-glow hover:opacity-90">
                  Browse Festivals <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="certificates">
          <div className="grid gap-6">
            {myTickets.length > 0 ? (
              myTickets.map((t: any) => (
                <div key={`cert-${t.id}`} className="glass group overflow-hidden rounded-[2.5rem] border border-border/60 hover:border-primary/40 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-8 gap-6">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[1.2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <Award className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold">{t.events?.title || "Unknown Event"}</h3>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified Participation Certificate
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="rounded-xl font-bold">
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
                      <Button className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow px-6" onClick={() => {
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
              <div className="glass rounded-[3rem] p-16 text-center text-muted-foreground font-medium">
                Attend an event to earn verified certificates.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="memories">
          <div className="grid gap-6 sm:grid-cols-2">
            {myTickets.map((t: any) => {
              const memoryRow: any = myMemories.find((m: any) => m.event_id === t.id);
              const memory = memoryRow ? { ...memoryRow, metadata: (memoryRow.metadata || {}) as any } : null;
              
              return (
                <div key={`memory-${t.id}`} className="glass rounded-[2.5rem] p-8 border border-border/60 overflow-hidden relative group">
                  {memory ? (
                    <>
                      <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                            memory.metadata.rarity === 'Legendary' ? 'bg-amber-400/10 border-amber-400/30 text-amber-500' : 
                            memory.metadata.rarity === 'Epic' ? 'bg-purple-400/10 border-purple-400/30 text-purple-500' : 
                            'bg-primary/10 border-primary/30 text-primary'
                          }`}>
                            {memory.metadata.rarity}
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground">{memory.metadata.serial}</span>
                        </div>
                        
                        <div className="aspect-square rounded-[2rem] bg-slate-900 border border-white/5 overflow-hidden mb-6 flex items-center justify-center relative shadow-inner">
                          <div className={`absolute inset-0 opacity-20 blur-2xl ${
                             memory.metadata.rarity === 'Legendary' ? 'bg-amber-400' : 
                             memory.metadata.rarity === 'Epic' ? 'bg-purple-400' : 
                             'bg-primary'
                          }`} />
                          <ImageIcon className="h-20 w-20 text-white/10" />
                          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.events?.title}</div>
                            <div className="text-sm font-bold text-white mt-1">Official Genesis Edition</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <span>{memory.metadata.edition} Edition</span>
                          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <div className="h-16 w-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 text-muted-foreground">
                        <Sparkles className="h-8 w-8 opacity-20" />
                      </div>
                      <h4 className="font-bold mb-2">Mint This Memory</h4>
                      <p className="text-xs text-muted-foreground mb-8 max-w-[200px]">Create a permanent digital record of your attendance at {t.events?.title}.</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full px-8 font-black text-[10px] uppercase tracking-widest hover:bg-brand-gradient hover:text-white transition-all shadow-glow"
                        onClick={() => mintMutation.mutate(t.id)}
                        disabled={mintMutation.isPending}
                      >
                        {mintMutation.isPending ? "Minting..." : "Mint Memory +200 XP"}
                      </Button>
                    </div>
                  )}
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
