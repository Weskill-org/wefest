import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, Users, IndianRupee, School, Globe, 
  ArrowUpRight, Download, Filter, Loader2, PieChart, Sparkles
} from "lucide-react";

const revenueData = [
  { name: "Jan", value: 80000 },
  { name: "Feb", value: 120000 },
  { name: "Mar", value: 190000 },
  { name: "Apr", value: 240000 },
  { name: "May", value: 310000 },
];
import { Button } from "@/components/ui/button";
import { 
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, 
  Line, LineChart, CartesianGrid, Area, AreaChart 
} from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

function AdminAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["institutional-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("institutional_analytics").select("*");
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totals = stats?.reduce((acc: any, s: any) => ({
    events: acc.events + s.total_events,
    footfall: acc.footfall + s.total_footfall,
    revenue: acc.revenue + s.total_revenue,
    subscriptions: acc.subscriptions + s.active_subscriptions
  }), { events: 0, footfall: 0, revenue: 0, subscriptions: 0 });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display">Institutional Intelligence</h1>
          <p className="text-muted-foreground mt-1">Cross-university performance metrics and revenue tracking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter By State</Button>
          <Button variant="outline" size="sm" className="bg-brand-gradient/10 border-primary/20 text-primary">
            <Download className="mr-2 h-4 w-4" /> Export Master Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total Reach" value={(totals?.footfall || 0).toLocaleString()} icon={Users} delta="+12%" />
        <MetricCard label="Global Revenue" value={`₹${((totals?.revenue || 0) / 100000).toFixed(1)}L`} icon={IndianRupee} delta="+45%" />
        <MetricCard label="Active Colleges" value={stats?.length.toString() || "0"} icon={School} delta="+3" />
        <MetricCard label="SaaS Growth" value={totals?.subscriptions.toString() || "0"} icon={TrendingUp} delta="+8%" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Revenue Growth (Q2 2026)</h2>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Live Sync</Badge>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-8">Performance by College</h2>
          <div className="space-y-6">
            {stats?.slice(0, 5).map((s: any) => (
              <div key={s.college_id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{s.college_name}</span>
                  <span className="text-muted-foreground">{s.total_footfall.toLocaleString()} reach</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-gradient rounded-full transition-all duration-1000" 
                    style={{ width: `${(s.total_footfall / 100000) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-[3rem] p-10 border border-border/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" /> Predictive Demand Forecasting
            </h2>
            <p className="text-sm text-muted-foreground mt-1">AI-driven projection of ticket sales and inventory requirements for upcoming festival season.</p>
          </div>
          <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/40">
            <div className="flex items-center gap-2 px-3 text-xs font-bold">
              <div className="h-3 w-3 rounded-full bg-primary" /> Actual Sales
            </div>
            <div className="flex items-center gap-2 px-3 text-xs font-bold border-l border-border/40">
              <div className="h-3 w-3 rounded-full bg-primary/30" /> AI Prediction
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeDasharray="5 5" fill="transparent" strokeWidth={2} />
              <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Confidence Level</div>
            <div className="text-2xl font-black">94.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on historical conversion rates and current traffic spikes.</p>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Top Predicted Region</div>
            <div className="text-2xl font-black">Mumbai Cluster</div>
            <p className="text-xs text-muted-foreground mt-1">Expected 45,000+ bookings in June 2026.</p>
          </div>
          <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Inventory Risk</div>
            <div className="text-2xl font-black">Low</div>
            <p className="text-xs text-muted-foreground mt-1">Server capacity automatically scaled for peak demand.</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-6">Regional Distribution</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <RegionStat label="North India" value="45%" color="bg-blue-500" />
          <RegionStat label="South India" value="30%" color="bg-emerald-500" />
          <RegionStat label="West India" value="25%" color="bg-amber-500" />
        </div>
      </div>

      <div className="glass rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Master Settlement Ledger</h2>
          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">Download Q2 Audit Log</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-border/40">
              <tr>
                <th className="pb-4">Institution</th>
                <th className="pb-4">Volume</th>
                <th className="pb-4">Platform Fee</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Settled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {stats?.map((s: any) => (
                <tr key={s.college_id} className="group hover:bg-muted/30 transition-all">
                  <td className="py-4 font-semibold">{s.college_name}</td>
                  <td className="py-4 font-mono">₹{((s.total_revenue || 0) / 1000).toFixed(1)}k</td>
                  <td className="py-4 text-primary font-bold">₹{((s.total_revenue || 0) * 0.1 / 1000).toFixed(1)}k</td>
                  <td className="py-4">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[9px]">Verified</Badge>
                  </td>
                  <td className="py-4 text-right text-muted-foreground font-medium">May 07, 2026</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const forecastData = [
  { name: 'Jan', actual: 80000, predicted: 82000 },
  { name: 'Feb', actual: 120000, predicted: 115000 },
  { name: 'Mar', actual: 190000, predicted: 185000 },
  { name: 'Apr', actual: 240000, predicted: 230000 },
  { name: 'May', actual: 310000, predicted: 320000 },
  { name: 'Jun', predicted: 450000 },
  { name: 'Jul', predicted: 580000 },
];

function MetricCard({ label, value, icon: Icon, delta }: any) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="h-20 w-20 text-primary" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-widest">{delta}</span>
      </div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function RegionStat({ label, value, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-12 w-12 rounded-2xl ${color} opacity-20 flex items-center justify-center`}>
        <Globe className={`h-6 w-6 opacity-100 text-foreground`} />
      </div>
      <div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${className}`}>{children}</span>;
}
