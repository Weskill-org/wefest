import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Loader2, MapPin, Globe, Calendar, Users, Trophy, ShieldCheck,
  ArrowLeft, ArrowRight, Sparkles, Building2, Clock, Star,
  GraduationCap, Zap, ChevronRight, Lock, ExternalLink,
  BarChart3, Award, Target, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/colleges/$collegeSlug")({
  loader: async ({ params }) => {
    const { data: college, error } = await supabase
      .from("colleges")
      .select(`*, events (*)`)
      .eq("slug", params.collegeSlug)
      .single();

    if (error || !college) throw notFound();
    return college;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} Festivals, Events & Campus Life | WeFest` : "College Profile — WeFest" },
      { name: "description", content: loaderData ? `Explore ${loaderData.name}'s upcoming college festivals, cultural fests, tech summits, and past event history on WeFest. Book tickets instantly!` : "Explore this college's festivals, events, and campus life on WeFest." },
      { name: "keywords", content: loaderData ? `${loaderData.name} fests, ${loaderData.name} events, ${loaderData.city} college fests, WeFest college` : "college profile, college fests, WeFest" },
      { property: "og:title", content: loaderData ? `${loaderData.name} Festivals, Events & Campus Life | WeFest` : "College Profile — WeFest" },
      { property: "og:description", content: loaderData ? `Explore ${loaderData.name}'s upcoming college festivals, cultural fests, tech summits, and past event history on WeFest.` : "Explore this college's festivals, events, and campus life on WeFest." },
      { property: "og:url", content: loaderData ? `https://wefest.weskill.org/colleges/${loaderData.slug}` : "https://wefest.weskill.org/colleges" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: loaderData ? `${loaderData.name} Festivals, Events & Campus Life | WeFest` : "College Profile — WeFest" },
      { name: "twitter:description", content: loaderData ? `Explore ${loaderData.name}'s upcoming college festivals and events on WeFest.` : "Explore this college's festivals, events, and campus life on WeFest." },
    ],
    links: [
      { rel: "canonical", href: loaderData ? `https://wefest.weskill.org/colleges/${loaderData.slug}` : "https://wefest.weskill.org/colleges" },
    ],
  }),
  component: CollegeProfilePage,
});

/* ───────── helpers ───────── */
const gradientPalette = [
  "from-fuchsia-500 to-violet-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-purple-600",
];

function hashGradient(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return gradientPalette[Math.abs(h) % gradientPalette.length];
}

