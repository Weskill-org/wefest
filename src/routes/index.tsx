import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, ShieldCheck, Sparkles, Ticket, TrendingUp, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import { events, colleges } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeFest — College festivals, reimagined" },
      { name: "description", content: "Discover, ticket and sponsor India's biggest college festivals on one identity-verified platform." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = events.slice(0, 6);
  return (
    <div>
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
              {featured.slice(0, 3).map((e, i) => (
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
              ))}
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

      {/* FEATURED FESTS */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Featured festivals</h2>
          <Link to="/events" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* COLLEGES */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Trusted by India's top colleges</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {colleges.map((c) => (
            <Link key={c.id} to="/colleges" className="glass rounded-xl p-4 transition hover:border-primary/40">
              <div className="font-semibold">{c.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.city} • {c.fests} active fests</div>
            </Link>
          ))}
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
