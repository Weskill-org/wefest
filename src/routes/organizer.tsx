import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Ticket, 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  Loader2,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { OrganizerHeader } from "@/components/organizer/organizer-header";
import { DashboardStatTile } from "@/components/organizer/dashboard-stat-tile";
import { OrganizerEventCard } from "@/components/organizer/organizer-event-card";
import { OrganizerEmptyState } from "@/components/organizer/organizer-empty-state";
import { RecentActivity } from "@/components/organizer/recent-activity";
import { QuickActions } from "@/components/organizer/quick-actions";
import { PerformanceSnapshot } from "@/components/organizer/performance-snapshot";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer")({
  head: () => ({ 
    meta: [
      { title: "Organizer Dashboard — WeFest" }, 
      { name: "description", content: "Professional event management suite for college festivals." }
    ] 
  }),
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();
      
    if (roleData?.role !== "college") {
      throw redirect({ to: '/' });
    }
  },
  component: Organizer,
});

function Organizer() {
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: myEvents, isLoading: loadingEvents } = useQuery({
    queryKey: ["my-events", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_user_id", userData!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery({
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
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="container mx-auto px-6">
        <OrganizerHeader 
          name={userData?.user_metadata?.full_name || userData?.email?.split("@")[0] || "Organizer"} 
          isVerified={true}
        />

        {/* Quick Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <DashboardStatTile 
            icon={IndianRupee} 
            label="Revenue (est.)" 
            value={`₹${(totalRevenue / 100000).toFixed(2)}L`} 
            delta="100%" 
            href="/organizer" 
          />
          <DashboardStatTile 
            icon={Ticket} 
            label="Tickets Sold" 
            value={totalTickets.toLocaleString()} 
            delta="100%" 
            href="/organizer" 
          />
          <DashboardStatTile 
            icon={Users} 
            label="Total Attendees" 
            value={totalAttendees.toLocaleString()} 
            delta="100%" 
            href="/organizer" 
          />
          <DashboardStatTile 
            icon={TrendingUp} 
            label="Sponsor Pipeline" 
            value={`₹${(sponsorPipeline / 100000).toFixed(2)}L`} 
            delta="100%" 
            href="/organizer" 
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Events Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-3xl font-black tracking-tight">Your Events</h2>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">
                  View All Events <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {myEvents && myEvents.length > 0 ? (
                  myEvents.map((e) => (
                    <OrganizerEventCard 
                      key={e.id}
                      id={e.id}
                      title={e.title}
                      date={e.date}
                      city={e.city}
                      cover={e.cover}
                      status={e.status || "Published"}
                      ticketsSold={Math.floor((e.attendees || 0) * 0.15)}
                      revenue={(e.attendees || 0) * (e.price_from || 0) * 0.15}
                    />
                  ))
                ) : (
                  <OrganizerEmptyState />
                )}
              </div>
            </section>

            {/* Performance & Financials */}
            <div className="grid gap-8 md:grid-cols-1">
              <PerformanceSnapshot />
              
              <section className="rounded-[2.5rem] border border-border/50 bg-muted/20 p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">Financial Settlements</h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-3xl bg-brand-gradient/5 border border-primary/20 p-8">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Available for Payout</div>
                    <div className="mt-4 text-5xl font-black tracking-tighter">₹{(totalRevenue * 0.85 / 100000).toFixed(2)}L</div>
                    <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                      Funds are typically settled within 48 hours of request. Includes deduction of 10% platform fee and 5% tax withholding.
                    </p>
                    <Button 
                      className="mt-8 w-full h-14 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={() => toast.success("Settlement Requested", { description: "Your payout is being processed." })}
                    >
                      Request Settlement
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Ledger</div>
                      <Badge variant="outline" className="bg-muted border-border/50 text-[10px]">View History</Badge>
                    </div>
                    
                    {[
                      { id: "#4592", date: "May 02, 2026", amount: "1.24L", status: "Completed" },
                      { id: "#4501", date: "April 15, 2026", amount: "0.85L", status: "Completed" },
                    ].map((settlement, i) => (
                      <div key={settlement.id} className={cn(
                        "flex items-center justify-between p-5 rounded-2xl border border-border/40 bg-muted/30 transition-all hover:bg-muted/50",
                        i > 0 && "opacity-60"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold text-sm">Settlement {settlement.id}</div>
                            <div className="text-[10px] text-muted-foreground font-medium">{settlement.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-lg">₹{settlement.amount}</div>
                          <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">{settlement.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizerSkeleton() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <div className="flex items-center gap-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <Skeleton className="h-10 w-48" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-28 rounded-3xl" />
          ))}
        </div>
        <div className="space-y-8">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
