import { Ticket, Users, FileText, Share2, Mail, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Create Event",
    icon: Plus,
    href: "/organizer/new",
    color: "bg-primary/10 text-primary hover:bg-primary hover:text-white",
  },
  {
    label: "Manage Tickets",
    icon: Ticket,
    href: "/organizer",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white",
  },
  {
    label: "Download Reports",
    icon: FileText,
    href: "/organizer",
    color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white",
  },
  {
    label: "Contact Attendees",
    icon: Mail,
    href: "/organizer",
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white",
  },
  {
    label: "Share Event",
    icon: Share2,
    href: "/organizer",
    color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white",
  },
  {
    label: "Add Staff",
    icon: Users,
    href: "/organizer",
    color: "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-3xl border border-border/50 bg-muted/20 p-8">
      <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className={cn(
              "group flex flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              action.color
            )}
          >
            <action.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
