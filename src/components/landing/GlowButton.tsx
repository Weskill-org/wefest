import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface GlowButtonProps {
  children: ReactNode;
  to: string;
  variant?: "primary" | "outline";
  className?: string;
}

export function GlowButton({ children, to, variant = "primary", className = "" }: GlowButtonProps) {
  if (variant === "outline") {
    return (
      <Button
        asChild
        size="lg"
        variant="outline"
        className={`relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-md text-foreground hover:border-primary/40 hover:bg-white/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_oklch(0.72_0.22_320/0.2)] ${className}`}
      >
        <Link to={to}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="lg"
      className={`glow-btn bg-brand-gradient text-primary-foreground font-bold shadow-glow ${className}`}
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
}
