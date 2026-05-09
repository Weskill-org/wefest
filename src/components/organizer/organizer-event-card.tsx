import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, IndianRupee, ExternalLink, Edit3, Share2, Trash2, MoreVertical, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrganizerEventCardProps {
  id: string;
  title: string;
  date: string;
  city: string;
  cover: string;
  status: "Draft" | "Published" | "Sold Out" | "Completed";
  ticketsSold: number;
  revenue: number;
  onDeleted?: () => void;
}

export function OrganizerEventCard({
  id,
  title,
  date,
  city,
  cover,
  status,
  ticketsSold,
  revenue,
  onDeleted,
}: OrganizerEventCardProps) {
  const queryClient = useQueryClient();

  const statusColors = {
    Draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Sold Out": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      // Invalidate all event query keys
      queryClient.invalidateQueries({ queryKey: ["my-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["all-college-events"] });
      onDeleted?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete event");
    },
  });

  const handleShare = async () => {
    const url = `${window.location.origin}/events/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Event link copied to clipboard!");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Event link copied to clipboard!");
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-muted/20 p-5 transition-all duration-500 hover:border-primary/30 hover:bg-muted/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        {/* Event Cover */}
        <div
          className={cn(
            "relative h-32 w-full shrink-0 overflow-hidden rounded-2xl md:h-24 md:w-40",
            "bg-gradient-to-br",
            cover
          )}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <Badge
            className={cn(
              "absolute left-2 top-2 border px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter backdrop-blur-md",
              statusColors[status]
            )}
          >
            {status}
          </Badge>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1 min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary/60" />
              {new Date(date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary/60" />
              {city}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-6 md:flex md:gap-10 shrink-0">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Tickets Sold
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-lg font-black">{ticketsSold.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Revenue
            </div>
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-emerald-500" />
              <span className="text-lg font-black">₹{(revenue / 100000).toFixed(2)}L</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-2 md:pt-0 shrink-0">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
            title="Edit Details"
          >
            <Link to="/organizer/events/$eventId/edit" params={{ eventId: id }}>
              <Pencil className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
            onClick={handleShare}
            title="Share event"
          >
            <Share2 className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>

          {/* More menu (Delete) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted/50"
                title="More options"
              >
                <MoreVertical className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem asChild>
                <Link
                  to="/events/$eventId"
                  params={{ eventId: id }}
                  target="_blank"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Public Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2 cursor-pointer"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
                {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Primary CTA */}
          <Button
            asChild
            className="rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white ml-1 h-9 px-4 text-xs font-bold"
          >
            <Link to="/organizer/events/$eventId" params={{ eventId: id }}>
              Manage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
