import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/event-card";
import { Sparkles, CalendarRange, Filter } from "lucide-react";
import { EventsHero } from "@/components/events/events-hero";
import { CategoryFilter } from "@/components/events/category-filter";
import { EmptyState } from "@/components/events/empty-state";

const cats = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"] as const;

export const Route = createFileRoute("/_student/events/")({
  head: () => ({ 
    meta: [
      { title: "Browse Festivals — WeFest" }, 
      { name: "description", content: "Explore the best cultural, technical, and sports festivals from top colleges across India." }
    ] 
  }),
  component: Events,
});

function Events() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile-for-isolation"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

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

  const { data: userTickets } = useQuery({
    queryKey: ["my-tickets-for-ai"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase.from("tickets").select("*, events(category)").eq("user_id", user.id);
      return data || [];
    }
  });

  const filtered = useMemo(() => {
    if (!dbEvents) return [];
    
    const userCollegeId = userProfile?.user_metadata?.college_id;
    
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
        (e.title.toLowerCase().includes(q.toLowerCase()) || 
         e.college.toLowerCase().includes(q.toLowerCase()) ||
         e.city.toLowerCase().includes(q.toLowerCase()))
      );
  }, [dbEvents, q, cat]);

  const smartMatches = useMemo(() => {
    if (!filtered || filtered.length === 0) return [];
    
    const userCategories = userTickets?.map((t: any) => t.events?.category).filter(Boolean) || [];
    const categoryAffinity = userCategories.reduce((acc: any, c: string) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});

    return [...filtered].map(e => {
      let score = 0;
      if (e.attendees > 5000) score += 20;
      if (e.attendees > 10000) score += 20;
      if (categoryAffinity[e.category]) score += (categoryAffinity[e.category] * 30);
      
      return { ...e, aiScore: score };
    })
    .filter(e => e.aiScore > 0)
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);
  }, [filtered, userTickets]);

  const resetFilters = () => {
    setQ("");
    setCat("All");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-[40vh] w-full animate-pulse bg-muted/20" />
        <div className="container mx-auto px-6 py-12">
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] rounded-3xl bg-muted/10 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EventsHero searchQuery={q} setSearchQuery={setQ} />
      
      <div id="explore-section" className="sticky top-16 z-30 border-y border-border/40 bg-background/60 py-4 backdrop-blur-xl">
        <CategoryFilter 
          categories={cats} 
          activeCategory={cat} 
          setActiveCategory={setCat} 
        />
      </div>

      <div className="container mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Smart Matches Section */}
        {q === "" && cat === "All" && smartMatches.length > 0 && (
          <section className="mb-24 relative">
            <div className="mb-10 flex items-center justify-between animate-in slide-in-from-left-4 fade-in duration-700 delay-100">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Smart Matches For You</h2>
                  <p className="text-sm text-muted-foreground">Personalized festival recommendations based on your interests.</p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-8 bg-brand-gradient opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 rounded-[3rem] blur-3xl -z-10" />
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {smartMatches.map((e, index) => (
                  <div key={`ai-${e.id}`} className="animate-in slide-in-from-bottom-4 fade-in duration-700" style={{ animationDelay: `${(index + 1) * 150}ms`, animationFillMode: 'both' }}>
                    <EventCard event={e} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Listing Section */}
        <section>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-2">
                <CalendarRange className="h-4 w-4" />
                <span>Upcoming Festivals</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                {cat === "All" ? "Explore Everything" : `${cat} Festivals`}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="font-medium">
                Showing {filtered.length} fests
              </span>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filtered.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} hasSearch={q !== "" || cat !== "All"} />
          )}
        </section>
      </div>
    </div>
  );
}

