import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TrendingUp, Ticket, IndianRupee, Users, Plus, ScanLine, Loader2 } from "lucide-react";

export const Route = createFileRoute("/organizer")({
  head: () => ({ meta: [{ title: "Organizer suite — WeFest" }, { name: "description", content: "Run your college festival end-to-end." }] }),
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
    return (
      <div className="container mx-auto px-6 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Organizer Login Required</h1>
        <p className="mt-2 text-muted-foreground">Please login to access the organizer suite.</p>
        <Button asChild className="mt-4"><Link to="/login">Login</Link></Button>
      </div>
    );
  }

  const totalAttendees = myEvents?.reduce((acc, e) => acc + e.attendees, 0) || 0;
  const totalRevenue = myEvents?.reduce((acc, e) => acc + (e.attendees * e.price_from * 0.15), 0) || 0; // Simple calc for demo
  const sponsorPipeline = proposals?.reduce((acc, p) => acc + p.amount, 0) || 0;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-primary">Organizer suite</div>
          <h1 className="font-display text-4xl font-black md:text-5xl">
            {userData.user_metadata?.full_name || userData.email?.split("@")[0] || "Organizer"}
          </h1>
          <p className="text-muted-foreground">Verified organizer</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/organizer/scan"><ScanLine className="h-4 w-4" /> Scan tickets</Link></Button>
          <Button asChild className="bg-brand-gradient text-primary-foreground hover:opacity-90">
            <Link to="/organizer/new"><Plus className="h-4 w-4" /> Create event</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat icon={IndianRupee} label="Revenue (est.)" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} delta="+100%" />
        <Stat icon={Ticket} label="Tickets sold" value={`${(totalAttendees * 0.15).toFixed(0)}`} delta="+100%" />
        <Stat icon={Users} label="Total attendees" value={totalAttendees.toLocaleString()} delta="+100%" />
        <Stat icon={TrendingUp} label="Sponsor pipeline" value={`₹${(sponsorPipeline / 100000).toFixed(1)}L`} delta="+100%" />
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Your events</h2>
      <div className="mt-4 grid gap-4">
        {myEvents && myEvents.length > 0 ? (
          myEvents.map((e) => (
            <div key={e.id} className="glass flex items-center justify-between rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${e.cover}`} />
                <div>
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(e.date).toDateString()} • {e.city}</div>
                </div>
              </div>
              <div className="hidden gap-8 text-sm md:flex">
                <Mini label="Reach" value={`${(e.attendees / 1000).toFixed(0)}k`} />
                <Mini label="Category" value={e.category} />
                <Mini label="Proposals" value={proposals?.filter(p => p.event_id === e.id).length.toString() || "0"} />
              </div>
              <Button asChild variant="outline" size="sm"><Link to="/events/$eventId" params={{ eventId: e.id }}>Manage</Link></Button>
            </div>
          ))
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">You haven't created any events yet.</p>
            <Button asChild className="mt-4" variant="outline"><Link to="/organizer/new">Create your first event</Link></Button>
          </div>
        )}
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Recent activity</h2>
      <div className="mt-4 glass divide-y divide-border/60 rounded-2xl">
        {proposals && proposals.length > 0 ? (
          proposals.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 text-sm">
              <div>
                <div className="font-medium">New sponsorship proposal received</div>
                <div className="text-xs text-muted-foreground">{p.tier} tier • ₹{(p.amount / 100000).toFixed(1)}L</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No recent activity</div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs text-emerald-400">{delta}</span>
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div><div className="font-semibold">{value}</div><div className="text-[11px] text-muted-foreground">{label}</div></div>;
}
