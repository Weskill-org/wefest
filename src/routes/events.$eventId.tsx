import { createFileRoute, Link, useNavigate, notFound, redirect } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Ticket as TicketIcon,
  Loader2,
  Sparkles,
  TrendingUp,
  Clock,
  BadgeCheck,
  Share2,
  Heart,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useRegion } from "@/contexts/RegionContext";
import { ShareEventDialog } from "@/components/events/share-event-dialog";
import { formatEventCapacity } from "@/lib/event-capacity";
import { parsePassSettings } from "@/lib/pass-settings";

export const Route = createFileRoute("/events/$eventId")({
  loader: async ({ params }) => {
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.eventId)
      .maybeSingle();

    if (error || !event) throw notFound();

    // Redirect to slug-based URL if slug exists
    if (event.slug) {
      throw redirect({
        to: "/fest/$slug",
        params: { slug: event.slug },
        replace: true,
      });
    }

    return event;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} Registration & Tickets | WeFest` : "Event — WeFest" },
      { name: "description", content: loaderData ? `Register for ${loaderData.title} on WeFest. Date: ${new Date(loaderData.date).toLocaleDateString()}. Category: ${loaderData.category}. Location: ${loaderData.college_name || "India"}. Book slots today!` : "Festival event on WeFest — India's college festival platform." },
      { name: "keywords", content: loaderData ? `${loaderData.title}, ${loaderData.college_name} fests, ${loaderData.category} college competition, WeFest tickets` : "college events, WeFest tickets" },
      { property: "og:title", content: loaderData ? `${loaderData.title} Registration & Tickets | WeFest` : "Event — WeFest" },
      { property: "og:description", content: loaderData ? `Register for ${loaderData.title} on WeFest. Date: ${new Date(loaderData.date).toLocaleDateString()}. Category: ${loaderData.category}. Location: ${loaderData.college_name || "India"}.` : "Festival event on WeFest — India's college festival platform." },
      { property: "og:image", content: loaderData?.cover || "https://wefest.weskill.org/og-image.png" },
      { property: "og:url", content: loaderData ? `https://wefest.weskill.org/events/${loaderData.id}` : "https://wefest.weskill.org/events" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: loaderData ? `${loaderData.title} | WeFest` : "Event — WeFest" },
      { name: "twitter:description", content: loaderData ? `Register for ${loaderData.title} on WeFest.` : "Explore this college festival event." },
      { name: "twitter:image", content: loaderData?.cover || "https://wefest.weskill.org/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: loaderData ? `https://wefest.weskill.org/events/${loaderData.id}` : "https://wefest.weskill.org/events" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Link to="/events" className="mt-4 text-primary hover:underline inline-block">
        Return to events
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mx-auto mb-5">
        <Calendar className="h-10 w-10 text-muted-foreground/40" />
      </div>
      <h1 className="text-2xl font-bold">Event not found</h1>
      <p className="mt-2 text-muted-foreground">This event may have been removed or doesn't exist.</p>
      <Link to="/events" className="mt-4 text-primary hover:underline inline-block">
        Browse all events
      </Link>
    </div>
  ),
  component: PublicEventDetail,
});

