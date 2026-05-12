import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/event-card";
import { 
  Sparkles, 
  CalendarRange, 
  Filter, 
  Search, 
  MapPin, 
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { EmptyState } from "@/components/events/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Cultural", "Tech", "Sports", "Business", "Arts"] as const;

export const Route = createFileRoute("/_student/explore/")({
  head: () => ({ 
    meta: [
      { title: "Campus Discovery — WeFest" }, 
      { name: "description", content: "Explore exclusive festivals and events at your institution." }
    ] 
  }),
  component: ProfessionalExplorePage,
});

function ProfessionalExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");

  // 1. Fetch User Profile to get College ID
  const { data: userProfile } = useQuery({
    queryKey: ["student-profile-scoped"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("student_profiles")
        .select("*, colleges(id, name, city)")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    }
  });

  // 2. Fetch Events (Always scoped to college if user has one)
  const { data: rawEvents, isLoading } = useQuery({
    queryKey: ["scoped-events", userProfile?.college_id],
    enabled: !!userProfile,
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: true });
      
      // CRITICAL: Strict college isolation logic
      if (userProfile?.college_id) {
        query = query.eq("college_id", userProfile.college_id);
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
        organizer: e.organizer,
        isVerified: true
      }))
      .filter((e) => {
        const matchesSearch = 
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          e.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = activeCategory === "All" || e.category === activeCategory;
        
        return matchesSearch && matchesCategory;
      });
  }, [rawEvents, searchQuery, activeCategory]);

  if (isLoading) {
    return (
      <div className="px-6 sm:px-8 py-10 max-w-[1400px] mx-auto space-y-8">
        <div className="h-40 w-full rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[420px] rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const collegeName = userProfile?.colleges?.name || "Your Institution";
  const city = userProfile?.colleges?.city || "Your City";

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-700">
      
      {/* ─── Premium Header Section ─── */}
      <section className="relative px-6 sm:px-8 pt-10 pb-16 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-indigo-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />

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
                Verified events only for students of <span className="text-foreground font-bold">{collegeName}</span>. 
                Experience the best of culture, tech, and sports.
              </p>
              
              {/* Quick Info Pills */}
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

            {/* Smart Stats Card */}
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Coming Soon</span>
                    <span className="font-bold">2+ Events</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3 rounded-full" />
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                  Request Event Access <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Search & Interactive Filters ─── */}
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
            
            <div className="h-8 w-px bg-white/10 hidden md:block" />

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
                  {activeCategory === category && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-black animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Event Grid ─── */}
      <section className="px-6 sm:px-8 py-12 max-w-[1400px] mx-auto">
        
        {/* Section Title */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-brand-gradient shadow-glow flex items-center justify-center text-white">
              <CalendarRange className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">Institution Calendar</h2>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Upcoming events at {collegeName}</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
            <Clock className="h-3 w-3" /> Updated 5m ago
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20">
            <EmptyState 
              onReset={() => { setSearchQuery(""); setActiveCategory("All"); }} 
              hasSearch={searchQuery !== "" || activeCategory !== "All"} 
            />
          </div>
        )}
      </section>

      {/* ─── Premium Footer CTA ─── */}
      {filteredEvents.length > 0 && (
        <section className="px-6 sm:px-8 mt-20">
          <div className="max-w-[1400px] mx-auto relative rounded-[3rem] overflow-hidden bg-brand-gradient p-12 lg:p-20 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-[-20deg] translate-x-32" />
            
            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">
                Don't Miss Out <br/>On The Action.
              </h2>
              <p className="text-lg text-white/80 font-medium leading-relaxed">
                Stay updated with your institution's latest happenings. Join 50,000+ students from {collegeName} who are already using WeFest to build memories.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                  Get Exclusive Invites
                </Button>
                <Button variant="ghost" className="h-14 px-8 rounded-2xl border-2 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Join Campus Network
                </Button>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-white/10 rounded-full blur-[80px]" />
          </div>
        </section>
      )}
    </div>
  );
}
