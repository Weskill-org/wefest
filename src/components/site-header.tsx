import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const nav = [
  { to: "/events", label: "Events" },
  { to: "/colleges", label: "Colleges" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/organizer", label: "Organize" },
] as const;

export function SiteHeader() {
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
          {nav.map((n) => (
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
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="bg-brand-gradient text-primary-foreground hover:opacity-90">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/40">
      <div className="container mx-auto grid gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-gradient">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </span>
            wefest
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            The digital backbone of college festivals.
          </p>
        </div>
        <FooterCol title="Product" items={["Events", "Tickets", "Sponsors", "Organizer Suite"]} />
        <FooterCol title="Company" items={["About", "Press", "Careers", "Contact"]} />
        <FooterCol title="Legal" items={["Terms", "Privacy", "Refunds", "Trust"]} />
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © 2026 WeFest. Made with conviction in India.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="hover:text-foreground transition-colors cursor-pointer">{i}</li>
        ))}
      </ul>
    </div>
  );
}
