import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { events } from "@/lib/mock";
import { TrendingUp, Ticket, IndianRupee, Users, Plus, ScanLine } from "lucide-react";

export const Route = createFileRoute("/organizer")({
  head: () => ({ meta: [{ title: "Organizer suite — WeFest" }, { name: "description", content: "Run your college festival end-to-end." }] }),
  component: Organizer,
});

function Organizer() {
  const myEvents = events.slice(0, 3);
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-primary">Organizer suite</div>
          <h1 className="font-display text-4xl font-black md:text-5xl">Mood Indigo Council</h1>
          <p className="text-muted-foreground">IIT Bombay • Verified organizer</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/organizer/scan"><ScanLine className="h-4 w-4" /> Scan tickets</Link></Button>
          <Button asChild className="bg-brand-gradient text-primary-foreground hover:opacity-90">
            <Link to="/organizer/new"><Plus className="h-4 w-4" /> Create event</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat icon={IndianRupee} label="Revenue" value="₹42.6L" delta="+18%" />
        <Stat icon={Ticket} label="Tickets sold" value="12,481" delta="+24%" />
        <Stat icon={Users} label="Attendees" value="84,210" delta="+12%" />
        <Stat icon={TrendingUp} label="Sponsor pipeline" value="₹1.8Cr" delta="+33%" />
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Your events</h2>
      <div className="mt-4 grid gap-4">
        {myEvents.map((e) => (
          <div key={e.id} className="glass flex items-center justify-between rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${e.cover}`} />
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(e.date).toDateString()} • {e.city}</div>
              </div>
            </div>
            <div className="hidden gap-8 text-sm md:flex">
              <Mini label="Sold" value={`${(e.attendees * 0.18).toFixed(0)}`} />
              <Mini label="Revenue" value={`₹${(e.attendees * e.priceFrom * 0.18 / 100000).toFixed(1)}L`} />
              <Mini label="Sponsors" value="6" />
            </div>
            <Button asChild variant="outline" size="sm"><Link to="/events/$eventId" params={{ eventId: e.id }}>Manage</Link></Button>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Recent activity</h2>
      <div className="mt-4 glass divide-y divide-border/60 rounded-2xl">
        {[
          ["Coca-Cola sent a sponsorship proposal", "₹8L Platinum tier", "2m ago"],
          ["480 Pro Passes sold today", "Mood Indigo 2026", "1h ago"],
          ["New volunteer onboarded", "Aarav Sharma", "3h ago"],
          ["Sub-event approved: Battle of Bands", "By dean's office", "1d ago"],
        ].map(([a, b, c]) => (
          <div key={a} className="flex items-center justify-between p-4 text-sm">
            <div>
              <div className="font-medium">{a}</div>
              <div className="text-xs text-muted-foreground">{b}</div>
            </div>
            <div className="text-xs text-muted-foreground">{c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs text-emerald-400">{delta}</span>
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div><div className="font-semibold">{value}</div><div className="text-[11px] text-muted-foreground">{label}</div></div>;
}
