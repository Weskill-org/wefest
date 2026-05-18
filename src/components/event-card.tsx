import { Link, useRouterState } from "@tanstack/react-router";
import { Calendar, MapPin, Users, ChevronRight, BadgeCheck } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { Button } from "./ui/button";

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
  description?: string;
  isVerified?: boolean;
  slug?: string;
}

export function EventCard({ event }: { event: Event }) {
  const { formatPrice } = useRegion();
  const routerState = useRouterState();
  
  // Determine if we're inside the student portal layout
  const isStudentRoute = routerState.matches.some(m => m.routeId === '/_student');

  return (
    <Link
      to={event.slug ? "/fest/$slug" : "/events/$eventId"}
      params={event.slug ? { slug: event.slug } : { eventId: event.id }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-muted/30 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(var(--brand-primary-rgb),0.1)]"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-px rounded-3xl bg-brand-gradient opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

      {/* Image Section */}
      <div className={`relative h-52 w-full overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-110 ${event.cover}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Category Badge & Slug */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md w-fit">
            {event.category}
          </span>
          {event.slug && (
            <span className="rounded-full border border-white/10 bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-amber-300 backdrop-blur-md w-fit flex items-center gap-1">
              {event.slug.split(".")[0]} <span className="opacity-40 text-white">.</span> {event.slug.split(".")[1]}
            </span>
          )}
        </div>

        {/* Price Tag */}
        {event.priceFrom > 0 && (
          <div className="absolute right-4 top-4">
            <span className="rounded-xl bg-brand-gradient px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-glow">
              {`${formatPrice(event.priceFrom)}+`}
            </span>
          </div>
        )}

        {/* College & Verification */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
            <span className="truncate max-w-[150px]">{event.college}</span>
            {event.isVerified !== false && <BadgeCheck className="h-3.5 w-3.5 text-blue-400 fill-blue-400/20" />}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        
        {event.description && (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {event.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-4 grid grid-cols-2 gap-y-2 text-[11px] font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              {event.city}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-3.5 w-3.5" />
              </div>
              {event.attendees < 0
                ? "Unlimited"
                : event.attendees > 0
                  ? `${(event.attendees / 1000).toFixed(0)}k+ Attending`
                  : "Open registration"}
            </div>
          </div>

          <Button variant="outline" className="w-full justify-between rounded-xl border-border/50 bg-background/50 text-xs font-bold transition-all group-hover:border-primary/50 group-hover:bg-primary/10">
            View Details
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
}


