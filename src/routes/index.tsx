import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Calendar, ShieldCheck, Sparkles, Ticket, TrendingUp, Users2, Loader2, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import { AdBanner } from "@/components/ad-banner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeFest — India's Premier College Festival & Event Ticketing Platform" },
      { name: "description", content: "Discover, ticket, and sponsor India's biggest college festivals (cultural fests, tech summits, sports meets) on WeFest. The unified, identity-verified campus ecosystem." },
      { name: "keywords", content: "WeFest, college festivals, campus fests, tech summits, cultural events, ticketing platform, college sponsors, Indian college fests" },
      { property: "og:title", content: "WeFest — India's Premier College Festival & Event Ticketing Platform" },
      { property: "og:description", content: "Discover, ticket, and sponsor India's biggest college festivals (cultural fests, tech summits, sports meets) on WeFest. The unified, identity-verified campus ecosystem." },
      { property: "og:url", content: "https://wefest.weskill.org" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "WeFest — India's Premier College Festival & Event Ticketing Platform" },
      { name: "twitter:description", content: "Discover, ticket, and sponsor India's biggest college festivals on WeFest." },
    ],
    links: [
      { rel: "canonical", href: "https://wefest.weskill.org" },
    ],
  }),
  beforeLoad: async () => {
    // Skip auth check on server to prevent flash of wrong content on refresh
    if (typeof window === 'undefined') return;

    // Try session first, then fall back to getUser
    let userId: string | undefined;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      userId = session.user.id;
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    }

    if (userId) {
      // Check admin first
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (adminRow) {
        throw redirect({ to: "/admin" });
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      
      const role = roleData?.role || "student";
      
      if (role === "company") {
        throw redirect({ to: "/sponsor/dashboard" });
      } else if (role === "college") {
        throw redirect({ to: "/organizer" });
      } else {
        throw redirect({ to: "/dashboard" });
      }
    }
  },
  component: Home,
});

