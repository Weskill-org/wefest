import { j as jsxRuntimeExports, r as reactExports, R as React } from "../_libs/react.mjs";
import { b as createRouter, e as useRouter, a as createRootRoute, c as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, f as useRouterState, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { D as redirect, A as notFound } from "../_libs/tanstack__router-core.mjs";
import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { aM as TriangleAlert, _ as Info, aF as Sparkles, U as Globe } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const RegionContext = reactExports.createContext(void 0);
const RegionProvider = ({ children }) => {
  const [currency, setCurrency] = reactExports.useState("INR");
  const formatPrice = (amount) => {
    const rates = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 9e-3
    };
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£"
    };
    const converted = amount * rates[currency];
    return `${symbols[currency]}${converted.toLocaleString(void 0, { maximumFractionDigits: 0 })}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RegionContext.Provider, { value: { currency, setCurrency, formatPrice }, children });
};
const useRegion = () => {
  const context = reactExports.useContext(RegionContext);
  if (!context) throw new Error("useRegion must be used within a RegionProvider");
  return context;
};
function createSupabaseClient() {
  const SUPABASE_URL = "https://vpganqviwrtmnrfvrrrx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ2FucXZpd3J0bW5yZnZycnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzQxOTYsImV4cCI6MjA5MzY1MDE5Nn0.x3iT4-Mji7FH1FjGzi0x2hHqeTjE5ZgyegHugL96bAA";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const client = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  supabase
}, Symbol.toStringTag, { value: "Module" }));
async function getAuthSession() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: adminData } = await supabase.from("admin_users").select("id").eq("user_id", user.id).maybeSingle();
  const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  return {
    user,
    role: roleData?.role || "student",
    isAdmin: !!adminData
  };
}
function getDashboardRedirect(role, isAdmin) {
  if (isAdmin) return "/admin";
  if (role === "company") return "/company";
  if (role === "college") return "/organizer";
  return "/dashboard";
}
const marketingNav = [
  { to: "/events", label: "Events" },
  { to: "/colleges", label: "Colleges" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/blog", label: "Blog" }
];
function SiteHeader() {
  const [session, setSession] = reactExports.useState(null);
  reactExports.useEffect(() => {
    getAuthSession().then(setSession);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 font-bold tracking-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg", children: [
        "we",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "fest" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-1 md:flex", children: marketingNav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: n.to,
        className: "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground",
        activeProps: { className: "text-foreground bg-accent/10" },
        children: n.label
      },
      n.to
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: session ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "bg-brand-gradient text-primary-foreground hover:opacity-90 font-bold px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getDashboardRedirect(session.role, session.isAdmin), children: "Dashboard" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Sign in" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "bg-brand-gradient text-primary-foreground hover:opacity-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Get started" }) })
    ] }) })
  ] }) });
}
function SiteFooter() {
  const { currency, setCurrency } = useRegion();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "relative mt-20 border-t border-white/10 bg-black/40 pt-20 pb-10 backdrop-blur-3xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 -top-40 h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent pointer-events-none opacity-60" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container relative z-10 mx-auto px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-16 md:grid-cols-2 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3 font-bold tracking-tight group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient shadow-glow transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(var(--brand),0.6)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl", children: [
              "we",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "fest" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground/90", children: "Empowering students to connect, compete, and celebrate. The first integrated ecosystem for India's college festival circuit. Built for the next generation of campus life." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-md w-full max-w-sm transition-colors hover:bg-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5 text-brand" }),
              " Select Currency"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2.5", children: ["INR", "USD", "EUR", "GBP"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setCurrency(c),
                className: `group relative overflow-hidden rounded-xl px-4 py-2 text-xs font-black tracking-wider transition-all duration-300 ${currency === c ? "bg-brand text-brand-foreground shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105" : "bg-black/20 text-muted-foreground hover:bg-black/40 hover:text-white"}`,
                children: c
              },
              c
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Product", items: [
          { label: "Events Marketplace", to: "/events" },
          { label: "College Portal", to: "/colleges" },
          { label: "Campus Ambassadors", to: "/ambassadors" },
          { label: "Talent Discovery", to: "/talent" }
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Resources", items: [
          { label: "Organizer Suite", to: "/organizer" },
          { label: "Sponsorship Hub", to: "/sponsors" },
          { label: "Digital Collectibles", to: "/social" },
          { label: "The Campus Pulse (Blog)", to: "/blog" }
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Legal", items: [
          { label: "Terms of Service", to: "/terms" },
          { label: "Privacy Policy", to: "/privacy" },
          { label: "Refund Policy", to: "/refund" },
          { label: "Cookie Policy", to: "/cookie-policy" }
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-6 md:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground/70", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " WeFest Technologies Pvt Ltd. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" })
            ] }),
            "System Status: Operational"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md", children: [
            "Made with ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 animate-pulse", children: "❤️" }),
            " in India"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function FooterCol({ title, items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-[0.2em] text-white/90", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: i.to,
        className: "text-sm font-medium text-muted-foreground/80 transition-all duration-300 hover:translate-x-1.5 hover:text-white inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full",
        children: i.label
      }
    ) }, i.label)) })
  ] });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function LoadingScreen() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 h-24 w-24 rounded-full bg-primary/20 blur-2xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-20 w-20 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow animate-in zoom-in duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-white tracking-tighter", children: "WF" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-2 rounded-[22px] border-2 border-primary/10 border-t-primary animate-spin" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-700", children: "WeFest" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500", children: "Preparing your festival experience..." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-10 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-30", children: "Securely Authenticating" })
  ] });
}
const appCss = "/assets/styles-Cnmqo1T3.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-black text-gradient", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Lost in the festival crowd" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This page doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Back home"
      }
    )
  ] }) });
}
const Route$10 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "WeFest — The digital backbone of college festivals" },
      { name: "description", content: "Host, manage, sponsor, and ticket college festivals on India's first college-native event ecosystem." },
      { property: "og:title", content: "WeFest — The digital backbone of college festivals" },
      { property: "og:description", content: "Host, manage, sponsor, and ticket college festivals on India's first college-native event ecosystem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "WeFest — The digital backbone of college festivals" },
      { name: "twitter:description", content: "Host, manage, sponsor, and ticket college festivals on India's first college-native event ecosystem." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c59fe210-a7d1-4b78-b701-d17ab3e930d5/id-preview-132cb495--272cb781-a3b7-42b3-b429-7a4083e42d44.lovable.app-1778076928123.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c59fe210-a7d1-4b78-b701-d17ab3e930d5/id-preview-132cb495--272cb781-a3b7-42b3-b429-7a4083e42d44.lovable.app-1778076928123.png" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { suppressHydrationWarning: true, children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [isAuthChecking, setIsAuthChecking] = React.useState(true);
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        await getAuthSession();
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkSession();
  }, []);
  if (isAuthChecking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, {});
  }
  const isOrganizerRoute = pathname.startsWith("/organizer");
  const isCompanyRoute = pathname.startsWith("/company");
  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = routerState.matches.some((m) => m.routeId === "/_student");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const hideGlobalLayout = isOrganizerRoute || isCompanyRoute || isAdminRoute || isStudentRoute || isAuthRoute;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RegionProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalBroadcasts, {}),
    !hideGlobalLayout && /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    !hideGlobalLayout && /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) }) });
}
function GlobalBroadcasts() {
  const { data: broadcasts } = useQuery({
    queryKey: ["global-broadcasts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("broadcast_messages").select("*").eq("active", true).order("created_at", { ascending: false });
        if (error) {
          console.warn("Broadcast fetch error:", error.message);
          return [];
        }
        return data || [];
      } catch (e) {
        console.error("Broadcast fetch exception:", e);
        return [];
      }
    },
    refetchInterval: 6e4
    // Refetch every minute
  });
  if (!Array.isArray(broadcasts) || broadcasts.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: broadcasts.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-white ${b.severity === "emergency" ? "bg-red-600" : b.severity === "warning" ? "bg-amber-600" : "bg-blue-600"}`, children: [
    b.severity === "emergency" || b.severity === "warning" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }),
    b.message
  ] }, b.id)) });
}
const $$splitComponentImporter$$ = () => import("./terms-Cuf1Ulq0.mjs");
const Route$$ = createFileRoute("/terms")({
  head: () => ({
    meta: [{
      title: "Terms of Service | WeFest"
    }, {
      name: "description",
      content: "Terms of Service for WeFest - India's college festival ecosystem. Read about our guidelines, ticketing policies, and user responsibilities."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$$, "component")
});
const $$splitComponentImporter$_ = () => import("./talent-CYyeObzQ.mjs");
const Route$_ = createFileRoute("/talent")({
  head: () => ({
    meta: [{
      title: "Artist Marketplace — WeFest"
    }, {
      name: "description",
      content: "Book top artists, DJs and performers for your college festival."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$_, "component")
});
const $$splitComponentImporter$Z = () => import("./sponsors-wR2PRVRc.mjs");
const Route$Z = createFileRoute("/sponsors")({
  head: () => ({
    meta: [{
      title: "Sponsor a fest — WeFest"
    }, {
      name: "description",
      content: "Discover and sponsor India's biggest college festivals."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$Z, "component")
});
const $$splitComponentImporter$Y = () => import("./signup-B78G-non.mjs");
const Route$Y = createFileRoute("/signup")({
  validateSearch: (search) => {
    return {
      redirect: search.redirect
    };
  },
  head: () => ({
    meta: [{
      title: "Sign up — WeFest"
    }, {
      name: "description",
      content: "Create your WeFest account as a Student, College, or Company."
    }]
  }),
  beforeLoad: async ({
    search
  }) => {
    if (typeof window === "undefined") return;
    const session = await getAuthSession();
    if (session) {
      if (search.redirect) {
        throw redirect({
          to: search.redirect
        });
      }
      throw redirect({
        to: getDashboardRedirect(session.role, session.isAdmin)
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$Y, "component")
});
const $$splitComponentImporter$X = () => import("./refund-BBDKq0oy.mjs");
const Route$X = createFileRoute("/refund")({
  head: () => ({
    meta: [{
      title: "Refund Policy | WeFest"
    }, {
      name: "description",
      content: "Refund Policy for WeFest. Understand the rules for ticket cancellations, event postponements, and refund processes."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$X, "component")
});
const $$splitComponentImporter$W = () => import("./privacy-CD64A2v7.mjs");
const Route$W = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy | WeFest"
    }, {
      name: "description",
      content: "Privacy Policy for WeFest. Learn how we handle student data, identity protection, and our commitment to user privacy."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$W, "component")
});
const $$splitComponentImporter$V = () => import("./organizer-DhJRHSeM.mjs");
const Route$V = createFileRoute("/organizer")({
  head: () => ({
    meta: [{
      title: "Organizer Dashboard — WeFest"
    }, {
      name: "description",
      content: "Professional event management suite for college festivals."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const session = await getAuthSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      });
    }
    if (session.role !== "college") {
      throw redirect({
        to: "/"
      });
    }
    session.user;
    let {
      data: membership
    } = await supabase.from("college_members").select(`
        *,
        colleges (id, name, status)
      `).eq("user_id", session.user.id).maybeSingle();
    if (!membership?.colleges) {
      const userCollegeName = session.user.user_metadata?.full_name;
      if (userCollegeName) {
        const {
          data: collegeByName
        } = await supabase.from("colleges").select("id, name, status").eq("name", userCollegeName).maybeSingle();
        if (collegeByName) {
          const {
            data: newMember
          } = await supabase.from("college_members").upsert({
            college_id: collegeByName.id,
            user_id: session.user.id,
            role: "admin",
            is_approved: true
          }, {
            onConflict: "college_id,user_id"
          }).select(`*, colleges (id, name, status)`).maybeSingle();
          membership = newMember || {
            role: "admin",
            is_approved: true,
            college_id: collegeByName.id,
            colleges: collegeByName
          };
        }
      }
    }
    return {
      user: session.user,
      membership
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$V, "component")
});
const $$splitComponentImporter$U = () => import("./login-BeqexIyj.mjs");
const Route$U = createFileRoute("/login")({
  validateSearch: (search) => {
    return {
      redirect: search.redirect
    };
  },
  head: () => ({
    meta: [{
      title: "Sign in — WeFest"
    }, {
      name: "description",
      content: "Sign in to WeFest with email and password or a magic link."
    }]
  }),
  beforeLoad: async ({
    search
  }) => {
    if (typeof window === "undefined") return;
    const session = await getAuthSession();
    if (session) {
      if (search.redirect) {
        throw redirect({
          to: search.redirect
        });
      }
      throw redirect({
        to: getDashboardRedirect(session.role, session.isAdmin)
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$U, "component")
});
const $$splitComponentImporter$T = () => import("./events-CLDKpgHh.mjs");
const Route$T = createFileRoute("/events")({
  component: lazyRouteComponent($$splitComponentImporter$T, "component")
});
const $$splitComponentImporter$S = () => import("./cookie-policy-C8cYqMij.mjs");
const Route$S = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [{
      title: "Cookie Policy | WeFest"
    }, {
      name: "description",
      content: "Cookie Policy for WeFest. Learn how we use cookies and similar technologies to improve your event discovery experience."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$S, "component")
});
const $$splitComponentImporter$R = () => import("./company-DFLLwux1.mjs");
const Route$R = createFileRoute("/company")({
  head: () => ({
    meta: [{
      title: "Company Portal — WeFest"
    }, {
      name: "description",
      content: "Manage sponsorships, track ROI, and connect with college festivals."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const session = await getAuthSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      });
    }
    if (session.role !== "company") {
      throw redirect({
        to: "/"
      });
    }
    return {
      user: session.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$R, "component")
});
const $$splitComponentImporter$Q = () => import("./colleges-BON_yq03.mjs");
const Route$Q = createFileRoute("/colleges")({
  component: lazyRouteComponent($$splitComponentImporter$Q, "component")
});
const $$splitComponentImporter$P = () => import("./blog-BFsOu0JM.mjs");
const Route$P = createFileRoute("/blog")({
  component: lazyRouteComponent($$splitComponentImporter$P, "component")
});
const $$splitComponentImporter$O = () => import("./ambassadors-LQYhVhAt.mjs");
const Route$O = createFileRoute("/ambassadors")({
  head: () => ({
    meta: [{
      title: "Campus Ambassadors — WeFest"
    }, {
      name: "description",
      content: "Become the face of festivals on your campus. Earn perks, rewards and internships."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$O, "component")
});
const $$splitComponentImporter$N = () => import("./admin-D0KHYtFo.mjs");
const Route$N = createFileRoute("/admin")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const session = await getAuthSession();
    if (!session || !session.isAdmin) {
      throw redirect({
        to: "/login"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$N, "component")
});
const $$splitComponentImporter$M = () => import("../_student-WQ8pJ4QM.mjs");
const Route$M = createFileRoute("/_student")({
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const session = await getAuthSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      });
    }
    if (session.role !== "student") {
      throw redirect({
        to: "/"
      });
    }
    const currentUser = session.user;
    let profile = null;
    try {
      const {
        data,
        error
      } = await supabase.from("student_profiles").select(`
          *,
          colleges (id, name)
        `).eq("id", currentUser.id).maybeSingle();
      if (!data && !error) {
        const {
          data: newProfile,
          error: insertError
        } = await supabase.from("student_profiles").insert({
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || "",
          college_id: currentUser.user_metadata?.college_id || null
        }).select(`*, colleges (id, name)`).single();
        if (!insertError) profile = newProfile;
      } else {
        profile = data;
      }
    } catch (e) {
      console.error("Error syncing student profile:", e);
    }
    return {
      user: currentUser,
      profile
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$M, "component")
});
const $$splitComponentImporter$L = () => import("./index-CBc6zXeL.mjs");
const Route$L = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "WeFest — College festivals, reimagined"
    }, {
      name: "description",
      content: "Discover, ticket and sponsor India's biggest college festivals on one identity-verified platform."
    }]
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    let userId;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (session?.user) {
      userId = session.user.id;
    } else {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    }
    if (userId) {
      const {
        data: adminRow
      } = await supabase.from("admin_users").select("id").eq("user_id", userId).maybeSingle();
      if (adminRow) {
        throw redirect({
          to: "/admin"
        });
      }
      const {
        data: roleData
      } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
      const role = roleData?.role || "student";
      if (role === "company") {
        throw redirect({
          to: "/sponsor/dashboard"
        });
      } else if (role === "college") {
        throw redirect({
          to: "/organizer"
        });
      } else {
        throw redirect({
          to: "/dashboard"
        });
      }
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$L, "component")
});
const $$splitComponentImporter$K = () => import("./organizer.index-Bh9c6fbG.mjs");
const Route$K = createFileRoute("/organizer/")({
  component: lazyRouteComponent($$splitComponentImporter$K, "component")
});
const $$splitComponentImporter$J = () => import("./events.index-BikkkJmQ.mjs");
const Route$J = createFileRoute("/events/")({
  head: () => ({
    meta: [{
      title: "Events & Festivals — WeFest"
    }, {
      name: "description",
      content: "Discover India's biggest college festivals — cultural fests, tech summits, sports meets, and more. Browse, filter, and grab your tickets on WeFest."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$J, "component")
});
const $$splitComponentImporter$I = () => import("./company.index-BazV-5Fn.mjs");
const Route$I = createFileRoute("/company/")({
  head: () => ({
    meta: [{
      title: "Dashboard | Company Portal | WeFest"
    }, {
      name: "description",
      content: "Overview of your sponsorship performance and lead generation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$I, "component")
});
const $$splitComponentImporter$H = () => import("./colleges.index-8Dxz6_M6.mjs");
const Route$H = createFileRoute("/colleges/")({
  head: () => ({
    meta: [{
      title: "College Network — WeFest"
    }, {
      name: "description",
      content: "Discover colleges on WeFest — the premier network for campus festivals and cultural events across India."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$H, "component")
});
const $$splitComponentImporter$G = () => import("./blog.index-7ycHIPu_.mjs");
const Route$G = createFileRoute("/blog/")({
  head: () => ({
    meta: [{
      title: "WeFest Blog | The Campus Pulse"
    }, {
      name: "description",
      content: "Insights, guides, and cultural trends from the Indian college festival circuit. Learn how to plan, host, and sponsor the best fests."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$G, "component")
});
const $$splitComponentImporter$F = () => import("./admin.index-Cze9Svxf.mjs");
const Route$F = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./sponsor.scan-CrF6Hss9.mjs");
const Route$E = createFileRoute("/sponsor/scan")({
  head: () => ({
    meta: [{
      title: "Booth Scanner — WeFest"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const $$splitComponentImporter$D = () => import("./sponsor.pricing-CdM3qOl7.mjs");
const Route$D = createFileRoute("/sponsor/pricing")({
  head: () => ({
    meta: [{
      title: "Sponsorship Plans — WeFest"
    }, {
      name: "description",
      content: "Upgrade your brand presence and ROI tracking."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./sponsor.dashboard-DALOvEG5.mjs");
const Route$C = createFileRoute("/sponsor/dashboard")({
  head: () => ({
    meta: [{
      title: "Sponsor Dashboard — WeFest"
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      });
    }
    const {
      data: roleData
    } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle();
    if (roleData?.role !== "company") {
      throw redirect({
        to: "/"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./organizer.wallet-DC5Jn_vO.mjs");
const Route$B = createFileRoute("/organizer/wallet")({
  head: () => ({
    meta: [{
      title: "WeCoin Wallet — Organizer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./organizer.team-DVkCERg2.mjs");
const Route$A = createFileRoute("/organizer/team")({
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./organizer.sponsor-assets-C4sxugO0.mjs");
const Route$z = createFileRoute("/organizer/sponsor-assets")({
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./organizer.settings-cqV_cGct.mjs");
const Route$y = createFileRoute("/organizer/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Organizer — WeFest"
    }, {
      name: "description",
      content: "Manage your organizer profile and account settings."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./organizer.scan-CpHF4cpA.mjs");
const Route$x = createFileRoute("/organizer/scan")({
  head: () => ({
    meta: [{
      title: "Scan tickets — WeFest"
    }, {
      name: "description",
      content: "Validate ticket QR codes at the gate."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./organizer.new-CMs7zZ3G.mjs");
const Route$w = createFileRoute("/organizer/new")({
  head: () => ({
    meta: [{
      title: "Create Event — WeFest"
    }, {
      name: "description",
      content: "Launch your next festival on the WeFest platform."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./events._eventId-DDeZZ5Dd.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./events._eventId-D3e59JiP.mjs");
const $$splitErrorComponentImporter$1 = () => import("./events._eventId-Cqnh41nl.mjs");
const Route$v = createFileRoute("/events/$eventId")({
  loader: async ({
    params
  }) => {
    const {
      data: event,
      error
    } = await supabase.from("events").select("*").eq("id", params.eventId).single();
    if (error || !event) throw notFound();
    return event;
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: loaderData ? `${loaderData.title} — WeFest` : "Event — WeFest"
    }, {
      name: "description",
      content: loaderData?.description ?? "Festival event on WeFest — India's college festival platform."
    }]
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./company.wallet-ColtrB7d.mjs");
const Route$u = createFileRoute("/company/wallet")({
  head: () => ({
    meta: [{
      title: "WeCoin Wallet — Company"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./company.settings-BWo3iCrT.mjs");
const Route$t = createFileRoute("/company/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Company Portal — WeFest"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./company.scan-Ctdi3m-y.mjs");
const Route$s = createFileRoute("/company/scan")({
  head: () => ({
    meta: [{
      title: "Booth Scanner — Company Portal — WeFest"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./company.proposals-Dp1U4XOe.mjs");
const Route$r = createFileRoute("/company/proposals")({
  head: () => ({
    meta: [{
      title: "Sponsorship Proposals | Company Portal | WeFest"
    }, {
      name: "description",
      content: "Manage and track your sent sponsorship proposals."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./company.marketplace-m1IS-7wn.mjs");
const Route$q = createFileRoute("/company/marketplace")({
  head: () => ({
    meta: [{
      title: "Marketplace — Company Portal — WeFest"
    }, {
      name: "description",
      content: "Discover and sponsor India's biggest college festivals."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./company.brand-assets-B_zoKqq3.mjs");
const Route$p = createFileRoute("/company/brand-assets")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./colleges._collegeSlug-DZ2o6RXw.mjs");
const Route$o = createFileRoute("/colleges/$collegeSlug")({
  head: () => ({
    meta: [{
      title: "College Profile — WeFest"
    }, {
      name: "description",
      content: "Explore this college's festivals, events, and campus life on WeFest."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const BLOG_POSTS = [
  {
    slug: "evolution-of-college-fests",
    title: "The Evolution of College Festivals in India: More Than Just Culture",
    excerpt: "From small internal gatherings to massive multi-city attractions, how college fests became the heartbeat of Indian youth culture.",
    author: "Aditya Sharma",
    date: "May 05, 2026",
    readTime: "8 min read",
    category: "Culture",
    cover: "bg-purple-500/20",
    content: "College festivals have always been the pinnacle of student life in India. From the high-octane energy of Mood Indigo to the technical brilliance of Shaastra, these events define an entire generation's campus experience. The shift from physical ticket counters to identity-verified digital ecosystems isn't just about convenience—it's about building a sustainable and transparent future for student-led initiatives."
  },
  {
    slug: "winning-sponsors-guide",
    title: "The Ultimate Guide to Winning Premium Sponsors for Your Fest",
    excerpt: "How to move beyond simple logos on posters and create real value that makes brands like RedBull and OnePlus want to partner with you.",
    author: "Rohan Varma",
    date: "May 02, 2026",
    readTime: "12 min read",
    category: "Event Mastery",
    cover: "bg-blue-500/20",
    content: "Winning sponsors is no longer about just selling space on a banner. It's about data, reach, and engagement. Brands are looking for authentic connections with the Gen-Z demographic, and college festivals provide the perfect laboratory for this interaction."
  },
  {
    slug: "budgeting-for-festivals",
    title: "Planning a Massive Fest on a Student Budget: A Survival Guide",
    excerpt: "Practical tips on resource optimization, vendor negotiation, and financial transparency for student coordinators.",
    author: "Priya Nair",
    date: "April 28, 2026",
    readTime: "10 min read",
    category: "Management",
    cover: "bg-green-500/20",
    content: "Transparency is the key to managing a student budget. Using digital tools to track every rupee ensures that the festival remains profitable and that the student body's interests are protected."
  },
  {
    slug: "talent-discovery-platforms",
    title: "Why Digital Infrastructure is the Future of Talent Discovery",
    excerpt: "How platforms like WeFest are helping student artists, dancers, and musicians get noticed by industry scouts.",
    author: "Ishani Gupta",
    date: "April 25, 2026",
    readTime: "6 min read",
    category: "Innovation",
    cover: "bg-orange-500/20",
    content: "Digital platforms are democratizing talent discovery. No longer do you need to be in a big city to be noticed; a verified performance record on a platform like WeFest can open doors to global opportunities."
  },
  // 10 New Posts
  {
    slug: "maximizing-sponsor-roi",
    title: "Maximizing Sponsor ROI: Moving Beyond Logo Placement",
    excerpt: "Learn how to provide deep analytical insights to your sponsors to ensure they come back year after year.",
    author: "Karan Singh",
    date: "May 07, 2026",
    readTime: "15 min read",
    category: "Sponsorship",
    cover: "bg-red-500/20",
    content: "Data is the new currency in sponsorship. By providing sponsors with detailed heatmaps of attendee movement and conversion rates from digital ads, you can prove the value of their investment beyond mere impressions."
  },
  {
    slug: "ai-in-event-management",
    title: "AI in Event Management: Automating the Boring Stuff",
    excerpt: "How artificial intelligence is helping organizers with scheduling, volunteer management, and attendee support.",
    author: "Sneha Kapoor",
    date: "May 06, 2026",
    readTime: "9 min read",
    category: "Technology",
    cover: "bg-cyan-500/20",
    content: "AI chatbots can handle 80% of attendee queries, freeing up your volunteer team to focus on the actual execution of the event. Predictive analytics can also help in estimating footfall and resource requirements."
  },
  {
    slug: "art-of-the-after-movie",
    title: "The Art of the After-Movie: Capturing Fest Memories That Last",
    excerpt: "Why a high-quality after-movie is your best marketing tool for next year's festival.",
    author: "Vikram Malhotra",
    date: "May 04, 2026",
    readTime: "7 min read",
    category: "Marketing",
    cover: "bg-pink-500/20",
    content: "A great after-movie captures the soul of the festival. It's not just about the performances; it's about the emotions, the crowds, and the shared experiences that define college life."
  },
  {
    slug: "safety-first-crowd-management",
    title: "Safety First: Professional Crowd Management for Large Fests",
    excerpt: "Critical strategies for ensuring student safety during high-occupancy cultural nights and concerts.",
    author: "Amitabh Bose",
    date: "May 03, 2026",
    readTime: "11 min read",
    category: "Operations",
    cover: "bg-yellow-500/20",
    content: "Effective crowd management starts with data. By monitoring entry and exit points in real-time through QR scanning, organizers can prevent overcrowding before it becomes a hazard."
  },
  {
    slug: "sustainable-festivals-campus",
    title: "Sustainable Festivals: Reducing the Carbon Footprint of Your Event",
    excerpt: "Practical steps to make your college fest eco-friendly, from digital ticketing to zero-waste food courts.",
    author: "Anjali Deshmukh",
    date: "May 01, 2026",
    readTime: "8 min read",
    category: "Sustainability",
    cover: "bg-emerald-500/20",
    content: "Going paperless with digital tickets is just the beginning. Implementing effective waste segregation and partnering with sustainable brands can significantly reduce the environmental impact of your festival."
  },
  {
    slug: "social-media-mastery-promoters",
    title: "Social Media Mastery for College Fest Promoters",
    excerpt: "How to create viral content that drives ticket sales and builds hype across Instagram, TikTok, and WhatsApp.",
    author: "Siddharth Roy",
    date: "April 30, 2026",
    readTime: "13 min read",
    category: "Marketing",
    cover: "bg-indigo-500/20",
    content: "Viral marketing isn't an accident. It's about understanding the current trends and creating content that resonates with the specific sub-cultures within your campus network."
  },
  {
    slug: "rise-of-esports-college-fests",
    title: "The Rise of Esports: Why Every Fest Needs a Gaming Wing",
    excerpt: "Esports is no longer a niche hobby. Learn how to integrate competitive gaming into your cultural festival.",
    author: "Rahul Verma",
    date: "April 29, 2026",
    readTime: "10 min read",
    category: "Trends",
    cover: "bg-slate-500/20",
    content: "Esports tournaments often see higher engagement rates than traditional cultural events. They attract a tech-savvy demographic that sponsors are eager to reach."
  },
  {
    slug: "navigating-legalities-permissions",
    title: "Navigating Legalities: Permissions and Licenses for College Fests",
    excerpt: "A checklist of the legal requirements for hosting large-scale events, including music licenses and local permits.",
    author: "Meera Joshi",
    date: "April 27, 2026",
    readTime: "14 min read",
    category: "Legal",
    cover: "bg-orange-600/20",
    content: "Ignoring legal requirements can lead to last-minute cancellations and heavy fines. Ensure you have your PPL/IPRS licenses and local police permissions well in advance."
  },
  {
    slug: "talent-scouting-cultural-night",
    title: "Talent Scouting: Finding the Next Big Act for Your Cultural Night",
    excerpt: "How to identify and book rising stars before they hit the mainstream, giving your fest an edge.",
    author: "Sameer Khan",
    date: "April 26, 2026",
    readTime: "9 min read",
    category: "Talent",
    cover: "bg-rose-500/20",
    content: "Finding 'undiscovered' talent is a great way to save on your budget while still providing a top-tier experience. Look for artists who are trending on social media but haven't hit the mainstream yet."
  },
  {
    slug: "psychology-of-ticketing",
    title: "The Psychology of Ticketing: Why Students Buy (or Don't)",
    excerpt: "Understanding price sensitivity, FOMO, and the ideal timing for ticket launches.",
    author: "Tanvi Gupta",
    date: "April 24, 2026",
    readTime: "11 min read",
    category: "Psychology",
    cover: "bg-amber-500/20",
    content: "Early-bird pricing isn't just about the discount; it's about building momentum. Creating a sense of urgency through limited-time offers can significantly boost initial sales."
  }
];
const $$splitComponentImporter$n = () => import("./blog._slug-DNrBlVzN.mjs");
const Route$n = createFileRoute("/blog/$slug")({
  head: ({
    params
  }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    return {
      meta: [{
        title: `${post?.title || "Blog Post"} | WeFest Blog`
      }, {
        name: "description",
        content: post?.excerpt || "Read our latest insights on college festivals and campus trends."
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./admin.users-wBpR8EgG.mjs");
const Route$m = createFileRoute("/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./admin.integrations-D0libjCD.mjs");
const Route$l = createFileRoute("/admin/integrations")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./admin.gift-cards-C-qzSM5I.mjs");
const Route$k = createFileRoute("/admin/gift-cards")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./admin.events-D4hCyD9C.mjs");
const Route$j = createFileRoute("/admin/events")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./admin.companies-gbYnkzC1.mjs");
const Route$i = createFileRoute("/admin/companies")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./admin.colleges-Byh8wKGA.mjs");
const Route$h = createFileRoute("/admin/colleges")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./admin.cities-BKE7lEcf.mjs");
const Route$g = createFileRoute("/admin/cities")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./admin.broadcasts-DNYh3Pg3.mjs");
const Route$f = createFileRoute("/admin/broadcasts")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./admin.approvals-CFtS6iT3.mjs");
const Route$e = createFileRoute("/admin/approvals")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./admin.analytics-aCv1Ppcz.mjs");
const Route$d = createFileRoute("/admin/analytics")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./admin.admins-DTodkYWx.mjs");
const Route$c = createFileRoute("/admin/admins")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("../_student.wallet-BfnOAGJC.mjs");
const Route$b = createFileRoute("/_student/wallet")({
  head: () => ({
    meta: [{
      title: "WeCoin Wallet — WeFest"
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) throw redirect({
      to: "/login",
      search: {
        redirect: location.href
      }
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("../_student.tickets-B-BC7rmk.mjs");
const Route$a = createFileRoute("/_student/tickets")({
  head: () => ({
    meta: [{
      title: "My Tickets — WeFest"
    }, {
      name: "description",
      content: "Your WeFest tickets and QR codes."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: "/login",
          search: {
            redirect: location.href
          }
        });
      }
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("../_student.social-D9vk5AjD.mjs");
const Route$9 = createFileRoute("/_student/social")({
  head: () => ({
    meta: [{
      title: "Campus Network — WeFest"
    }, {
      name: "description",
      content: "Connect with students from other colleges and follow your friends."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: "/login",
          search: {
            redirect: location.href
          }
        });
      }
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("../_student.shop-DyAT9GhH.mjs");
const Route$8 = createFileRoute("/_student/shop")({
  head: () => ({
    meta: [{
      title: "Campus Store — WeFest Merch"
    }, {
      name: "description",
      content: "Get official college festival hoodies, tees and gear."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: "/login",
          search: {
            redirect: location.href
          }
        });
      }
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("../_student.settings-CkZ5QrVM.mjs");
const Route$7 = createFileRoute("/_student/settings")({
  head: () => ({
    meta: [{
      title: "Profile Settings — WeFest"
    }, {
      name: "description",
      content: "Manage your student profile, college affiliation, and preferences."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_student.orders-fZVPaXdq.mjs");
const Route$6 = createFileRoute("/_student/orders")({
  head: () => ({
    meta: [{
      title: "My Orders — WeFest"
    }, {
      name: "description",
      content: "Track your merchandise orders."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: "/login",
          search: {
            redirect: location.href
          }
        });
      }
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("../_student.dashboard-CEoC8Ti8.mjs");
const Route$5 = createFileRoute("/_student/dashboard")({
  head: () => ({
    meta: [{
      title: "Student Dashboard — WeFest"
    }, {
      name: "description",
      content: "Your personalized festival command center."
    }]
  }),
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: "/login",
          search: {
            redirect: location.href
          }
        });
      }
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./organizer.events.index-DtBA5pB5.mjs");
const Route$4 = createFileRoute("/organizer/events/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_student.explore.index-DJ83N3H2.mjs");
const Route$3 = createFileRoute("/_student/explore/")({
  head: () => ({
    meta: [{
      title: "Campus Discovery — WeFest"
    }, {
      name: "description",
      content: "Explore exclusive festivals and events at your institution."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./organizer.events._eventId-Bxsap43k.mjs");
const Route$2 = createFileRoute("/organizer/events/$eventId")({
  validateSearch: (search) => {
    return {
      tab: search.tab || "analytics"
    };
  },
  loader: async ({
    params,
    context
  }) => {
    const {
      membership
    } = context;
    let query = supabase.from("events").select("*").eq("id", params.eventId);
    if (membership?.college_id) {
      query = query.or(`organizer_user_id.eq.${context.user.id},college_id.eq.${membership.college_id}`);
    } else {
      query = query.eq("organizer_user_id", context.user.id);
    }
    const {
      data: event,
      error
    } = await query.maybeSingle();
    if (error || !event) throw notFound();
    return event;
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_student.explore._eventId-BEtGRaLy.mjs");
const $$splitNotFoundComponentImporter = () => import("../_student.explore._eventId-BZ2mdJoz.mjs");
const $$splitErrorComponentImporter = () => import("../_student.explore._eventId-DIAAmnl_.mjs");
const Route$1 = createFileRoute("/_student/explore/$eventId")({
  loader: async ({
    params
  }) => {
    const {
      data: event,
      error
    } = await supabase.from("events").select("*").eq("id", params.eventId).single();
    if (error || !event) throw notFound();
    return event;
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: loaderData ? `${loaderData.title} — WeFest` : "Event — WeFest"
    }, {
      name: "description",
      content: loaderData?.description ?? "Festival on WeFest"
    }]
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./organizer.events._eventId.edit-Cqrc1Dsj.mjs");
const Route = createFileRoute("/organizer/events/$eventId/edit")({
  loader: async ({
    params
  }) => {
    const {
      data: event,
      error
    } = await supabase.from("events").select("*").eq("id", params.eventId).maybeSingle();
    if (error || !event) throw notFound();
    return event;
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TermsRoute = Route$$.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$10
});
const TalentRoute = Route$_.update({
  id: "/talent",
  path: "/talent",
  getParentRoute: () => Route$10
});
const SponsorsRoute = Route$Z.update({
  id: "/sponsors",
  path: "/sponsors",
  getParentRoute: () => Route$10
});
const SignupRoute = Route$Y.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$10
});
const RefundRoute = Route$X.update({
  id: "/refund",
  path: "/refund",
  getParentRoute: () => Route$10
});
const PrivacyRoute = Route$W.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$10
});
const OrganizerRoute = Route$V.update({
  id: "/organizer",
  path: "/organizer",
  getParentRoute: () => Route$10
});
const LoginRoute = Route$U.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$10
});
const EventsRoute = Route$T.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => Route$10
});
const CookiePolicyRoute = Route$S.update({
  id: "/cookie-policy",
  path: "/cookie-policy",
  getParentRoute: () => Route$10
});
const CompanyRoute = Route$R.update({
  id: "/company",
  path: "/company",
  getParentRoute: () => Route$10
});
const CollegesRoute = Route$Q.update({
  id: "/colleges",
  path: "/colleges",
  getParentRoute: () => Route$10
});
const BlogRoute = Route$P.update({
  id: "/blog",
  path: "/blog",
  getParentRoute: () => Route$10
});
const AmbassadorsRoute = Route$O.update({
  id: "/ambassadors",
  path: "/ambassadors",
  getParentRoute: () => Route$10
});
const AdminRoute = Route$N.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$10
});
const StudentRoute = Route$M.update({
  id: "/_student",
  getParentRoute: () => Route$10
});
const IndexRoute = Route$L.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$10
});
const OrganizerIndexRoute = Route$K.update({
  id: "/",
  path: "/",
  getParentRoute: () => OrganizerRoute
});
const EventsIndexRoute = Route$J.update({
  id: "/",
  path: "/",
  getParentRoute: () => EventsRoute
});
const CompanyIndexRoute = Route$I.update({
  id: "/",
  path: "/",
  getParentRoute: () => CompanyRoute
});
const CollegesIndexRoute = Route$H.update({
  id: "/",
  path: "/",
  getParentRoute: () => CollegesRoute
});
const BlogIndexRoute = Route$G.update({
  id: "/",
  path: "/",
  getParentRoute: () => BlogRoute
});
const AdminIndexRoute = Route$F.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const SponsorScanRoute = Route$E.update({
  id: "/sponsor/scan",
  path: "/sponsor/scan",
  getParentRoute: () => Route$10
});
const SponsorPricingRoute = Route$D.update({
  id: "/sponsor/pricing",
  path: "/sponsor/pricing",
  getParentRoute: () => Route$10
});
const SponsorDashboardRoute = Route$C.update({
  id: "/sponsor/dashboard",
  path: "/sponsor/dashboard",
  getParentRoute: () => Route$10
});
const OrganizerWalletRoute = Route$B.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => OrganizerRoute
});
const OrganizerTeamRoute = Route$A.update({
  id: "/team",
  path: "/team",
  getParentRoute: () => OrganizerRoute
});
const OrganizerSponsorAssetsRoute = Route$z.update({
  id: "/sponsor-assets",
  path: "/sponsor-assets",
  getParentRoute: () => OrganizerRoute
});
const OrganizerSettingsRoute = Route$y.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => OrganizerRoute
});
const OrganizerScanRoute = Route$x.update({
  id: "/scan",
  path: "/scan",
  getParentRoute: () => OrganizerRoute
});
const OrganizerNewRoute = Route$w.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => OrganizerRoute
});
const EventsEventIdRoute = Route$v.update({
  id: "/$eventId",
  path: "/$eventId",
  getParentRoute: () => EventsRoute
});
const CompanyWalletRoute = Route$u.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => CompanyRoute
});
const CompanySettingsRoute = Route$t.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => CompanyRoute
});
const CompanyScanRoute = Route$s.update({
  id: "/scan",
  path: "/scan",
  getParentRoute: () => CompanyRoute
});
const CompanyProposalsRoute = Route$r.update({
  id: "/proposals",
  path: "/proposals",
  getParentRoute: () => CompanyRoute
});
const CompanyMarketplaceRoute = Route$q.update({
  id: "/marketplace",
  path: "/marketplace",
  getParentRoute: () => CompanyRoute
});
const CompanyBrandAssetsRoute = Route$p.update({
  id: "/brand-assets",
  path: "/brand-assets",
  getParentRoute: () => CompanyRoute
});
const CollegesCollegeSlugRoute = Route$o.update({
  id: "/$collegeSlug",
  path: "/$collegeSlug",
  getParentRoute: () => CollegesRoute
});
const BlogSlugRoute = Route$n.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => BlogRoute
});
const AdminUsersRoute = Route$m.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AdminRoute
});
const AdminIntegrationsRoute = Route$l.update({
  id: "/integrations",
  path: "/integrations",
  getParentRoute: () => AdminRoute
});
const AdminGiftCardsRoute = Route$k.update({
  id: "/gift-cards",
  path: "/gift-cards",
  getParentRoute: () => AdminRoute
});
const AdminEventsRoute = Route$j.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => AdminRoute
});
const AdminCompaniesRoute = Route$i.update({
  id: "/companies",
  path: "/companies",
  getParentRoute: () => AdminRoute
});
const AdminCollegesRoute = Route$h.update({
  id: "/colleges",
  path: "/colleges",
  getParentRoute: () => AdminRoute
});
const AdminCitiesRoute = Route$g.update({
  id: "/cities",
  path: "/cities",
  getParentRoute: () => AdminRoute
});
const AdminBroadcastsRoute = Route$f.update({
  id: "/broadcasts",
  path: "/broadcasts",
  getParentRoute: () => AdminRoute
});
const AdminApprovalsRoute = Route$e.update({
  id: "/approvals",
  path: "/approvals",
  getParentRoute: () => AdminRoute
});
const AdminAnalyticsRoute = Route$d.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AdminRoute
});
const AdminAdminsRoute = Route$c.update({
  id: "/admins",
  path: "/admins",
  getParentRoute: () => AdminRoute
});
const StudentWalletRoute = Route$b.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => StudentRoute
});
const StudentTicketsRoute = Route$a.update({
  id: "/tickets",
  path: "/tickets",
  getParentRoute: () => StudentRoute
});
const StudentSocialRoute = Route$9.update({
  id: "/social",
  path: "/social",
  getParentRoute: () => StudentRoute
});
const StudentShopRoute = Route$8.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => StudentRoute
});
const StudentSettingsRoute = Route$7.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => StudentRoute
});
const StudentOrdersRoute = Route$6.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => StudentRoute
});
const StudentDashboardRoute = Route$5.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => StudentRoute
});
const OrganizerEventsIndexRoute = Route$4.update({
  id: "/events/",
  path: "/events/",
  getParentRoute: () => OrganizerRoute
});
const StudentExploreIndexRoute = Route$3.update({
  id: "/explore/",
  path: "/explore/",
  getParentRoute: () => StudentRoute
});
const OrganizerEventsEventIdRoute = Route$2.update({
  id: "/events/$eventId",
  path: "/events/$eventId",
  getParentRoute: () => OrganizerRoute
});
const StudentExploreEventIdRoute = Route$1.update({
  id: "/explore/$eventId",
  path: "/explore/$eventId",
  getParentRoute: () => StudentRoute
});
const OrganizerEventsEventIdEditRoute = Route.update({
  id: "/edit",
  path: "/edit",
  getParentRoute: () => OrganizerEventsEventIdRoute
});
const StudentRouteChildren = {
  StudentDashboardRoute,
  StudentOrdersRoute,
  StudentSettingsRoute,
  StudentShopRoute,
  StudentSocialRoute,
  StudentTicketsRoute,
  StudentWalletRoute,
  StudentExploreEventIdRoute,
  StudentExploreIndexRoute
};
const StudentRouteWithChildren = StudentRoute._addFileChildren(StudentRouteChildren);
const AdminRouteChildren = {
  AdminAdminsRoute,
  AdminAnalyticsRoute,
  AdminApprovalsRoute,
  AdminBroadcastsRoute,
  AdminCitiesRoute,
  AdminCollegesRoute,
  AdminCompaniesRoute,
  AdminEventsRoute,
  AdminGiftCardsRoute,
  AdminIntegrationsRoute,
  AdminUsersRoute,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const BlogRouteChildren = {
  BlogSlugRoute,
  BlogIndexRoute
};
const BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
const CollegesRouteChildren = {
  CollegesCollegeSlugRoute,
  CollegesIndexRoute
};
const CollegesRouteWithChildren = CollegesRoute._addFileChildren(
  CollegesRouteChildren
);
const CompanyRouteChildren = {
  CompanyBrandAssetsRoute,
  CompanyMarketplaceRoute,
  CompanyProposalsRoute,
  CompanyScanRoute,
  CompanySettingsRoute,
  CompanyWalletRoute,
  CompanyIndexRoute
};
const CompanyRouteWithChildren = CompanyRoute._addFileChildren(CompanyRouteChildren);
const EventsRouteChildren = {
  EventsEventIdRoute,
  EventsIndexRoute
};
const EventsRouteWithChildren = EventsRoute._addFileChildren(EventsRouteChildren);
const OrganizerEventsEventIdRouteChildren = {
  OrganizerEventsEventIdEditRoute
};
const OrganizerEventsEventIdRouteWithChildren = OrganizerEventsEventIdRoute._addFileChildren(
  OrganizerEventsEventIdRouteChildren
);
const OrganizerRouteChildren = {
  OrganizerNewRoute,
  OrganizerScanRoute,
  OrganizerSettingsRoute,
  OrganizerSponsorAssetsRoute,
  OrganizerTeamRoute,
  OrganizerWalletRoute,
  OrganizerIndexRoute,
  OrganizerEventsEventIdRoute: OrganizerEventsEventIdRouteWithChildren,
  OrganizerEventsIndexRoute
};
const OrganizerRouteWithChildren = OrganizerRoute._addFileChildren(
  OrganizerRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  StudentRoute: StudentRouteWithChildren,
  AdminRoute: AdminRouteWithChildren,
  AmbassadorsRoute,
  BlogRoute: BlogRouteWithChildren,
  CollegesRoute: CollegesRouteWithChildren,
  CompanyRoute: CompanyRouteWithChildren,
  CookiePolicyRoute,
  EventsRoute: EventsRouteWithChildren,
  LoginRoute,
  OrganizerRoute: OrganizerRouteWithChildren,
  PrivacyRoute,
  RefundRoute,
  SignupRoute,
  SponsorsRoute,
  TalentRoute,
  TermsRoute,
  SponsorDashboardRoute,
  SponsorPricingRoute,
  SponsorScanRoute
};
const routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const queryClient = new QueryClient();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {
      queryClient
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter,
  queryClient
}, Symbol.toStringTag, { value: "Module" }));
export {
  BLOG_POSTS as B,
  Route$Y as R,
  Button as a,
  Route$V as b,
  Route$U as c,
  Route$R as d,
  Route$M as e,
  Route$K as f,
  Route$z as g,
  Route$x as h,
  Route$w as i,
  Route$v as j,
  Route$o as k,
  Route$n as l,
  Route$8 as m,
  Route$5 as n,
  Route$4 as o,
  Route$2 as p,
  Route$1 as q,
  Route as r,
  client as s,
  cn as t,
  getAuthSession as u,
  getDashboardRedirect as v,
  router as w,
  supabase as x,
  useRegion as y
};
