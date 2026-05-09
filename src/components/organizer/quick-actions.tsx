import { Ticket, Users, FileText, Share2, Mail, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: any;
  href: string;
  color: string;
  roles?: string[];
}

const actions: QuickAction[] = [
  {
    label: "Create Event",
    icon: Plus,
    href: "/organizer/new",
    color: "bg-primary/10 text-primary hover:bg-primary hover:text-white",
    roles: ["admin", "coordinator"],
  },
  {
    label: "Manage Tickets",
    icon: Ticket,
    href: "/organizer",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white",
    roles: ["admin", "ticket_poc"],
  },
  {
    label: "Download Reports",
    icon: FileText,
    href: "/organizer",
    color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white",
    roles: ["admin"],
  },
  {
    label: "Contact Attendees",
    icon: Mail,
    href: "/organizer",
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white",
    roles: ["admin", "coordinator"],
  },
  {
    label: "Share Event",
    icon: Share2,
    href: "/organizer",
    color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white",
  },
  {
    label: "Team Management",
    icon: Users,
    href: "/organizer/team",
    color: "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white",
    roles: ["admin"],
  },
];

interface QuickActionsProps {
  role?: string;
}

export function QuickActions({ role = "member" }: QuickActionsProps) {
  const filteredActions = actions.filter(
    (action) => !action.roles || action.roles.includes(role)
  );

  return (
    <div className="rounded-3xl border border-border/50 bg-muted/20 p-8">
      <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {filteredActions.map((action) => (
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