function Home() {
  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .limit(6)
        .order("attendees", { ascending: false });
      if (error) throw error;
      return data.map(e => ({
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
        slug: e.slug
      }));
    }
  });

  const { data: colleges, isLoading: loadingColleges } = useQuery({
    queryKey: ["featured-colleges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("colleges").select("*").limit(4).order("fests", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: testimonials } = useQuery({
    queryKey: ["featured-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("is_featured", true).limit(3);
      if (error) throw error;
      return data;
    }
  });

  const { data: partners } = useQuery({
    queryKey: ["partner-brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partner_brands").select("*").eq("is_active", true).limit(6);
      if (error) throw error;
      return data;
    }
  });

  const featured = events || [];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WeFest",
    "url": "https://wefest.weskill.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wefest.weskill.org/events?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WeFest",
    "url": "https://wefest.weskill.org",
    "logo": "https://wefest.weskill.org/logo.png",
    "sameAs": [
      "https://instagram.com/wefest.in",
      "https://twitter.com/wefest_in",
      "https://linkedin.com/company/wefest-in"
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="container relative mx-auto grid gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              India's college-first event ecosystem
            </span>
            <h1 className="mt-6 font-display text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              The digital <span className="text-gradient">backbone</span> of college festivals.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              From planning to sponsorship to ticketing — WeFest powers every fest in your college network. Verified identity, zero fakes, infinite reach.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-gradient text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/signup">Join with college email <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/events">Browse fests</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 text-sm">
              <Stat label="Colleges" value="120+" />
              <Stat label="Fests hosted" value="450+" />
              <Stat label="Tickets sold" value="2.1M" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-brand-gradient opacity-30 blur-3xl" />
            <div className="relative grid gap-4">
              {loadingEvents ? (
                <div className="h-48 glass rounded-2xl flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                featured.slice(0, 3).map((e, i) => (
                  <div key={e.id} className={`glass overflow-hidden rounded-2xl ${i === 1 ? "ml-8" : ""}`}>
                    <div className={`flex items-center gap-4 p-4`}>
                      <div className={`h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br ${e.cover}`} />
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">{e.college}</div>
                        <div className="truncate font-semibold">{e.title}</div>
                        <div className="text-xs text-primary">From ₹{e.priceFrom}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold text-primary">One platform. Every workflow.</div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Built for organizers, sponsors and students.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Feature icon={Calendar} title="Plan & host" desc="Multi-day, multi-event scheduling with sub-event hierarchies, volunteers and approvals." />
          <Feature icon={Ticket} title="Sell tickets" desc="Branded ticket tiers, QR check-in, real-time scanning and instant settlement." />
          <Feature icon={TrendingUp} title="Win sponsors" desc="A live marketplace where sponsors discover fests by reach, demographics and category." />
          <Feature icon={ShieldCheck} title="Verified identity" desc="Email-domain verified students. No fake signups, no scalper bots, ever." />
          <Feature icon={Users2} title="College network" desc="Cross-campus discovery. Your fest, seen by 100+ colleges from day one." />
          <Feature icon={Sparkles} title="Live analytics" desc="Footfall, conversion, sponsor ROI dashboards. Data that wins next year's pitch." />
        </div>
      </section>

      {/* AD BANNER */}
      <section className="container mx-auto px-6">
        <AdBanner 
          title="Boost your fest to 100k+ students" 
          description="Get featured on the homepage, email newsletters and college community feeds across India. Verified reach for maximum ROI."
          ctaText="Promote now"
          type="premium"
        />
      </section>

      {/* FEATURED FESTS */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Featured festivals</h2>
          <Link to="/events" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loadingEvents ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 glass rounded-2xl animate-pulse" />)
          ) : (
            featured.map((e) => <EventCard key={e.id} event={e} />)
          )}
        </div>
      </section>

      {/* PARTNER BRANDS */}
      <section className="container mx-auto px-6 py-12 border-y border-border/40">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">Trusted by global brands for campus outreach</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {partners?.map(p => (
              <div key={p.id} className="text-xl font-black italic tracking-tighter text-foreground/80">{p.name}</div>
            )) || (
              <div className="flex gap-12">
                {["Red Bull", "Adobe", "Reliance Jio", "Zomato", "OnePlus"].map(n => (
                  <div key={n} className="text-xl font-black italic tracking-tighter text-foreground/80">{n}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (SUCCESS STORIES) */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Success stories from the <span className="text-gradient">network</span></h2>
          <p className="mt-4 text-muted-foreground">Hear from the organizers and sponsors who powered their fests with WeFest.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {(testimonials || [
            { name: "Arjun Mehta", role: "Fest Coordinator", organization: "IIT Bombay", content: "WeFest transformed Mood Indigo. Handling 100k+ registrations without a single server hiccup was a dream come true." },
            { name: "Sara Khan", role: "Marketing Head", organization: "Red Bull India", content: "The real-time ROI tracking and verified student leads make WeFest our go-to for campus activations." },
            { name: "Dr. Ramesh Iyer", role: "Dean of Student Affairs", organization: "BITS Pilani", content: "Digital transparency in budgeting and sponsorship is exactly what college administrations needed." }
          ]).map((t, i) => (
            <div key={i} className="glass rounded-[2rem] p-8 relative">
              <Quote className="absolute top-6 right-8 h-10 w-10 text-primary/10" />
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="text-lg italic leading-relaxed text-foreground/90">"{t.content}"</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-brand-gradient p-0.5">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-bold">
                    {t.name.slice(0, 1)}
                  </div>
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}, {t.organization}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLEGES */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Trusted by India's top colleges</h2>
            <p className="mt-2 text-muted-foreground">From Tier-1 engineering colleges to premier management institutes.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/colleges">See all colleges</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {loadingColleges ? (
            [1, 2, 3, 4].map(i => <div key={i} className="h-16 glass rounded-xl animate-pulse" />)
          ) : (
            colleges?.map((c) => (
              <Link key={c.id} to="/colleges" className="glass rounded-xl p-4 transition hover:border-primary/40">
                <div className="font-semibold">{c.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.city} • {c.fests} active fests</div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="overflow-hidden rounded-3xl bg-brand-gradient p-10 text-primary-foreground shadow-glow md:p-16">
          <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
            <div>
              <h3 className="font-display text-3xl font-black md:text-5xl">Run your next fest on WeFest.</h3>
              <p className="mt-3 max-w-xl text-primary-foreground/80">Onboard your college, set up sub-events in minutes, open sponsorship outreach instantly.</p>
            </div>
            <div className="flex md:justify-end">
              <Button asChild size="lg" variant="secondary" className="bg-background text-foreground">
                <Link to="/organizer">Open organizer suite <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-gradient">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="glass group rounded-2xl p-6 transition hover:border-primary/40">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient shadow-glow">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
