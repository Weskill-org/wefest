import { createFileRoute, Link, notFound, redirect, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, IndianRupee, Activity, Check, X, Ticket, Loader2, ShoppingBag, Zap, Mic2, Star, Wallet, Send, Plus, BarChart3, Receipt, Clock, Handshake, ArrowUpRight, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/organizer/events/$eventId")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "analytics",
    };
  },
  loader: async ({ params, context }) => {
    // Access membership from parent context
    const { membership, user } = context as any;
    
    let query = supabase
       .from("events")
       .select("*")
       .eq("id", params.eventId);
    
    if (membership?.college_id) {
      query = query.or(`organizer_user_id.eq.${user?.id},college_id.eq.${membership.college_id}`);
    } else if (user?.id) {
      query = query.eq("organizer_user_id", user.id);
    } else {
      throw redirect({ 
        to: "/login",
        search: { redirect: location.pathname + location.search }
      });
    }

    const { data: event, error } = await query.maybeSingle();
     
     if (error || !event) throw notFound();
     return event;
  },
  component: OrganizerEventDashboard,
});

function OrganizerEventDashboard() {
  const event = Route.useLoaderData();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [acceptNotes, setAcceptNotes] = useState("");

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: ""
  });

  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    title: "",
    message_content: "",
    channel: "email",
    target_segment: "ticket_holders",
    scheduled_at: ""
  });

  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    category: "",
    allocated_amount: "",
    currency: "INR"
  });

  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    requirements: "",
    perks: "",
    status: "active"
  });

  // Only show the dashboard if we are at the base event URL
  const isBaseRoute = !!matchRoute({ to: "/organizer/events/$eventId", fuzzy: false });

  const { data: volunteers, isLoading: loadingVols } = useQuery({
    queryKey: ["volunteers", event?.id],
    enabled: !!event?.id,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*, user:user_id(email, raw_user_meta_data)")
        .eq("event_id", event?.id);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: proposals, isLoading: loadingProposals, refetch: refetchProposals } = useQuery({
    queryKey: ["event-proposals", event?.id],
    enabled: !!event?.id,
    staleTime: 0,
    refetchInterval: 5000, // Fallback polling every 5s if Realtime fails
    queryFn: async () => {
      console.log("[Query] Fetching proposals for event:", event?.id);
      if (!event?.id) return [];
      
      const { data: proposalsData, error: proposalsError } = await supabase
        .from("sponsorship_proposals")
        .select("*")
        .eq("event_id", event.id)
        .order('created_at', { ascending: false });

      if (proposalsError) {
        console.error("[Query] Error fetching proposals:", proposalsError);
        throw proposalsError;
      }

      if (!proposalsData || proposalsData.length === 0) {
        console.log("[Query] No proposals found for event:", event?.id);
        return [];
      }

      // Fetch company profiles for these proposals
      const companyIds = [...new Set(proposalsData.map(p => p.company_user_id).filter(Boolean))];
      
      if (companyIds.length === 0) {
        return proposalsData.map(p => ({ ...p, company: null }));
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", companyIds);

      if (profilesError) {
        console.error("[Query] Error fetching company profiles:", profilesError);
        // Still return proposals even if profiles fail
        return proposalsData.map(p => ({ ...p, company: null }));
      }

      const result = proposalsData.map(proposal => ({
        ...proposal,
        company: profilesData?.find(profile => profile.user_id === proposal.company_user_id) || null
      }));
      
      console.log(`[Query] Successfully fetched ${result.length} proposals for event ${event?.id}`);
      if (result.length > 0) {
        console.table(result.map(r => ({ id: r?.id, status: r?.status, company: (r?.company as any)?.full_name || 'N/A' })));
      }
      return result;
    }
  });

  useEffect(() => {
    if (!event?.id) return;

    console.log(`[Realtime] Subscribing to sponsorship_proposals for event: ${event?.id}`);
    
    const channel = supabase
      .channel(`event_proposals_hardened_${event?.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sponsorship_proposals',
          filter: `event_id=eq.${event?.id}`
        },
        (payload) => {
          console.log('[Realtime] Proposal change detected:', payload);
          refetchProposals(); // Use the refetch function from useQuery
          toast.info("Sponsorship updates received!");
        }
      )
      .subscribe((status, err) => {
        console.log(`[Realtime] Subscription status for event ${event?.id}:`, status);
        if (err) console.error(`[Realtime] Error subscribing to event ${event?.id}:`, err);
        
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Active and listening for proposals on event: ${event?.id}`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`[Realtime] Channel error for event ${event?.id}. Falling back to polling.`);
        }
      });

    return () => {
      console.log(`[Realtime] Removing subscription for event: ${event?.id}`);
      supabase.removeChannel(channel);
    };
  }, [event?.id, queryClient]);


  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ["event-tickets-sold", event?.id],
    enabled: !!event?.id,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", event?.id);

      if (error) throw error;
      return data;
    }
  });

  const { data: eventProducts } = useQuery({
    queryKey: ["event-products", event?.id],
    enabled: !!event?.id,

    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("event_id", event?.id);

      if (error) throw error;
      return data;
    }
  });

  const { data: eventPrograms } = useQuery({
    queryKey: ["event-programs", event?.id],
    enabled: !!event?.id,

    queryFn: async () => {
      const { data, error } = await supabase.from("ambassador_programs").select("*").eq("event_id", event?.id);

      if (error) throw error;
      return data;
    }
  });

  const { data: budgets } = useQuery({
    queryKey: ["event-budgets", event?.id],
    enabled: !!event?.id,

    queryFn: async () => {
      const { data, error } = await supabase.from("event_budgets").select("*").eq("event_id", event?.id);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: campaigns } = useQuery({
    queryKey: ["marketing-campaigns", event?.college_id],
    enabled: !!event?.college_id,

    queryFn: async () => {
      const { data, error } = await supabase.from("marketing_campaigns").select("*").eq("college_id", event?.college_id ?? "");

      if (error) throw error;
      return data;
    }
  });

  const { data: vendorPayouts } = useQuery({
    queryKey: ["vendor-payouts", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_payouts").select("*").eq("event_id", event?.id || "");
      if (error) throw error;
      return data;
    }
  });

  const { data: eventOrders } = useQuery({
    queryKey: ["event-orders", event?.id],
    enabled: !!event?.id && !!eventProducts?.length,
    queryFn: async () => {
      const productIds = eventProducts?.map(p => p?.id).filter(Boolean) || [];
      if (productIds.length === 0) return [];
      const { data, error } = await supabase.from("orders").select("*").in("product_id", productIds);
      if (error) throw error;
      return data || [];
    }
  });

  const { data: ambassadorApplications } = useQuery({
    queryKey: ["ambassador-applications", event?.id],
    enabled: !!event?.id && !!eventPrograms?.length,
    queryFn: async () => {
      const programIds = eventPrograms?.map(p => p?.id).filter(Boolean) || [];
      if (programIds.length === 0) return [];
      const { data, error } = await supabase.from("ambassador_applications").select("*").in("program_id", programIds);
      if (error) throw error;
      return data || [];
    }
  });

  const updateVolMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from("volunteers").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Volunteer status updated");
      if (event?.id) queryClient.invalidateQueries({ queryKey: ["volunteers", event?.id] });
    }
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from("sponsorship_proposals").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sponsorship status updated");
      if (event?.id) queryClient.invalidateQueries({ queryKey: ["event-proposals", event?.id] });
    }
  });

  const saveProductMutation = useMutation({
    mutationFn: async (data: typeof productForm) => {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price), // Store in Rupees
        stock: Number(data.stock),
        image_url: data.image_url || null,
        event_id: event?.id
      };
      
      if (editingProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingProduct ? "Product updated successfully" : "Product added successfully");
      if (event?.id) queryClient.invalidateQueries({ queryKey: ["event-products", event?.id] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", stock: "", image_url: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save product");
    }
  });

  const saveCampaignMutation = useMutation({
    mutationFn: async (data: typeof campaignForm) => {
      const payload = {
        title: data.title,
        message_content: data.message_content,
        channel: data.channel,
        target_segment: data.target_segment,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).toISOString() : null,
        college_id: event?.college_id,
        status: data.scheduled_at ? 'scheduled' : 'sent'
      };
      
      const { error } = await supabase.from("marketing_campaigns").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Campaign created successfully");
      if (event?.college_id) queryClient.invalidateQueries({ queryKey: ["marketing-campaigns", event.college_id] });
      setIsCampaignDialogOpen(false);
      setCampaignForm({
        title: "",
        message_content: "",
        channel: "email",
        target_segment: "ticket_holders",
        scheduled_at: ""
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create campaign");
    }
  });

  const saveBudgetMutation = useMutation({
    mutationFn: async (data: typeof budgetForm) => {
      const payload = {
        category: data.category,
        allocated_amount: Number(data.allocated_amount),
        currency: data.currency,
        event_id: event?.id,
        spent_amount: 0
      };
      
      const { error } = await supabase.from("event_budgets").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Budget added successfully");
      if (event?.id) queryClient.invalidateQueries({ queryKey: ["event-budgets", event?.id] });
      setIsBudgetDialogOpen(false);
      setBudgetForm({ category: "", allocated_amount: "", currency: "INR" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add budget");
    }
  });

  const saveProgramMutation = useMutation({
    mutationFn: async (data: typeof programForm) => {
      const payload = {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        perks: data.perks.split(",").map(p => p.trim()).filter(Boolean),
        status: data.status,
        event_id: event?.id
      };
      
      const { error } = await supabase.from("ambassador_programs").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Program created successfully");
      if (event?.id) queryClient.invalidateQueries({ queryKey: ["event-programs", event?.id] });
      setIsProgramDialogOpen(false);
      setProgramForm({
        title: "",
        description: "",
        requirements: "",
        perks: "",
        status: "active"
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create program");
    }
  });

  const handleOpenProductDialog = (product?: any) => {

    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(), // Already in Rupees
        stock: product.stock.toString(),
        image_url: product.image_url || ""
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", stock: "", image_url: "" });
    }
    setIsProductDialogOpen(true);
  };

  const ticketRevenue = (tickets || []).reduce((acc, ticket) => {
    const passSettings = event?.pass_settings as any;
    if (!passSettings) return acc + (event?.price_from || 0);
    
    // Check if it matches a specific tier price
    const tier = ticket.tier?.toLowerCase();
    if (tier === 'vip' && passSettings.vip?.enabled) {
      return acc + (passSettings.vip.price || event?.price_from || 0);
    } else if (tier === 'normal' && passSettings.normal?.enabled) {
      return acc + (passSettings.normal.price || event?.price_from || 0);
    }
    
    return acc + (event?.price_from || 0);
  }, 0);

  const merchRevenue = (eventOrders || []).reduce((acc, order) => acc + (order?.total_amount || 0), 0);
  const totalRevenue = ticketRevenue + merchRevenue;

  const pendingVols = volunteers?.filter(v => v.status === "pending") || [];
  const activeVols = volunteers?.filter(v => v.status === "approved") || [];
  const pendingProposals = proposals?.filter(p => p.status === "pending") || [];
  const activeProposals = proposals?.filter(p => p.status === "accepted") || [];

  if (!event) return null;

  if (!isBaseRoute) {
    return <Outlet />;
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">{event.title}</h1>
          <div className="text-sm text-muted-foreground mt-1">Analytics, volunteers, and operations management</div>
          {(event as any).slug && (
            <button
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/fest/${(event as any).slug}`); toast.success("Event link copied!"); }}
              className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-black text-primary hover:bg-primary/20 transition-all cursor-pointer group"
            >
              <span>{(event as any).slug.split(".")[0]}</span>
              <span className="text-primary/40 text-lg font-black">.</span>
              <span>{(event as any).slug.split(".")[1]}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary/50 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            event.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 
            event.status === 'draft' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'
          }`}>
            {event.status === 'published' ? <Check className="h-3 w-3" /> : null}
            {event.status}
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
            <Link to="/organizer/events/$eventId/edit" params={{ eventId: event?.id || "" }}>Edit Event</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
            <Link to={`/fest/${(event as any).slug || event?.id}`}>View Public Page</Link>
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(val) => navigate({ search: { tab: val } })} className="">
        <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-muted/30 p-1 rounded-xl border border-border/40">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers ({volunteers?.length || 0})</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors ({proposals?.length || 0})</TabsTrigger>
          <TabsTrigger value="merch">Merchandise ({eventProducts?.length || 0})</TabsTrigger>
          <TabsTrigger value="ambassadors">Ambassadors ({eventPrograms?.length || 0})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
              <div className="mt-4 text-3xl font-bold">{(event?.attendees || 0).toLocaleString()}</div>
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
            <Button size="sm" className="bg-brand-gradient text-white" onClick={() => setIsBudgetDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Budget</Button>
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
                        <td className="p-4 text-muted-foreground">₹{(p.tax_amount ?? 0).toLocaleString()} (18%)</td>
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
            <Button size="sm" className="bg-brand-gradient text-white" onClick={() => setIsCampaignDialogOpen(true)}><Send className="h-4 w-4 mr-2" /> Create Campaign</Button>

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
                    {activeVols.map(v => v?.id && (
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

        <TabsContent value="sponsors" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-black tracking-tight">Sponsorship Hub</h3>
              <p className="text-xs text-muted-foreground">Manage brand partnerships and sponsorship proposals.</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-bold">
              <Zap className="h-4 w-4 mr-2" /> Invite Sponsors
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl text-xs font-bold"
              onClick={() => {
                refetchProposals();
                toast.info("Refreshing sponsorship data...");
              }}
              disabled={loadingProposals}
            >
              <Activity className={cn("h-4 w-4 mr-2", loadingProposals && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-2xl">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Committed</div>
              <div className="text-xl font-black">₹{(activeProposals.reduce((acc, p) => acc + (p?.amount || 0), 0) / 100000).toFixed(1)}L</div>
            </div>
            <div className="glass p-4 rounded-2xl">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Active Partners</div>
              <div className="text-xl font-black">{activeProposals.length}</div>
            </div>
            <div className="glass p-4 rounded-2xl">
              <div className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest mb-1">Pending</div>
              <div className="text-xl font-black text-amber-500">{pendingProposals.length}</div>
            </div>
            <div className="glass p-4 rounded-2xl">
              <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Goals Met</div>
              <div className="text-xl font-black">
                {Math.min(100, Math.round((activeProposals.reduce((acc, p) => acc + (p?.amount || 0), 0) / 2000000) * 100))}%
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-lg">Pending Proposals</h3>
              {pendingProposals.length > 0 && (
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-none px-2 py-0.5 text-[10px]">
                  NEW
                </Badge>
              )}
            </div>
            
            {pendingProposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 glass rounded-3xl border-dashed border-border/60">
                <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <h4 className="font-bold text-muted-foreground">No pending proposals</h4>
                <p className="text-xs text-muted-foreground/60 mt-1">New requests from the marketplace will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingProposals.map(p => p?.id && (
                  <div key={p.id} className="group glass p-5 rounded-2xl border-white/5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-lg shadow-inner">
                        {((p.company as any)?.full_name || 'A')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black truncate text-base">{(p.company as any)?.full_name || (p.company as any)?.email || 'Anonymous Brand'}</div>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter py-0 px-2 h-5 border-primary/20 text-primary">
                            {p.tier}
                          </Badge>
                          <span className="text-xs font-bold text-foreground/80">₹{((p?.amount || 0) / 100000).toFixed(1)}L</span>
                        </div>
                      </div>
                    </div>

                    {p.message && (
                      <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground italic leading-relaxed">
                        "{p.message}"
                      </div>
                    )}

                    <div className="flex gap-2 mt-5">
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-10 shadow-lg shadow-emerald-900/20"
                        onClick={() => setSelectedProposal(p)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Review & Accept
                      </Button>
                      <Button 
                        variant="ghost"
                        className="w-10 rounded-xl text-red-500 hover:bg-red-500/10 h-10"
                        onClick={() => updateProposalMutation.mutate({ id: p.id, status: 'rejected' })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              <h3 className="font-bold text-lg">Active Partnerships</h3>
            </div>
            
            {activeProposals.length === 0 ? (
              <div className="text-sm text-muted-foreground glass p-8 rounded-3xl text-center border-dashed border-border/40">
                You haven't finalized any sponsorships yet.
              </div>
            ) : (
              <div className="glass overflow-hidden rounded-[24px] border border-border/40 shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                      <th className="p-4 font-black uppercase tracking-widest text-[10px]">Brand Partner</th>
                      <th className="p-4 font-black uppercase tracking-widest text-[10px]">Tier</th>
                      <th className="p-4 font-black uppercase tracking-widest text-[10px]">Investment</th>
                      <th className="p-4 font-black uppercase tracking-widest text-[10px]">Date Joined</th>
                      <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {activeProposals.map(p => p?.id && (
                      <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {((p.company as any)?.full_name || 'A')[0].toUpperCase()}
                            </div>
                            <span className="font-bold">{(p.company as any)?.full_name || (p.company as any)?.email || 'Anonymous Brand'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase px-2 py-0.5 border-none">
                            {p.tier}
                          </Badge>
                        </td>
                        <td className="p-4 font-black text-primary text-base">₹{((p?.amount || 0) / 100000).toFixed(1)}L</td>
                        <td className="p-4 text-xs text-muted-foreground">{p?.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4 text-right">
                          <Button size="sm" variant="ghost" className="rounded-lg h-8 px-3 font-bold text-xs hover:bg-primary/10 hover:text-primary">
                            View Brand
                          </Button>
                        </td>
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
            <Button size="sm" className="bg-brand-gradient text-white" onClick={() => handleOpenProductDialog()}>Add Product</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {eventProducts?.map(p => {
              if (!p?.id) return null;
              const soldCount = (eventOrders || []).filter(o => o?.product_id === p.id).reduce((acc, o) => acc + (o?.quantity || 1), 0);
              return (
                <div key={p.id} className="glass p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <h4 className="font-bold">{p.name}</h4>
                    <div className="text-xl font-black mt-2 text-primary">₹{p.price.toLocaleString()}</div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border/40 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">{soldCount} Sold</div>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenProductDialog(p)}>Edit</Button>
                  </div>
                </div>
              );
            })}

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
            <Button size="sm" className="bg-brand-gradient text-white" onClick={() => setIsProgramDialogOpen(true)}>Create Program</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {eventPrograms?.map(prog => {
              if (!prog?.id) return null;
              const applicants = (ambassadorApplications || []).filter(a => a?.program_id === prog.id);
              const approvedCount = applicants.filter(a => a?.status === 'approved').length;
              return (
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
                      <div className="text-lg font-bold">{applicants.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Approved</div>
                      <div className="text-lg font-bold">{approvedCount}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-6 w-full">Manage Applications</Button>
                </div>
              );
            })}

            {(!eventPrograms || eventPrograms.length === 0) && (
              <div className="col-span-full py-12 glass rounded-2xl text-center text-muted-foreground">
                No ambassador programs active for this event.
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="settings" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-8">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Event Visibility</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/40">
                  <div>
                    <div className="font-bold">Status</div>
                    <div className="text-xs text-muted-foreground">How this event appears to students</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    event.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 
                    event.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {event.status || 'draft'}
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
                  <div className="font-bold mb-2">Discovery Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {(event.tags as string[] | null)?.length ? (
                      (event.tags as string[]).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-md">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No tags added</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Logistics & Venue</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Venue</div>
                    <div className="text-sm font-bold">{(event as any).venue || 'TBD'}</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Time</div>
                    <div className="text-sm font-bold">{(event as any).time || 'All Day'}</div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Committee Members</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(() => {
                      const members: any[] = (event as any).team_members || [];
                      if (!members.length) {
                        return <span className="text-xs text-muted-foreground italic">No team members listed</span>;
                      }
                      return members.map((m: any, i: number) => {
                        const name = typeof m === 'string' ? m : m.name;
                        const role = typeof m === 'object' ? m.role : undefined;
                        return (
                          <span key={i} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded-full border border-border/40">
                            {name}{role ? ` · ${role}` : ''}
                          </span>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pass Configuration — correctly reads JSONB object {vip:{...}, normal:{...}} */}
          <div className="glass rounded-2xl p-8">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Ticket className="h-5 w-5 text-primary" /> Pass Configuration</h3>
            {(() => {
              const ps = (event as any).pass_settings as { vip?: any; normal?: any } | null | undefined;
              if (!ps) {
                return (
                  <div className="py-8 text-center text-sm text-muted-foreground italic">
                    Using default pricing: ₹{event?.price_from || 0} (Day Pass)
                  </div>
                );
              }
              const cards = [
                { key: 'normal', label: 'Normal Pass', data: ps.normal, color: 'bg-muted/30 border-border/40' },
                { key: 'vip',    label: 'VIP Pass',    data: ps.vip,    color: 'bg-primary/5 border-primary/20' },
              ].filter(c => c.data);
              if (!cards.length) {
                return (
                  <div className="py-8 text-center text-sm text-muted-foreground italic">
                    No passes configured yet.
                  </div>
                );
              }
              return (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {cards.map(({ key, label, data, color }) => (
                    <div key={key} className={`p-5 rounded-xl border ${color} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div className={`text-xs font-black uppercase tracking-widest ${key === 'vip' ? 'text-primary' : ''}`}>{label}</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                          {data.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="text-2xl font-black text-primary">₹{data.price?.toLocaleString() || 0}</div>
                      <div className="space-y-1.5 text-[11px] text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Duration</span>
                          <span className="font-bold text-foreground">{data.days || 1} day{(data.days || 1) > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Single day</span>
                          <span className="font-bold text-foreground">₹{data.single_day_price?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Multi day</span>
                          <span className="font-bold text-foreground">₹{data.multi_day_price?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </TabsContent>
      </Tabs>

      {/* Acceptance Dialog */}
      <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && setSelectedProposal(null)}>
        <DialogContent className="sm:max-w-[500px] glass border-border/60">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Check className="h-6 w-6 text-emerald-500" /> Accept Sponsorship
            </DialogTitle>
            <DialogDescription>
              Review the details before formally accepting this sponsorship. This will notify the sponsor and lock in the commitment.
            </DialogDescription>
          </DialogHeader>

          {selectedProposal && (
            <div className="space-y-6 py-4">
              <div className="bg-muted/30 border border-border/40 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Company</div>
                    <div className="font-medium">{(selectedProposal.company as any)?.raw_user_meta_data?.full_name || (selectedProposal.company as any)?.email || 'Sponsor'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Tier</div>
                    <div className="font-medium text-primary capitalize">{selectedProposal.tier}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Amount Committed</div>
                  <div className="text-xl font-black">₹{(selectedProposal.amount / 100000).toFixed(1)}L <span className="text-sm font-medium text-muted-foreground">(₹{selectedProposal.amount.toLocaleString()})</span></div>
                </div>
                {selectedProposal.message && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Message from Sponsor</div>
                    <div className="text-sm italic text-muted-foreground">"{selectedProposal.message}"</div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Internal Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="E.g., Payment received via wire transfer on..." 
                  className="resize-none bg-background/50 border-border/40"
                  value={acceptNotes}
                  onChange={(e) => setAcceptNotes(e.target.value)}
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg p-3 text-xs flex items-start gap-2">
                <Activity className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Accepting this proposal confirms you have verified the funds or agreed to the payment terms offline. This action cannot be easily undone.</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setSelectedProposal(null)}>Cancel</Button>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white" 
              onClick={() => {
                if (selectedProposal?.id) {
                  updateProposalMutation.mutate({ id: selectedProposal.id, status: 'accepted' });
                }
                setSelectedProposal(null);
                setAcceptNotes("");
              }}
              disabled={updateProposalMutation.isPending}
            >
              {updateProposalMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Confirm Acceptance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Add/Edit Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border/60">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the product details below." : "Fill in the details to add a new merchandise item to your event."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Product Name</Label>
              <Input 
                id="name" 
                placeholder="E.g., Event T-Shirt" 
                className="bg-background/50 border-border/40"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your product..." 
                className="resize-none bg-background/50 border-border/40"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number"
                  placeholder="0.00" 
                  className="bg-background/50 border-border/40"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Initial Stock</Label>
                <Input 
                  id="stock" 
                  type="number"
                  placeholder="100" 
                  className="bg-background/50 border-border/40"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Image URL (Optional)</Label>
              <Input 
                id="image_url" 
                placeholder="https://..." 
                className="bg-background/50 border-border/40"
                value={productForm.image_url}
                onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-brand-gradient text-white" 
              onClick={() => saveProductMutation.mutate(productForm)}
              disabled={saveProductMutation.isPending || !productForm.name || !productForm.price || !productForm.stock}
            >
              {saveProductMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Create Dialog */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border/60">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Send className="h-6 w-6 text-primary" />
              Create Marketing Campaign
            </DialogTitle>
            <DialogDescription>
              Launch a new notification campaign to reach your audience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-title" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Campaign Title</Label>
              <Input 
                id="campaign-title" 
                placeholder="E.g., Early Bird Discount Ending Soon!" 
                className="bg-background/50 border-border/40"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-message" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Message Content</Label>
              <Textarea 
                id="campaign-message" 
                placeholder="Write your campaign message here..." 
                className="resize-none h-32 bg-background/50 border-border/40"
                value={campaignForm.message_content}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, message_content: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Channel</Label>
                <Select 
                  value={campaignForm.channel} 
                  onValueChange={(val) => setCampaignForm(prev => ({ ...prev, channel: val }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/40">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Target Segment</Label>
                <Select 
                  value={campaignForm.target_segment} 
                  onValueChange={(val) => setCampaignForm(prev => ({ ...prev, target_segment: val }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/40">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_students">All Students</SelectItem>
                    <SelectItem value="ticket_holders">Ticket Holders</SelectItem>
                    <SelectItem value="past_attendees">Past Attendees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-at" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Schedule (Optional)</Label>
              <Input 
                id="scheduled-at" 
                type="datetime-local"
                className="bg-background/50 border-border/40"
                value={campaignForm.scheduled_at}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
              />
              <p className="text-[10px] text-muted-foreground">Leave empty to send immediately.</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsCampaignDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-brand-gradient text-white" 
              onClick={() => saveCampaignMutation.mutate(campaignForm)}
              disabled={saveCampaignMutation.isPending || !campaignForm.title || !campaignForm.message_content}
            >
              {saveCampaignMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {campaignForm.scheduled_at ? "Schedule Campaign" : "Send Campaign Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/40">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
            <DialogDescription>
              Create a new budget category for tracking event expenses.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Category Name</Label>
              <Input 
                id="budget-category" 
                placeholder="e.g. Venue, Marketing, Talent"
                className="bg-background/50 border-border/40"
                value={budgetForm.category}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-amount" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Allocated Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                <Input 
                  id="budget-amount" 
                  type="number"
                  placeholder="0.00"
                  className="bg-background/50 border-border/40 pl-8"
                  value={budgetForm.allocated_amount}
                  onChange={(e) => setBudgetForm(prev => ({ ...prev, allocated_amount: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Currency</Label>
              <Select 
                value={budgetForm.currency} 
                onValueChange={(val) => setBudgetForm(prev => ({ ...prev, currency: val }))}
              >
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsBudgetDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-brand-gradient text-white" 
              onClick={() => saveBudgetMutation.mutate(budgetForm)}
              disabled={saveBudgetMutation.isPending || !budgetForm.category || !budgetForm.allocated_amount}
            >
              {saveBudgetMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Save Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Program Create Dialog */}
      <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border/60">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Create Ambassador Program
            </DialogTitle>
            <DialogDescription>
              Launch a new program to recruit campus ambassadors for your event.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="program-title" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Program Title</Label>
              <Input 
                id="program-title" 
                placeholder="E.g., Campus Leader Program" 
                className="bg-background/50 border-border/40"
                value={programForm.title}
                onChange={(e) => setProgramForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program-desc" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Description</Label>
              <Textarea 
                id="program-desc" 
                placeholder="What is this program about? What are the responsibilities?" 
                className="resize-none h-24 bg-background/50 border-border/40"
                value={programForm.description}
                onChange={(e) => setProgramForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program-req" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Requirements</Label>
              <Textarea 
                id="program-req" 
                placeholder="E.g., Active on social media, strong communication skills..." 
                className="resize-none h-20 bg-background/50 border-border/40"
                value={programForm.requirements}
                onChange={(e) => setProgramForm(prev => ({ ...prev, requirements: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program-perks" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Perks (Comma Separated)</Label>
              <Input 
                id="program-perks" 
                placeholder="E.g., Free Ticket, VIP Access, Certificate" 
                className="bg-background/50 border-border/40"
                value={programForm.perks}
                onChange={(e) => setProgramForm(prev => ({ ...prev, perks: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Status</Label>
              <Select 
                value={programForm.status} 
                onValueChange={(val) => setProgramForm(prev => ({ ...prev, status: val }))}
              >
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Visible to public)</SelectItem>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsProgramDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-brand-gradient text-white" 
              onClick={() => saveProgramMutation.mutate(programForm)}
              disabled={saveProgramMutation.isPending || !programForm.title || !programForm.description}
            >
              {saveProgramMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
              Create Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