function relativeDate(d: string) {
  const diff = new Date(d).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return "Past";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ───────── component ───────── */
function CollegeProfilePage() {
  const college = Route.useLoaderData();
  const { collegeSlug } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  /* ── current user ── */
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  /* ── member count ── */
  const { data: memberCount } = useQuery({
    queryKey: ["college-member-count", college?.id],
    enabled: !!college?.id,
    queryFn: async () => {
      const { count } = await supabase
        .from("college_members")
        .select("id", { count: "exact", head: true })
        .eq("college_id", college!.id);
      return count ?? 0;
    },
  });

  /* ── student count ── */
  const { data: studentCount } = useQuery({
    queryKey: ["college-student-count", college?.id],
    enabled: !!college?.id,
    queryFn: async () => {
      const { count } = await supabase
        .from("student_profiles")
        .select("id", { count: "exact", head: true })
        .eq("college_id", college!.id);
      return count ?? 0;
    },
  });



  /* ── derived data ── */
  const grad = hashGradient(college.name);
  const initials = college.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const now = new Date();
  const allEvents = college.events || [];
  const upcomingEvents = allEvents.filter((e: any) => new Date(e.date) >= now);
  const pastEvents = allEvents.filter((e: any) => new Date(e.date) < now);
  const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;
  const totalAttendees = allEvents.reduce((a: number, e: any) => a + (e.attendees || 0), 0);

  const collegeSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": college.name,
    "url": `https://wefest.weskill.org/colleges/${college.slug}`,
    "logo": college.logo || undefined,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": college.city || "India",
      "addressCountry": "IN"
    },
    "sameAs": college.domain ? [`https://${college.domain}`] : undefined
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
      />
      {/* ═══════ HERO ═══════ */}
      <div className="relative overflow-hidden">
        {/* background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-20`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-[100px]" />

        <div className="container relative mx-auto px-6 pt-8 pb-12 md:pb-16">
          {/* back link */}
          <Link
            to="/colleges"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-8"
          >
            <div className="h-8 w-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="h-4 w-4" />
            </div>
            College Network
          </Link>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            {/* left */}
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className={`h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-2xl border border-white/10`}>
                  <span className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{initials}</span>
                </div>
                <div>
                  {college.status === "approved" && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400 mb-2">
                      <ShieldCheck className="h-3 w-3" /> Verified Institution
                    </div>
                  )}
                  <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    {college.name}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {college.city && (
                  <span className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {college.city}
                  </span>
                )}
                {college.domain && (
                  <span className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5">
                    <Globe className="h-3.5 w-3.5 text-primary" /> @{college.domain}
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5">
                  <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="font-bold text-foreground">{college.fests}</span> {college.fests === 1 ? "Festival" : "Festivals"} Hosted
                </span>
              </div>
            </div>

            {/* right — quick stats pills */}
            <div className="flex flex-wrap gap-3">
              <div className="glass rounded-2xl px-5 py-3 text-center min-w-[100px]">
                <div className="text-2xl font-black text-foreground">{allEvents.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Events</div>
              </div>
              <div className="glass rounded-2xl px-5 py-3 text-center min-w-[100px]">
                <div className="text-2xl font-black text-foreground">{studentCount ?? 0}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Students</div>
              </div>
              <div className="glass rounded-2xl px-5 py-3 text-center min-w-[100px]">
                <div className="text-2xl font-black text-foreground">{totalAttendees.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reach</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ BODY ═══════ */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* ─── main column ─── */}
          <div className="space-y-10">
            {/* About */}
            <section className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold">About the Institution</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {college.name} is a premier educational institution
                {college.city ? ` located in ${college.city}` : ""}.
                Known for its vibrant campus culture and excellence in organizing world-class festivals,
                it has become a cornerstone of the WeFest college network.
                {college.fests > 0 && ` With ${college.fests} successful ${college.fests === 1 ? "festival" : "festivals"} under its belt, the institution continues to set benchmarks in student-led events.`}
              </p>
              {college.domain && (
                <a
                  href={`https://${college.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-primary hover:underline"
                >
                  Visit Official Website <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </section>

            {/* Events section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">Festivals & Events</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Events organized by {college.name}
                  </p>
                </div>
                <div className="flex rounded-xl bg-muted/30 p-1 border border-border/40">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      activeTab === "upcoming"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Upcoming ({upcomingEvents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      activeTab === "past"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Past ({pastEvents.length})
                  </button>
                </div>
              </div>

              {displayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-3xl border border-dashed border-border/60">
                  <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {activeTab === "upcoming" ? "No upcoming events" : "No past events"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    {activeTab === "upcoming"
                      ? "Stay tuned — new festivals are announced regularly."
                      : "This institution hasn't hosted any events yet."}
                  </p>
                </div>
              ) : !currentUser ? (
                <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-3xl border border-dashed border-border/60 px-4">
                  <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Festivals & Events are locked</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                    Sign in with your verified college email to view and register for festivals at {college.name}.
                  </p>
                  <Button
                    onClick={() => navigate({ to: "/signup", search: { redirect: `/colleges/${college.slug}` } })}
                    className="mt-6 bg-brand-gradient text-white shadow-glow rounded-xl font-bold px-6 py-2.5 transition-all hover:scale-105"
                  >
                    Join to Unlock <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {displayEvents.map((event: any) => {
                    const isUpcoming = new Date(event.date) >= now;
                    return (
                      <Link
                        key={event.id}
                        to="/events/$eventId"
                        params={{ eventId: event.id }}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                      >
                        {/* color bar */}
                        <div className={`h-32 w-full bg-gradient-to-br ${event.cover || "from-fuchsia-500 to-indigo-700"} relative`}>
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                            <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-md text-[10px] font-bold">
                              {event.category || "Festival"}
                            </Badge>
                            {isUpcoming && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-white/90">
                                <Zap className="h-3 w-3 text-amber-400" />
                                {relativeDate(event.date)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {event.description || "An exciting campus event."}
                          </p>

                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/30">
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </span>
                              {event.attendees > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" /> {event.attendees}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                              View Details <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* ─── sidebar ─── */}
          <div className="space-y-6">
            {/* Sign-up CTA (guest only) */}
            {!currentUser && (
              <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 text-white shadow-2xl">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Join the Network</span>
                  </div>
                  <h3 className="font-display text-xl font-bold leading-tight">
                    Sign up to register for events
                  </h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">
                    Create your free WeFest account to explore events, book tickets, and connect with students from {college.name}.
                  </p>
                  <div className="mt-5 flex flex-col gap-2">
                    <Button
                      onClick={() => navigate({ to: "/signup", search: { redirect: `/colleges/${collegeSlug}` } })}
                      className="w-full bg-white text-primary font-bold rounded-xl hover:bg-white/90 shadow-lg"
                    >
                      Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/login", search: { redirect: `/colleges/${collegeSlug}` } })}
                      className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-sm"
                    >
                      Already have an account? Sign in
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Institutional Stats */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-bold">Institutional Stats</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Trophy, label: "Festivals Hosted", value: college.fests, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                  { icon: Calendar, label: "Total Events", value: allEvents.length, color: "text-primary", bg: "bg-primary/10" },
                  { icon: Sparkles, label: "Upcoming", value: upcomingEvents.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { icon: Users, label: "Total Reach", value: totalAttendees.toLocaleString(), color: "text-blue-400", bg: "bg-blue-500/10" },
                  { icon: GraduationCap, label: "Students Enrolled", value: studentCount ?? 0, color: "text-violet-400", bg: "bg-violet-500/10" },
                  { icon: Award, label: "Team Members", value: memberCount ?? 0, color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-muted/20 p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg ${bg} p-2`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick info */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-bold">Quick Info</h3>
              </div>
              <div className="space-y-4">
                {college.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</div>
                      <div className="text-sm font-medium">{college.city}</div>
                    </div>
                  </div>
                )}
                {college.domain && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Domain</div>
                      <div className="text-sm font-medium">@{college.domain}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verification</div>
                    <Badge className={`mt-1 text-[10px] font-bold border-none ${
                      college.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {college.status === "approved" ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Member Since</div>
                    <div className="text-sm font-medium">
                      {new Date(college.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Need help */}
            <div className="glass rounded-3xl p-6 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Part of this college?</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Sign up as a student to access exclusive events and connect with your campus community.
                  </p>
                </div>
              </div>
              {!currentUser && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-4 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold"
                >
                  <Link to="/signup" search={{ redirect: `/colleges/${collegeSlug}` }}>
                    Join as Student <GraduationCap className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
