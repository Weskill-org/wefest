import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { format, isPast, isFuture, differenceInDays } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  QrCode, Loader2, Star, Zap, Award, Sparkles,
  Calendar, Ticket, CalendarRange, Trophy, Bell, BellOff, 
  ScanLine, CheckCircle2, XCircle, ShieldCheck,
  Clock, ArrowRight, Search
} from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard — WeFest" }, { name: "description", content: "Your personalized festival command center." }] }),
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    // Check session first, if missing, check user to prevent refresh race condition
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
  component: StudentDashboard,
});

function StudentDashboard() {
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["dashboard-tickets"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login");

      const { data: ticketsData, error } = await supabase
        .from("tickets")
        .select(`*, events (*)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      let visits: any[] = [];
      try {
        const { data } = await supabase
          .from("sponsor_booth_visits")
          .select("*")
          .eq("student_user_id", user.id);
        visits = data || [];
      } catch (_) {}

      let memories: any[] = [];
      try {
        const { data } = await supabase
          .from("digital_memories")
          .select("*")
          .eq("user_id", user.id);
        memories = data || [];
      } catch (_) {}

      let notifications: any[] = [];
      try {
        const { data } = await supabase
          .from("notification_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
        notifications = data || [];
      } catch (_) {}

      return {
        tickets: ticketsData || [],
        visits: visits || [],
        memories: memories || [],
        notifications: notifications || [],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-6 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  const myTickets = tickets?.tickets || [];
  const myVisits = tickets?.visits || [];
  const myMemories = tickets?.memories || [];
  const myNotifications = tickets?.notifications || [];

  const festPoints = (myTickets.length * 100) + (myVisits.length * 50) + (myMemories.length * 200);
  const currentLevel = Math.floor(festPoints / 300) + 1;
  const progressToNext = (festPoints % 300) / 300 * 100;

  const upcomingTickets = myTickets.filter((t: any) => t.events?.date && isFuture(new Date(t.events.date)));
  const pastTickets = myTickets.filter((t: any) => t.events?.date && isPast(new Date(t.events.date)));
  const scannedTickets = myTickets.filter((t: any) => t.scanned_at);

  const studentName = currentUser?.user_metadata?.full_name || "Student";

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Hero */}
      <div className="glass rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gradient opacity-20 blur-[80px] transition-opacity duration-700 group-hover:opacity-40" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary opacity-10 blur-[80px] transition-opacity duration-700 group-hover:opacity-30" />
        
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-brand-gradient blur-md opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="h-20 w-20 relative rounded-2xl bg-brand-gradient p-0.5 shadow-glow shrink-0">
              <div className="h-full w-full rounded-[14px] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground -mb-1">Lvl</div>
                <div className="text-3xl font-black bg-brand-gradient bg-clip-text text-transparent">{currentLevel}</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl truncate">{studentName}</h1>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 className="h-3 w-3" /> Verified Student
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold text-primary flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 shadow-sm">
                <Star className="h-4 w-4" /> {festPoints} pts
              </span>
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                <Ticket className="h-4 w-4 opacity-50" /> {myTickets.length} festivals
              </span>
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                <ScanLine className="h-4 w-4 opacity-50" /> {myVisits.length} booths visited
              </span>
            </div>
          </div>
          
          <div className="w-full sm:w-56 glass-panel p-4 rounded-2xl border-white/5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              <span className="text-foreground">Level {currentLevel}</span>
              <span>Level {currentLevel + 1}</span>
            </div>
            <div className="h-2.5 w-full bg-background/50 overflow-hidden rounded-full border border-border/50 p-0.5 shadow-inner">
              <div 
                className="h-full bg-brand-gradient rounded-full shadow-glow transition-all duration-1000 ease-out relative" 
                style={{ width: `${progressToNext}%` }} 
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="text-xs font-bold text-primary mt-2 text-right">
              {300 - (festPoints % 300)} pts to next rank
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <MiniStat icon={CalendarRange} label="Upcoming" value={upcomingTickets.length} color="text-blue-500" bg="bg-blue-500/10" />
        <MiniStat icon={Ticket} label="Total Tickets" value={myTickets.length} color="text-primary" bg="bg-primary/10" />
        <MiniStat icon={CheckCircle2} label="Attended" value={scannedTickets.length} color="text-emerald-500" bg="bg-emerald-500/10" />
        <MiniStat icon={Trophy} label="Fest Points" value={festPoints} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Events (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Upcoming Events */}
          {upcomingTickets.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-blue-500" />
                <h3 className="text-xl font-bold tracking-tight">Upcoming Festivals</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingTickets.map((t: any) => {
                  const daysLeft = differenceInDays(new Date(t.events?.date), new Date());
                  return (
                    <Link key={t.id} to="/events/$eventId" params={{ eventId: t.event_id }} className="group">
                      <div className={cn("glass-panel relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border-white/5", t.events?.cover)}>
                        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/80 z-0" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className="flex items-start justify-between mb-4">
                            <div className="inline-flex items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                              {t.tier}
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-3xl font-black text-white drop-shadow-md">{daysLeft}</div>
                              <div className="text-[9px] font-bold text-white/70 uppercase tracking-widest">days left</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-display text-xl font-bold text-white drop-shadow-md line-clamp-1 group-hover:text-primary-100 transition-colors">{t.events?.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-white/80 mt-2 font-medium">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(t.events?.date), "EEE, MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Past Experiences */}
          {pastTickets.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-muted-foreground/30" />
                <h3 className="text-xl font-bold tracking-tight text-muted-foreground">Past Experiences</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {pastTickets.map((t: any) => (
                  <Link key={t.id} to="/events/$eventId" params={{ eventId: t.event_id }} className="group">
                    <div className="rounded-2xl border border-border/40 bg-muted/5 p-5 opacity-70 hover:opacity-100 transition-all duration-300 hover:bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold truncate text-foreground/80 group-hover:text-foreground">{t.events?.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(t.events?.date), "MMM dd, yyyy")}
                          </div>
                        </div>
                        {t.scanned_at ? (
                          <div className="shrink-0 ml-3 flex flex-col items-end">
                            <ShieldCheck className="h-5 w-5 text-emerald-500 mb-1" />
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Attended</span>
                          </div>
                        ) : (
                          <div className="shrink-0 ml-3 flex flex-col items-end">
                            <XCircle className="h-4 w-4 text-muted-foreground/50 mb-1" />
                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Missed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {myTickets.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center animate-in fade-in duration-500">
              <CalendarRange className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <h3 className="font-bold text-lg mb-2">No events yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Browse festivals and book your first pass.</p>
              <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
                <Link to="/events">Explore Fests <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Scan & Alerts */}
        <div className="space-y-8 lg:mt-0 mt-8">
          
          {/* Certificates Call to action / Link to tickets */}
          <div className="glass-panel p-6 rounded-3xl border-white/5 bg-brand-gradient text-white relative overflow-hidden group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
            <div className="absolute -right-10 -top-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <Award className="h-40 w-40" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Your Tickets & Certificates</h3>
              <p className="text-sm text-white/80 mb-6">View your QR passes and download certificates for attended festivals.</p>
              <Button asChild variant="secondary" className="w-full font-bold bg-white/20 hover:bg-white/30 text-white border-0">
                <Link to="/tickets">View Wallet</Link>
              </Button>
            </div>
          </div>

          {/* Quick Scan */}
          <div className="glass-panel p-6 rounded-3xl border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-primary" /> Sponsor Scan
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Enter a booth code to earn +50 fest points.</p>
            <ScanSection userId={currentUser?.id} />
          </div>

          {/* Notifications */}
          <div className="glass-panel rounded-3xl border-white/5 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
            <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/10 shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Recent Alerts
              </h3>
            </div>
            <div className="overflow-y-auto hide-scrollbar flex-1">
              {myNotifications.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {myNotifications.map((n: any) => (
                    <div key={n.id} className={cn("flex gap-3 p-4", n.is_read ? "opacity-60" : "bg-primary/5")}>
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", n.is_read ? "bg-muted text-muted-foreground" : "bg-primary text-white")}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm">{n.title}</div>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                        <div className="text-[10px] text-muted-foreground mt-1.5 font-medium">{format(new Date(n.created_at), "MMM dd, hh:mm a")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <BellOff className="mx-auto h-8 w-8 opacity-15 mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">No alerts yet.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}

/* ── Mini Stat ── */
function MiniStat({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-white/5 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/5 blur-xl transition-all duration-500 group-hover:bg-white/10 group-hover:scale-150" />
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 shadow-inner", bg, color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-display font-black tracking-tight mb-1">{value}</div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
  );
}

/* ── Scan Section ── */
function ScanSection({ userId }: { userId?: string }) {
  const [code, setCode] = useState("");
  const [log, setLog] = useState<{ code: string; ok: boolean; t: string; note?: string }[]>([]);
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (boothCode: string) => {
      if (!userId) throw new Error("Please login");
      // Try to find a sponsor booth with this code
      const { data: booth, error } = await (supabase as any)
        .from("sponsor_booths")
        .select("id, sponsor_name")
        .eq("code", boothCode.trim())
        .maybeSingle();
      
      if (error) throw error;
      if (!booth) throw new Error("Booth not found. Check the code and try again.");
      
      // Record the visit
      const { error: visitError } = await supabase
        .from("sponsor_booth_visits")
        .insert({
          student_user_id: userId,
          booth_id: booth.id,
        } as any);
      
      if (visitError) {
        if (visitError.code === "23505") throw new Error("You've already visited this booth!");
        throw visitError;
      }
      
      return booth;
    },
    onSuccess: (booth) => {
      toast.success(`+50 pts! Visited ${booth.sponsor_name}`);
      setLog(l => [{ code, ok: true, t: new Date().toLocaleTimeString(), note: `${booth.sponsor_name} booth` }, ...l]);
      setCode("");
      queryClient.invalidateQueries({ queryKey: ["dashboard-tickets"] });
    },
    onError: (e: any) => {
      toast.error(e.message);
      setLog(l => [{ code, ok: false, t: new Date().toLocaleTimeString(), note: e.message }, ...l]);
    },
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    scanMutation.mutate(code);
  };

  return (
    <div className="max-w-xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel rounded-3xl p-8 mb-8 border-white/10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ScanLine className="h-32 w-32" />
        </div>
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner border border-primary/20">
            <ScanLine className="h-8 w-8" />
          </div>
          <h3 className="font-display text-2xl font-bold mb-2">Scan Sponsor Booth</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Enter the unique booth code provided by the sponsor to mark your visit and earn +50 fest points.
          </p>
        </div>

        <form onSubmit={handleScan} className="flex gap-3 relative z-10">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER BOOTH CODE"
            disabled={scanMutation.isPending}
            className="h-14 rounded-xl border-border/50 bg-background/50 font-mono text-lg tracking-widest text-center shadow-inner focus-visible:ring-primary/50"
            maxLength={10}
          />
          <Button 
            type="submit" 
            disabled={scanMutation.isPending || !code.trim()} 
            className="bg-brand-gradient text-white rounded-xl font-bold min-w-[120px] h-14 shadow-glow hover:scale-105 transition-transform"
          >
            {scanMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Verify"}
          </Button>
        </form>
      </div>

      {/* Scan Log */}
      {log.length > 0 && (
        <div className="glass-panel rounded-2xl divide-y divide-border/30 overflow-hidden border-white/5">
          <div className="bg-muted/20 px-5 py-3 border-b border-border/30">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Scans</h4>
          </div>
          {log.map((l, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 text-sm bg-background/30 hover:bg-background/50 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                {l.ok ? (
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-bold tracking-wider">{l.code}</code>
                    {l.ok && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">+50 PTS</span>}
                  </div>
                  {l.note && <p className={cn("text-xs mt-0.5 font-medium truncate", l.ok ? "text-muted-foreground" : "text-destructive/80")}>{l.note}</p>}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-bold tracking-widest shrink-0 ml-4">{l.t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
