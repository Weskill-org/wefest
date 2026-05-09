import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LayoutDashboard, CalendarCheck, Users, Megaphone, TrendingUp, Share2, MapPin, Building2, ShieldCheck, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    // Skip redirect on server to prevent redirect-on-refresh bug
    if (typeof window === 'undefined') return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
  { to: "/admin/events", icon: CalendarCheck, label: "Events" },
  { to: "/admin/analytics", icon: TrendingUp, label: "Analytics" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/colleges", icon: Share2, label: "Colleges" },
  { to: "/admin/integrations", icon: Share2, label: "Integrations" },
  { to: "/admin/cities", icon: MapPin, label: "Cities" },
  { to: "/admin/broadcasts", icon: Megaphone, label: "Broadcasts" },
];

function AdminLayout() {
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["check-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, rank")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") { // Ignore no rows error
        console.error("Error checking admin status:", error);
      }
      return data;
    }
  });

  const isAdmin = !!adminData;
  const adminRank = adminData?.rank;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You do not have administrative privileges.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-primary-foreground">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="glass rounded-2xl p-4 h-fit sticky top-24">
          <div className="mb-6 px-3">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider">Control Panel</div>
            <div className="font-display text-xl font-bold mt-1">Admin Hub</div>
            {adminRank && (
              <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                {adminRank}
              </div>
            )}
          </div>
          <nav className="flex flex-col gap-1">
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={link.exact ? { exact: true } : undefined}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent/50 hover:text-foreground"
                activeProps={{ className: "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" }}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
