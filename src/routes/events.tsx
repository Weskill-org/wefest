import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/event-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const cats = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"] as const;

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Browse festivals — WeFest" }, { name: "description", content: "Discover college festivals across India." }] }),
  component: Events,
});

function Events() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");

  const { data: dbEvents, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    if (!dbEvents) return [];
    return dbEvents
      .map(e => ({
        id: e.id,
        title: e.title,
        college: e.college_name,
        collegeId: e.college_id || "",
        date: e.date,
        city: e.city,
        category: e.category as any,
        cover: e.cover,
        attendees: e.attendees,
        priceFrom: e.price_from,
        description: e.description,
        organizer: e.organizer
      }))
      .filter((e) =>
        (cat === "All" || e.category === cat) &&
        (e.title.toLowerCase().includes(q.toLowerCase()) || e.college.toLowerCase().includes(q.toLowerCase()))
      );
  }, [dbEvents, q, cat]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-black md:text-5xl animate-pulse bg-muted h-12 w-64 rounded" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-64 glass rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-black md:text-5xl">All festivals</h1>
        <p className="text-muted-foreground">{filtered.length} fests across {new Set(filtered.map(e => e.college)).size} colleges</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fest or college…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                cat === c ? "border-transparent bg-brand-gradient text-primary-foreground" : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  );
}
