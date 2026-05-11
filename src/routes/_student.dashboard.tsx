import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { format, isPast, isFuture, differenceInDays } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  QrCode, Loader2, Star, Zap, Sparkles,
  Calendar, Ticket, CalendarRange, Trophy, Bell, BellOff, 
  ScanLine, CheckCircle2, XCircle, ShieldCheck,
  Clock, ArrowRight, ChevronRight, TrendingUp, Wallet
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard — WeFest" }, { name: "description", content: "Your personalized festival command center." }] }),
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

      let notifications: any[] = [];
      try {
        const { data } = await supabase
          .from("notification_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        notifications = data || [];
      } catch (_) {}

      return {
        tickets: ticketsData || [],
        visits: visits || [],
        notifications: notifications || [],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="mt-3 text-xs text-muted-foreground">Loading dashboard…</p>
      </div>
    );
  }

  const myTickets = tickets?.tickets || [];
  const myVisits = tickets?.visits || [];
  const myNotifications = tickets?.notifications || [];

  const festPoints = (myTickets.length * 100) + (myVisits.length * 50);
  const currentLevel = Math.floor(festPoints / 300) + 1;
  const xpInLevel = festPoints % 300;
  const xpPercent = (xpInLevel / 300) * 100;

  const upcoming = myTickets.filter((t: any) => t.events?.date && isFuture(new Date(t.events.date)));
  const past = myTickets.filter((t: any) => t.events?.date && isPast(new Date(t.events.date)));
  const attended = myTickets.filter((t: any) => t.scanned_at);

  const studentName = currentUser?.user_metadata?.full_name || "Student";
  const greeting = getGreeting();

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ─── Header Row ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{greeting}</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{studentName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <LevelPill level={currentLevel} xp={xpInLevel} percent={xpPercent} />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Verified</span>
          </div>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={CalendarRange} label="Upcoming" value={upcoming.length} accent="blue" />
        <StatCard icon={Ticket} label="Total Passes" value={myTickets.length} accent="purple" />
        <StatCard icon={CheckCircle2} label="Attended" value={attended.length} accent="emerald" />
        <StatCard icon={Star} label="Points" value={festPoints} accent="amber" />
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ─── Left Column (2/3) ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Passes */}
          {upcoming.length > 0 ? (
            <DashboardSection 
              title="Active Passes" 
              action={<Link to="/tickets" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {upcoming.slice(0, 4).map((t: any) => {
                  const days = differenceInDays(new Date(t.events?.date), new Date());
                  return (
                    <Link key={t.id} to="/events/$eventId" params={{ eventId: t.event_id }} className="group">
                      <div className="relative rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all duration-200 hover:border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md">{t.tier} pass</span>
                          <div className="text-right">
                            <div className="text-lg font-bold leading-none">{days}</div>
                            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">days</div>
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm leading-tight line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">{t.events?.title}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(t.events?.date), "EEE, MMM dd")}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </DashboardSection>
          ) : (
            <DashboardSection title="Active Passes">
              <div className="rounded-xl border-2 border-dashed border-white/10 py-12 px-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-sm mb-1">No upcoming festivals</h3>
                <p className="text-xs text-muted-foreground mb-5 max-w-[240px] mx-auto">Discover amazing college fests and book your first pass.</p>
                <Button asChild size="sm" className="bg-brand-gradient text-white rounded-lg font-semibold shadow-lg text-xs h-9 px-5">
                  <Link to="/events">Browse Fests <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            </DashboardSection>
          )}

          {/* Past Events */}
          {past.length > 0 && (
            <DashboardSection title="Past Events" muted>
              <div className="space-y-2">
                {past.slice(0, 4).map((t: any) => (
                  <Link key={t.id} to="/events/$eventId" params={{ eventId: t.event_id }} className="group">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate group-hover:text-foreground transition-colors">{t.events?.title}</h4>
                        <p className="text-[10px] text-muted-foreground">{format(new Date(t.events?.date), "MMM dd, yyyy")}</p>
                      </div>
                      {t.scanned_at ? (
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Attended
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-wider flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Missed
                        </span>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </DashboardSection>
          )}
        </div>

        {/* ─── Right Column (1/3) ─── */}
        <div className="space-y-6">

          {/* Wallet Quick Access */}
          <div className="rounded-xl bg-brand-gradient p-5 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <QrCode className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4" />
                <h3 className="font-semibold text-sm">Digital Wallet</h3>
              </div>
              <p className="text-[11px] text-white/70 mb-4 leading-relaxed">QR passes & certificates</p>
              <Button asChild variant="secondary" size="sm" className="w-full font-semibold bg-white/15 hover:bg-white/25 text-white border-0 text-xs h-8">
                <Link to="/tickets">Open Wallet</Link>
              </Button>
            </div>
          </div>

          {/* Quick Scan */}
          <DashboardSection 
            title="Quick Scan" 
            icon={<Zap className="h-3.5 w-3.5 text-amber-500" />}
            subtitle="Earn +50 pts per booth"
          >
            <QuickScan userId={currentUser?.id} />
          </DashboardSection>

          {/* Activity Feed */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col max-h-[380px]">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold text-muted-foreground">Activity</h3>
            </div>
            <div className="overflow-y-auto hide-scrollbar flex-1">
              {myNotifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {myNotifications.map((n: any) => (
                    <div key={n.id} className={cn("px-4 py-3", !n.is_read && "bg-primary/5")}>
                      <div className="flex gap-2.5">
                        <div className={cn(
                          "h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
                          !n.is_read ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"
                        )}>
                          <Bell className="h-3 w-3" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold leading-tight">{n.title}</div>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{n.body}</p>
                          <div className="text-[9px] text-muted-foreground/50 mt-1 font-medium">
                            {format(new Date(n.created_at), "MMM dd, hh:mm a")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <BellOff className="mx-auto h-6 w-6 text-muted-foreground/15 mb-2" />
                  <p className="text-[10px] text-muted-foreground/50 font-medium">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Reusable Components
   ─────────────────────────────────────────── */

/** Section wrapper with consistent heading */
function DashboardSection({ title, action, icon, subtitle, muted, children }: {
  title: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h3 className={cn("text-sm font-semibold", muted && "text-muted-foreground")}>{title}</h3>
          </div>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Compact stat card */
function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  const colors: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10",
    purple: "text-primary bg-primary/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
  };
  const c = colors[accent] || colors.blue;
  const [textColor, bgColor] = c.split(" ");

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors group">
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3", bgColor, textColor)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xl font-bold tracking-tight leading-none mb-0.5">{value}</div>
      <div className="text-[10px] text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

/** Level + XP inline pill */
function LevelPill({ level, xp, percent }: { level: number; xp: number; percent: number }) {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
      {/* Level number */}
      <div className="flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-bold">Lv. {level}</span>
      </div>
      {/* XP bar */}
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-gradient rounded-full transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[9px] text-muted-foreground font-medium whitespace-nowrap">{xp}/300</span>
      </div>
    </div>
  );
}

/** Compact booth scan form */
function QuickScan({ userId }: { userId?: string }) {
  const [code, setCode] = useState("");
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (boothCode: string) => {
      if (!userId) throw new Error("Please login");
      const { data: booth, error } = await (supabase as any)
        .from("sponsor_booths")
        .select("id, sponsor_name")
        .eq("code", boothCode.trim().toUpperCase())
        .maybeSingle();
      
      if (error) throw error;
      if (!booth) throw new Error("Booth not found");
      
      const { error: visitError } = await supabase
        .from("sponsor_booth_visits")
        .insert({ student_user_id: userId, booth_id: booth.id } as any);
      
      if (visitError) {
        if (visitError.code === "23505") throw new Error("Already visited");
        throw visitError;
      }
      return booth;
    },
    onSuccess: (booth) => {
      toast.success(`+50 pts — ${booth.sponsor_name}`);
      setCode("");
      queryClient.invalidateQueries({ queryKey: ["dashboard-tickets"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); if (code.trim()) scanMutation.mutate(code); }}
      className="flex gap-2"
    >
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="BOOTH CODE"
        disabled={scanMutation.isPending}
        className="h-9 rounded-lg bg-white/5 border-white/10 font-mono text-xs text-center tracking-widest placeholder:tracking-normal placeholder:font-sans"
        maxLength={8}
      />
      <Button 
        type="submit" 
        disabled={scanMutation.isPending || !code.trim()} 
        size="sm"
        className="bg-brand-gradient text-white rounded-lg font-semibold px-3 h-9 shrink-0 text-xs"
      >
        {scanMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Scan"}
      </Button>
    </form>
  );
}

/** Time-aware greeting */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}
