import { createFileRoute, Link } from "@tanstack/react-router";
import { colleges, events } from "@/lib/mock";

export const Route = createFileRoute("/colleges")({
  head: () => ({ meta: [{ title: "Colleges — WeFest" }, { name: "description", content: "Verified college network on WeFest." }] }),
  component: CollegesPage,
});

function CollegesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-black md:text-5xl">College network</h1>
      <p className="mt-2 text-muted-foreground">{colleges.length} verified colleges and counting.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colleges.map((c) => {
          const cFests = events.filter((e) => e.collegeId === c.id);
          return (
            <div key={c.id} className="glass rounded-2xl p-6 transition hover:border-primary/40">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-xl font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.city} • @{c.domain}</div>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{c.fests} fests</span>
              </div>
              {cFests.length > 0 && (
                <div className="mt-4 grid gap-1.5 text-sm">
                  {cFests.map((e) => (
                    <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="text-muted-foreground hover:text-primary">
                      → {e.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
