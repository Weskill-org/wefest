import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/event-card";
import { 
  Sparkles, 
  CalendarRange, 
  Search, 
  MapPin, 
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Loader2,
  Tag,
  Flame,
  Filter,
  X,
  Calendar,
} from "lucide-react";
import { EmptyState } from "@/components/events/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudentAppLayout } from "@/components/layout/StudentAppLayout";
import { eventMatchesPreferences, extractUniqueTags } from "@/lib/preferences";

const CATEGORIES = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"] as const;
const DATE_PRESETS = ["All Dates", "Today", "This Week", "This Month", "Upcoming"] as const;

export const Route = createFileRoute("/fest/")(  {
  head: () => ({ 
    meta: [
      { title: "Discover College Festivals | WeFest" }, 
      { name: "description", content: "Explore and register for India's biggest college festivals (cultural, tech, sports, business, and arts) across premier campuses on WeFest." },
      { name: "keywords", content: "college festivals, campus fests, cultural events, tech summits, college sponsors, Indian college fests, WeFest directory" },
      { property: "og:title", content: "Discover College Festivals | WeFest" },
      { property: "og:description", content: "Explore and register for India's biggest college festivals (cultural, tech, sports, business, and arts) across premier campuses on WeFest." },
      { property: "og:url", content: "https://wefest.weskill.org/fest" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Discover College Festivals | WeFest" },
      { name: "twitter:description", content: "Explore and register for India's biggest college festivals on WeFest." },
    ],
    links: [
      { rel: "canonical", href: "https://wefest.weskill.org/fest" },
    ],
  }),
  component: PublicFestPage,
});

function PublicFestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [datePreset, setDatePreset] = useState<(typeof DATE_PRESETS)[number]>("All Dates");
  const navigate = useNavigate();

  // ── Two-Word Quick Find ──────────────────────────────────────────────
  const [findWord1, setFindWord1] = useState("");
  const [findWord2, setFindWord2] = useState("");
  const [findStatus, setFindStatus] = useState<"idle" | "checking" | "found" | "not_found">("idle");
  const findTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const word2Ref = useRef<HTMLInputElement>(null);

  const handleFindWord = useCallback((w1: string, w2: string) => {
    if (findTimer.current) clearTimeout(findTimer.current);
    if (!w1 || !w2 || w1.length < 2 || w2.length < 2) { setFindStatus("idle"); return; }
    setFindStatus("checking");
    findTimer.current = setTimeout(async () => {
      const slug = `${w1.toLowerCase()}.${w2.toLowerCase()}`;
      const { data } = await supabase.from("events").select("id, slug").eq("slug", slug).maybeSingle();
      if (data) {
        setFindStatus("found");
        setTimeout(() => navigate({ to: "/fest/$slug", params: { slug } }), 400);
      } else {
        setFindStatus("not_found");
      }
    }, 600);
  }, [navigate]);

  const onFindWord1 = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z]/g, "");
    setFindWord1(clean);
    handleFindWord(clean, findWord2);
    if (val.includes(".")) { word2Ref.current?.focus(); }
  };
  const onFindWord2 = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z]/g, "");
    setFindWord2(clean);
    handleFindWord(findWord1, clean);
  };

  // Auth & Profile
  const { data: authData } = useQuery({
    queryKey: ["current-auth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("*, colleges(*)")
        .eq("id", user.id)
        .maybeSingle();
      return { user, profile };
    }
  });

  const user = authData?.user;
  const profile = authData?.profile;
  const studentPreferences: string[] = profile?.interests || [];

  // Events (Scoped if logged in, otherwise all public)
  const { data: rawEvents, isLoading } = useQuery({
    queryKey: ["fest-events", profile?.college_id],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: true });
      
      if (profile?.college_id) {
        query = query.eq("college_id", profile.college_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Extract unique tags and cities from all events
  const allTags = useMemo(() => {
    if (!rawEvents) return [];
    return extractUniqueTags(rawEvents);
  }, [rawEvents]);

  const cities = useMemo(() => {
    if (!rawEvents) return [];
    const citySet = new Set(rawEvents.map(e => e.city).filter((c): c is string => !!c));
    return Array.from(citySet).sort();
  }, [rawEvents]);

  // Date filter helper
  const passesDateFilter = useCallback((dateStr: string) => {
    if (datePreset === "All Dates") return true;
    const eventDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (datePreset) {
      case "Today":
        return eventDate >= today && eventDate < new Date(today.getTime() + 86400000);
      case "This Week": {
        const weekEnd = new Date(today.getTime() + 7 * 86400000);
        return eventDate >= today && eventDate < weekEnd;
      }
      case "This Month": {
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return eventDate >= today && eventDate <= monthEnd;
      }
      case "Upcoming":
        return eventDate >= today;
      default:
        return true;
    }
  }, [datePreset]);

  // Map and filter events
  const allMappedEvents = useMemo(() => {
    if (!rawEvents) return [];
    return rawEvents.map(e => ({
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
      slug: e.slug,
      tags: (e as any).tags || [],
      organizer: e.organizer,
      recommended: false as boolean | undefined,
    }));
  }, [rawEvents]);

  const filteredEvents = useMemo(() => {
    return allMappedEvents.filter((e) => {
      // Search: matches title, description, college, tags, organizer
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        e.title.toLowerCase().includes(q) || 
        e.description?.toLowerCase().includes(q) ||
        e.college.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.organizer?.toLowerCase().includes(q) ||
        (e.tags && e.tags.some((t: string) => t.toLowerCase().includes(q)));

      const matchesCategory = activeCategory === "All" || e.category === activeCategory;
      const matchesTag = !selectedTag || (e.tags && e.tags.some((t: string) => t.toLowerCase() === selectedTag!.toLowerCase()));
      const matchesCity = selectedCity === "all" || e.city === selectedCity;
      const matchesDate = passesDateFilter(e.date);

      return matchesSearch && matchesCategory && matchesTag && matchesCity && matchesDate;
    });
  }, [allMappedEvents, searchQuery, activeCategory, selectedTag, selectedCity, passesDateFilter]);

  // Separate recommended vs all
  const { recommended, others } = useMemo(() => {
    if (!studentPreferences || studentPreferences.length === 0) {
      return { recommended: [], others: filteredEvents };
    }
    const rec: typeof filteredEvents = [];
    const rest: typeof filteredEvents = [];
    for (const e of filteredEvents) {
      if (eventMatchesPreferences(e, studentPreferences)) {
        rec.push({ ...e, recommended: true });
      } else {
        rest.push(e);
      }
    }
    return { recommended: rec, others: rest };
  }, [filteredEvents, studentPreferences]);

  const hasActiveFilters = searchQuery !== "" || activeCategory !== "All" || selectedTag !== null || selectedCity !== "all" || datePreset !== "All Dates";

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setSelectedTag(null);
    setSelectedCity("all");
    setDatePreset("All Dates");
  };

  const collegeName = (profile?.colleges as any)?.name || "Premium Institutions";
  const city = (profile?.colleges as any)?.city || "India";

  const PageContent = (
    <div className="min-h-screen pb-20 animate-in fade-in duration-700">
      <section className="relative px-6 sm:px-8 pt-10 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Institutional Access
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-2">
                Explore Exclusive <br/>
                <span className="text-gradient">Campus Festivals</span>
              </h1>
              <p className="text-base text-muted-foreground font-medium max-w-lg">
                Discover verified events {user ? `at ${collegeName}` : "across India's top colleges"}. 
                Experience the best of culture, tech, and sports.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold">{collegeName}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold">{city}</span>
                </div>
                {studentPreferences.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-md">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-primary">{studentPreferences.length} interests active</span>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden xl:block w-72 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 relative group overflow-hidden">
              <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-glow">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{filteredEvents.length}</div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Fests</div>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                {recommended.length > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">For You</span>
                    <span className="text-primary font-black">{recommended.length}</span>
                  </div>
                )}
                <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                  Browse Categories <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Find */}
      <section className="px-6 sm:px-8 pb-2">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-black/30 backdrop-blur-2xl rounded-[2rem] p-4 border border-primary/10 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest">Quick Find by Event Code</div>
                <div className="text-[10px] text-muted-foreground">Type the two-word code to instantly jump to an event</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center rounded-2xl border border-white/10 bg-black/20 overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                <input
                  type="text"
                  value={findWord1}
                  onChange={(e) => onFindWord1(e.target.value)}
                  placeholder="first word"
                  className="flex-1 h-12 px-5 bg-transparent text-sm font-bold text-right outline-none placeholder:text-muted-foreground/30"
                  maxLength={20}
                />
                <div className="flex items-center justify-center w-10 shrink-0">
                  <span className={cn(
                    "text-3xl font-black transition-colors duration-300",
                    findStatus === "found" ? "text-emerald-400" : findStatus === "not_found" ? "text-red-400" : "text-primary/60"
                  )}>.</span>
                </div>
                <input
                  ref={word2Ref}
                  type="text"
                  value={findWord2}
                  onChange={(e) => onFindWord2(e.target.value)}
                  placeholder="second word"
                  className="flex-1 h-12 px-5 bg-transparent text-sm font-bold outline-none placeholder:text-muted-foreground/30"
                  maxLength={20}
                />
              </div>
              {findStatus === "checking" && <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />}
              {findStatus === "found" && <div className="text-emerald-400 text-xs font-bold shrink-0 animate-pulse">Found! Redirecting…</div>}
              {findStatus === "not_found" && <div className="text-red-400 text-xs font-bold shrink-0">Not found</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="px-6 sm:px-8 py-6 sticky top-0 z-30 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-3 border border-white/5 shadow-2xl flex flex-col gap-3">
            {/* Search bar + Category pills */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 group w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events by name, tags, college, city, or keywords like AI, hackathon, dance..."
                  className="h-14 pl-12 rounded-[1.5rem] bg-black/20 border-white/10 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground font-medium"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide px-2 w-full md:w-auto">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "h-11 px-5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 relative group",
                      activeCategory === category
                        ? "bg-white text-black shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Date presets + City filter + Tags */}
            <div className="flex flex-wrap items-center gap-2 px-2">
              {/* Date presets */}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                {DATE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setDatePreset(preset)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap",
                      datePreset === preset
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground/70 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-white/10 mx-1" />

              {/* City filter */}
              {cities.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1 shrink-0" />
                  <button
                    onClick={() => setSelectedCity("all")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap",
                      selectedCity === "all"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground/70 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    All Cities
                  </button>
                  {cities.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedCity(c)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap",
                        selectedCity === c
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground/70 hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tag pills */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 px-2 overflow-x-auto scrollbar-hide pb-1">
                <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <button
                  onClick={() => setSelectedTag(null)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap shrink-0",
                    selectedTag === null
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-muted-foreground/70 hover:text-foreground hover:bg-white/5"
                  )}
                >
                  All Tags
                </button>
                {allTags.slice(0, 15).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap shrink-0",
                      selectedTag === tag
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "text-muted-foreground/70 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* Active filter summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-3 px-3 pb-1">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                  <Filter className="h-3 w-3" />
                  <span>{filteredEvents.length} {filteredEvents.length === 1 ? "result" : "results"}</span>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Recommended For You ─── */}
      {recommended.length > 0 && (
        <section className="px-6 sm:px-8 pt-6 pb-2 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary shadow-glow border border-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                Recommended for You
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  {recommended.length}
                </span>
              </h2>
              <p className="text-[11px] text-muted-foreground font-medium">Based on your selected interests</p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((event, index) => (
              <div
                key={`rec-${event.id}`}
                className="animate-in slide-in-from-bottom-4 fade-in duration-500"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
              >
                <EventCard event={event as any} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── All Events Grid ─── */}
      <section className="px-6 sm:px-8 py-12 max-w-[1400px] mx-auto">
        {recommended.length > 0 && others.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground border border-white/5">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">All Events</h2>
              <p className="text-[11px] text-muted-foreground font-medium">
                Browse all available events
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />)}
           </div>
        ) : others.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((event) => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        ) : recommended.length === 0 ? (
          <EmptyState onReset={clearAllFilters} hasSearch={hasActiveFilters} />
        ) : null}
      </section>
    </div>
  );

  if (user) {
    return (
      <StudentAppLayout user={user} profile={profile}>
        {PageContent}
      </StudentAppLayout>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Minimal branded header for guests */}
      <header className="sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-xs shadow-glow transition-transform group-hover:scale-105">W</div>
          <span className="font-display font-black tracking-tighter text-lg">
            We<span className="text-gradient">Fest</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/events" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">Events</Link>
          <Link to="/colleges" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">Colleges</Link>
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild><Link to="/login">Sign in</Link></Button>
          <Button size="sm" className="bg-brand-gradient text-primary-foreground hover:opacity-90 font-bold" asChild><Link to="/signup">Join Free</Link></Button>
        </div>
      </header>
      <div className="flex-1">{PageContent}</div>
      {/* Minimal footer for guests on fest pages */}
      <footer className="border-t border-white/5 bg-black/30 backdrop-blur-xl py-8 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-black text-[10px] shadow-glow">W</div>
            <span className="font-black tracking-tighter text-sm">We<span className="text-gradient">Fest</span></span>
          </Link>
          <p className="text-xs text-muted-foreground/60 font-medium">
            © {new Date().getFullYear()} WeFest Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
