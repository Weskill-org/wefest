import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { events, sponsorshipTiers } from "@/lib/mock";
import { TrendingUp, Users2, Building2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sponsors")({
  head: () => ({ meta: [{ title: "Sponsor a fest — WeFest" }, { name: "description", content: "Discover and sponsor India's biggest college festivals." }] }),
  component: Sponsors,
});

function Sponsors() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
        <div>
          <div className="text-sm font-semibold text-primary">Sponsor marketplace</div>
          <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Reach <span className="text-gradient">2M+ Gen-Z</span> on campus.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Filter fests by reach, demographics and category. Send proposals in one click. Track ROI live.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Kpi icon={Users2} label="Reach" value="2.1M" />
          <Kpi icon={Building2} label="Colleges" value="120" />
          <Kpi icon={TrendingUp} label="Avg ROI" value="6.4×" />
        </div>
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold">Sponsorship tiers</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        {sponsorshipTiers.map((t) => (
          <div key={t.name} className="glass rounded-2xl p-6">
            <div className="text-sm text-muted-foreground">{t.name} sponsor</div>
            <div className="mt-1 text-2xl font-bold text-gradient">₹{(t.price / 100000).toFixed(1)}L</div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {t.perks.map((p) => <li key={p}>• {p}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold">Open for sponsorship</h2>
      <div className="mt-4 grid gap-4">
        {events.map((e) => (
          <div key={e.id} className="glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${e.cover}`} />
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-xs text-muted-foreground">{e.college} • {e.city} • {(e.attendees / 1000).toFixed(0)}k expected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{e.category}</span>
              <Button onClick={() => toast.success(`Proposal sent to ${e.title}`)} className="bg-brand-gradient text-primary-foreground hover:opacity-90">
                Send proposal
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-lg font-bold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
