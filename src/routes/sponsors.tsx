import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users2, Building2, Loader2, Sparkles, CheckCircle2, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/sponsors")({
  head: () => ({ meta: [{ title: "Sponsor a fest — WeFest" }, { name: "description", content: "Discover and sponsor India's biggest college festivals." }] }),
  component: Sponsors,
});

const sponsorshipTiers = [
  { name: "Title", price: 2500000, perks: ["Naming rights", "Stage branding", "Hero placement", "5 keynote slots"] },
  { name: "Platinum", price: 1200000, perks: ["Logo on all assets", "Dedicated booth", "2 keynote slots"] },
  { name: "Gold", price: 600000, perks: ["Logo placement", "Booth", "Social shoutouts"] },
  { name: "Silver", price: 250000, perks: ["Logo placement", "Combined booth"] },
];

function Sponsors() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tier, setTier] = useState("Gold");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

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
        tier: tier,
        amount: amount,
        message: message,
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

  const scoredEvents = useMemo(() => {
    if (!events) return [];
    return [...events]
      .map(e => {
        // Heuristic: Sponsor AI Match Score
        // Higher attendees = better base score
        let score = 65; 
        if (e.attendees > 2000) score += 10;
        if (e.attendees > 5000) score += 10;
        if (e.attendees > 10000) score += 12;
        // Mock demographic fit modifier
        score += (e.title.length % 5);
        
        return { ...e, aiScore: Math.min(score, 99) };
      })
      .sort((a, b) => b.aiScore - a.aiScore);
  }, [events]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
        <div>
          <div className="text-sm font-semibold text-primary">Sponsor marketplace</div>
          <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Reach <span className="text-gradient">2M+ Gen-Z</span> on campus.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Filter fests by reach, demographics and category. Send proposals in one click. Track ROI live.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Kpi icon={Users2} label="Reach" value="2.1M" />
          <Kpi icon={Building2} label="Colleges" value="120" />
          <Kpi icon={TrendingUp} label="Avg ROI" value="6.4×" />
        </div>
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold">Sponsorship tiers</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        {sponsorshipTiers.map((t) => (
          <div key={t.name} className="glass rounded-2xl p-6">
            <div className="text-sm text-muted-foreground">{t.name} sponsor</div>
            <div className="mt-1 text-2xl font-bold text-gradient">₹{(t.price / 100000).toFixed(1)}L+</div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {t.perks.map((p) => <li key={p}>• {p}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" /> AI Smart Matches
      </h2>
      <div className="mt-4 grid gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 glass rounded-2xl animate-pulse" />)
        ) : (
          scoredEvents?.map((e) => (
            <div key={e.id} className="glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between relative overflow-hidden transition hover:border-primary/40">
              {e.aiScore > 90 && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> HIGH MATCH
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${e.cover} relative`}>
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-0.5 border shadow-sm">
                    <div className="bg-primary text-primary-foreground text-[9px] font-bold h-6 w-6 flex items-center justify-center rounded-full">
                      {e.aiScore}%
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.college_name} • {e.city} • {(e.attendees / 1000).toFixed(0)}k expected</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{e.category}</span>
                <Button 
                  onClick={() => {
                    setSelectedEvent(e);
                    const defaultTier = sponsorshipTiers.find(t => t.name === "Gold")!;
                    setTier("Gold");
                    setAmount(defaultTier.price.toString());
                    setMessage(`We are interested in sponsoring ${e.title} as a Gold partner.`);
                    setIsDialogOpen(true);
                  }} 
                  className="bg-brand-gradient text-primary-foreground shadow-glow hover:opacity-90"
                >
                  Create proposal
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border/60">
          <form onSubmit={handleSendProposal}>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Sponsor {selectedEvent?.title}</DialogTitle>
              <DialogDescription>
                Send a custom sponsorship proposal directly to the college organizers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-6">
              <div className="grid gap-2">
                <Label htmlFor="tier">Sponsorship Tier</Label>
                <Select value={tier} onValueChange={(val) => {
                  setTier(val);
                  const found = sponsorshipTiers.find(t => t.name === val);
                  if (found) setAmount(found.price.toString());
                }}>
                  <SelectTrigger id="tier" className="bg-background/50 border-border/60">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsorshipTiers.map(t => (
                      <SelectItem key={t.name} value={t.name}>{t.name} (from ₹{(t.price / 100000).toFixed(1)}L)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Offer Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="amount" 
                    type="number" 
                    min="10000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 bg-background/50 border-border/60" 
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message to Organizer</Label>
                <Textarea 
                  id="message" 
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-background/50 border-border/60 resize-none" 
                  placeholder="Introduce your brand and expectations..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={proposalMutation.isPending} className="bg-brand-gradient text-primary-foreground">
                {proposalMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Proposal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-lg font-bold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
