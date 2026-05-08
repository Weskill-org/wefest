import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, IndianRupee, Activity, Check, X, Ticket, Loader2, ShoppingBag, Zap, Mic2, Star, Wallet, Send, Plus, BarChart3, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";

export const Route = createFileRoute("/organizer/events/$eventId")({
  loader: async ({ params }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.eventId)
      .eq("organizer_user_id", user.id)
      .single();
    
    if (error || !event) throw notFound();
    return event;
  },
  component: OrganizerEventDashboard,
});

function OrganizerEventDashboard() {
  const event = Route.useLoaderData();
  const queryClient = useQueryClient();

  const { data: volunteers, isLoading: loadingVols } = useQuery({
    queryKey: ["volunteers", event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*, user:user_id(email, raw_user_meta_data)")
        .eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery({
    queryKey: ["proposals", event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*, company:company_user_id(email, raw_user_meta_data)")
        .eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ["event-tickets-sold", event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: eventProducts } = useQuery({
    queryKey: ["event-products", event.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: eventPrograms } = useQuery({
    queryKey: ["event-programs", event.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("ambassador_programs").select("*").eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: budgets } = useQuery({
    queryKey: ["event-budgets", event.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_budgets").select("*").eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: campaigns } = useQuery({
    queryKey: ["marketing-campaigns", event.college_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("marketing_campaigns").select("*").eq("college_id", event.college_id);
      if (error) throw error;
      return data;
    }
  });

  const { data: vendorPayouts } = useQuery({
    queryKey: ["vendor-payouts", event.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_payouts").select("*").eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });

  const updateVolMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from("volunteers").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Volunteer status updated");
      queryClient.invalidateQueries({ queryKey: ["volunteers", event.id] });
    }
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from("sponsorship_proposals").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sponsorship status updated");
      queryClient.invalidateQueries({ queryKey: ["proposals", event.id] });
    }
  });

  const totalRevenue = tickets?.length ? tickets.length * event.price_from : 0;
  const pendingVols = volunteers?.filter(v => v.status === "pending") || [];
  const activeVols = volunteers?.filter(v => v.status === "approved") || [];
  const pendingProposals = proposals?.filter(p => p.status === "pending") || [];
  const activeProposals = proposals?.filter(p => p.status === "accepted") || [];

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/organizer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Organizer Suite
      </Link>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black">{event.title}</h1>
          <div className="text-sm text-muted-foreground mt-1">Manage analytics, volunteers, and operations</div>
        </div>
        <Button asChild variant="outline">
          <Link to="/events/$eventId" params={{ eventId: event.id }}>View public page</Link>
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="mt-10">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers ({activeVols.length})</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors ({activeProposals.length})</TabsTrigger>
          <TabsTrigger value="merch">Merchandise ({eventProducts?.length || 0})</TabsTrigger>
          <TabsTrigger value="ambassadors">Ambassadors ({eventPrograms?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* ... existing analytics content ... */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <IndianRupee className="h-5 w-5" />
                <span className="text-sm font-semibold">Total Revenue</span>
              </div>
              <div className="mt-4 text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Ticket className="h-5 w-5" />
                <span className="text-sm font-semibold">Tickets Sold</span>
              </div>
              <div className="mt-4 text-3xl font-bold">{tickets?.length || 0}</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 text-purple-400">
                <Activity className="h-5 w-5" />
                <span className="text-sm font-semibold">Expected Footfall</span>
              </div>
              <div className="mt-4 text-3xl font-bold">{event.attendees.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass rounded-2xl p-8 md:col-span-2">
              <h3 className="font-semibold text-lg mb-6">Ticket Sales Velocity</h3>
              <div className="h-[250px] w-full">
                {(() => {
                  if (!tickets || tickets.length === 0) {
                    return <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No sales data yet.</div>;
                  }
                  
                  // Group by date
                  const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() }).map(d => format(d, "MMM dd"));
                  const salesByDate = tickets.reduce((acc: any, t: any) => {
                    const dateStr = format(parseISO(t.created_at), "MMM dd");
                    acc[dateStr] = (acc[dateStr] || 0) + 1;
                    return acc;
                  }, {});
                  
                  const chartData = last7Days.map(date => ({
                    date,
                    sales: salesByDate[date] || 0
                  }));

                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "12px", border: "1px solid hsl(var(--border))" }}
                          itemStyle={{ color: "hsl(var(--foreground))" }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="font-semibold text-lg mb-6">Sales by Tier</h3>
              <div className="h-[200px] w-full flex flex-col items-center justify-center">
                {(() => {
                  if (!tickets || tickets.length === 0) {
                    return <div className="text-muted-foreground text-sm">No sales data yet.</div>;
                  }
                  const tierCounts = tickets.reduce((acc: any, t: any) => {
                    acc[t.tier] = (acc[t.tier] || 0) + 1;
                    return acc;
                  }, {});
                  
                  const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];
                  const pieData = Object.entries(tierCounts).map(([name, value], idx) => ({ name, value, color: COLORS[idx % COLORS.length] }));

                  return (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                            {pieData.map((entry: any, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "12px", border: "1px solid hsl(var(--border))" }}
                            itemStyle={{ color: "hsl(var(--foreground))" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
                        {pieData.map(d => (
                          <div key={d.name} className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} /> {d.name} ({String(d.value)})
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Event Budget Tracking</h3>
              <p className="text-sm text-muted-foreground">Monitor allocated vs. spent amounts across categories</p>
            </div>
            <Button size="sm" className="bg-brand-gradient text-white"><Plus className="h-4 w-4 mr-2" /> New Budget</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="glass rounded-2xl p-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Budget</div>
              <div className="text-2xl font-black">₹{(budgets?.reduce((acc, b) => acc + b.allocated_amount, 0) || 0).toLocaleString()}</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Spent</div>
              <div className="text-2xl font-black text-red-400">₹{(budgets?.reduce((acc, b) => acc + b.spent_amount, 0) || 0).toLocaleString()}</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Remaining</div>
              <div className="text-2xl font-black text-emerald-400">
                ₹{((budgets?.reduce((acc, b) => acc + b.allocated_amount, 0) || 0) - (budgets?.reduce((acc, b) => acc + b.spent_amount, 0) || 0)).toLocaleString()}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Burn Rate</div>
              <div className="text-2xl font-black text-blue-400">
                {budgets?.length ? Math.round(((budgets?.reduce((acc, b) => acc + b.spent_amount, 0) || 0) / (budgets?.reduce((acc, b) => acc + b.allocated_amount, 0) || 1)) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-8">
              <h4 className="font-bold mb-6 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Budget Allocation</h4>
              <div className="space-y-6">
                {budgets?.map(budget => (
                  <div key={budget.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{budget.category}</span>
                      <span className="text-muted-foreground">₹{budget.spent_amount.toLocaleString()} / ₹{budget.allocated_amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${budget.spent_amount > budget.allocated_amount ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min((budget.spent_amount / budget.allocated_amount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {(!budgets || budgets.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No budget categories defined yet.</div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" /> Recent Expenses</h4>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                <div className="text-center py-12 text-muted-foreground text-sm">Expense tracking module ready. Add an expense to begin.</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border border-border/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display text-xl font-bold">Vendor Payouts & Tax Recon</h3>
                <p className="text-sm text-muted-foreground">Manage payments to external vendors and verify GST compliance</p>
              </div>
              <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Schedule Payout</Button>
            </div>
            {vendorPayouts && vendorPayouts.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-border/60">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium">Vendor</th>
                      <th className="p-4 font-medium">Amount</th>
                      <th className="p-4 font-medium">Tax (GST)</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {vendorPayouts.map(p => (
                      <tr key={p.id}>
                        <td className="p-4 font-medium">{p.vendor_name}</td>
                        <td className="p-4 font-bold">₹{p.amount.toLocaleString()}</td>
                        <td className="p-4 text-muted-foreground">₹{p.tax_amount.toLocaleString()} (18%)</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${
                            p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm">Invoice</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center glass rounded-2xl">
                <p className="text-sm text-muted-foreground font-medium">No vendor payouts scheduled yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Marketing & Notifications</h3>
              <p className="text-sm text-muted-foreground">Automate reach-out to students via Email, SMS, or Push</p>
            </div>
            <Button size="sm" className="bg-brand-gradient text-white"><Send className="h-4 w-4 mr-2" /> Create Campaign</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {campaigns?.map(campaign => (
              <div key={campaign.id} className="glass p-6 rounded-2xl border border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    campaign.status === 'sent' ? 'bg-emerald-500/10 text-emerald-500' : 
                    campaign.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {campaign.status}
                  </div>
                  <div className="text-xs text-muted-foreground">{campaign.channel.toUpperCase()}</div>
                </div>
                <h4 className="font-bold mb-2">{campaign.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{campaign.message_content}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">{campaign.target_segment.replace('_', ' ')}</div>
                  <Button variant="ghost" size="sm" className="h-8">Details</Button>
                </div>
              </div>
            ))}
            {(!campaigns || campaigns.length === 0) && (
              <div className="col-span-full py-12 glass rounded-2xl text-center text-muted-foreground">
                No marketing campaigns active. Reach out to your audience to drive sales!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Pending Requests ({pendingVols.length})</h3>
            {pendingVols.length === 0 ? (
              <div className="text-sm text-muted-foreground glass p-6 rounded-xl text-center">No pending requests</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pendingVols.map(v => (
                  <div key={v.id} className="glass p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-medium">{(v.user as any)?.raw_user_meta_data?.full_name || (v.user as any)?.email}</div>
                      <div className="text-xs text-muted-foreground">Applied for: {v.role}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="text-emerald-500" onClick={() => updateVolMutation.mutate({ id: v.id, status: 'approved' })}><Check className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-red-500" onClick={() => updateVolMutation.mutate({ id: v.id, status: 'rejected' })}><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Active Volunteers ({activeVols.length})</h3>
            {activeVols.length === 0 ? (
              <div className="text-sm text-muted-foreground glass p-6 rounded-xl text-center">No active volunteers</div>
            ) : (
              <div className="glass overflow-hidden rounded-xl border border-border/60">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {activeVols.map(v => (
                      <tr key={v.id}>
                        <td className="p-4 font-medium">{(v.user as any)?.raw_user_meta_data?.full_name || (v.user as any)?.email}</td>
                        <td className="p-4 capitalize">{v.role}</td>
                        <td className="p-4"><span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-500">Active</span></td>
                        <td className="p-4 text-right">
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => updateVolMutation.mutate({ id: v.id, status: 'rejected' })}>Revoke</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sponsors" className="space-y-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Pending Proposals ({pendingProposals.length})</h3>
            {pendingProposals.length === 0 ? (
              <div className="text-sm text-muted-foreground glass p-6 rounded-xl text-center">No pending proposals</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pendingProposals.map(p => (
                  <div key={p.id} className="glass p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{(p.company as any)?.raw_user_meta_data?.full_name || (p.company as any)?.email || 'Sponsor'}</div>
                        <div className="text-xs text-muted-foreground">{p.tier} Tier • ₹{(p.amount / 100000).toFixed(1)}L</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="text-emerald-500 h-8 w-8" onClick={() => updateProposalMutation.mutate({ id: p.id, status: 'accepted' })}><Check className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => updateProposalMutation.mutate({ id: p.id, status: 'rejected' })}><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    {p.message && (
                      <div className="bg-muted/50 rounded-lg p-3 text-xs italic text-muted-foreground border border-border/40">
                        "{p.message}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Active Sponsors ({activeProposals.length})</h3>
            {activeProposals.length === 0 ? (
              <div className="text-sm text-muted-foreground glass p-6 rounded-xl text-center">No active sponsors</div>
            ) : (
              <div className="glass overflow-hidden rounded-xl border border-border/60">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium">Company</th>
                      <th className="p-4 font-medium">Tier</th>
                      <th className="p-4 font-medium">Committed</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {activeProposals.map(p => (
                      <tr key={p.id}>
                        <td className="p-4 font-medium">{(p.company as any)?.raw_user_meta_data?.full_name || (p.company as any)?.email || 'Sponsor'}</td>
                        <td className="p-4 capitalize text-primary font-medium">{p.tier}</td>
                        <td className="p-4 font-semibold">₹{(p.amount / 100000).toFixed(1)}L</td>
                        <td className="p-4"><span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-500">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="merch" className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Merchandise Drop</h3>
            <Button size="sm" className="bg-brand-gradient text-white">Add Product</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {eventProducts?.map(p => (
              <div key={p.id} className="glass p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <h4 className="font-bold">{p.name}</h4>
                  <div className="text-xl font-black mt-2 text-primary">₹{(p.price / 100).toLocaleString()}</div>
                </div>
                <div className="mt-6 pt-6 border-t border-border/40 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">8 Sold</div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
            {(!eventProducts || eventProducts.length === 0) && (
              <div className="col-span-full py-12 glass rounded-2xl text-center text-muted-foreground">
                No products added to this event yet.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ambassadors" className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Ambassador Programs</h3>
            <Button size="sm" className="bg-brand-gradient text-white">Create Program</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {eventPrograms?.map(prog => (
              <div key={prog.id} className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{prog.title}</h4>
                    <div className="text-xs text-muted-foreground capitalize">{prog.status}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Applicants</div>
                    <div className="text-lg font-bold">24</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Approved</div>
                    <div className="text-lg font-bold">5</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-6 w-full">Manage Applications</Button>
              </div>
            ))}
            {(!eventPrograms || eventPrograms.length === 0) && (
              <div className="col-span-full py-12 glass rounded-2xl text-center text-muted-foreground">
                No ambassador programs active for this event.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
