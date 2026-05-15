import { Bell, Clock, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RecentActivity } from "./organizer/recent-activity";
import { cn } from "@/lib/utils";

interface ActivityFeedPopoverProps {
  collegeId?: string;
  className?: string;
  collapsed?: boolean;
}

export function ActivityFeedPopover({ collegeId, className, collapsed }: ActivityFeedPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 relative group",
            collapsed && "justify-center px-2.5",
            "text-muted-foreground hover:text-foreground hover:bg-white/5",
            className
          )}
        >
          <div className="relative">
            <Bell className={cn("h-[18px] w-[18px] shrink-0 transition-colors group-hover:text-foreground")} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          {!collapsed && <span className="truncate flex-1 text-left">Activity Feed</span>}
          {!collapsed && (
            <div className="bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider group-hover:bg-primary group-hover:text-white transition-all">
              Live
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        align="start" 
        className="w-[400px] p-0 border-white/5 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-[2.5rem] ml-2"
        sideOffset={10}
      >
        <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
          <div className="p-1">
            <RecentActivity collegeId={collegeId} />
          </div>
        </div>
        <div className="bg-white/5 p-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Real-time updates enabled
            </span>
          </div>
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
