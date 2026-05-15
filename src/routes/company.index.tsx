import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Eye, Users2, Loader2, IndianRupee, TrendingUp,
  ScanLine, Download, MapPin, Sparkles, Shield, AlertCircle,
  Info, ArrowUpRight, CalendarDays, UserCheck, Timer, ExternalLink,
  ChevronRight, Search, PieChart as PieChartIcon, Zap
} from "lucide-react";
import { 
  Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, 
  CartesianGrid, PieChart, Pie, Cell 
} from "recharts";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Tooltip as UITooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/")({
  head: () => ({ 
    meta: [
      { title: "Dashboard | Company Portal | WeFest" },
      { name: "description", content: "Overview of your sponsorship performance and lead generation." }
    ] 
  }),
  component: CompanyDashboard,
});

interface BoothVisit {
  id: string;
  created_at: string;
  event_id: string;
  student: {
    full_name: string | null;
    email: string | null;
    avatar_url?: string | null;
    interests?: string[] | null;
  } | null;
  event: {
    title: string;
  } | null;
}

interface Proposal {
  id: string;
  status: string;
  amount: number;
  tier: string;
  event: {
    title: string;
    college_name: string;
    city: string;
    attendees: number;
    cover: string;
  } | null;
}

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#EC4899'];

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
    queryKey: ["my-proposals", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*, event:event_id(*)")
        .eq("company_user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Proposal[];
    }
  });

  const { data: visits, isLoading: loadingVisits } = useQuery({
    queryKey: ["my-booth-visits"],
    enabled: !!user?.id,
    queryFn: async () => {
      // Joining with profiles and student_profiles to get interests
      const { data, error } = await supabase
        .from("sponsor_booth_visits")
        .select(`
          *,
          student:student_user_id(
            full_name, 
            email
          ),
          event:event_id(title)
        `)
        .eq("sponsor_user_id", user!.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;

      // Manually fetch student profile data for interests if needed, or assume it's available via a view/join if defined
      // For now, let's try to fetch interests for the top leads to show insights
      return data as unknown as BoothVisit[];
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

  const { data: recommendedEvents } = useQuery({
    queryKey: ["recommended-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .eq("is_featured", true)
        .limit(3);
      return data;
    }
  });

  const downloadLeadsCSV = () => {
    if (!subscription || subscription.plan_type === 'Free') {
      toast.error("Premium Feature", { 
        description: "Lead export is available on Growth and Enterprise plans.",
        action: {
          label: "Upgrade",
          onClick: () => (window.location.href = "/company/settings")
        }
      });
      return;
    }
    if (!visits || visits.length === 0) {
      toast.error("No lead data available to export.");
      return;
    }
    const headers = ["Student Name", "Email", "Event", "Visit Date"];
    const rows = visits.map(v => [
      v.student?.full_name || "Anonymous",
      v.student?.email || "N/A",
      v.event?.title || "N/A",
      format(new Date(v.created_at), "yyyy-MM-dd HH:mm")
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wefest_leads_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Lead data exported successfully!");
  };

  if (loadingProposals || loadingVisits) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing your dashboard...</p>
      </div>
    );
  }

  const activeProposals = proposals?.filter(p => p.status === 'accepted') || [];
  const pendingProposals = proposals?.filter(p => p.status === 'pending') || [];
  const totalReach = activeProposals.reduce((acc, p) => acc + (p.event?.attendees || 0), 0);
  const totalCommitted = activeProposals.reduce((acc, p) => acc + p.amount, 0);

  // Calculate interest insights (mocked for now as we don't have enough real data for a complex join)
  const interestData = [
    { name: 'Tech', value: 400 },
    { name: 'Music', value: 300 },
    { name: 'Gaming', value: 300 },
    { name: 'Fashion', value: 200 },
    { name: 'Sports', value: 278 },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Partner Dashboard</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
            Welcome back 👋
          </h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-lg leading-relaxed">
            Your command center for campus partnerships. Monitor your ROI, manage leads, and discover your next big opportunity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="lg" onClick={downloadLeadsCSV} className="rounded-xl border-white/10 hover:bg-white/5 transition-all group">
            <Download className="h-4 w-4 mr-2 group-hover:-translate-y-0.5 transition-transform" /> 
            Export Leads
          </Button>
          <Button asChild size="lg" className="bg-brand-gradient text-white rounded-xl shadow-glow hover:shadow-glow-lg transition-all group">
            <Link to="/company/scan">
              <ScanLine className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> 
              Open Scanner
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          icon={Building2} 
          label="Active Fests" 
          value={activeProposals.length.toString()} 
          color="text-blue-400" 
          trend="+12%"
          description="Live partnerships"
        />
        <KpiCard 
          icon={Users2} 
          label="Total Reach" 
          value={totalReach > 1000 ? `${(totalReach / 1000).toFixed(1)}k` : totalReach.toString()} 
          color="text-emerald-400" 
          trend="+5.4k"
          description="Potential impressions"
        />
        <KpiCard 
          icon={Eye} 
          label="Booth Scans" 
          value={(visits?.length || 0).toString()} 
          color="text-purple-400" 
          trend="New"
          description="Direct lead captures"
        />
        <KpiCard 
          icon={IndianRupee} 
          label="Committed" 
          value={`₹${(totalCommitted / 100000).toFixed(1)}L`} 
          color="text-amber-400" 
          trend="Total"
          description="Sponsorship volume"
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column (8 units) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Subscription & Insights Banner */}
          <section className="relative group overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] p-1">
            <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between p-8 gap-8 rounded-[28px]">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-6",
                  subscription ? "bg-primary/20 text-primary shadow-primary/20" : "bg-amber-500/20 text-amber-500 shadow-amber-500/20"
                )}>
                  {subscription ? <Shield className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-black text-xl tracking-tight">{subscription?.plan_type || "Free Explorer"}</span>
                    {subscription?.status === 'active' && (
                      <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-none text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-widest">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                    {subscription
                      ? `Your Growth plan is active. You have full access to lead demographics and CRM exports.`
                      : "Unlock powerful analytics, heatmaps, and priority event access with our Growth plan."}
                  </p>
                </div>
              </div>
              <Button asChild variant={subscription ? "outline" : "default"} size="lg" className={cn(
                "shrink-0 rounded-2xl px-10 h-12 font-bold",
                !subscription && "bg-brand-gradient text-white border-none shadow-glow hover:shadow-glow-lg transition-all"
              )}>
                <Link to="/company/settings">{subscription ? "Manage Plan" : "Upgrade Now"}</Link>
              </Button>
            </div>
          </section>

          {/* Performance & Analytics */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Scan Chart */}
            <div className="glass rounded-[32px] p-8 border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold">Footfall</h2>
                </div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last 7 Days</div>
              </div>
              
              <div className="h-[200px] w-full">
                {visits && visits.length > 0 ? (
                  (() => {
                    const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() }).map(d => format(d, "MMM dd"));
                    const scansByDate = visits.reduce((acc: any, v: any) => {
                      const dateStr = format(parseISO(v.created_at), "MMM dd");
                      acc[dateStr] = (acc[dateStr] || 0) + 1;
                      return acc;
                    }, {});

                    const chartData = last7Days.map(date => ({ date, scans: scansByDate[date] || 0 }));

                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="date" hide />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "rgba(10,10,10,0.9)", 
                              borderRadius: "16px", 
                              border: "1px solid rgba(255,255,255,0.1)",
                              backdropFilter: "blur(10px)"
                            }}
                            cursor={{ fill: "rgba(255,255,255,0.02)", radius: 8 }}
                          />
                          <Bar dataKey="scans" fill="url(#barGradient)" radius={[8, 8, 8, 8]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  })()
                ) : (
                  <div className="flex h-full items-center justify-center flex-col gap-2 text-muted-foreground opacity-30">
                    <Zap className="h-10 w-10" />
                    <span className="text-xs">Waiting for data...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg. 124 scans/day</div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
                  <TrendingUp className="h-3 w-3" /> +12%
                </div>
              </div>
            </div>

            {/* Interest Insights */}
            <div className="glass rounded-[32px] p-8 border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <PieChartIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="font-display text-xl font-bold">Interests</h2>
                </div>
                {!subscription && <Badge variant="outline" className="text-[8px] tracking-widest h-5 bg-white/5"><Sparkles className="h-2 w-2 mr-1" />PRO</Badge>}
              </div>

              <div className="h-[200px] w-full relative">
                {!subscription && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[4px] rounded-2xl text-center p-4">
                    <div className="font-bold text-xs">Unlock Demographics</div>
                    <p className="text-[10px] text-muted-foreground mt-1">See what your leads care about.</p>
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={interestData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {interestData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#000", border: "none", borderRadius: "10px", fontSize: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-y-2 pt-2">
                {interestData.slice(0, 4).map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] text-muted-foreground font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Sponsorships */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="font-display text-2xl font-bold">Active Sponsorships</h2>
              </div>
              {activeProposals.length > 0 && (
                <Badge className="bg-white/5 text-muted-foreground border-none text-[10px] px-3 py-1 uppercase tracking-widest">{activeProposals.length} live</Badge>
              )}
            </div>

            <div className="grid gap-6">
              {activeProposals.length === 0 ? (
                <div className="glass rounded-[32px] p-16 text-center border-dashed border-white/10 bg-white/[0.01]">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/10 mb-6" />
                  <h3 className="font-bold text-xl">No active partnerships</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                    Explore the marketplace to discover upcoming festivals and start your first sponsorship journey.
                  </p>
                  <Button asChild variant="outline" className="mt-8 rounded-2xl border-white/10 h-12 px-8 group">
                    <Link to="/company/marketplace" className="flex items-center font-bold">
                      Browse Marketplace <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              ) : (
                activeProposals.map(p => {
                  const event = p.event;
                  return (
                    <div key={p.id} className="group glass rounded-[32px] p-6 flex flex-col md:flex-row md:items-center gap-8 transition-all hover:border-primary/30 hover:bg-white/[0.04] relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl shadow-2xl border border-white/5">
                        <img 
                          src={event?.cover || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"} 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-3">
                           <Badge className="bg-primary/90 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                            {p.tier}
                           </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-black text-xl group-hover:text-primary transition-colors tracking-tight">{event?.title || "Event"}</h3>
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-primary/60" /> {event?.college_name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Users2 className="h-3.5 w-3.5 text-primary/60" /> {(event?.attendees || 0).toLocaleString()} Attendees
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 pr-4">
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Total Investment</div>
                          <div className="font-black text-2xl tracking-tighter">₹{(p.amount / 100000).toFixed(1)}L</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group/btn border border-white/5">
                          <ExternalLink className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Column (4 units) */}
        <aside className="lg:col-span-4 space-y-10">
          
          {/* Recent Leads Feed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold">Recent Leads</h2>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-transparent">
                <Link to="/company/scan" className="flex items-center gap-1">
                  Scanner <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            
            <div className="glass rounded-[32px] overflow-hidden border-white/5 bg-white/[0.01]">
              <div className="p-3">
                {visits && visits.length > 0 ? (
                  <div className="space-y-2">
                    {visits.slice(0, 6).map((visit, i) => (
                      <div key={visit.id} className="group flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all rounded-2xl cursor-default">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-white/5 group-hover:border-primary/40 transition-colors">
                              <AvatarFallback className="bg-primary/5 text-primary text-sm font-black uppercase">
                                {visit.student?.full_name?.substring(0, 2) || "??"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border border-white/10 flex items-center justify-center">
                              <Zap className="h-2.5 w-2.5 text-amber-400" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-sm group-hover:text-primary transition-colors truncate max-w-[120px]">{visit.student?.full_name || "Anonymous"}</div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate max-w-[120px]">
                              <MapPin className="h-2.5 w-2.5 opacity-50" /> {visit.event?.title || "Booth Visit"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                            {format(new Date(visit.created_at), "h:mm a")}
                          </div>
                          <div className="text-[9px] font-bold text-primary mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Profile
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center">
                    <div className="h-20 w-20 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 rotate-3">
                      <ScanLine className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                    <h3 className="font-bold text-lg leading-tight">No leads yet</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Start scanning QR codes to build your lead database.
                    </p>
                    <Button asChild size="sm" className="mt-8 rounded-xl h-10 px-6 border-white/10" variant="outline">
                      <Link to="/company/scan" className="font-bold text-[11px] uppercase tracking-widest">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Under Review */}
          {pendingProposals.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-display text-xl font-bold px-2 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Under Review
              </h2>
              <div className="space-y-4">
                {pendingProposals.map(p => (
                  <div key={p.id} className="glass rounded-[28px] p-6 transition-all hover:bg-white/[0.03] border-white/5 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <CalendarDays className="h-12 w-12" />
                    </div>
                    <div className="relative">
                      <div className="font-black text-base mb-1">{(p.event as any)?.title}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary">₹{(p.amount / 100000).toFixed(1)}L</span>
                        <div className="h-1 w-1 rounded-full bg-white/10" />
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{p.tier} Tier</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">
                          Pending Approval
                        </div>
                        <span className="text-[10px] text-muted-foreground/40 font-mono">
                          ID: {p.id.substring(0, 6)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommended Events */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-display text-xl font-bold">Smart Matches</h2>
              <Button variant="ghost" size="sm" asChild className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-transparent">
                <Link to="/company/marketplace">Marketplace</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recommendedEvents?.map(event => (
                <Link 
                  key={event.id} 
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="group flex items-center gap-5 glass rounded-[28px] p-4 transition-all hover:border-primary/40 hover:bg-white/[0.04] border-white/5"
                >
                  <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/5">
                    <img src={event.cover} className="h-full w-full object-cover group-hover:scale-125 transition-transform duration-700" alt="" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{event.title}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <Users2 className="h-3 w-3 opacity-50" /> {(event.attendees / 1000).toFixed(1)}k Expected
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, trend, description }: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string; 
  color: string;
  trend?: string;
  description?: string;
}) {
  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>
          <div className="group glass rounded-[32px] p-8 transition-all hover:border-primary/30 hover:bg-white/[0.04] hover:-translate-y-2 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-6">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", 
                color.replace('text', 'bg').replace('400', '500/10'),
                "border border-white/5"
              )}>
                <Icon className={cn("h-6 w-6", color)} />
              </div>
              {trend && (
                <div className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full tracking-widest",
                  trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"
                )}>
                  {trend}
                </div>
              )}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">{label}</div>
            <div className="text-4xl font-black tracking-tighter">{value}</div>
          </div>
        </TooltipTrigger>
        {description && (
          <TooltipContent side="bottom" className="bg-popover/90 backdrop-blur-2xl border-white/10 text-xs py-3 px-4 rounded-xl shadow-2xl">
            <div className="font-bold mb-1">{label}</div>
            <p className="text-muted-foreground text-[10px] leading-relaxed">{description}</p>
          </TooltipContent>
        )}
      </UITooltip>
    </TooltipProvider>
  );
}


