import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Users2, Building2, Loader2, Sparkles, CheckCircle2,
  IndianRupee, Search, Filter, ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/company/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Company Portal — WeFest" },
      { name: "description", content: "Discover and sponsor India's biggest college festivals." }
    ]
  }),
  component: CompanyMarketplace,
});

const sponsorshipTiers = [
  { name: "Title", price: 2500000, perks: ["Naming rights", "Stage branding", "Hero placement", "5 keynote slots"] },
  { name: "Platinum", price: 1200000, perks: ["Logo on all assets", "Dedicated booth", "2 keynote slots"] },
  { name: "Gold", price: 600000, perks: ["Logo placement", "Booth", "Social shoutouts"] },
  { name: "Silver", price: 250000, perks: ["Logo placement", "Combined booth"] },
];

function CompanyMarketplace() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tier, setTier] = useState("Gold");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: events, isLoading } = useQuery({
    queryKey: ["sponsorship-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("attendees", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const proposalMutation = useMutation({
    mutationFn: async ({ eventId, eventTitle, tier, amount, message }: { eventId: string; eventTitle: string; tier: string; amount: number; message: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to send proposals");
      const { error } = await supabase.from("sponsorship_proposals").insert({
        company_user_id: user.id,
        event_id: eventId,
        tier,
        amount,
        message,
      });
      if (error) throw error;
      return eventTitle;
    },
    onSuccess: (title) => {
      toast.success(`Proposal sent to ${title}`);
      setIsDialogOpen(false);
      setSelectedEvent(null);
      setMessage("");
      setAmount("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send proposal");
    }
  });

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !amount) return;
    proposalMutation.mutate({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      tier,
      amount: parseInt(amount),
      message
    });
  };

  const categories = useMemo(() => {
    if (!events) return [];
    const cats = [...new Set(events.map(e => e.category))].filter(Boolean);
    return cats.sort();
  }, [events]);

  const scoredEvents = useMemo(() => {
    if (!events) return [];
    return [...events]
      .map(e => {
        let score = 65;
        if (e.attendees > 2000) score += 10;
        if (e.attendees > 5000) score += 10;
        if (e.attendees > 10000) score += 12;
        score += (e.title.length % 5);
        return { ...e, aiScore: Math.min(score, 99) };
      })
      .filter(e => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.college_name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q);
        const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.aiScore - a.aiScore);
  }, [events, searchQuery, categoryFilter]);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-primary uppercase tracking-widest">Sponsor Marketplace</div>
        <h1 className="mt-1 font-display text-3xl md:text-4xl font-black tracking-tight">
          Reach <span className="text-gradient">2M+ Gen-Z</span> on campus.
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-xl">
          Discover festivals by reach, demographics, and category. Send proposals instantly and track ROI live.
        </p>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-3 gap-3">
        <KpiMini icon={Users2} label="Network Reach" value="2.1M" />
        <KpiMini icon={Building2} label="Colleges" value="120+" />
        <KpiMini icon={TrendingUp} label="Avg ROI" value="6.4×" />
      </div>

      {/* Sponsorship Tiers */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4">Sponsorship Tiers</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {sponsorshipTiers.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-5 transition-all hover:border-primary/20">
              <div className="text-xs text-muted-foreground font-medium">{t.name} sponsor</div>
              <div className="mt-1 text-xl font-black text-gradient">₹{(t.price / 100000).toFixed(1)}L+</div>
              <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                {t.perks.map((p) => <li key={p}>• {p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fests by name, college, or city…"
            className="pl-9 glass border-white/10 h-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px] glass border-white/10 h-10">
            <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AI Smart Matches */}
      <section>
        <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" /> AI Smart Matches
          <span className="text-xs font-normal text-muted-foreground ml-1">({scoredEvents.length} fests)</span>
        </h2>
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 glass rounded-2xl animate-pulse" />)
          ) : scoredEvents.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground text-sm">
              No matching festivals found. Try adjusting your search.
            </div>
          ) : (
            scoredEvents.map((e) => (
              <div key={e.id} className="glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between relative overflow-hidden transition-all hover:border-primary/20">
                {e.aiScore > 90 && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-500/10 px-3 py-1 text-[9px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> High Match
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${e.cover} relative shrink-0`}>
                    <div className="absolute -bottom-1.5 -right-1.5 bg-background rounded-full p-0.5 border shadow-sm">
                      <div className="bg-primary text-primary-foreground text-[8px] font-black h-5 w-5 flex items-center justify-center rounded-full">
                        {e.aiScore}%
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{e.title}</div>
                    <div className="text-[11px] text-muted-foreground">{e.college_name} · {e.city} · {(e.attendees / 1000).toFixed(0)}k expected</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-[10px] bg-white/5">{e.category}</Badge>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(e);
                      setTier("Gold");
                      setAmount(sponsorshipTiers.find(t => t.name === "Gold")!.price.toString());
                      setMessage(`We are interested in sponsoring ${e.title} as a Gold partner.`);
                      setIsDialogOpen(true);
                    }}
                    className="bg-brand-gradient text-white shadow-glow hover:opacity-90 text-xs"
                  >
                    Create Proposal <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Proposal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px] glass border-border/60">
          <form onSubmit={handleSendProposal}>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Sponsor {selectedEvent?.title}</DialogTitle>
              <DialogDescription className="text-xs">
                Send a custom sponsorship proposal directly to the organizers.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-5">
              <div className="grid gap-1.5">
                <Label htmlFor="tier" className="text-xs font-bold">Sponsorship Tier</Label>
                <Select value={tier} onValueChange={(val) => {
                  setTier(val);
                  const found = sponsorshipTiers.find(t => t.name === val);
                  if (found) setAmount(found.price.toString());
                }}>
                  <SelectTrigger id="tier" className="bg-background/50 border-border/60 h-10">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsorshipTiers.map(t => (
                      <SelectItem key={t.name} value={t.name}>{t.name} (from ₹{(t.price / 100000).toFixed(1)}L)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="amount" className="text-xs font-bold">Offer Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    min="10000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 bg-background/50 border-border/60 h-10"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="message" className="text-xs font-bold">Message to Organizer</Label>
                <Textarea
                  id="message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-background/50 border-border/60 resize-none text-sm"
                  placeholder="Introduce your brand and expectations..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={proposalMutation.isPending} className="bg-brand-gradient text-white">
                {proposalMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Proposal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiMini({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-lg font-black">{value}</div>
      <div className="text-[10px] text-muted-foreground font-medium">{label}</div>
    </div>
  );
}
