import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Ticket, 
  IndianRupee, 
  Users, 
  ArrowRight,
  CalendarPlus,
  ScanLine,
  FileText,
  Mail,
  Zap
} from "lucide-react";
import { OrganizerEventCard } from "@/components/organizer/organizer-event-card";
import { OrganizerEmptyState } from "@/components/organizer/organizer-empty-state";
import { RecentActivity } from "@/components/organizer/recent-activity";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/organizer/")({
  component: OrganizerDashboard,
});

function OrganizerDashboard() {
  const ctx = Route.useRouteContext() as any;
  const membership = ctx.membership;
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: myEvents, isLoading: loadingEvents } = useQuery({
    queryKey: ["my-college-events", userData?.id, membership?.college_id],
    enabled: !!userData?.id,
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (membership?.college_id) {
        query = query.or(`organizer_user_id.eq.${userData!.id},college_id.eq.${membership.college_id}`);
      } else {
        query = query.eq("organizer_user_id", userData!.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: proposals } = useQuery({
    queryKey: ["event-proposals", myEvents?.map(e => e.id)],
    enabled: !!myEvents && myEvents.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*")
        .in("event_id", myEvents!.map(e => e.id));
      if (error) throw error;
      return data;
    }
  });

  const { data: latestActivity } = useQuery({
    queryKey: ["latest-activity", membership?.college_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recent_activity")
        .select("*")
        .eq("college_id", membership?.college_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  if (loadingUser || loadingEvents) {
    return <OrganizerSkeleton />;
  }

  const totalAttendees = myEvents?.reduce((acc, e) => acc + (e.attendees || 0), 0) || 0;
  const totalRevenue = myEvents?.reduce((acc, e) => acc + ((e.attendees || 0) * (e.price_from || 0) * 0.15), 0) || 0;
  const sponsorPipeline = proposals?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
  const totalTickets = Math.floor(totalAttendees * 0.15);

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1400px] mx-auto">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight lg:text-4xl text-white">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Performance metrics for <span className="text-primary font-bold">{membership?.colleges?.name || "your campus"}</span>.</p>
        </div>
        
        {/* Latest High-impact Update */}
        {latestActivity && (
          <Link 
            to="/organizer/activity"
            className="group flex items-center gap-4 p-3 pr-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/[0.06] transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Latest Intel</div>
              <div className="text-xs font-bold text-white truncate max-w-[200px]">{latestActivity.title}</div>
            </div>
          </Link>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(2)}L`} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard icon={Ticket} label="Tickets Issued" value={totalTickets.toLocaleString()} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard icon={Users} label="Total Attendees" value={totalAttendees.toLocaleString()} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard icon={TrendingUp} label="Sponsorships" value={`₹${(sponsorPipeline / 100000).toFixed(2)}L`} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      {/* Primary Actions Row */}
      <div className="flex flex-wrap gap-3 mb-12">
        <QuickActionBtn to="/organizer/new" icon={CalendarPlus} label="Create Event" primary />
        <QuickActionBtn to="/organizer/scan" icon={ScanLine} label="Scan Tickets" />
        <QuickActionBtn to="/organizer/events" icon={FileText} label="All Events" />
        <QuickActionBtn to="/organizer/team" icon={Users} label="Manage Team" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-10">
        {/* Events Section - Now taking more prominence */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                <h2 className="text-xl font-bold tracking-tight text-white">Recent Festivals</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-bold text-xs group" asChild>
                <Link to="/organizer/events">
                  View Management Portal <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {myEvents && myEvents.length > 0 ? (
                myEvents.slice(0, 4).map((e) => (
                  <OrganizerEventCard 
                    key={e.id}
                    id={e.id}
                    title={e.title}
                    date={e.date}
                    city={e.city}
                    cover={e.cover}
                    status={(e.status || "Published") as "Completed" | "Draft" | "Published" | "Sold Out"}
                    ticketsSold={Math.floor((e.attendees || 0) * 0.15)}
                    revenue={(e.attendees || 0) * (e.price_from || 0) * 0.15}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <OrganizerEmptyState />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.05] group">
      <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-black tracking-tight text-white">{value}</div>
    </div>
  );
}

// Updated QuickActionBtn for better hierarchy
function QuickActionBtn({ to, icon: Icon, label, primary }: { to: string; icon: any; label: string; primary?: boolean }) {
  return (
    <Button 
      variant={primary ? "default" : "outline"} 
      size="sm" 
      asChild 
      className={cn(
        "rounded-2xl gap-2.5 h-11 px-6 text-[11px] font-black uppercase tracking-widest transition-all duration-300",
        primary 
          ? "bg-brand-gradient hover:shadow-glow border-none" 
          : "border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-white"
      )}
    >
      <Link to={to}>
        <Icon className={cn("h-4 w-4", primary ? "text-white" : "text-primary")} />
        {label}
      </Link>
    </Button>
  );
}

function OrganizerSkeleton() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-28 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
