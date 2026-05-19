import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
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
import { StudentAppLayout } from "@/components/layout/StudentAppLayout";
import { formatEventCapacity } from "@/lib/event-capacity";

export const Route = createFileRoute("/fest/$slug")({
  loader: async ({ params }) => {
    console.log("[Loader] Fetching event for slug:", params.slug);
    try {
      const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();

      if (error) {
        console.error("[Loader] Supabase error:", error);
        throw error;
      }
      
      if (!event) {
        console.warn("[Loader] Event not found for slug:", params.slug);
        throw notFound();
      }
      
      console.log("[Loader] Successfully fetched event:", event.title);
      return event;
    } catch (err) {
      console.error("[Loader] Catch-all error:", err);
      throw err;
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — WeFest` : "Event — WeFest" },
      { name: "description", content: loaderData?.description ?? "Festival event on WeFest — India's college festival platform." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{(error as any).message}</p>
      <Link to="/fest" className="mt-4 text-primary hover:underline inline-block">
        Return to festivals
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
      <Link to="/fest" className="mt-4 text-primary hover:underline inline-block">
        Browse all fests
      </Link>
    </div>
  ),
  component: FullEventDetail,
});

function FullEventDetail() {
  const event = Route.useLoaderData();
  const navigate = useNavigate();
  const { formatPrice } = useRegion();
  const queryClient = useQueryClient();

  // Auth & Profile
  const { data: authData } = useQuery({
    queryKey: ["current-auth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("*, colleges(*)")
        .eq("id", user.id)
        .maybeSingle();
      return { user, profile };
    }
  });

  const currentUser = authData?.user;
  const profile = authData?.profile;

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

  const referralCode = profile?.referral_code;

  const tiers = useMemo(() => {
    const settings = (event as any).pass_settings;
    if (!settings) {
      return [
        { name: "Day Pass", price: 499, perks: ["Single day access", "All open events"] },
        { name: "Pro Pass", price: 1499, perks: ["All days", "Priority entry", "Pro shows"] },
        { name: "VIP", price: 3999, perks: ["All access", "Backstage tour", "Merch kit"] },
      ];
    }

    const result = [];
    if (settings.normal?.enabled) {
      result.push({
        name: "Normal Pass",
        price: settings.normal.price,
        perks: [
          `${settings.normal.days} Day(s) access`,
          "All open events",
          `Single day: ₹${settings.normal.single_day_price}`,
        ],
      });
    }
    if (settings.vip?.enabled) {
      result.push({
        name: "VIP Pass",
        price: settings.vip.price,
        perks: [
          "Priority Entry",
          "Backstage Access",
          "VIP Lounge",
          `Multi-day: ₹${settings.vip.multi_day_price}`,
        ],
      });
    }
    return result.length > 0 ? result : [
      { name: "General Entry", price: event.price_from || 0, perks: ["Standard access"] },
    ];
  }, [event]);

  const [selected, setSelected] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  const buyMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        navigate({ to: "/signup" });
        throw new Error("redirect");
      }
      const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
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
  const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const subEvents = [
    "Headliner Concert",
    "Battle of Bands",
    "Stand-up Night",
    "Dance Showdown",
    "Hackathon",
    "Esports Arena",
  ];

  const PageUI = (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Banner */}
      <div className={`relative h-[340px] md:h-[400px] bg-gradient-to-br ${event.cover}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-between py-8">
          <Link
            to="/fest"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group w-fit"
          >
            <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Festivals
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
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
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
          <div className="mt-4">
            <button
              onClick={() => setShareOpen(true)}
              className="w-full glass rounded-xl p-3.5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <Share2 className="h-4 w-4" /> Share Event
            </button>
          </div>
        </aside>
      </div>

      <ShareEventDialog 
        open={shareOpen} 
        onOpenChange={setShareOpen}
        eventTitle={event.title}
        eventUrl={typeof window !== 'undefined' ? window.location.href : ""}
        referralCode={referralCode || undefined}
      />
    </div>
  );

  if (currentUser) {
    return (
      <StudentAppLayout user={currentUser} profile={profile}>
        {PageUI}
      </StudentAppLayout>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal branded header for guests */}
      <header className="sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-xs shadow-glow transition-transform group-hover:scale-105">W</div>
          <span className="font-display font-black tracking-tighter text-lg">
            We<span className="text-gradient">Fest</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/fest" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">Festivals</Link>
          <Link to="/events" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">Events</Link>
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild><Link to="/login">Sign in</Link></Button>
          <Button size="sm" className="bg-brand-gradient text-primary-foreground hover:opacity-90 font-bold" asChild><Link to="/signup">Join Free</Link></Button>
        </div>
      </header>
      <div className="flex-1">{PageUI}</div>
      {/* Minimal footer for guests */}
      <footer className="border-t border-white/5 bg-black/30 backdrop-blur-xl py-8 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-black text-[10px] shadow-glow">W</div>
            <span className="font-black tracking-tighter text-sm">We<span className="text-gradient">Fest</span></span>
          </Link>
          <p className="text-xs text-muted-foreground/60 font-medium">
            © {new Date().getFullYear()} WeFest Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
