import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { format, isPast, isFuture, differenceInDays } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  QrCode, Loader2, Star, Zap, Award, Sparkles,
  Calendar, Ticket, CalendarRange, Trophy, Bell, BellOff, 
  ScanLine, CheckCircle2, XCircle, Download, ShieldCheck,
  Clock, ArrowRight, Search
} from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CertificateTemplate } from "@/components/certificate-template";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard — WeFest" }, { name: "description", content: "Your personalized festival command center." }] }),
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
    <div className="container mx-auto max-w-5xl px-6 py-10">
      {/* Profile Hero */}
      <div className="rounded-2xl border border-border/50 bg-muted/10 p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-gradient opacity-[0.06] blur-3xl" />
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-brand-gradient p-0.5 shadow-glow shrink-0">
            <div className="h-full w-full rounded-[14px] bg-background flex flex-col items-center justify-center">
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground -mb-0.5">Lvl</div>
              <div className="text-xl font-black">{currentLevel}</div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl truncate">{studentName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-xs font-bold text-primary flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                <Star className="h-3 w-3" /> {festPoints} pts
              </span>
              <span className="text-xs text-muted-foreground font-medium">{myTickets.length} festivals • {myVisits.length} booths visited</span>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
              <span>L{currentLevel}</span>
              <span>L{currentLevel + 1}</span>
            </div>
            <div className="h-2 w-full bg-muted overflow-hidden rounded-full border border-border/50 p-0.5">
              <div className="h-full bg-brand-gradient transition-all rounded-full shadow-glow" style={{ width: `${progressToNext}%` }} />
            </div>
            <div className="text-[10px] font-bold text-primary mt-1 text-right">{300 - (festPoints % 300)} pts to next</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <MiniStat icon={CalendarRange} label="Upcoming" value={upcomingTickets.length} color="text-blue-500" bg="bg-blue-500/10" />
        <MiniStat icon={Ticket} label="Total Tickets" value={myTickets.length} color="text-primary" bg="bg-primary/10" />
        <MiniStat icon={CheckCircle2} label="Attended" value={scannedTickets.length} color="text-emerald-500" bg="bg-emerald-500/10" />
        <MiniStat icon={Trophy} label="Fest Points" value={festPoints} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="events" className="">
        <TabsList className="mb-6 bg-muted/30 p-1 rounded-xl h-auto border border-border/40 flex-wrap gap-1">
          <TabsTrigger value="events" className="rounded-lg px-4 py-2 font-bold text-xs data-[state=active]:bg-background">My Events</TabsTrigger>
          <TabsTrigger value="tickets" className="rounded-lg px-4 py-2 font-bold text-xs data-[state=active]:bg-background">Tickets & QR</TabsTrigger>
          <TabsTrigger value="scan" className="rounded-lg px-4 py-2 font-bold text-xs data-[state=active]:bg-background">
            <ScanLine className="h-3.5 w-3.5 mr-1.5" /> Scan
          </TabsTrigger>
          <TabsTrigger value="certificates" className="rounded-lg px-4 py-2 font-bold text-xs data-[state=active]:bg-background">Certificates</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-4 py-2 font-bold text-xs data-[state=active]:bg-background">
            <Bell className="h-3.5 w-3.5 mr-1.5" /> Alerts
          </TabsTrigger>
        </TabsList>

        {/* My Events Tab */}
        <TabsContent value="events" className="space-y-6">
          {upcomingTickets.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Upcoming</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {upcomingTickets.map((t: any) => {
                  const daysLeft = differenceInDays(new Date(t.events?.date), new Date());
                  return (
                    <Link key={t.id} to="/events/$eventId" params={{ eventId: t.event_id }} className="group">
                      <div className={cn("rounded-xl border border-border/50 p-5 transition-all hover:bg-muted/10 hover:border-primary/30", t.events?.cover)}>
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{t.tier}</div>
                            <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{t.events?.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(t.events?.date), "EEE, MMM dd")}
                            </div>
                          </div>
                          <div className="shrink-0 ml-4 text-right">
                            <div className="text-2xl font-black text-primary">{daysLeft}</div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">days left</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {pastTickets.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Past Events</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {pastTickets.map((t: any) => (
                  <Link key={t.id} to="/events/$eventId" params={{ eventId: t.event_id }} className="group">
                    <div className="rounded-xl border border-border/50 p-5 opacity-70 hover:opacity-100 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h4 className="font-bold truncate">{t.events?.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(t.events?.date), "MMM dd, yyyy")}
                          </div>
                        </div>
                        {t.scanned_at && (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">Attended</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {myTickets.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center">
              <CalendarRange className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <h3 className="font-bold text-lg mb-2">No events yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Browse festivals and book your first pass.</p>
              <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
                <Link to="/events">Explore Fests <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tickets & QR Tab */}
        <TabsContent value="tickets" className="space-y-4">
          {myTickets.length > 0 ? (
            myTickets.map((t: any) => (
              <div key={t.id} className="flex items-center gap-5 rounded-xl border border-border/50 p-5 group hover:bg-muted/10 transition-all">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-white text-black p-1.5 shadow-lg group-hover:rotate-2 transition-transform">
                  <QrCode className="h-full w-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary px-1.5 py-0.5 rounded bg-primary/5 border border-primary/20">
                      {t.tier}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">ID: {t.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <h3 className="mt-2 font-bold text-lg truncate">{t.events?.title || "Unknown Event"}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {t.events?.date ? format(new Date(t.events.date), "EEE, MMM dd, yyyy") : "No date"}
                  </div>
                  <div className="mt-3">
                    <code className="rounded-lg bg-muted px-3 py-1.5 text-xs font-black tracking-widest text-foreground/80 border border-border/40">
                      {t.code}
                    </code>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center">
              <Ticket className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground font-medium">Your ticket wallet is empty.</p>
              <Button asChild className="mt-6 bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
                <Link to="/events">Browse Festivals <Sparkles className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Scan Tab */}
        <TabsContent value="scan">
          <ScanSection userId={currentUser?.id} />
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          {myTickets.length > 0 ? (
            myTickets.map((t: any) => (
              <div key={`cert-${t.id}`} className="flex items-center justify-between p-5 rounded-xl border border-border/50 group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{t.events?.title || "Unknown Event"}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified Participation
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold">Preview</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl border-none bg-transparent p-0">
                      <CertificateTemplate 
                        studentName={studentName}
                        eventName={t.events?.title || "Event"}
                        date={t.events?.date ? format(new Date(t.events.date), "MMMM dd, yyyy") : "2026"}
                        certificateId={`CERT-${t.id.slice(0, 8).toUpperCase()}`}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" className="bg-brand-gradient text-white rounded-lg text-xs font-bold shadow-glow px-4" onClick={() => {
                    toast.success("Certificate download started");
                    window.print();
                  }}>
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center">
              <Award className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground font-medium">Attend an event to earn verified certificates.</p>
            </div>
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-xl border border-border/50 overflow-hidden">
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
              <div className="py-12 text-center">
                <BellOff className="mx-auto h-10 w-10 opacity-15 mb-4" />
                <p className="text-sm text-muted-foreground font-medium">No notifications yet.</p>
                <p className="text-xs text-muted-foreground mt-1">We'll alert you about upcoming fests and ticket updates!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Mini Stat ── */
function MiniStat({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-2", bg, color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xl font-black">{value}</div>
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
    <div className="max-w-xl">
      <div className="rounded-xl border border-border/50 bg-muted/10 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">Scan Sponsor Booth</h3>
            <p className="text-xs text-muted-foreground">Enter the booth code to earn points and unlock rewards.</p>
          </div>
        </div>

        <form onSubmit={handleScan} className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter booth code"
            disabled={scanMutation.isPending}
            className="h-10 rounded-xl border-border/50 bg-background font-mono"
          />
          <Button type="submit" disabled={scanMutation.isPending || !code.trim()} className="bg-brand-gradient text-white rounded-xl font-bold min-w-[100px] h-10">
            {scanMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Scan"}
          </Button>
        </form>
      </div>

      {/* Scan Log */}
      {log.length > 0 && (
        <div className="rounded-xl border border-border/50 divide-y divide-border/50 overflow-hidden">
          {log.map((l, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                {l.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                <div className="min-w-0">
                  <code className="font-mono text-xs truncate block">{l.code}</code>
                  {l.note && <p className={cn("text-[10px] mt-0.5", l.ok ? "text-muted-foreground" : "text-destructive")}>{l.note}</p>}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-4">{l.t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
