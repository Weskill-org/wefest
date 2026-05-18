import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { 
  Building2, CheckCircle2, Clock, XCircle, Search, 
  ArrowUpRight, IndianRupee, MapPin, Users2, CalendarDays, ExternalLink,
  Handshake, MessagesSquare, Trash2
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/company/proposals")({
  head: () => ({
    meta: [
      { title: "Sponsorship Proposals | Company Portal | WeFest" },
      { name: "description", content: "Manage and track your sent sponsorship proposals." }
    ]
  }),
  component: CompanyProposals,
});

interface Proposal {
  id: string;
  status: string;
  amount: number;
  tier: string;
  message: string;
  created_at: string;
  event: {
    id: string;
    title: string;
    college_name: string;
    city: string;
    attendees: number;
    cover: string;
    date: string;
  } | null;
}

function CompanyProposals() {
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [proposalToRemove, setProposalToRemove] = useState<Proposal | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleRemoveProposal = async (proposalId: string) => {
    setIsRemoving(true);
    try {
      const { error } = await supabase
        .from("sponsorship_proposals")
        .delete()
        .eq("id", proposalId);

      if (error) throw error;

      toast.success("Proposal removed successfully");
      queryClient.invalidateQueries({ queryKey: ["my-proposals", user?.id] });
      setSelectedProposal(null);
      setProposalToRemove(null);
    } catch (error: any) {
      console.error("Error removing proposal:", error);
      toast.error(error.message || "Failed to remove proposal");
    } finally {
      setIsRemoving(false);
    }
  };

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  });

  const { data: proposals, isLoading } = useQuery({
    queryKey: ["my-proposals", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*, event:event_id(*)")
        .eq("company_user_id", user!.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching proposals:", error);
        throw error;
      }
      
      console.log("Proposals data received:", data);
      return data as Proposal[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (!user?.id) return;
    
    console.log("Setting up real-time subscription for company_user_id:", user.id);
    const channel = supabase
      .channel(`company_proposals_${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'sponsorship_proposals', 
          filter: `company_user_id=eq.${user.id}` 
        },
        (payload) => {
          console.log("Real-time update received for proposals:", payload);
          queryClient.invalidateQueries({ queryKey: ["my-proposals", user.id] });
          if (payload.eventType === 'UPDATE') {
            toast.success("Proposal updated!", {
              description: "The status of one of your proposals has changed."
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  if (isLoading || !user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Handshake className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your proposals...</p>
      </div>
    );
  }

  const allProposals = proposals || [];
  const pending = allProposals.filter(p => p.status === 'pending');
  const confirmed = allProposals.filter(p => p.status === 'accepted');
  const rejected = allProposals.filter(p => p.status === 'rejected');

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sponsorships</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Manage Proposals
          </h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-lg">
            Track your sponsorship requests, review pending negotiations, and view details for confirmed partnerships.
          </p>
        </div>
        <Button asChild size="lg" className="bg-brand-gradient text-white rounded-xl shadow-glow transition-all hover:-translate-y-1">
          <Link to="/company/marketplace">
            <Search className="h-4 w-4 mr-2" />
            Find New Events
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-[24px] p-6 border-white/5">
          <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mb-2">Total Sent</div>
          <div className="text-3xl font-black">{allProposals.length}</div>
        </div>
        <div className="glass rounded-[24px] p-6 border-white/5">
          <div className="text-[10px] uppercase font-black tracking-widest text-amber-500/60 mb-2 flex items-center gap-2">
            <Clock className="h-3 w-3 text-amber-500" /> Pending
          </div>
          <div className="text-3xl font-black text-amber-500">{pending.length}</div>
        </div>
        <div className="glass rounded-[24px] p-6 border-white/5 bg-emerald-500/5 border-emerald-500/20">
          <div className="text-[10px] uppercase font-black tracking-widest text-emerald-500/60 mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Confirmed
          </div>
          <div className="text-3xl font-black text-emerald-500">{confirmed.length}</div>
        </div>
        <div className="glass rounded-[24px] p-6 border-white/5">
          <div className="text-[10px] uppercase font-black tracking-widest text-rose-500/60 mb-2 flex items-center gap-2">
            <XCircle className="h-3 w-3 text-rose-500" /> Rejected
          </div>
          <div className="text-3xl font-black text-rose-500">{rejected.length}</div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white/5 border border-white/5 h-12 p-1 rounded-2xl mb-6">
          <TabsTrigger value="all" className="rounded-xl px-6 text-xs font-bold data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-lg">All ({allProposals.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl px-6 text-xs font-bold data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500 data-[state=active]:shadow-lg">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="confirmed" className="rounded-xl px-6 text-xs font-bold data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500 data-[state=active]:shadow-lg">Confirmed ({confirmed.length})</TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-xl px-6 text-xs font-bold data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-500 data-[state=active]:shadow-lg">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ProposalList proposals={allProposals} onViewDetails={setSelectedProposal} onRemoveProposal={setProposalToRemove} />
        </TabsContent>
        <TabsContent value="pending" className="mt-0">
          <ProposalList proposals={pending} onViewDetails={setSelectedProposal} onRemoveProposal={setProposalToRemove} emptyMessage="No pending proposals right now." />
        </TabsContent>
        <TabsContent value="confirmed" className="mt-0">
          <ProposalList proposals={confirmed} onViewDetails={setSelectedProposal} onRemoveProposal={setProposalToRemove} emptyMessage="No confirmed sponsorships yet." />
        </TabsContent>
        <TabsContent value="rejected" className="mt-0">
          <ProposalList proposals={rejected} onViewDetails={setSelectedProposal} onRemoveProposal={setProposalToRemove} emptyMessage="No rejected proposals." />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && setSelectedProposal(null)}>
        <DialogContent className="glass border-white/10 p-0 overflow-hidden max-w-2xl">
          {selectedProposal && selectedProposal.event && (
            <>
              <div className="relative h-48 w-full overflow-hidden">
                <img src={selectedProposal.event.cover} className="w-full h-full object-cover" alt="Event Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <Badge className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 border-none shadow-xl",
                    selectedProposal.status === "accepted" ? "bg-emerald-500 text-white" :
                    selectedProposal.status === "rejected" ? "bg-rose-500 text-white" :
                    "bg-amber-500 text-white"
                  )}>
                    {selectedProposal.status === "accepted" ? "Confirmed" : selectedProposal.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-black mb-2">{selectedProposal.event.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {selectedProposal.event.college_name}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {selectedProposal.event.city}</span>
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {format(new Date(selectedProposal.event.date), "MMM dd, yyyy")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Tier Requested</div>
                    <div className="font-black text-xl text-primary">{selectedProposal.tier}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Committed Amount</div>
                    <div className="font-black text-xl flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      {(selectedProposal.amount / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>

                {selectedProposal.message && (
                  <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                      <MessagesSquare className="h-4 w-4" /> Your Message
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 italic">"{selectedProposal.message}"</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <Button variant="ghost" onClick={() => setSelectedProposal(null)}>Close</Button>
                  {selectedProposal.status === 'pending' && (
                    <Button 
                      variant="destructive"
                      onClick={() => setProposalToRemove(selectedProposal)}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove Proposal
                    </Button>
                  )}
                  <Button asChild className="bg-primary text-primary-foreground font-bold">
                     <Link to="/events/$eventId" params={{ eventId: selectedProposal.event.id }}>View Event Page</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!proposalToRemove} onOpenChange={(open) => !open && setProposalToRemove(null)}>
        <AlertDialogContent className="glass border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-black text-xl text-foreground">Remove Proposal?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              Are you sure you want to remove your pending sponsorship proposal for{" "}
              <span className="font-bold text-foreground">"{proposalToRemove?.event?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2">
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-foreground text-muted-foreground rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemoving}
              onClick={() => proposalToRemove && handleRemoveProposal(proposalToRemove.id)}
              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/20 font-bold"
            >
              {isRemoving ? "Removing..." : "Remove Proposal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProposalList({ 
  proposals, 
  emptyMessage = "No proposals found.", 
  onViewDetails,
  onRemoveProposal
}: { 
  proposals: Proposal[], 
  emptyMessage?: string, 
  onViewDetails: (p: Proposal) => void,
  onRemoveProposal?: (p: Proposal) => void
}) {
  if (proposals.length === 0) {
    return (
      <div className="glass rounded-[32px] p-16 text-center border-dashed border-white/10 bg-white/[0.01]">
        <Search className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
        <h3 className="font-bold text-lg">{emptyMessage}</h3>
        <Button asChild variant="outline" className="mt-6 rounded-xl border-white/10 group">
          <Link to="/company/marketplace">
            Browse Marketplace <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map(p => (
        <div key={p.id} className="group glass rounded-[24px] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-6 transition-all hover:bg-white/[0.03] border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="h-16 w-24 shrink-0 rounded-xl overflow-hidden border border-white/10 relative">
              <img src={p.event?.cover} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="font-bold text-lg truncate pr-4">{p.event?.title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" /> {p.event?.college_name}</span>
                <span className="hidden sm:flex items-center gap-1.5"><Users2 className="h-3 w-3" /> {(p.event?.attendees || 0).toLocaleString()} Attendees</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-none">
            <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/5 text-center">
              <div className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-0.5">{p.tier}</div>
              <div className="text-sm font-bold flex items-center justify-center gap-1">₹{(p.amount / 100000).toFixed(1)}L</div>
            </div>
            
            <div className="w-[120px]">
              <Badge variant="outline" className={cn(
                "w-full justify-center py-1.5 border-none font-black uppercase text-[10px] tracking-widest",
                p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                p.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                'bg-amber-500/10 text-amber-500'
              )}>
                {p.status === 'accepted' ? 'Confirmed' : p.status}
              </Badge>
              <div className="text-[10px] text-center text-muted-foreground mt-1">
                {format(new Date(p.created_at), "MMM dd, yyyy")}
              </div>
            </div>

            {p.status === 'pending' && onRemoveProposal && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveProposal(p);
                }}
                className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-white/5"
                title="Remove Proposal"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onViewDetails(p)}
              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all ml-auto md:ml-0 border border-white/5"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
