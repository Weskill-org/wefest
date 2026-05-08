import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Plus, ScanLine } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrganizerHeaderProps {
  name: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export function OrganizerHeader({ name, avatarUrl, isVerified = true }: OrganizerHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20 p-1 bg-background">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-brand-gradient text-white font-bold text-xl">
            {name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-black md:text-4xl tracking-tight text-foreground">
              {name}
            </h1>
            {isVerified && (
              <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
            )}
          </div>
          <p className="text-muted-foreground mt-1 max-w-md">
            Manage your events, tickets, attendees, and revenue in one premium dashboard.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          asChild 
          variant="outline" 
          className="rounded-xl border-border/50 bg-background/50 hover:bg-muted transition-all duration-300"
        >
          <Link to="/organizer/scan">
            <ScanLine className="mr-2 h-4 w-4 text-primary" />
            Scan Tickets
          </Link>
        </Button>
        <Button 
          asChild 
          className="bg-brand-gradient text-white rounded-xl px-6 font-bold shadow-glow hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Link to="/organizer/new">
            <Plus className="mr-2 h-5 w-5" />
            Create Event
          </Link>
        </Button>
      </div>
    </div>
  );
}
