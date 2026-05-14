import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { k as Route$o, x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import "../_libs/sonner.mjs";
import { a3 as LoaderCircle, i as Building2, b as ArrowLeft, aD as ShieldCheck, a8 as MapPin, U as Globe, aN as Trophy, N as ExternalLink, C as Calendar, aZ as Zap, aV as Users, u as ChevronRight, a4 as Lock, aF as Sparkles, c as ArrowRight, p as ChartColumn, V as GraduationCap, e as Award, aI as Target, H as Clock, X as Heart } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const gradientPalette = ["from-fuchsia-500 to-violet-600", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500", "from-rose-500 to-pink-500", "from-indigo-500 to-purple-600"];
function hashGradient(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) | 0;
  return gradientPalette[Math.abs(h) % gradientPalette.length];
}
function relativeDate(d) {
  const diff = new Date(d).getTime() - Date.now();
  const days = Math.ceil(diff / 864e5);
  if (days < 0) return "Past";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return new Date(d).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric"
  });
}
function CollegeProfilePage() {
  const {
    collegeSlug
  } = Route$o.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("upcoming");
  const {
    data: currentUser
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      return user;
    }
  });
  const {
    data: college,
    isLoading
  } = useQuery({
    queryKey: ["college-profile", collegeSlug],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("colleges").select(`*, events (*)`).eq("slug", collegeSlug).single();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: memberCount
  } = useQuery({
    queryKey: ["college-member-count", college?.id],
    enabled: !!college?.id,
    queryFn: async () => {
      const {
        count
      } = await supabase.from("college_members").select("id", {
        count: "exact",
        head: true
      }).eq("college_id", college.id);
      return count ?? 0;
    }
  });
  const {
    data: studentCount
  } = useQuery({
    queryKey: ["college-student-count", college?.id],
    enabled: !!college?.id,
    queryFn: async () => {
      const {
        count
      } = await supabase.from("student_profiles").select("id", {
        count: "exact",
        head: true
      }).eq("college_id", college.id);
      return count ?? 0;
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[70vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground font-medium", children: "Loading profile…" })
    ] }) });
  }
  if (!college) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-24 w-24 rounded-3xl bg-muted/20 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-12 w-12 text-muted-foreground/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black", children: "College not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground max-w-sm mx-auto", children: "This institution may not exist or hasn't been verified yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-6 bg-brand-gradient text-white rounded-xl shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/colleges", children: "Browse All Colleges" }) })
    ] });
  }
  const grad = hashGradient(college.name);
  const initials = college.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const now = /* @__PURE__ */ new Date();
  const allEvents = college.events || [];
  const upcomingEvents = allEvents.filter((e) => new Date(e.date) >= now);
  const pastEvents = allEvents.filter((e) => new Date(e.date) < now);
  const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;
  const totalAttendees = allEvents.reduce((a, e) => a + (e.attendees || 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${grad} opacity-20` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-[100px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container relative mx-auto px-6 pt-8 pb-12 md:pb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/colleges", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:-translate-x-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
          "College Network"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-8 md:flex-row md:items-end md:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-2xl border border-white/10`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl md:text-3xl font-black text-white drop-shadow-lg", children: initials }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                college.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }),
                  " Verified Institution"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-5xl font-black tracking-tight leading-tight", children: college.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
              college.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-primary" }),
                " ",
                college.city
              ] }),
              college.domain && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5 text-primary" }),
                " @",
                college.domain
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5 text-yellow-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: college.fests }),
                " ",
                college.fests === 1 ? "Festival" : "Festivals",
                " Hosted"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl px-5 py-3 text-center min-w-[100px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-foreground", children: allEvents.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Events" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl px-5 py-3 text-center min-w-[100px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-foreground", children: studentCount ?? 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Students" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl px-5 py-3 text-center min-w-[100px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-foreground", children: totalAttendees.toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Reach" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-6 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-3xl p-6 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "About the Institution" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground leading-relaxed", children: [
            college.name,
            " is a premier educational institution",
            college.city ? ` located in ${college.city}` : "",
            ". Known for its vibrant campus culture and excellence in organizing world-class festivals, it has become a cornerstone of the WeFest college network.",
            college.fests > 0 && ` With ${college.fests} successful ${college.fests === 1 ? "festival" : "festivals"} under its belt, the institution continues to set benchmarks in student-led events.`
          ] }),
          college.domain && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://${college.domain}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 mt-4 text-sm font-bold text-primary hover:underline", children: [
            "Visit Official Website ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold tracking-tight", children: "Festivals & Events" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                "Events organized by ",
                college.name
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-xl bg-muted/30 p-1 border border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("upcoming"), className: `rounded-lg px-4 py-2 text-xs font-bold transition-all ${activeTab === "upcoming" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: [
                "Upcoming (",
                upcomingEvents.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("past"), className: `rounded-lg px-4 py-2 text-xs font-bold transition-all ${activeTab === "past" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: [
                "Past (",
                pastEvents.length,
                ")"
              ] })
            ] })
          ] }),
          displayEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center glass rounded-3xl border border-dashed border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-8 w-8 text-muted-foreground/30" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: activeTab === "upcoming" ? "No upcoming events" : "No past events" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xs", children: activeTab === "upcoming" ? "Stay tuned — new festivals are announced regularly." : "This institution hasn't hosted any events yet." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: displayEvents.map((event) => {
            const isUpcoming = new Date(event.date) >= now;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: currentUser ? "/events/$eventId" : "/signup", params: currentUser ? {
              eventId: event.id
            } : void 0, search: !currentUser ? {
              redirect: `/events/${event.id}`
            } : void 0, className: "group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `h-32 w-full bg-gradient-to-br ${event.cover || "from-fuchsia-500 to-indigo-700"} relative`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-4 right-4 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/15 text-white border-white/20 backdrop-blur-md text-[10px] font-bold", children: event.category || "Festival" }),
                  isUpcoming && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-bold text-white/90", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-amber-400" }),
                    relativeDate(event.date)
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1", children: event.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: event.description || "An exciting campus event." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-4 flex items-center justify-between border-t border-border/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                      new Date(event.date).toLocaleDateString(void 0, {
                        month: "short",
                        day: "numeric"
                      })
                    ] }),
                    event.attendees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
                      " ",
                      event.attendees
                    ] })
                  ] }),
                  currentUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all", children: [
                    "View Details ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
                    " Sign up to view"
                  ] })
                ] })
              ] })
            ] }, event.id);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        !currentUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-brand-gradient p-6 text-white shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-amber-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-white/80", children: "Join the Network" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold leading-tight", children: "Sign up to register for events" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-white/70 leading-relaxed", children: [
              "Create your free WeFest account to explore events, book tickets, and connect with students from ",
              college.name,
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate({
                to: "/signup",
                search: {
                  redirect: `/colleges/${collegeSlug}`
                }
              }), className: "w-full bg-white text-primary font-bold rounded-xl hover:bg-white/90 shadow-lg", children: [
                "Create Free Account ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => navigate({
                to: "/login",
                search: {
                  redirect: `/colleges/${collegeSlug}`
                }
              }), className: "w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-sm", children: "Already have an account? Sign in" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "Institutional Stats" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [{
            icon: Trophy,
            label: "Festivals Hosted",
            value: college.fests,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10"
          }, {
            icon: Calendar,
            label: "Total Events",
            value: allEvents.length,
            color: "text-primary",
            bg: "bg-primary/10"
          }, {
            icon: Sparkles,
            label: "Upcoming",
            value: upcomingEvents.length,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
          }, {
            icon: Users,
            label: "Total Reach",
            value: totalAttendees.toLocaleString(),
            color: "text-blue-400",
            bg: "bg-blue-500/10"
          }, {
            icon: GraduationCap,
            label: "Students Enrolled",
            value: studentCount ?? 0,
            color: "text-violet-400",
            bg: "bg-violet-500/10"
          }, {
            icon: Award,
            label: "Team Members",
            value: memberCount ?? 0,
            color: "text-amber-400",
            bg: "bg-amber-500/10"
          }].map(({
            icon: Icon,
            label,
            value,
            color,
            bg
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl bg-muted/20 p-3 hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg ${bg} p-2`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${color}` }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: value })
          ] }, label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "Quick Info" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            college.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Location" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: college.city })
              ] })
            ] }),
            college.domain && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Domain" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
                  "@",
                  college.domain
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-500 mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Verification" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `mt-1 text-[10px] font-bold border-none ${college.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`, children: college.status === "approved" ? "Verified" : "Pending" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Member Since" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: new Date(college.created_at).toLocaleDateString(void 0, {
                  month: "long",
                  year: "numeric"
                }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 border border-primary/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-sm", children: "Part of this college?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Sign up as a student to access exclusive events and connect with your campus community." })
            ] })
          ] }),
          !currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "w-full mt-4 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", search: {
            redirect: `/colleges/${collegeSlug}`
          }, children: [
            "Join as Student ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "ml-2 h-4 w-4" })
          ] }) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CollegeProfilePage as component
};
