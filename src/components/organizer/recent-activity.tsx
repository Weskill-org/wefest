
import { useEffect, useState } from "react";
import { Ticket, UserCheck, DollarSign, Gift, Clock, PlusCircle, RefreshCw, Loader2, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

type Activity = {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  metadata: any;
};

const iconMap: Record<string, any> = {
  ticket_purchased: { icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
  event_created: { icon: PlusCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  event_status_updated: { icon: RefreshCw, color: "text-amber-500", bg: "bg-amber-500/10" },
  college_approved: { icon: School, color: "text-purple-500", bg: "bg-purple-500/10" },
  default: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted/10" },
};

export function RecentActivity() {
  const queryClient = useQueryClient();
  const [realtimeActivities, setRealtimeActivities] = useState<Activity[]>([]);

  const { data: initialActivities, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("recent_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return (data || []) as Activity[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("public:recent_activity")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "recent_activity" },
        (payload) => {
          const newActivity = payload.new as Activity;
          setRealtimeActivities((prev) => [newActivity, ...prev].slice(0, 10));
          // Also invalidate query to keep sync
          queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const displayActivities = realtimeActivities.length > 0 
    ? [...realtimeActivities, ...(initialActivities || []).filter(a => !realtimeActivities.find(ra => ra.id === a.id))].slice(0, 10)
    : initialActivities || [];

  return (
    <div className="rounded-[2rem] border border-border/50 bg-muted/20 p-8 transition-all duration-500 ease-in-out">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight">Recent Activity</h2>
        <div className="flex items-center text-[10px] font-black text-primary uppercase tracking-[0.2em] gap-2 bg-primary/10 px-3 py-1 rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Live
        </div>
      </div>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 opacity-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Feed...</p>
          </div>
        ) : displayActivities.length > 0 ? (
          displayActivities.map((item) => {
            const config = iconMap[item.type] || iconMap.default;
            const Icon = config.icon;
            
            return (
              <div key={item.id} className="group relative flex items-start gap-4 transition-all hover:translate-x-1">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                  config.bg,
                  config.color
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                    <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                {/* Hover Indicator */}
                <div className="absolute -left-4 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all group-hover:opacity-100" />
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
            <Clock className="h-10 w-10 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest max-w-[150px] leading-relaxed">
              No activity yet. Your feed will update as you manage events.
            </p>
          </div>
        )}
      </div>
      
      {displayActivities.length > 0 && (
        <button className="mt-8 w-full rounded-2xl border border-border/50 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:bg-muted hover:text-primary hover:border-primary/20">
          View All Logs
        </button>
      )}
    </div>
  );
}
