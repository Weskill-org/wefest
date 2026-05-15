import { useEffect, useState } from "react";
import { Ticket, UserCheck, DollarSign, Gift, Clock, PlusCircle, RefreshCw, Loader2, School, ShoppingBag, Filter, ChevronDown, Activity, Calendar, Tag, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

type Activity = {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  metadata: any;
};

const iconMap: Record<string, any> = {
  ticket_purchased: { icon: Ticket, color: "text-blue-400", bg: "bg-blue-500/10", label: "Ticketing" },
  event_created: { icon: PlusCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Planning" },
  event_status_updated: { icon: RefreshCw, color: "text-amber-400", bg: "bg-amber-500/10", label: "Operations" },
  college_approved: { icon: School, color: "text-purple-400", bg: "bg-purple-500/10", label: "Verification" },
  order_created: { icon: ShoppingBag, color: "text-pink-400", bg: "bg-pink-500/10", label: "Commerce" },
  volunteer_applied: { icon: UserCheck, color: "text-indigo-400", bg: "bg-indigo-500/10", label: "Volunteers" },
  booth_visited: { icon: Gift, color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Sponsorship" },
  student_joined: { icon: Users, color: "text-rose-400", bg: "bg-rose-500/10", label: "Community" },
  default: { icon: Clock, color: "text-slate-400", bg: "bg-slate-500/10", label: "System" },
};

export function RecentActivity({ collegeId }: { collegeId?: string }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [limit, setLimit] = useState(15);
  const [realtimeActivities, setRealtimeActivities] = useState<Activity[]>([]);

  const { data: initialActivities, isLoading, isFetching } = useQuery({
    queryKey: ["recent-activity", collegeId, activeTab, limit],
    queryFn: async () => {
      let query = (supabase as any)
        .from("recent_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (collegeId) {
        query = query.eq("college_id", collegeId);
      }

      if (activeTab !== "all") {
        if (activeTab === "events") {
          query = query.in("type", ["event_created", "event_status_updated"]);
        } else if (activeTab === "tickets") {
          query = query.eq("type", "ticket_purchased");
        } else if (activeTab === "merch") {
          query = query.eq("type", "order_created");
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as Activity[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`recent_activity_${collegeId || 'global'}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "recent_activity",
          filter: collegeId ? `college_id=eq.${collegeId}` : undefined
        },
        (payload) => {
          const newActivity = payload.new as Activity;
          // Only add to realtime list if it matches current filter
          const matchesFilter = activeTab === "all" || 
            (activeTab === "events" && ["event_created", "event_status_updated"].includes(newActivity.type)) ||
            (activeTab === "tickets" && newActivity.type === "ticket_purchased") ||
            (activeTab === "merch" && newActivity.type === "order_created");

          if (matchesFilter) {
            setRealtimeActivities((prev) => [newActivity, ...prev].slice(0, limit));
          }
          queryClient.invalidateQueries({ queryKey: ["recent-activity", collegeId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, collegeId, activeTab, limit]);

  const displayActivities = realtimeActivities.length > 0 
    ? [...realtimeActivities, ...(initialActivities || []).filter(a => !realtimeActivities.find(ra => ra.id === a.id))].slice(0, limit)
    : initialActivities || [];

  const tabs = [
    { id: "all", label: "All Activity", icon: Activity },
    { id: "events", label: "Events", icon: Calendar },
    { id: "tickets", label: "Tickets", icon: Tag },
    { id: "merch", label: "Merchandise", icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      {/* Filters/Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/5 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setRealtimeActivities([]);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white"
            )}
          >
            <tab.icon className={cn("h-3.5 w-3.5", activeTab === tab.id ? "animate-pulse" : "")} />
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 w-full rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : displayActivities.length > 0 ? (
        <div className="grid gap-3 relative">
          {isFetching && !isLoading && (
             <div className="absolute top-0 right-0 z-10">
                <Loader2 className="h-4 w-4 animate-spin text-primary opacity-50" />
             </div>
          )}
          
          {displayActivities.map((item, index) => {
            const config = iconMap[item.type] || iconMap.default;
            const Icon = config.icon;
            
            return (
              <div 
                key={item.id} 
                className={cn(
                  "group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                  "bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-xl",
                  "animate-in fade-in slide-in-from-bottom-4"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-lg border border-white/5",
                  config.bg,
                  config.color
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-bold text-foreground/90 group-hover:text-foreground transition-colors truncate">
                        {item.title}
                      </p>
                      <span className={cn("px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border", config.bg, config.color, "border-current/10")}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/70 line-clamp-1 leading-relaxed group-hover:text-muted-foreground/90 transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                   <div className="h-1 w-8 rounded-full bg-primary/20 blur-sm" />
                </div>
              </div>
            );
          })}

          {initialActivities && initialActivities.length >= limit && (
            <Button 
              variant="ghost" 
              onClick={() => setLimit(l => l + 15)}
              className="mt-4 w-full py-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group"
            >
              <ChevronDown className="h-4 w-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
              Load More Transmissions
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center relative overflow-hidden rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.03),transparent)] opacity-50" />
          <div className="relative z-10">
            <div className="h-16 w-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
              <Clock className="h-8 w-8 text-muted-foreground/20" />
            </div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Frequency Silent</h3>
            <p className="text-[11px] text-muted-foreground/40 max-w-[240px] mx-auto leading-relaxed">
              No activity matching these filters was detected. Stay tuned for live updates from your campus.
            </p>
            {activeTab !== "all" && (
              <Button 
                variant="link" 
                onClick={() => setActiveTab("all")}
                className="mt-4 text-xs text-primary font-bold"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
