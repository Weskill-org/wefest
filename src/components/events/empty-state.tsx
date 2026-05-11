import { SearchX, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface EmptyStateProps {
  onReset: () => void;
  hasSearch?: boolean;
}

export function EmptyState({ onReset, hasSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/50 border border-border/60">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold tracking-tight text-foreground">
        {hasSearch ? "No matching festivals found" : "No upcoming festivals"}
      </h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        {hasSearch 
          ? "Try adjusting your search terms or category to find what you're looking for." 
          : "New college festivals will appear here soon. Check back later for upcoming events."}
      </p>
      
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {hasSearch && (
          <Button 
            variant="outline" 
            onClick={onReset}
            className="rounded-xl border-border/60 hover:bg-muted/50"
          >
            Reset Filters
          </Button>
        )}
        <Button asChild className="rounded-xl bg-brand-gradient text-primary-foreground shadow-glow">
          <Link to="/organizer">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Organize Your Fest
          </Link>
        </Button>
      </div>
    </div>
  );
}
