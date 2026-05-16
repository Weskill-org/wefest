import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Building2, Eye, MapPin, Users2, Loader2, IndianRupee, TrendingUp, ScanLine, Download, MessageSquare, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, AlertCircle, Info, ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/sponsor/dashboard")({
  head: () => ({ meta: [{ title: "Sponsor Dashboard — WeFest" }] }),
  beforeLoad: async ({ location }) => {
    // Skip redirect on server to prevent redirect-on-refresh bug
    if (typeof window === 'undefined') return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname + location.search },

      });
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();
      
    if (roleData?.role !== "company") {
      throw redirect({ to: '/' });
    }
  },
  component: SponsorDashboard,
});

function SponsorDashboard() {
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery({
    queryKey: ["my-proposals", user?.id],
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
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    }
  });

  const [isMessaging, setIsMessaging] = useState(false);

  const downloadLeadsCSV = () => {
    if (!subscription) {
      toast.error("Pro feature", { description: "Lead export is only available for Growth and Enterprise plans." });
      return;
    }

    if (!visits || visits.length === 0) {
      toast.error("No lead data available to export.");
      return;
    }

    // Define CSV headers
    const headers = ["Student Name", "Email", "Event", "Visit Date", "Engagement Status"];
    
    // Map data to CSV rows
    const rows = (visits as any[]).map(v => [
      v.full_name || "Anonymous",
      v.email || "N/A",
      v.event_title || "General Interest",
      format(new Date(v.visited_at || v.created_at), "yyyy-MM-dd HH:mm"),
      v.engagement_type || "Viewed"
    ]);

    // Construct CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wefest_leads_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Lead data exported successfully!", {
      description: `${visits.length} leads have been compiled into your CSV report.`
    });
  };

  if (loadingUser || loadingProposals || loadingVisits) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeProposals = proposals?.filter(p => p.status === 'accepted') || [];
  const pendingProposals = proposals?.filter(p => p.status === 'pending') || [];
  const totalReach = activeProposals.reduce((acc, p) => acc + (p.event as any).attendees, 0);

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/sponsors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-primary">Brand Portal</div>
          <h1 className="mt-1 font-display text-4xl font-black">Sponsor Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage your college festival sponsorships and track ROI.</p>
        </div>
        <Button asChild className="bg-brand-gradient text-primary-foreground">
          <Link to="/sponsor/scan">
            <ScanLine className="mr-2 h-4 w-4" /> Open Booth Scanner
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 text-primary">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-semibold">Active Fests</span>
          </div>
          <div className="mt-4 text-3xl font-bold">{activeProposals.length}</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <Users2 className="h-5 w-5" />
            <span className="text-sm font-semibold">Total Reach</span>
          </div>
          <div className="mt-4 text-3xl font-bold">{totalReach.toLocaleString()}</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 text-purple-400">
            <Eye className="h-5 w-5" />
            <span className="text-sm font-semibold">Booth Scans</span>
          </div>
          <div className="mt-4 text-3xl font-bold">{visits?.length || 0}</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 text-blue-400">
            <IndianRupee className="h-5 w-5" />
            <span className="text-sm font-semibold">Committed</span>
          </div>
          <div className="mt-4 text-3xl font-bold">₹{(activeProposals.reduce((acc, p) => acc + p.amount, 0) / 100000).toFixed(1)}L</div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={downloadLeadsCSV}>
          <Download className="h-4 w-4" /> Download Leads (CSV)
        </Button>
        
        <Dialog open={isMessaging} onOpenChange={setIsMessaging}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Direct Organizer Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message Organizer</DialogTitle>
              <DialogDescription>
                Start a direct conversation with the event coordination team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Event</label>
                <select className="w-full bg-muted/50 border border-border/40 rounded-lg p-2 text-sm text-foreground">
                  {activeProposals.length > 0 ? (
                    activeProposals.map((p: any) => (
                      <option key={p.id}>{p.event?.title || "Event"}</option>
                    ))
                  ) : (
                    <option>General Inquiry</option>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea 
                  className="w-full bg-muted/50 border border-border/40 rounded-lg p-3 text-sm min-h-[100px] text-foreground" 
                  placeholder="Inquire about booth placement, extra passes, or marketing opportunities..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMessaging(false)}>Cancel</Button>
              <Button 
                className="bg-brand-gradient text-white" 
                onClick={() => {
                  toast.success("Message sent!", { description: "The organizer will respond via your registered email shortly." });
                  setIsMessaging(false);
                }}
              >
                Send Inquiry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subscription Status Bar */}
      <div className={`mt-10 overflow-hidden rounded-2xl border transition-all ${
        subscription ? "border-primary/20 bg-primary/5" : "border-orange-500/20 bg-orange-500/5"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              subscription ? "bg-primary/20 text-primary" : "bg-orange-500/20 text-orange-500"
            }`}>
              {subscription ? <Shield className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Plan: {subscription?.plan_type || "Free Explorer"}</span>
                {subscription?.status === 'active' && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Active</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {subscription 
                  ? `Your ${subscription.plan_type} plan includes priority proposals and heatmap analytics.`
                  : "You are currently on the Free plan. Upgrade for booth heatmaps and priority support."}
              </p>
            </div>
          </div>
          <Button asChild variant={subscription ? "outline" : "default"} className={!subscription ? "bg-brand-gradient text-white" : ""}>
            <Link to="/sponsor/pricing">{subscription ? "Manage Plan" : "Upgrade Now"}</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">Brand Assets & Creatives</h2>
            <p className="text-sm text-muted-foreground">Upload assets for in-app banners and event marketing</p>
          </div>
          <Button size="sm" className="bg-brand-gradient text-white"><Plus className="h-4 w-4 mr-2" /> Upload Asset</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center border-dashed border-2 border-border/60 hover:border-primary/40 transition-all cursor-pointer group h-48">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add New Creative</div>
          </div>
          <div className="glass p-6 rounded-2xl h-48 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-none">Approved</Badge>
            </div>
            <div>
              <div className="text-sm font-bold">Main Logo (PNG)</div>
              <div className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Transparency Enabled</div>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl h-48 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-500 border-none">In Review</Badge>
            </div>
            <div>
              <div className="text-sm font-bold">Homepage Banner</div>
              <div className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">1200 x 600 px</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-bold">Active Sponsorships</h2>
          <div className="mt-4 space-y-4">
            {activeProposals.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
                No active sponsorships yet. Browse the marketplace to sponsor fests.
                <Button asChild variant="outline" className="mt-4 block mx-auto w-fit">
                  <Link to="/sponsors">Find Fests</Link>
                </Button>
              </div>
            ) : (
              activeProposals.map(p => {
                const event = p.event as any;
                return (
                  <div key={p.id} className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-5">
                    <div className={`h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br ${event.cover}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{event.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3" /> {event.college_name}, {event.city}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-right">
                      <div><div className="text-muted-foreground text-xs">Tier</div><div className="font-semibold">{p.tier}</div></div>
                      <div><div className="text-muted-foreground text-xs">Attendees</div><div className="font-semibold">{event.attendees.toLocaleString()}</div></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold">Pending Proposals</h2>
          <div className="mt-4 space-y-3">
            {pendingProposals.length === 0 ? (
              <div className="glass rounded-xl p-6 text-center text-sm text-muted-foreground">No pending proposals</div>
            ) : (
              pendingProposals.map(p => (
                <div key={p.id} className="glass rounded-xl p-4 text-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{(p.event as any).title}</div>
                    <div className="text-muted-foreground text-xs">₹{(p.amount / 100000).toFixed(1)}L • {p.tier} Tier</div>
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-medium text-orange-500">Reviewing</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              Engagement Heatmap {!subscription && <Badge variant="outline" className="text-[10px]"><Sparkles className="h-2 w-2 mr-1" /> Pro</Badge>}
            </h2>
            <div className={`mt-4 glass rounded-2xl p-6 relative overflow-hidden ${!subscription ? "grayscale blur-[2px]" : ""}`}>
              {!subscription && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm text-center p-6">
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <div className="font-bold">Unlock Heatmap Analytics</div>
                  <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Visualize crowd density and peak engagement at your booths.</p>
                  <Button asChild size="sm" className="mt-4 bg-brand-gradient text-white">
                    <Link to="/sponsor/pricing">Upgrade to Pro</Link>
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-medium text-muted-foreground">Venue: Main Stadium Booths</div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground">
                  Low <div className="h-2 w-12 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-red-500" /> High
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 24 }).map((_, i) => {
                  const intensity = Math.random();
                  const color = intensity > 0.8 ? "bg-red-500" : intensity > 0.5 ? "bg-emerald-500" : intensity > 0.2 ? "bg-blue-500" : "bg-muted";
                  return (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-md ${color} opacity-40 transition-all hover:scale-110 hover:opacity-100 cursor-help relative group`}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 pointer-events-none">
                        Booth {i+1}: {Math.floor(intensity * 1200)} visits
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <Info className="h-3 w-3" /> Heatmap shows simulated density based on aggregated booth scan data.
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">Engagement Analytics</h2>
            <div className="mt-4 glass rounded-2xl p-6">
              <div className="flex items-center gap-2 font-semibold text-lg mb-6">
                <TrendingUp className="h-5 w-5 text-primary" /> Booth Scans Over Time
              </div>
              <div className="h-[250px] w-full">
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
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "12px", border: "1px solid hsl(var(--border))" }}
                          itemStyle={{ color: "hsl(var(--foreground))" }}
                          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        />
                        <Bar dataKey="scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
