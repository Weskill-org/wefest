import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, IndianRupee, ExternalLink, Settings, Edit3, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrganizerEventCardProps {
  id: string;
  title: string;
  date: string;
  city: string;
  cover: string;
  status: "Draft" | "Published" | "Sold Out" | "Completed";
  ticketsSold: number;
  revenue: number;
}

export function OrganizerEventCard({
  id,
  title,
  date,
  city,
  cover,
  status,
  ticketsSold,
  revenue
}: OrganizerEventCardProps) {
  const statusColors = {
    Draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Sold Out": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-muted/20 p-5 transition-all duration-500 hover:border-primary/30 hover:bg-muted/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        {/* Event Cover / Mini Banner */}
        <div className={cn(
          "relative h-32 w-full shrink-0 overflow-hidden rounded-2xl md:h-24 md:w-40",
          "bg-gradient-to-br",
          cover
        )}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <Badge className={cn(
            "absolute left-2 top-2 border px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter backdrop-blur-md",
            statusColors[status]
          )}>
            {status}
          </Badge>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-1">
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary/60" />
              {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary/60" />
              {city}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-6 md:flex md:gap-10">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tickets Sold</div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-lg font-black">{ticketsSold.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Revenue</div>
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-emerald-500" />
              <span className="text-lg font-black">₹{(revenue / 100000).toFixed(2)}L</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
            <Link to="/organizer/events/$eventId" params={{ eventId: id }}>
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
            <Edit3 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button asChild className="ml-auto rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white md:ml-2">
            <Link to="/organizer/events/$eventId" params={{ eventId: id }}>
              Manage <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
