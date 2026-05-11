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
  Mail
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

  if (loadingUser || loadingEvents) {
    return <OrganizerSkeleton />;
  }

  const totalAttendees = myEvents?.reduce((acc, e) => acc + (e.attendees || 0), 0) || 0;
  const totalRevenue = myEvents?.reduce((acc, e) => acc + ((e.attendees || 0) * (e.price_from || 0) * 0.15), 0) || 0;
  const sponsorPipeline = proposals?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
  const totalTickets = Math.floor(totalAttendees * 0.15);

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1400px]">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor performance across all your college festivals.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={IndianRupee} label="Revenue (est.)" value={`₹${(totalRevenue / 100000).toFixed(2)}L`} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard icon={Ticket} label="Tickets Sold" value={totalTickets.toLocaleString()} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard icon={Users} label="Attendees" value={totalAttendees.toLocaleString()} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard icon={TrendingUp} label="Sponsor Pipeline" value={`₹${(sponsorPipeline / 100000).toFixed(2)}L`} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-2 mb-10">
        <QuickActionBtn to="/organizer/new" icon={CalendarPlus} label="Create Event" />
        <QuickActionBtn to="/organizer/scan" icon={ScanLine} label="Scan Tickets" />
        <QuickActionBtn to="/organizer/events" icon={FileText} label="All Events" />
        <QuickActionBtn to="/organizer/team" icon={Users} label="Team" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        {/* Events Section */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold tracking-tight">Recent Events</h2>
              <Button variant="ghost" size="sm" className="text-primary font-bold text-xs" asChild>
                <Link to="/organizer/events">
                  View All <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3">
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
                <OrganizerEmptyState />
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/10 p-5 transition-all hover:bg-muted/20">
      <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-black tracking-tight">{value}</div>
    </div>
  );
}

function QuickActionBtn({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Button variant="outline" size="sm" asChild className="rounded-xl border-border/50 bg-muted/10 hover:bg-muted/30 gap-2 h-9 px-4 text-xs font-bold">
      <Link to={to}>
        <Icon className="h-3.5 w-3.5 text-primary" />
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
      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
