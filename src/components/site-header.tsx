import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthSession, getDashboardRedirect } from "@/lib/auth";

// Public marketing navigation — only shown to non-logged-in visitors
const marketingNav = [
  { to: "/colleges", label: "Colleges" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    getAuthSession().then(setSession);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-lg">
            We<span className="text-gradient">Fest</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {marketingNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent/10" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <Button asChild size="sm" className="bg-brand-gradient text-primary-foreground hover:opacity-90 font-bold px-5">
              <Link to={getDashboardRedirect(session.role, session.isAdmin)}>
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-brand-gradient text-primary-foreground hover:opacity-90">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { currency, setCurrency } = useRegion();

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/40 pt-20 pb-10 backdrop-blur-3xl overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-50" />
      <div className="absolute inset-x-0 -top-40 h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent pointer-events-none opacity-60" />
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 font-bold tracking-tight group">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient shadow-glow transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(var(--brand),0.6)]">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="text-2xl">
                We<span className="text-gradient">Fest</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground/90">
              Empowering students to connect, compete, and celebrate. The first integrated ecosystem for India's college festival circuit. Built for the next generation of campus life.
            </p>
            
            <div className="mt-10 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-md w-full max-w-sm transition-colors hover:bg-white/10">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <Globe className="h-3.5 w-3.5 text-brand" /> Select Currency
              </div>
              <div className="flex flex-wrap gap-2.5">
                {(["INR", "USD", "EUR", "GBP"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`group relative overflow-hidden rounded-xl px-4 py-2 text-xs font-black tracking-wider transition-all duration-300 ${
                      currency === c 
                        ? "bg-brand text-brand-foreground shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105" 
                        : "bg-black/20 text-muted-foreground hover:bg-black/40 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <FooterCol title="Product" items={[
            { label: "Platform Overview", to: "/signup" },
            { label: "College Portal", to: "/colleges" },
            { label: "Campus Ambassadors", to: "/ambassadors" },
            { label: "Talent Discovery", to: "/talent" }
          ]} />
          
          <FooterCol title="Resources" items={[
            { label: "Organizer Suite", to: "/organizer" },
            { label: "Sponsorship Hub", to: "/sponsors" },
            { label: "Digital Collectibles", to: "/social" },
            { label: "The Campus Pulse (Blog)", to: "/blog" }
          ]} />
          
          <FooterCol title="Legal" items={[
            { label: "Terms of Service", to: "/terms" },
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Refund Policy", to: "/refund" },
            { label: "Cookie Policy", to: "/cookie-policy" }
          ]} />
        </div>
        
        <div className="mt-20 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-xs font-medium text-muted-foreground/70">
            © {new Date().getFullYear()} WeFest Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              </span>
              System Status: Operational
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
              Made with <span className="text-red-500 animate-pulse">❤️</span> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">{title}</h3>
      <ul className="space-y-4">
        {items.map((i) => (
          <li key={i.label}>
            <Link 
              to={i.to} 
              className="text-sm font-medium text-muted-foreground/80 transition-all duration-300 hover:translate-x-1.5 hover:text-white inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

