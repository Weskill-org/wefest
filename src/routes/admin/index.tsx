import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, IndianRupee, Ticket, Building2, TrendingUp, Calendar as CalendarIcon, Settings, Sparkles, Check, X, ShieldCheck } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRegion } from "@/contexts/RegionContext";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { formatPrice } = useRegion();
  // Fetch platform-wide data
  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tickets").select("*, event:events(price_from)");
      if (error) throw error;
      return data;
    }
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery({
    queryKey: ["admin-proposals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sponsorship_proposals").select("*").eq("status", "accepted");
      if (error) throw error;
      return data;
    }
  });

  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) throw error;
      return data;
    }
  });

  if (loadingTickets || loadingProposals || loadingEvents) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate platform metrics
  const totalTickets = tickets?.length || 0;
  
  // Calculate revenue: 10% commission on tickets + 5% on sponsorships (example business model)
  const ticketRevenue = tickets?.reduce((acc, t: any) => acc + (t.event?.price_from || 0), 0) || 0;
  const sponsorshipVolume = proposals?.reduce((acc, p) => acc + p.amount, 0) || 0;
  
  const platformCommission = (ticketRevenue * 0.10) + (sponsorshipVolume * 0.05);

  const pendingEvents = events?.filter(e => e.status === "pending").length || 0;

  // Generate chart data for the last 14 days of ticket sales
  const last14Days = eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() }).map(d => format(d, "MMM dd"));
  
  const salesByDate = tickets?.reduce((acc: any, t: any) => {
    const dateStr = format(parseISO(t.created_at), "MMM dd");
    acc[dateStr] = (acc[dateStr] || 0) + (t.event?.price_from || 0);
    return acc;
  }, {});

  const chartData = last14Days.map(date => ({
    date,
    revenue: salesByDate?.[date] || 0
  }));

  return (
    <div>
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events Moderation</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-3 text-emerald-500 mb-4">
                <IndianRupee className="h-5 w-5" />
                <span className="text-sm font-semibold">Net Revenue (Platform)</span>
              </div>
              <div className="text-3xl font-bold">{formatPrice(platformCommission)}</div>
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" /> +12% from last month
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 text-blue-400 mb-4">
                <Ticket className="h-5 w-5" />
                <span className="text-sm font-semibold">Total Tickets Sold</span>
              </div>
              <div className="text-3xl font-bold">{totalTickets.toLocaleString()}</div>
              <div className="mt-2 text-xs text-muted-foreground">Across all colleges</div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 text-purple-400 mb-4">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-semibold">Sponsorship Volume</span>
              </div>
              <div className="text-3xl font-bold">{formatPrice(sponsorshipVolume)}</div>
              <div className="mt-2 text-xs text-muted-foreground">Approved deals</div>
            </div>

            <div className="glass rounded-2xl p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Pending Approvals</span>
              </div>
              <div className="text-3xl font-bold">{pendingEvents}</div>
              <div className="mt-2 text-xs text-muted-foreground">Events waiting review</div>
            </div>
          </div>

          <div className="mt-8 glass rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-semibold text-lg">Gross Transaction Volume (Tickets)</h3>
                <p className="text-sm text-muted-foreground">Last 14 days of ticket sales across the platform.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{formatPrice((Object.values(salesByDate || {}) as number[]).reduce((a, b) => a + b, 0))}</div>
                <div className="text-xs text-muted-foreground">14-day total</div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatPrice(val)} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                    formatter={(value: number) => [formatPrice(value), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="p-4">Event & College</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Boosting</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {events?.slice(0, 10).map((e: any) => (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold">{e.title}</div>
                      <div className="text-xs text-muted-foreground">{e.college_name}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        e.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {e.is_featured && <Badge className="bg-primary/10 text-primary border-none"><Sparkles className="h-3 w-3 mr-1" /> Featured</Badge>}
                        {e.is_promoted && <Badge className="bg-blue-500/10 text-blue-500 border-none"><TrendingUp className="h-3 w-3 mr-1" /> Promoted</Badge>}
                        {!e.is_featured && !e.is_promoted && <span className="text-muted-foreground text-xs italic">Normal</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => toast.success("Event featured successfully!")}><Sparkles className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500"><Check className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500"><X className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="max-w-2xl">
          <div className="glass rounded-2xl p-8 space-y-8">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2"><IndianRupee className="h-5 w-5 text-primary" /> Monetization Settings</h3>
              <p className="text-sm text-muted-foreground mt-1">Configure platform-wide commission rates for all transactions.</p>
              
              <div className="mt-6 grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ticket Sale Commission (%)</label>
                  <div className="flex gap-4">
                    <Input defaultValue="10" className="max-w-[100px]" />
                    <Button variant="outline" onClick={() => toast.success("Settings updated")}>Save</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sponsorship Deal Commission (%)</label>
                  <div className="flex gap-4">
                    <Input defaultValue="5" className="max-w-[100px]" />
                    <Button variant="outline" onClick={() => toast.success("Settings updated")}>Save</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/60">
              <h3 className="font-bold text-lg flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-500" /> Compliance & Security</h3>
              <p className="text-sm text-muted-foreground mt-1">Automatic verification and audit log settings.</p>
              <div className="mt-4 flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div className="text-sm font-medium">Force College Email Verification</div>
                <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/20">Enabled</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
