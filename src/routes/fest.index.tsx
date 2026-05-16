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
  Loader2
} from "lucide-react";
import { EmptyState } from "@/components/events/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudentAppLayout } from "@/components/layout/StudentAppLayout";

const CATEGORIES = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"] as const;

export const Route = createFileRoute("/fest/")({
  head: () => ({ 
    meta: [
      { title: "Festivals — WeFest" }, 
      { name: "description", content: "Discover India's biggest college festivals." }
    ] 
  }),
  component: PublicFestPage,
});

function PublicFestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
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

  const filteredEvents = useMemo(() => {
    if (!rawEvents) return [];
    return rawEvents
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
        slug: e.slug
      }))
      .filter((e) => {
        const matchesSearch = 
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          e.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || e.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
  }, [rawEvents, searchQuery, activeCategory]);

  const collegeName = profile?.colleges?.name || "Premium Institutions";
  const city = profile?.colleges?.city || "India";

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
          <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-3 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for festivals, competitions, or guest stars..."
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
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 sm:px-8 py-12 max-w-[1400px] mx-auto">
        {isLoading ? (
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />)}
           </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        ) : (
          <EmptyState onReset={() => { setSearchQuery(""); setActiveCategory("All"); }} hasSearch={searchQuery !== "" || activeCategory !== "All"} />
        )}
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
    <div className="bg-background min-h-screen">
      {/* Basic header for guests */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-black text-xs">W</div>
          <span className="font-display font-black tracking-tighter text-lg">WeFest</span>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
          <Button className="bg-brand-gradient text-white" asChild><Link to="/signup">Join Now</Link></Button>
        </div>
      </header>
      {PageContent}
    </div>
  );
}