function PublicEventDetail() {
  const event = Route.useLoaderData();
  const navigate = useNavigate();
  const { formatPrice } = useRegion();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: hasTicket } = useQuery({
    queryKey: ["has-ticket", event.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("tickets")
        .select("id")
        .eq("event_id", event.id)
        .eq("user_id", currentUser!.id);
      return (data?.length || 0) > 0;
    },
  });

  const { data: studentProfile } = useQuery({
    queryKey: ["student-profile", currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("referral_code")
        .eq("id", currentUser!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const referralCode = studentProfile?.referral_code;

  const tiers = useMemo(() => {
    const passes = parsePassSettings(event?.pass_settings);
    if (passes.length === 0) {
      return [
        { name: "General Entry", price: event.price_from || 0, perks: ["Standard access"] },
      ];
    }

    return passes
      .filter((p) => p.enabled)
      .map((pass) => {
        const perks = [];
        if (pass.days) {
          perks.push(`${pass.days} Day(s) access`);
        }
        perks.push("All open events");
        if (Number(pass.single_day_price) > 0) {
          perks.push(`Single day: ₹${pass.single_day_price}`);
        }
        if (Number(pass.multi_day_price) > 0) {
          perks.push(`Multi-day package: ₹${pass.multi_day_price}`);
        }
        
        return {
          name: pass.name,
          price: Number(pass.price) || 0,
          perks: perks.length > 0 ? perks : ["Standard entry access"],
        };
      });
  }, [event]);

  const [selected, setSelected] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  const buyMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        navigate({ to: "/signup" });
        throw new Error("redirect");
      }
      const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
      const { error } = await supabase.from("tickets").insert({
        user_id: currentUser.id,
        event_id: event.id,
        tier: tiers[selected].name,
        code: ticketCode,
      });
      if (error) throw error;
      return { tier: tiers[selected].name, code: ticketCode };
    },
    onSuccess: (data) => {
      toast.success(`Success! ${data.tier} booked. Your code: ${data.code}`);
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["has-ticket", event.id] });
    },
    onError: (error: any) => {
      if (error.message === "redirect") return;
      toast.error(error.message || "Failed to book ticket");
    },
  });

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  const daysUntil = Math.ceil(
    (eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const subEvents = [
    "Headliner Concert",
    "Battle of Bands",
    "Stand-up Night",
    "Dance Showdown",
    "Hackathon",
    "Esports Arena",
  ];

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description || `Register for ${event.title} on WeFest.`,
    "startDate": new Date(event.date).toISOString(),
    "endDate": new Date(new Date(event.date).getTime() + 8*60*60*1000).toISOString(),
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": event.college_name || "Campus Arena",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.city || "India",
        "addressCountry": "IN"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": event.price_from || 0,
      "highPrice": tiers[tiers.length - 1]?.price || event.price_from || 999,
      "offerCount": tiers.length,
      "url": `https://wefest.weskill.org/events/${event.id}`
    },
    "organizer": {
      "@type": "Organization",
      "name": "WeFest",
      "url": "https://wefest.weskill.org"
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {/* Hero Banner */}
      <div className={`relative h-[340px] md:h-[400px] bg-gradient-to-br ${event.cover}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-between py-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group w-fit"
          >
            <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="h-4 w-4" />
            </div>
            All Events
          </Link>
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                <Sparkles className="h-3 w-3 text-amber-400" /> {event.category || "Festival"}
              </div>
              {isUpcoming && daysUntil <= 30 && (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200 border border-emerald-500/20">
                  <Clock className="h-3 w-3" /> {daysUntil === 0 ? "Today!" : `${daysUntil} day${daysUntil !== 1 ? "s" : ""} left`}
                </div>
              )}
              {event.college_id && (
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-indigo-500/20">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </div>
              )}
            </div>
            <div className="text-xs font-bold text-white/60 uppercase tracking-tighter mb-1">
              {event.college_name} Presents
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.9]">
              {event.title}
            </h1>
            {(event as any).tags && (event as any).tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {(event as any).tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          {/* Event Meta */}
          <section>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/40">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {eventDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {(event as any).time && (
                <span className="flex items-center gap-2 border-l border-border/40 pl-4">
                  <Clock className="h-4 w-4 text-primary" />
                  {(event as any).time}
                </span>
              )}
              <span className="flex items-center gap-2 border-l border-border/40 pl-4">
                <MapPin className="h-4 w-4 text-primary" />
                {event.city}
              </span>
              {(event as any).venue && (
                <span className="flex items-center gap-2 border-l border-border/40 pl-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  {(event as any).venue}
                </span>
              )}
              <span className="flex items-center gap-2 border-l border-border/40 pl-4">
                <Users className="h-4 w-4 text-primary" />
                {formatEventCapacity(event.attendees)} capacity
              </span>
            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">About this event</h2>
            <p className="text-lg leading-relaxed text-foreground/80 font-medium">
              {event.description}
            </p>
          </section>

          {/* Schedule / Sub-events */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Event Schedule
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {subEvents.map((s) => (
                <div
                  key={s}
                  className="glass group rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold">{s}</div>
                    <div className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    Multiple sessions • Open to all pass holders
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Organizer */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">Organized by</h2>
            <div className="glass rounded-2xl p-6 border border-border/60 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0">
                <span className="text-lg font-black text-primary-foreground">
                  {event.college_name
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-lg">{event.college_name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-blue-400" /> Verified Institution on WeFest
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Ticket Sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="glass rounded-2xl p-6 border border-border/60 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 blur-3xl -mr-12 -mt-12" />
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-6">
              <TicketIcon className="h-4 w-4" /> Select Your Pass
            </div>
            <div className="space-y-3">
              {tiers.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setSelected(i)}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                    selected === i
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border/60 hover:border-primary/40 bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold">{t.name}</div>
                    <div className="font-black text-lg text-primary">
                      {t.price === 0 ? "Free" : formatPrice(t.price)}
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {t.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium"
                      >
                        <div className="h-1 w-1 rounded-full bg-primary" /> {p}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {currentUser ? (
              <Button
                onClick={() => buyMutation.mutate()}
                disabled={buyMutation.isPending || hasTicket}
                size="lg"
                className="mt-6 h-14 w-full rounded-xl bg-brand-gradient text-white font-bold text-base shadow-glow hover:opacity-90 disabled:opacity-50"
              >
                {buyMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : hasTicket ? (
                  "Ticket Booked ✅"
                ) : (
                  "Get Pass Now"
                )}
              </Button>
            ) : (
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => navigate({ to: "/signup" })}
                  size="lg"
                  className="h-14 w-full rounded-xl bg-brand-gradient text-white font-bold text-base shadow-glow hover:opacity-90"
                >
                  Sign Up to Book <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-center text-[10px] text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-bold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
            <p className="mt-3 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              Instant QR • Secured via WeFest Escrow
            </p>
          </div>

          {/* Share / Actions */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setShareOpen(true)}
              className="flex-1 glass rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button
              onClick={() => toast.success("Added to wishlist!")}
              className="flex-1 glass rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <Heart className="h-4 w-4" /> Save
            </button>
          </div>
        </aside>
      </div>

      <ShareEventDialog 
        open={shareOpen} 
        onOpenChange={setShareOpen}
        eventTitle={event.title}
        eventUrl={window.location.href}
        referralCode={referralCode || undefined}
      />
    </div>
  );
}
