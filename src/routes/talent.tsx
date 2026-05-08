import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Music, Mic2, Music2, Star, IndianRupee, Loader2, Search, Filter, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/talent")({
  head: () => ({
    meta: [
      { title: "Artist Marketplace — WeFest" },
      { name: "description", content: "Book top artists, DJs and performers for your college festival." },
    ],
  }),
  component: TalentMarketplace,
});

function TalentMarketplace() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");

  const { data: artists, isLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_profiles")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const filtered = useMemo(() => {
    if (!artists) return [];
    return artists.filter(a => 
      (genre === "All" || a.genre === genre) &&
      (a.name.toLowerCase().includes(q.toLowerCase()) || a.genre?.toLowerCase().includes(q.toLowerCase()))
    );
  }, [artists, q, genre]);

  const genres = ["All", "DJ", "Band", "Singer", "Speaker", "Comedian"];

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero */}
      <section className="relative mb-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-bold text-primary">
              <Mic2 className="h-3.5 w-3.5" /> Verified Talent Network
            </div>
            <h1 className="mt-6 font-display text-5xl font-black leading-tight md:text-7xl">
              Book the <span className="text-gradient">Star</span> of your next fest.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Browse and book India's most talented student and professional artists. Secure payments, verified ratings, and direct communication.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="bg-brand-gradient hover:opacity-90 rounded-full px-8 shadow-glow">
                Explore Talent
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Register as Artist
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-gradient opacity-10 blur-3xl -z-10 rounded-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 rounded-3xl bg-slate-900 border border-white/5 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <Music2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white/10" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">DJs</div>
                  <div className="font-bold">Electronic Vibes</div>
                </div>
              </div>
              <div className="h-64 mt-12 rounded-3xl bg-brand-gradient overflow-hidden relative group shadow-glow">
                <Mic2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white/20" />
                <div className="absolute bottom-4 left-4 text-white font-bold">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Live</div>
                  <div className="font-bold">Singer Songwriters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h2 className="font-display text-3xl font-bold">Artist Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">Discover verified talent for your festival</p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search artists..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              className="pl-9 bg-background/50 border-border/60"
            />
          </div>
          <div className="flex gap-2">
            {genres.slice(0, 4).map(g => (
              <Button 
                key={g} 
                onClick={() => setGenre(g)}
                variant="outline" 
                size="sm" 
                className={`rounded-full ${genre === g ? "border-primary bg-primary/5" : "border-border/60"}`}
              >
                {g}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 glass rounded-[2rem] animate-pulse" />)
        ) : filtered.length > 0 ? (
          filtered.map(a => (
            <div key={a.id} className="glass group overflow-hidden rounded-[2rem] border border-border/60 hover:border-primary/40 transition-all">
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-brand-gradient p-0.5 shadow-glow">
                      <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center font-display text-xl font-black">
                        {a.name.slice(0, 1)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">{a.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="text-primary font-semibold">{a.genre}</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-foreground">{Number(a.rating).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(a.rating ?? 0) > 4.5 && (
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                <p className="mt-6 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {a.bio || "No bio available."}
                </p>
                
                <div className="mt-8 pt-8 border-t border-border/40 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Starting from</div>
                    <div className="text-lg font-black text-primary flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {((a.base_price ?? 0) / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <Button className="bg-brand-gradient text-white rounded-full px-6 shadow-glow">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <Mic2 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-bold">No artists found</h3>
            <p className="text-muted-foreground">We are constantly adding new talent. Stay tuned!</p>
          </div>
        )}
      </div>

      {/* Safety Section */}
      <section className="mt-24 p-12 glass rounded-[3rem] border border-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] items-center relative z-10">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-brand-gradient shadow-glow">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold">Why book through WeFest?</h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <SafetyPoint title="Secure Escrow" desc="Funds are only released once the performance is confirmed and completed." />
              <SafetyPoint title="Verified Talent" desc="We check IDs, portfolios and past performance records for every artist." />
              <SafetyPoint title="Standard Contracts" desc="Professional legal agreements automatically generated for every booking." />
              <SafetyPoint title="Support" desc="Dedicated dispute resolution and on-ground coordination support." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SafetyPoint({ title, desc }: { title: string, desc: string }) {
  return (
    <div>
      <div className="font-bold flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary" /> {title}
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
