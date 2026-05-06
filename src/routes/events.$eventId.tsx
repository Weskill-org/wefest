import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { events } from "@/lib/mock";
import { Calendar, MapPin, Users, ArrowLeft, Ticket as TicketIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const event = events.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — WeFest` : "Event — WeFest" },
      { name: "description", content: loaderData?.description ?? "Festival on WeFest" },
    ],
  }),
  errorComponent: ({ error }) => <div className="container py-20">{error.message}</div>,
  notFoundComponent: () => <div className="container py-20">Event not found.</div>,
  component: EventDetail,
});

const tiers = [
  { name: "Day Pass", price: 499, perks: ["Single day access", "All open events"] },
  { name: "Pro Pass", price: 1499, perks: ["All 4 days", "Priority entry", "Pro shows"] },
  { name: "VIP", price: 3999, perks: ["All access", "Backstage tour", "Merch kit"] },
];

function EventDetail() {
  const event = Route.useLoaderData();
  const [selected, setSelected] = useState(1);

  const buy = () => toast.success(`${tiers[selected].name} added to checkout — ₹${tiers[selected].price}`);

  return (
    <div>
      <div className={`relative h-72 bg-gradient-to-br ${event.cover}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="container relative mx-auto h-full px-6">
          <Link to="/events" className="absolute top-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <div className="absolute bottom-6">
            <div className="text-sm text-white/80">{event.college}</div>
            <h1 className="font-display text-5xl font-black text-white md:text-6xl">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-10 px-6 py-12 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{new Date(event.date).toDateString()}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{event.city}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" />{event.attendees.toLocaleString("en-IN")} expected</span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">{event.description}</p>

          <h2 className="mt-12 font-display text-2xl font-bold">Sub-events</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Headliner Concert", "Battle of Bands", "Stand-up Night", "Dance Showdown", "Hackathon", "Esports Arena"].map((s) => (
              <div key={s} className="glass rounded-xl p-4">
                <div className="font-semibold">{s}</div>
                <div className="text-xs text-muted-foreground">Multiple sessions • Open to all</div>
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-display text-2xl font-bold">Organizer</h2>
          <div className="mt-4 glass rounded-2xl p-5">
            <div className="font-semibold">{event.organizer}</div>
            <div className="text-sm text-muted-foreground">Verified by WeFest • {event.college}</div>
          </div>
        </div>

        <aside className="sticky top-24 h-fit">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <TicketIcon className="h-4 w-4" /> Pick your pass
            </div>
            <div className="mt-4 grid gap-3">
              {tiers.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setSelected(i)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected === i ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{t.name}</div>
                    <div className="font-bold">₹{t.price}</div>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {t.perks.map((p) => <li key={p}>• {p}</li>)}
                  </ul>
                </button>
              ))}
            </div>
            <Button onClick={buy} size="lg" className="mt-5 w-full bg-brand-gradient text-primary-foreground hover:opacity-90">
              Checkout securely
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">QR ticket • Instant delivery</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
