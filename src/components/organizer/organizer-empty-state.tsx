import { Link } from "@tanstack/react-router";
import { Plus, HelpCircle, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrganizerEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-border/60 bg-muted/5 py-24 text-center transition-all duration-500 hover:bg-muted/10">
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/40 border border-border/50 text-muted-foreground shadow-2xl">
          <CalendarOff className="h-12 w-12 opacity-50" />
        </div>
      </div>
      
      <h2 className="font-display text-3xl font-black tracking-tight text-foreground md:text-4xl">
        No Events Found
      </h2>
      <p className="mt-4 max-w-sm text-lg font-medium text-muted-foreground">
        You haven't created any events yet. Start your journey by creating your first festival experience.
      </p>
      
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button 
          asChild 
          className="h-14 rounded-2xl bg-brand-gradient px-8 text-lg font-bold shadow-glow hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Link to="/organizer/new">
            <Plus className="mr-2 h-6 w-6" />
            Create First Event
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="h-14 rounded-2xl border-border/50 bg-background/50 px-8 text-lg font-bold hover:bg-muted"
        >
          <HelpCircle className="mr-2 h-6 w-6 text-primary" />
          Learn How It Works
        </Button>
      </div>
    </div>
  );
}
