import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/colleges")({
  head: () => ({ meta: [{ title: "Colleges — WeFest" }, { name: "description", content: "Verified college network on WeFest." }] }),
  component: CollegesPage,
});

function CollegesPage() {
  const { data: colleges, isLoading } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select(`
          *,
          events (
            id,
            title
          )
        `)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

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
          <div key={c.id} className="glass rounded-2xl p-6 transition hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.city} • @{c.domain}</div>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{c.fests} fests</span>
            </div>
            {c.events && c.events.length > 0 && (
              <div className="mt-4 grid gap-1.5 text-sm">
                {c.events.map((e) => (
                  <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="text-muted-foreground hover:text-primary">
                    → {e.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
