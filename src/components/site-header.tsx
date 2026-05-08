import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRegion } from "@/contexts/RegionContext";
import { Globe } from "lucide-react";

const marketingNav = [
  { to: "/events", label: "Events" },
  { to: "/colleges", label: "Colleges" },
  { to: "/sponsors", label: "Sponsors" },
];

const studentNav = [
  { to: "/events", label: "Explore Fests" },
  { to: "/tickets", label: "My Tickets" },
  { to: "/shop", label: "Shop" },
  { to: "/social", label: "Network" },
];

const organizerNav = [
  { to: "/organizer", label: "Dashboard" },
  { to: "/organizer/new", label: "Create Event" },
  { to: "/organizer/scan", label: "Scan Tickets" },
  { to: "/ambassadors", label: "Ambassadors" },
];

const sponsorNav = [
  { to: "/sponsor/dashboard", label: "Dashboard" },
  { to: "/sponsors", label: "Discover Fests" },
  { to: "/sponsor/scan", label: "Scan Booth" },
];

export function SiteHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string>("none");

  useEffect(() => {
    const checkRole = async (user: User | null) => {
      if (!user) {
        setIsAdmin(false);
        setUserRole("none");
        return;
      }
      
      const { data: adminData } = await supabase.from("admin_users").select("id").eq("user_id", user.id).maybeSingle();
      setIsAdmin(!!adminData);

      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
      setUserRole(roleData?.role || "student");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      checkRole(u);
    });
    
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      checkRole(u);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  let currentNav = marketingNav;
  if (user) {
    if (userRole === "company") currentNav = sponsorNav;
    else if (userRole === "college") currentNav = organizerNav;
    else currentNav = studentNav;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-lg">
            we<span className="text-gradient">fest</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {currentNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent/10" }}
            >
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-md px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
              activeProps={{ className: "bg-red-500/10" }}
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-xs text-muted-foreground md:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
            </>
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
    <footer className="relative border-t border-border/40 bg-background/80 pt-16 pb-8 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow">
                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
              </span>
              <span className="text-xl">
                we<span className="text-gradient">fest</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Empowering students to connect, compete, and celebrate. The first integrated ecosystem for India's college festival circuit.
            </p>
            
            <div className="mt-8">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <Globe className="h-3 w-3" /> Select Currency
              </div>
              <div className="flex flex-wrap gap-2">
                {(["INR", "USD", "EUR", "GBP"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`group relative overflow-hidden rounded-lg px-4 py-1.5 text-[11px] font-black tracking-wider transition-all ${
                      currency === c 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                    {currency === c && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <FooterCol title="Product" items={[
            { label: "Events Marketplace", to: "/events" },
            { label: "College Portal", to: "/colleges" },
            { label: "Campus Ambassadors", to: "/ambassadors" },
            { label: "Talent Discovery", to: "/talent" }
          ]} />
          
          <FooterCol title="Resources" items={[
            { label: "Organizer Suite", to: "/organizer" },
            { label: "Sponsorship Hub", to: "/sponsors" },
            { label: "Digital Collectibles", to: "/social" },
            { label: "Merch Store", to: "/shop" }
          ]} />
          
          <FooterCol title="Legal" items={[
            { label: "Terms of Service", to: "#" },
            { label: "Privacy Policy", to: "#" },
            { label: "Refund Policy", to: "#" },
            { label: "Cookie Policy", to: "#" }
          ]} />
        </div>
        
        <div className="mt-16 border-t border-border/40 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[11px] font-medium text-muted-foreground">
            © 2026 WeFest Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              System Status: Operational
            </span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="space-y-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50">{title}</div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.label}>
            <Link 
              to={i.to} 
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

