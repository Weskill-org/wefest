import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Calendar,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Users2,
  Quote,
  Star,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/ad-banner";
import { useEffect, useRef, useCallback } from "react";

// Landing-specific components
import { HeroScene } from "@/components/landing/HeroScene";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { GlowButton } from "@/components/landing/GlowButton";
import { FloatingCard } from "@/components/landing/FloatingCard";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { ParticleField } from "@/components/landing/ParticleField";
import { LightStreaks } from "@/components/landing/LightStreaks";
import "@/components/landing/landing.css";

export const Route = createFileRoute("/")(  {
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // ── Mouse tracking for parallax + cursor glow ──────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalized -1 to 1
    const mx = (clientX / innerWidth - 0.5) * 2;
    const my = (clientY / innerHeight - 0.5) * 2;

    // Set CSS custom properties
    container.style.setProperty("--mx", String(mx));
    container.style.setProperty("--my", String(my));
    container.style.setProperty("--mouse-x", `${clientX}px`);
    container.style.setProperty("--mouse-y", `${clientY}px`);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // ── JSON-LD structured data ────────────────────────────────────
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
    <div ref={containerRef} className="landing-bg relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* ── Global ambient layers ──────────────────────────────── */}
      <div className="cursor-glow" />
      <ParticleField />
      <LightStreaks />

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Ambient mesh gradient backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 25% 20%, oklch(0.40 0.20 310 / 0.3), transparent 50%), " +
              "radial-gradient(ellipse 60% 50% at 75% 60%, oklch(0.35 0.18 240 / 0.2), transparent 50%)",
          }}
        />

        <div className="container relative z-10 mx-auto grid gap-8 px-6 py-20 md:grid-cols-2 md:py-28 lg:gap-12">
          {/* Left column: Text content */}
          <div className="relative z-10 flex flex-col justify-center">
            {/* Eyebrow badge */}
            <ScrollReveal delay={0}>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                India's college-first event ecosystem
              </span>
            </ScrollReveal>

            {/* Main headline */}
            <AnimatedHeadline
              as="h1"
              className="mt-8 font-display text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              {"The future of "}
              <span className="text-shimmer">college festivals</span>
              {" starts here."}
            </AnimatedHeadline>

            {/* Subtitle */}
            <ScrollReveal delay={300}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                From planning to sponsorship to ticketing — WeFest powers every fest
                in your college network. Verified identity, zero fakes, infinite reach.
              </p>
            </ScrollReveal>

            {/* CTA buttons */}
            <ScrollReveal delay={450}>
              <div className="mt-10 flex flex-wrap gap-4">
                <GlowButton to="/signup">
                  Join with college email <ArrowRight className="ml-2 h-4 w-4" />
                </GlowButton>
                <GlowButton to="/colleges" variant="outline">
                  <Rocket className="mr-2 h-4 w-4 text-primary" /> Explore colleges
                </GlowButton>
              </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={600}>
              <div className="mt-12 flex gap-8 md:gap-12">
                <StatBlock value="120+" label="Colleges" />
                <StatBlock value="450+" label="Events powered" />
                <StatBlock value="2.1M" label="Tickets sold" />
              </div>
            </ScrollReveal>
          </div>

          {/* Right column: 3D Hero Scene */}
          <div className="relative parallax-scene hidden md:block">
            <HeroScene />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.10_0.03_280)] to-transparent pointer-events-none" />
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURES — Interactive 3D tilt cards
          ════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="max-w-2xl">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              One platform. Every workflow.
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Built for organizers, sponsors{" "}
              <span className="text-shimmer">and students.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 100}>
              <FloatingCard>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient shadow-glow">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="mt-5 text-lg font-bold">{f.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
              </FloatingCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          AD BANNER
          ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 container mx-auto px-6">
        <ScrollReveal>
          <AdBanner
            title="Reach 100k+ verified students"
            description="Get featured on the homepage, email newsletters and college community feeds across India. Verified reach for maximum ROI."
            ctaText="Learn more"
            type="premium"
          />
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PARTNER BRANDS
          ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <ScrollReveal>
          <div
            className="glass-panel rounded-3xl p-10 md:p-14"
            style={{
              background: "oklch(1 0 0 / 0.02)",
              borderColor: "oklch(1 0 0 / 0.06)",
            }}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8">
                Trusted by global brands for campus outreach
              </p>
              <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                {partners?.map(p => (
                  <div
                    key={p.id}
                    className="text-xl font-black italic tracking-tighter text-white/25 transition-all duration-500 hover:text-white/70 hover:text-shimmer cursor-default"
                  >
                    {p.name}
                  </div>
                )) || (
                  <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                    {["Red Bull", "Adobe", "Reliance Jio", "Zomato", "OnePlus"].map(n => (
                      <div
                        key={n}
                        className="text-xl font-black italic tracking-tighter text-white/25 transition-all duration-500 hover:text-white/70 cursor-default"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="relative z-10 container mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Success stories from the{" "}
              <span className="text-shimmer">network</span>
            </h2>
            <p className="mt-4 text-white/50">
              Hear from the organizers and sponsors who powered their fests with WeFest.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {(testimonials || [
            { name: "Arjun Mehta", role: "Fest Coordinator", organization: "IIT Bombay", content: "WeFest transformed Mood Indigo. Handling 100k+ registrations without a single server hiccup was a dream come true." },
            { name: "Sara Khan", role: "Marketing Head", organization: "Red Bull India", content: "The real-time ROI tracking and verified student leads make WeFest our go-to for campus activations." },
            { name: "Dr. Ramesh Iyer", role: "Dean of Student Affairs", organization: "BITS Pilani", content: "Digital transparency in budgeting and sponsorship is exactly what college administrations needed." }
          ]).map((t, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <FloatingCard className="h-full">
                <Quote className="h-8 w-8 text-primary/15 mb-4" />
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-base italic leading-relaxed text-white/70">
                  "{t.content}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-brand-gradient p-0.5 shadow-glow">
                    <div className="h-full w-full rounded-full bg-[oklch(0.14_0.02_280)] flex items-center justify-center text-xs font-bold">
                      {t.name.slice(0, 1)}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-[11px] text-white/40">{t.role}, {t.organization}</div>
                  </div>
                </div>
              </FloatingCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COLLEGES
          ════════════════════════════════════════════════════════════ */}
      <section id="colleges" className="relative z-10 container mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Trusted by India's <span className="text-shimmer">top colleges</span>
              </h2>
              <p className="mt-2 text-white/50">
                From Tier-1 engineering colleges to premier management institutes.
              </p>
            </div>
            <GlowButton to="/colleges" variant="outline">
              See all colleges
            </GlowButton>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {loadingColleges ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 glass-panel rounded-xl animate-pulse" />
            ))
          ) : (
            colleges?.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 80}>
                <Link
                  to="/colleges"
                  className="glass-panel block rounded-xl p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_oklch(0.72_0.22_320/0.15)]"
                >
                  <div className="font-semibold">{c.name}</div>
                  <div className="mt-1.5 text-xs text-white/40">
                    {c.city} • {c.fests} active fests
                  </div>
                </Link>
              </ScrollReveal>
            ))
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════════════════════ */}
      <section id="cta" className="relative z-10 container mx-auto px-6 pb-24">
        <ScrollReveal>
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-16"
            style={{
              background: "linear-gradient(135deg, oklch(0.40 0.22 320), oklch(0.35 0.18 260), oklch(0.30 0.20 240))",
              backgroundSize: "200% 200%",
              animation: "bg-drift 10s ease-in-out infinite",
              boxShadow: "0 0 80px oklch(0.72 0.22 320 / 0.2), 0 20px 60px oklch(0 0 0 / 0.4)",
            }}
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 grid gap-8 md:grid-cols-[2fr_1fr] md:items-center">
              <div>
                <h3 className="font-display text-3xl font-black text-white md:text-5xl leading-tight">
                  Power your college with WeFest.
                </h3>
                <p className="mt-4 max-w-xl text-white/70 text-lg">
                  Onboard your college, set up events in minutes, open sponsorship
                  outreach instantly.
                </p>
              </div>
              <div className="flex md:justify-end">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[oklch(0.20_0.03_280)] font-bold hover:bg-white/90 shadow-[0_0_40px_oklch(1_0_0/0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_oklch(1_0_0/0.3)]"
                >
                  <Link to="/organizer">
                    Open organizer suite <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

/* ── Stats block ───────────────────────────────────────────────── */
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-black text-shimmer md:text-4xl">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
        {label}
      </div>
    </div>
  );
}

/* ── Features data ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Calendar,
    title: "Plan & host",
    desc: "Multi-day, multi-event scheduling with sub-event hierarchies, volunteers and approvals.",
  },
  {
    icon: Ticket,
    title: "Sell tickets",
    desc: "Branded ticket tiers, QR check-in, real-time scanning and instant settlement.",
  },
  {
    icon: TrendingUp,
    title: "Win sponsors",
    desc: "A live marketplace where sponsors discover events by reach, demographics and category.",
  },
  {
    icon: ShieldCheck,
    title: "Verified identity",
    desc: "Email-domain verified students. No fake signups, no scalper bots, ever.",
  },
  {
    icon: Users2,
    title: "College network",
    desc: "Cross-campus discovery. Your event, seen by 100+ colleges from day one.",
  },
  {
    icon: Sparkles,
    title: "Live analytics",
    desc: "Footfall, conversion, sponsor ROI dashboards. Data that wins next year's pitch.",
  },
];
