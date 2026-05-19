import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon, Sparkles, ShieldCheck, Loader2,
  Trophy, Zap, Star, Medal, Filter, Grid3X3, List
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const Route = createFileRoute("/_student/memories")({
  head: () => ({
    meta: [
      { title: "Digital Memories — WeFest" },
      { name: "description", content: "Your minted digital memories and collectibles from WeFest events." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: location.pathname + location.searchStr } });
  },
  component: MemoriesPage,
});

function MemoriesPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "Legendary" | "Epic" | "Common">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["student-memories-full"],
    queryFn: async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) throw new Error("Not authenticated");
        const user = userData.user;

        const [ticketsRes, memoriesRes] = await Promise.all([
          supabase
            .from("tickets")
            .select("*, events(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("digital_memories")
            .select("*")
            .eq("user_id", user.id)
        ]);

        if (ticketsRes.error) throw ticketsRes.error;
        if (memoriesRes.error) throw memoriesRes.error;

        return { tickets: ticketsRes.data || [], memories: memoriesRes.data || [] };
      } catch (e: any) {
        console.error("Error fetching memories:", e);
        throw e;
      }
    },
  });

  const mintMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      const serialNumber = Math.floor(Math.random() * 1000) + 1;
      const { error } = await supabase.from("digital_memories").insert({
        user_id: user!.id,
        event_id: eventId,
        metadata: {
          rarity: serialNumber < 10 ? "Legendary" : serialNumber < 100 ? "Epic" : "Common",
          edition: "Genesis",
          serial: `#${serialNumber}`,
          verified_by: "WeFest Blockchain Registry",
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-memories-full"] });
      toast.success("Memory Minted! ✨", { description: "Your digital souvenir is now live on the blockchain." });
    },
    onError: (err: any) => toast.error(err.message || "Failed to mint memory."),
  });

  const myTickets = data?.tickets || [];
  const myMemories = data?.memories || [];

  const mintedCount = myMemories.length;
  const legendaryCount = myMemories.filter((m: any) => (m.metadata as any)?.rarity === "Legendary").length;
  const epicCount = myMemories.filter((m: any) => (m.metadata as any)?.rarity === "Epic").length;

  const filteredTickets = myTickets.filter((t: any) => {
    if (filter === "all") return true;
    const memory = myMemories.find((m: any) => m.event_id === t.event_id);
    if (!memory) return false;
    return (memory.metadata as any)?.rarity === filter;
  });

  const rarityConfig = {
    Legendary: { label: "Legendary", class: "bg-amber-400/10 border-amber-400/30 text-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]" },
    Epic: { label: "Epic", class: "bg-purple-400/10 border-purple-400/30 text-purple-400", glow: "shadow-[0_0_20px_rgba(192,132,252,0.15)]" },
    Common: { label: "Common", class: "bg-primary/10 border-primary/30 text-primary", glow: "" },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Loading your collection…</p>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Digital Memories</h1>
          </div>
          <p className="text-sm text-muted-foreground">Your minted collectibles and event souvenirs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all", viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5")}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all", viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Minted", value: mintedCount, icon: Sparkles, color: "text-primary" },
          { label: "Legendary", value: legendaryCount, icon: Trophy, color: "text-amber-400" },
          { label: "Epic", value: epicCount, icon: Zap, color: "text-purple-400" },
          { label: "Events Attended", value: myTickets.length, icon: Star, color: "text-emerald-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-all">
            <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      {myTickets.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {(["all", "Legendary", "Epic", "Common"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                filter === f
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-white/5 text-muted-foreground hover:border-white/10 hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      )}

      {/* Collection Grid / List */}
      {myTickets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-white/10 py-20 px-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <ImageIcon className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <h3 className="font-semibold text-base mb-2">No events attended yet</h3>
          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto mb-6">
            Buy a ticket and attend a WeFest event to mint your first digital memory.
          </p>
          <Button asChild size="sm" className="bg-brand-gradient text-white rounded-lg font-semibold shadow-glow text-xs h-9 px-5">
            <Link to="/explore">Browse Fests</Link>
          </Button>
        </div>
      ) : (
        <div className={cn(
          viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-3"
        )}>
          {filteredTickets.map((t: any) => {
            const memoryRow: any = myMemories.find((m: any) => m.event_id === t.event_id);
            const memory = memoryRow ? { ...memoryRow, metadata: (memoryRow.metadata || {}) as any } : null;
            const rarity = memory?.metadata?.rarity as "Legendary" | "Epic" | "Common" | undefined;
            const cfg = rarity ? rarityConfig[rarity] : null;

            if (viewMode === "list") {
              return (
                <div key={t.id} className={cn("group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-4 flex items-center gap-4", cfg?.glow)}>
                  <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    {memory ? <ShieldCheck className="h-5 w-5 text-emerald-400" /> : <Sparkles className="h-5 w-5 text-muted-foreground/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{t.events?.title || "Unknown Event"}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {t.events?.date ? format(new Date(t.events.date), "MMM dd, yyyy") : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {memory ? (
                      <>
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border", cfg?.class)}>
                          {memory.metadata.rarity}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">{memory.metadata.serial}</span>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-brand-gradient text-white rounded-lg font-semibold text-[10px] h-7 px-3 shadow-glow"
                        onClick={() => mintMutation.mutate(t.event_id)}
                        disabled={mintMutation.isPending}
                      >
                        {mintMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Sparkles className="h-3 w-3 mr-1" /> Mint</>}
                      </Button>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div key={t.id} className={cn("group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-5 flex flex-col", cfg?.glow)}>
                {memory ? (
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border", cfg?.class)}>
                        {memory.metadata.rarity}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground/60 font-mono">{memory.metadata.serial}</span>
                    </div>

                    <div className="aspect-square rounded-xl bg-black/40 border border-white/10 overflow-hidden mb-4 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                      <ImageIcon className="h-10 w-10 text-white/10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest truncate">{t.events?.title}</div>
                        <div className="text-[10px] font-semibold text-white/80 mt-0.5">Genesis Edition</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                      <span>{memory.metadata.edition}</span>
                      <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                      <Sparkles className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Mint Memory</h4>
                    <p className="text-[10px] text-muted-foreground mb-4 truncate w-full text-center">{t.events?.title}</p>
                    <Button
                      size="sm"
                      className="w-full rounded-lg bg-brand-gradient text-white font-semibold text-xs h-8 shadow-glow"
                      onClick={() => mintMutation.mutate(t.event_id)}
                      disabled={mintMutation.isPending}
                    >
                      {mintMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <>Mint <Sparkles className="ml-1 h-3 w-3" /></>}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filteredTickets.length === 0 && myTickets.length > 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No {filter} memories yet. Mint some!
        </div>
      )}
    </div>
  );
}
