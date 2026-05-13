import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Eye, Users2, Loader2, IndianRupee, TrendingUp,
  ScanLine, Download, MapPin, Sparkles, Shield, AlertCircle,
  Info, ArrowUpRight, CalendarDays
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "Dashboard — Company Portal — WeFest" }] }),
  component: CompanyDashboard,
});

function CompanyDashboard() {
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery({
    queryKey: ["my-proposals"],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*, event:event_id(*)")
        .eq("company_user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: visits, isLoading: loadingVisits } = useQuery({
    queryKey: ["my-booth-visits"],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_booth_visits")
        .select("*")
        .eq("sponsor_user_id", user!.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: subscription } = useQuery({
    queryKey: ["my-subscription"],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    }
  });

  const downloadLeadsCSV = () => {
    if (!subscription) {
      toast.error("Pro feature", { description: "Lead export is only available for Growth and Enterprise plans." });
      return;
    }
    if (!visits || visits.length === 0) {
      toast.error("No lead data available to export.");
      return;
    }
    const headers = ["Student Name", "Email", "Event", "Visit Date", "Engagement Status"];
    const rows = (visits as any[]).map(v => [
      v.full_name || "Anonymous",
      v.email || "N/A",
      v.event_title || "General Interest",
      format(new Date(v.visited_at || v.created_at), "yyyy-MM-dd HH:mm"),
      v.engagement_type || "Viewed"
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map((cell: string) => `"${cell}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wefest_leads_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Lead data exported successfully!", {
      description: `${visits.length} leads compiled into your CSV report.`
    });
  };

  if (loadingProposals || loadingVisits) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeProposals = proposals?.filter(p => p.status === 'accepted') || [];
  const pendingProposals = proposals?.filter(p => p.status === 'pending') || [];
  const totalReach = activeProposals.reduce((acc, p) => acc + ((p.event as any)?.attendees || 0), 0);
  const totalCommitted = activeProposals.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest">Overview</div>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-black tracking-tight">
            Welcome back 👋
          </h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-lg">
            Track your sponsorships, monitor booth engagement, and discover new festivals to partner with.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadLeadsCSV} className="text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export Leads
          </Button>
          <Button asChild size="sm" className="bg-brand-gradient text-white text-xs shadow-glow">
            <Link to="/company/scan">
              <ScanLine className="h-3.5 w-3.5 mr-1.5" /> Open Scanner
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Building2} label="Active Fests" value={activeProposals.length.toString()} color="text-primary" />
        <KpiCard icon={Users2} label="Total Reach" value={totalReach.toLocaleString()} color="text-emerald-400" />
        <KpiCard icon={Eye} label="Booth Scans" value={(visits?.length || 0).toString()} color="text-purple-400" />
        <KpiCard icon={IndianRupee} label="Committed" value={`₹${(totalCommitted / 100000).toFixed(1)}L`} color="text-blue-400" />
      </div>

      {/* Subscription Banner */}
      <div className={`overflow-hidden rounded-2xl border transition-all ${
        subscription ? "border-primary/20 bg-primary/5" : "border-amber-500/20 bg-amber-500/5"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
              subscription ? "bg-primary/20 text-primary" : "bg-amber-500/20 text-amber-500"
            }`}>
              {subscription ? <Shield className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{subscription?.plan_type || "Free Explorer"}</span>
                {subscription?.status === 'active' && (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[9px]">Active</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {subscription
                  ? `Includes priority proposals and heatmap analytics.`
                  : "Upgrade for booth heatmaps, lead exports, and priority support."}
              </p>
            </div>
          </div>
          <Button asChild variant={subscription ? "outline" : "default"} size="sm" className={`shrink-0 text-xs ${!subscription ? "bg-brand-gradient text-white" : ""}`}>
            <Link to="/company/settings">{subscription ? "Manage Plan" : "Upgrade Now"}</Link>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Active Sponsorships */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Active Sponsorships</h2>
            {activeProposals.length > 0 && (
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{activeProposals.length} active</span>
            )}
          </div>
          <div className="space-y-3">
            {activeProposals.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <Building2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground text-sm">No active sponsorships yet.</p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/company/marketplace">Browse Marketplace <ArrowUpRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>
            ) : (
              activeProposals.map(p => {
                const event = p.event as any;
                return (
                  <div key={p.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-primary/20">
                    <div className={`h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br ${event?.cover || 'from-primary/30 to-primary/10'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{event?.title || "Event"}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3" /> {event?.college_name}, {event?.city}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Tier</div>
                        <div className="font-semibold mt-0.5">{p.tier}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reach</div>
                        <div className="font-semibold mt-0.5">{(event?.attendees || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Pending Proposals */}
          <section>
            <h2 className="font-display text-xl font-bold mb-4">Pending Proposals</h2>
            <div className="space-y-2">
              {pendingProposals.length === 0 ? (
                <div className="glass rounded-xl p-6 text-center text-sm text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
                  No pending proposals
                </div>
              ) : (
                pendingProposals.map(p => (
                  <div key={p.id} className="glass rounded-xl p-4 text-sm flex items-center justify-between transition-all hover:border-primary/20">
                    <div>
                      <div className="font-semibold">{(p.event as any)?.title || "Event"}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">₹{(p.amount / 100000).toFixed(1)}L · {p.tier} Tier</div>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider">Reviewing</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Engagement Heatmap */}
          <section>
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              Engagement Heatmap
              {!subscription && <Badge variant="outline" className="text-[10px]"><Sparkles className="h-2 w-2 mr-1" />Pro</Badge>}
            </h2>
            <div className={`mt-4 glass rounded-2xl p-5 relative overflow-hidden ${!subscription ? "grayscale blur-[2px]" : ""}`}>
              {!subscription && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm text-center p-6">
                  <Shield className="h-7 w-7 text-primary mb-2" />
                  <div className="font-bold text-sm">Unlock Heatmap Analytics</div>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">Visualize crowd density at your booths.</p>
                  <Button asChild size="sm" className="mt-3 bg-brand-gradient text-white text-xs">
                    <Link to="/company/settings">Upgrade</Link>
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-medium text-muted-foreground">Venue: Main Stadium Booths</div>
                <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-muted-foreground">
                  Low <div className="h-1.5 w-10 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-red-500" /> High
                </div>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: 24 }).map((_, i) => {
                  const intensity = Math.random();
                  const color = intensity > 0.8 ? "bg-red-500" : intensity > 0.5 ? "bg-emerald-500" : intensity > 0.2 ? "bg-blue-500" : "bg-muted";
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-md ${color} opacity-40 transition-all hover:scale-110 hover:opacity-100 cursor-help relative group`}
                    >
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[9px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 pointer-events-none">
                        Booth {i+1}: {Math.floor(intensity * 1200)} visits
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg">
                <Info className="h-3 w-3 shrink-0" /> Simulated density from aggregated booth scans.
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Engagement Analytics Chart */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4">Engagement Analytics</h2>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 font-semibold text-sm mb-6">
            <TrendingUp className="h-4 w-4 text-primary" /> Booth Scans (Last 7 Days)
          </div>
          <div className="h-[220px] w-full">
            {(() => {
              if (!visits || visits.length === 0) {
                return <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No engagement data yet.</div>;
              }

              const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() }).map(d => format(d, "MMM dd"));
              const scansByDate = visits.reduce((acc: any, v: any) => {
                const dateStr = format(parseISO(v.created_at), "MMM dd");
                acc[dateStr] = (acc[dateStr] || 0) + 1;
                return acc;
              }, {});

              const chartData = last7Days.map(date => ({
                date,
                scans: scansByDate[date] || 0
              }));

              return (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "12px", border: "1px solid hsl(var(--border))" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    />
                    <Bar dataKey="scans" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-5 transition-all hover:border-primary/10 group">
      <div className={`flex items-center gap-2.5 ${color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-3 text-2xl md:text-3xl font-black tracking-tight">{value}</div>
    </div>
  );
}
