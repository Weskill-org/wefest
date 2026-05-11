import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Search, Filter, CalendarPlus } from "lucide-react";
import { OrganizerEventCard } from "@/components/organizer/organizer-event-card";
import { OrganizerEmptyState } from "@/components/organizer/organizer-empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/organizer/events/")({
  component: OrganizerEventsList,
});

function OrganizerEventsList() {
  const ctx = Route.useRouteContext() as any;
  const membership = ctx.membership;
  const [searchQuery, setSearchQuery] = useState("");

  const { data: userData } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ["all-college-events", userData?.id, membership?.college_id],
    enabled: !!userData?.id,
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (membership?.college_id) {
        query = query.or(`organizer_user_id.eq.${userData!.id},college_id.eq.${membership.college_id}`);
      } else {
        query = query.eq("organizer_user_id", userData!.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const filtered = useMemo(() => {
    if (!events) return [];
    if (!searchQuery.trim()) return events;
    return events.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  if (isLoading) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-10 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">All Events</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor all your festivals. {events?.length || 0} total.</p>
        </div>

        <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow h-10 px-5 text-sm">
          <Link to="/organizer/new">
            <CalendarPlus className="h-4 w-4 mr-2" /> New Event
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search events..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-muted/10 border-border/50 rounded-xl"
        />
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((e) => (
            <OrganizerEventCard 
              key={e.id}
              id={e.id}
              title={e.title}
              date={e.date}
              city={e.city}
              cover={e.cover}
              status={(e.status || "Published") as any}
              ticketsSold={Math.floor((e.attendees || 0) * 0.15)}
              revenue={(e.attendees || 0) * (e.price_from || 0) * 0.15}
            />
          ))
        ) : (
          <OrganizerEmptyState />
        )}
      </div>
    </div>
  );
}
