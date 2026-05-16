import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Bell, BellOff, Calendar, Ticket, TrendingUp, CheckCircle2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/_student/tickets")({
  head: () => ({ meta: [{ title: "My Tickets — WeFest" }, { name: "description", content: "Your WeFest tickets and QR codes." }] }),
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
  const [printingCert, setPrintingCert] = useState<any>(null);

  useEffect(() => {
    if (printingCert) {
      // Increase delay to ensure images (logo-gold.png) and fonts are fully loaded
      const timer = setTimeout(() => {
        window.print();
        setPrintingCert(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [printingCert]);

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

  const { data: currentUserProfile } = useQuery({
    queryKey: ["current-user-profile-with-college"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, colleges(name)')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return { user };
      }
      return { user, profile };
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="mt-3 text-xs text-muted-foreground">Loading your tickets…</p>
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

  const studentName = currentUserProfile?.user?.user_metadata?.full_name || currentUserProfile?.profile?.full_name || "Student";
  const collegeName = currentUserProfile?.profile?.colleges?.name;

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[900px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Tickets, certificates, and digital memories.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Level Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold">Lv. {currentLevel}</span>
            <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-brand-gradient rounded-full transition-all duration-1000" style={{ width: `${progressToNext}%` }} />
            </div>
          </div>
          {/* Points */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/15">
            <Star className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">{festPoints} pts</span>
          </div>
        </div>
      </div>

      {/* ─── Badges ─── */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map(b => (
            <div key={b.name} className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[10px] font-bold transition-transform hover:scale-105 cursor-default">
              <b.icon className={`h-3 w-3 ${b.color}`} /> {b.name}
            </div>
          ))}
        </div>
      )}

      {/* ─── Tabs ─── */}
      <Tabs defaultValue="tickets">
        <TabsList className="bg-white/[0.03] p-1 rounded-xl h-10 border border-white/5">
          <TabsTrigger value="tickets" className="rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">Tickets</TabsTrigger>
          <TabsTrigger value="certificates" className="rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">Certificates</TabsTrigger>
          <TabsTrigger value="memories" className="rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <div className="flex items-center gap-1.5"><ImageIcon className="h-3 w-3" /> Memories</div>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-4 h-full font-semibold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <div className="flex items-center gap-1.5"><Bell className="h-3 w-3" /> Alerts</div>
          </TabsTrigger>
        </TabsList>

        {/* ─── Tickets Tab ─── */}
        <TabsContent value="tickets" className="mt-6 animate-in fade-in duration-300">
          <div className="grid gap-4">
            {myTickets.length > 0 ? (
              myTickets.map((t: any) => (
                <div key={t.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Event Details */}
                    <div className="flex-1 p-5 md:pr-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">{t.tier}</span>
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">#{t.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{t.events?.title || "Unknown Event"}</h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.events?.date ? format(new Date(t.events.date), "EEE, MMM dd, yyyy") : "No date"}</span>
                      </div>
                      <div className="mt-4">
                        <Link to="/explore/$eventId" params={{ eventId: t.event_id }}>
                          <Button size="sm" variant="ghost" className="rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary px-3 h-8">
                            <ExternalLink className="mr-1.5 h-3 w-3" /> View Event
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* QR Section */}
                    <div className="relative p-5 md:pl-8 flex flex-col items-center justify-center bg-white/[0.01] border-t md:border-t-0 md:border-l border-dashed border-white/10">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background hidden md:block" />
                      <div className="grid h-28 w-28 place-items-center rounded-2xl bg-white p-2 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <QRCodeSVG 
                          value={t.code || t.id} 
                          size={96}
                          level="H"
                          includeMargin={false}
                          className="h-full w-full"
                        />
                      </div>
                      <code className="mt-3 rounded-lg bg-white/5 px-3 py-1 text-xs font-bold tracking-widest text-foreground border border-white/10 text-center">
                        {t.code}
                      </code>
                      <div className="text-[9px] text-muted-foreground/50 mt-1.5 font-medium uppercase tracking-widest">Scan at entry</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center">
                <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-sm mb-1">No tickets yet</h3>
                <p className="text-xs text-muted-foreground max-w-[280px] mx-auto mb-5">Browse upcoming festivals and secure your spot.</p>
                <Button asChild size="sm" className="bg-brand-gradient text-white rounded-lg font-semibold shadow-glow text-xs h-9 px-5">
                  <Link to="/explore">Browse Fests</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─── Certificates Tab ─── */}
        <TabsContent value="certificates" className="mt-6 animate-in fade-in duration-300">
          <div className="grid gap-4">
            {myTickets.length > 0 ? (
              myTickets.map((t: any) => (
                <div key={`cert-${t.id}`} className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{t.events?.title || "Unknown Event"}</h3>
                        <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified Participation
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-lg font-semibold text-xs h-8 border-white/10 bg-white/[0.02]">Preview</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[1120px] w-[96vw] border-none bg-[#0a0a0c] p-0 overflow-auto max-h-[90vh]">
                          <CertificateTemplate 
                            studentName={studentName}
                            eventName={t.events?.title || "Event Participant"}
                            date={t.events?.date ? format(new Date(t.events.date), "MMMM dd, yyyy") : "2026"}
                            certificateId={`CERT-${t.id.slice(0, 8).toUpperCase()}`}
                            collegeName={collegeName}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" className="bg-brand-gradient text-white rounded-lg font-semibold shadow-glow text-xs h-8 px-4" onClick={() => {
                        toast.success("Preparing certificate for download...");
                        setPrintingCert(t);
                      }}>
                        <Download className="h-3 w-3 mr-1.5" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center">
                <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-sm mb-1">No certificates yet</h3>
                <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">Attend events to unlock verified certificates.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─── Memories Tab ─── */}
        <TabsContent value="memories" className="mt-6 animate-in fade-in duration-300">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myTickets.map((t: any) => {
              const memoryRow: any = myMemories.find((m: any) => m.event_id === t.id);
              const memory = memoryRow ? { ...memoryRow, metadata: (memoryRow.metadata || {}) as any } : null;
              
              return (
                <div key={`memory-${t.id}`} className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-5 flex flex-col">
                  {memory ? (
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border",
                          memory.metadata.rarity === 'Legendary' ? 'bg-amber-400/10 border-amber-400/30 text-amber-500' : 
                          memory.metadata.rarity === 'Epic' ? 'bg-purple-400/10 border-purple-400/30 text-purple-500' : 
                          'bg-primary/10 border-primary/30 text-primary'
                        )}>
                          {memory.metadata.rarity}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/60">{memory.metadata.serial}</span>
                      </div>
                      
                      <div className="aspect-square rounded-xl bg-black/40 border border-white/10 overflow-hidden mb-4 flex items-center justify-center relative">
                        <ImageIcon className="h-10 w-10 text-white/15" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest truncate">{t.events?.title}</div>
                          <div className="text-[10px] font-semibold text-white/80 mt-0.5">Genesis Edition</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                        <span>{memory.metadata.edition}</span>
                        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                        <Sparkles className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">Mint Memory</h4>
                      <p className="text-[10px] text-muted-foreground mb-4">{t.events?.title}</p>
                      <Button 
                        size="sm"
                        className="w-full rounded-lg bg-brand-gradient text-white font-semibold text-xs h-8 shadow-glow"
                        onClick={() => mintMutation.mutate(t.id)}
                        disabled={mintMutation.isPending}
                      >
                        {mintMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <>Mint <Sparkles className="ml-1 h-3 w-3" /></>}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ─── Notifications Tab ─── */}
        <TabsContent value="notifications" className="mt-6 animate-in fade-in duration-300 space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <h3 className="text-xs font-semibold text-muted-foreground">Recent Alerts</h3>
              <Button variant="ghost" size="sm" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground h-7 px-2">Mark all read</Button>
            </div>
            <div>
              {tickets?.notifications && tickets.notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {tickets.notifications.map((n: any) => (
                    <div key={n.id} className={cn("flex gap-3 px-5 py-4", !n.is_read && "bg-primary/5")}>
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        !n.is_read ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"
                      )}>
                        <Bell className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold leading-tight">{n.title}</div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{n.body}</p>
                        <div className="text-[9px] text-muted-foreground/50 mt-1 font-medium">{format(new Date(n.created_at), "MMM dd, hh:mm a")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <BellOff className="mx-auto h-6 w-6 text-muted-foreground/15 mb-2" />
                  <p className="text-[10px] text-muted-foreground/50 font-medium">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── HIDDEN PRINT ROOT (PORTAL) ─── */}
      {printingCert && typeof document !== 'undefined' && createPortal(
        <div className="print-root">
          <CertificateTemplate 
            studentName={studentName}
            eventName={printingCert.events?.title || "Event Participant"}
            date={printingCert.events?.date ? format(new Date(printingCert.events.date), "MMMM dd, yyyy") : "2026"}
            certificateId={`CERT-${printingCert.id.slice(0, 8).toUpperCase()}`}
            collegeName={collegeName}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
