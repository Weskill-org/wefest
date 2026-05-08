import { Ticket, UserCheck, DollarSign, Gift, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "ticket",
    title: "New ticket purchased",
    description: "Rohan Sharma bought a Platinum Pass for Technex '26",
    time: "2 mins ago",
    icon: Ticket,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    id: 2,
    type: "checkin",
    title: "Attendee checked in",
    description: "Priya V. has just entered the Main Arena",
    time: "15 mins ago",
    icon: UserCheck,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: 3,
    type: "sponsor",
    title: "Sponsor inquiry received",
    description: "Red Bull is interested in Sponsoring the Music Fest",
    time: "1 hour ago",
    icon: DollarSign,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    id: 4,
    type: "merch",
    title: "Merch order placed",
    description: "12 limited edition hoodies ordered by IIT Delhi group",
    time: "3 hours ago",
    icon: Gift,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-3xl border border-border/50 bg-muted/20 p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight">Recent Activity</h2>
        <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest gap-2">
          <Clock className="h-3 w-3" /> Real-time
        </div>
      </div>
      
      <div className="space-y-6">
        {activities.map((item) => (
          <div key={item.id} className="group relative flex items-start gap-4 transition-all hover:translate-x-1">
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              item.iconBg,
              item.iconColor
            )}>
              <item.icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <span className="text-[10px] font-medium text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
            </div>
            
            {/* Hover line */}
            <div className="absolute -left-4 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all group-hover:opacity-100" />
          </div>
        ))}
      </div>
      
      <button className="mt-8 w-full rounded-2xl border border-border/50 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted hover:text-primary">
        View All Logs
      </button>
    </div>
  );
}
