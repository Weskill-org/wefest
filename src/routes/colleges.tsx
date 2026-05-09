import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

export const Route = createFileRoute("/colleges")({
  head: () => ({ meta: [{ title: "Colleges — WeFest" }, { name: "description", content: "Verified college network on WeFest." }] }),
  component: CollegesPage,
});

function CollegesPage() {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: colleges, isLoading } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select(`
          *,
          events (
            id,
            title,
            date,
            description
          )
        `)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleRegisterClick = (eventId: string) => {
    if (currentUser) {
      navigate({ to: "/events/$eventId", params: { eventId } });
    } else {
      navigate({ to: "/login", search: { redirect: `/events/${eventId}` } });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-black md:text-5xl animate-pulse bg-muted h-12 w-64 rounded" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-black md:text-5xl">College network</h1>
      <p className="mt-2 text-muted-foreground">{colleges?.length || 0} verified colleges and counting.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colleges?.map((c) => (
          <Link 
            key={c.id} 
            to="/colleges/$collegeSlug"
            params={{ collegeSlug: c.slug }}
            className="glass rounded-2xl p-6 transition hover:border-primary/40 cursor-pointer block"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.city} • @{c.domain}</div>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{c.fests} fests</span>
            </div>
            {c.events && c.events.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Click to view {c.events.length} upcoming {c.events.length === 1 ? 'event' : 'events'}
              </div>
            )}
          </Link>
        ))}
      </div>

      <Dialog open={!!selectedCollege} onOpenChange={(open) => !open && setSelectedCollege(null)}>
        <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-border/60">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">{selectedCollege?.name} Events</DialogTitle>
            <DialogDescription>
              Fests and events hosted by {selectedCollege?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {selectedCollege?.events?.length > 0 ? (
              <div className="grid gap-4">
                {selectedCollege.events.map((e: any) => {
                  const eventDate = e.date ? new Date(e.date) : new Date();
                  return (
                    <div key={e.id} className="glass rounded-2xl p-5 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center bg-primary/10 rounded-xl p-3 min-w-[70px] border border-primary/20">
                          <span className="text-xs font-bold text-primary uppercase">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-black">{eventDate.getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{e.title}</h4>
                          {e.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{e.description}</p>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleRegisterClick(e.id)}
                        className="w-full sm:w-auto bg-brand-gradient text-white shadow-glow shrink-0"
                      >
                        {currentUser ? "View & Register" : "Sign in to Register"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-2xl border border-border/40 border-dashed">
                <CalendarIcon className="mx-auto h-10 w-10 opacity-20 mb-3" />
                No upcoming events found for this college.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
