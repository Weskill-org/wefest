import { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface DashboardStatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  isPositive?: boolean;
  href: string;
  className?: string;
}

export function DashboardStatTile({
  icon: Icon,
  label,
  value,
  delta,
  isPositive = true,
  href,
  className
}: DashboardStatTileProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/50 bg-muted/20 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-muted/30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      {/* Decorative background glow */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-opacity group-hover:opacity-100" />
      
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
          <Icon className="h-6 w-6" />
        </div>
        {delta && (
          <span className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
            isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {isPositive ? "+" : ""}{delta}
          </span>
        )}
      </div>
      
      <div className="mt-6">
        <div className="text-3xl font-black tracking-tight text-foreground">{value}</div>
        <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
      </div>
      
      {/* Subtle indicator line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-gradient transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
