import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users } from "lucide-react";

export interface Event {
  id: string;
  title: string;
  college: string;
  date: string;
  city: string;
  category: string;
  cover: string;
  attendees: number;
  priceFrom: number;
}

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      className="group block overflow-hidden rounded-2xl border border-border/60 bg-card-gradient transition-all hover:border-primary/50 hover:shadow-glow"
    >
      <div className={`relative h-44 bg-gradient-to-br ${event.cover}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-xs backdrop-blur">
          {event.category}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-brand-gradient px-2.5 py-1 text-xs font-medium text-primary-foreground">
          ₹{event.priceFrom}+
        </span>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-xs text-white/80">{event.college}</div>
          <div className="text-lg font-bold leading-tight text-white">{event.title}</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.city}</span>
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{(event.attendees / 1000).toFixed(0)}k</span>
      </div>
    </Link>
  );
}
