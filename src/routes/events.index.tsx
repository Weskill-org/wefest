import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/event-card";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Ticket,
  Filter,
  TrendingUp,
  Flame,
  Clock,
  SlidersHorizontal,
} from "lucide-react";

const categories = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"] as const;

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events & Festivals — WeFest" },
      {
        name: "description",
        content:
          "Discover India's biggest college festivals — cultural fests, tech summits, sports meets, and more. Browse, filter, and grab your tickets on WeFest.",
      },
    ],
  }),
  component: EventsIndexPage,
});

function EventsIndexPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "popular" | "price">("date");

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const mappedEvents = useMemo(() => {
    if (!events) return [];
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      college: e.college_name,
      collegeId: e.college_id || "",
      date: e.date,
      city: e.city,
      category: e.category as string,
      cover: e.cover,
      attendees: e.attendees,
      priceFrom: e.price_from,
      description: e.description,
      organizer: e.organizer,
      slug: e.slug,
    }));
  }, [events]);

  // Unique cities for filter
  const cities = useMemo(() => {
    const citySet = new Set(
      mappedEvents.map((e) => e.city).filter((c): c is string => !!c)
    );
    return Array.from(citySet).sort();
  }, [mappedEvents]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = mappedEvents.filter((e) => {
      const matchesSearch =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || e.category === selectedCategory;
      const matchesCity = selectedCity === "all" || e.city === selectedCity;
      return matchesSearch && matchesCategory && matchesCity;
    });

    // Sort
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.attendees - a.attendees);
    } else if (sortBy === "price") {
      result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
    } else {
      result = [...result].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return result;
  }, [mappedEvents, searchQuery, selectedCategory, selectedCity, sortBy]);

  // Trending = most attendees among upcoming
  const trending = useMemo(() => {
    const now = new Date();
    return mappedEvents
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => b.attendees - a.attendees)
      .slice(0, 3);
  }, [mappedEvents]);

  // Stats
  const totalEvents = mappedEvents.length;
  const upcomingCount = mappedEvents.filter(
    (e) => new Date(e.date) >= new Date()
  ).length;
  const totalAttendees = mappedEvents.reduce((a, e) => a + e.attendees, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="rounded-3xl bg-muted/20 p-12 animate-pulse h-64" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* ─── Hero Section ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white shadow-2xl md:p-12">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold backdrop-blur-md mb-4">
            <Sparkles className="h-4 w-4" /> Live Events Marketplace
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight md:text-6xl">
            Discover College Festivals
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            Find, explore, and book tickets to the most exciting festivals happening across India's top colleges.
          </p>

          {/* Stats Row */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md">
              <Calendar className="h-5 w-5 text-white/70" />
              <div>
                <div className="text-2xl font-black">{totalEvents}</div>
                <div className="text-[11px] text-white/60 font-medium">Total Events</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md">
              <Flame className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-2xl font-black">{upcomingCount}</div>
                <div className="text-[11px] text-white/60 font-medium">Upcoming</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md">
              <Users className="h-5 w-5 text-white/70" />
              <div>
                <div className="text-2xl font-black">{totalAttendees > 1000 ? `${(totalAttendees / 1000).toFixed(0)}k+` : totalAttendees}</div>
                <div className="text-[11px] text-white/60 font-medium">Total Attendees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blurs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>

      {/* ─── Trending Section ─── */}
      {trending.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-9 w-9 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Trending Now</h2>
              <p className="text-[11px] text-muted-foreground">The most popular festivals right now.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((e, index) => (
              <div
                key={`trending-${e.id}`}
                className="animate-in slide-in-from-bottom-4 fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
              >
                <EventCard event={e} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Search & Filters ─── */}
      <div className="mt-12 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="event-search"
              placeholder="Search events by name, college, or city…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl pl-10 border-border/50 bg-background/60 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm p-1">
              {[
                { value: "date" as const, icon: Clock, label: "Latest" },
                { value: "popular" as const, icon: TrendingUp, label: "Popular" },
                { value: "price" as const, icon: Ticket, label: "Price" },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSortBy(s.value)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                    sortBy === s.value
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === c
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="h-6 w-px bg-border/40 mx-1 self-center" />
          {/* City filter */}
          <button
            onClick={() => setSelectedCity("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedCity === "all"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <MapPin className="inline h-3 w-3 mr-1" />
            All Cities
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                selectedCity === city
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Active filter count */}
        {(searchQuery || selectedCategory !== "All" || selectedCity !== "all") && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <Filter className="h-3 w-3" />
              <span>{filtered.length} {filtered.length === 1 ? "result" : "results"}</span>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedCity("all");
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ─── Event Grid ─── */}
      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-5">
            <Calendar className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold">No events found</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Try adjusting your search, category, or city filters to find events.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedCity("all");
            }}
            variant="outline"
            className="mt-6 rounded-xl"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      {/* ─── CTA Footer ─── */}
      {!currentUser && (
        <div className="mt-20 text-center">
          <div className="glass inline-flex flex-col items-center rounded-3xl p-8 md:p-12 border border-border/40 max-w-2xl mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow mb-4">
              <Ticket className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold">
              Ready to attend your first fest?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Sign up with your college email to get verified access, exclusive discounts, and join the community of 100k+ festival-goers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => navigate({ to: "/signup" })}
                className="bg-brand-gradient text-white shadow-glow rounded-xl font-bold px-8"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/login" })}
                className="rounded-xl font-bold"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
