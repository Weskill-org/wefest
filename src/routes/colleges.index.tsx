import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Globe,
  Trophy,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/colleges/")({
  head: () => ({
    meta: [
      { title: "Top Colleges & Universities Campus Network | WeFest" },
      {
        name: "description",
        content:
          "Explore the premier campus network of India's top colleges. Browse verified educational institutions, tech fests, cultural events, and past archives on WeFest.",
      },
      { name: "keywords", content: "college campus network, Indian universities, tech fests colleges, DU colleges fests, IIT college festivals, verified campus network, WeFest colleges" },
      { property: "og:title", content: "Top Colleges & Universities Campus Network | WeFest" },
      { property: "og:description", content: "Explore the premier campus network of India's top colleges. Browse verified educational institutions, tech fests, cultural events, and past archives on WeFest." },
      { property: "og:url", content: "https://wefest.weskill.org/colleges" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Top Colleges & Universities Campus Network | WeFest" },
      { name: "twitter:description", content: "Explore the premier campus network of India's top colleges on WeFest." },
    ],
    links: [
      { rel: "canonical", href: "https://wefest.weskill.org/colleges" },
    ],
  }),
  component: CollegesIndexPage,
});

function CollegesIndexPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: colleges, isLoading } = useQuery({
    queryKey: ["colleges-approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select(
          `
          *,
          events (
            id,
            title,
            date,
            description,
            category
          )
        `
        )
        .eq("status", "approved")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // All approved colleges are real — no placeholder filtering needed
  const realColleges = colleges || [];

  // Get unique cities for filter
  const cities = useMemo(() => {
    const citySet = new Set(
      realColleges.map((c) => c.city).filter((c): c is string => !!c && c !== "Pending")
    );
    return Array.from(citySet).sort();
  }, [realColleges]);

  // Filter colleges by search & city
  const filtered = useMemo(() => {
    return realColleges.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity =
        selectedCity === "all" || c.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [realColleges, searchQuery, selectedCity]);

  // Stats
  const totalFests = realColleges?.reduce((acc, c) => acc + (c.events?.length || 0), 0) || 0;
  const totalEvents =
    realColleges?.reduce((acc, c) => {
      const upcoming = c.events?.filter(
        (e: any) => new Date(e.date) >= new Date()
      ) || [];
      return acc + upcoming.length;
    }, 0) || 0;

  // Gradient accents for cards
  const gradients = [
    "from-fuchsia-500/20 to-violet-500/20",
    "from-blue-500/20 to-cyan-500/20",
    "from-emerald-500/20 to-teal-500/20",
    "from-amber-500/20 to-orange-500/20",
    "from-rose-500/20 to-pink-500/20",
    "from-indigo-500/20 to-purple-500/20",
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="rounded-3xl bg-muted/20 p-12 animate-pulse h-64" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl h-56 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const collegesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "WeFest Partner Colleges & Campus Network",
    "description": "Directory of verified universities and college communities hosting festivals on WeFest.",
    "itemListElement": realColleges.slice(0, 15).map((c, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "EducationalOrganization",
        "name": c.name,
        "url": `https://wefest.weskill.org/colleges/${c.slug}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": c.city || "India",
          "addressCountry": "IN"
        }
      }
    }))
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegesListSchema) }}
      />
      {/* ─── Hero Section ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white shadow-2xl md:p-12">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold backdrop-blur-md mb-4">
            <ShieldCheck className="h-4 w-4" /> Verified Institutions
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight md:text-6xl">
            College Network
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            India's most vibrant campus communities — verified colleges
            hosting festivals, cultural events, and more.
          </p>

          {/* Stats Row */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md">
              <Building2 className="h-5 w-5 text-white/70" />
              <div>
                <div className="text-2xl font-black">{realColleges?.length || 0}</div>
                <div className="text-[11px] text-white/60 font-medium">Institutions</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-black">{totalFests}</div>
                <div className="text-[11px] text-white/60 font-medium">Total Festivals</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md">
              <Calendar className="h-5 w-5 text-white/70" />
              <div>
                <div className="text-2xl font-black">{totalEvents}</div>
                <div className="text-[11px] text-white/60 font-medium">Active Events</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blurs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>

      {/* ─── Search & Filters ─── */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="college-search"
            placeholder="Search colleges by name, city, or domain…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl pl-10 border-border/50 bg-background/60 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCity("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedCity === "all"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            All Cities
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                selectedCity === city
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* ─── College Grid ─── */}
      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-5">
            <GraduationCap className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold">No colleges found</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => {
            const upcomingEvents =
              c.events?.filter(
                (e: any) => new Date(e.date) >= new Date()
              ) || [];
            const gradientClass = gradients[i % gradients.length];

            return (
              <Link
                key={c.id}
                to="/colleges/$collegeSlug"
                params={{ collegeSlug: c.slug! }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`} />

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shrink-0`}>
                        <span className="text-sm font-black text-foreground/80">
                          {c.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors truncate">
                          {c.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {c.city && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {c.city}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  </div>

                  {c.domain && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">@{c.domain}</span>
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold gap-1">
                      <Trophy className="h-3 w-3" />
                      {c.events?.length || 0} {(c.events?.length || 0) === 1 ? "fest" : "fests"}
                    </Badge>
                    {upcomingEvents.length > 0 && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-bold gap-1">
                        <Sparkles className="h-3 w-3" />
                        {upcomingEvents.length} upcoming
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      View college profile
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ─── CTA Footer ─── */}
      {!currentUser && (
        <div className="mt-16 text-center">
          <div className="glass inline-flex flex-col items-center rounded-3xl p-8 md:p-10 border border-border/40">
            <GraduationCap className="h-10 w-10 text-primary mb-3" />
            <h3 className="font-display text-xl font-bold">Want your college on WeFest?</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Register your institution to start hosting festivals, managing events, and joining India's largest college network.
            </p>
            <Button onClick={() => navigate({ to: "/signup" })} className="mt-5 bg-brand-gradient text-white shadow-glow rounded-xl font-bold px-8">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
