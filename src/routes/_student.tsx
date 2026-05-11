import { createFileRoute, Outlet, redirect, Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, CalendarRange, Ticket, Users, 
  ShoppingBag, Settings, Menu, X, LogOut, 
  ChevronLeft, ChevronRight, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Route = createFileRoute("/_student")({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }

    // Fetch student profile to get college details
    let profile = null;
    try {
      const { data } = await supabase
        .from("student_profiles")
        .select(`
          *,
          colleges (id, name)
        `)
        .eq("user_id", session.user.id)
        .maybeSingle();
      profile = data;
    } catch (e) {}

    return {
      user: session.user,
      profile
    };
  },
  component: StudentLayout,
});

const sidebarLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/events", label: "Explore Fests", icon: CalendarRange, exact: false },
  { to: "/tickets", label: "My Tickets", icon: Ticket, exact: false },
  { to: "/social", label: "Campus Network", icon: Users, exact: false },
  { to: "/shop", label: "Campus Store", icon: ShoppingBag, exact: false },
];

function StudentLayout() {
  const ctx = Route.useRouteContext();
  const user = ctx.user as any;
  const profile = ctx.profile as any;
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const studentName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";
  const collegeName = profile?.colleges?.name || "Independent Student";
  const initials = studentName.substring(0, 2).toUpperCase();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn("flex items-center gap-3 px-5 pt-6 pb-4", collapsed && "justify-center px-3")}>
        <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-sm shadow-glow overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={studentName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold truncate">{studentName}</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest truncate block">
              {collegeName}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-border/50 my-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hide-scrollbar">
        {sidebarLinks.map((link) => {
          const isActive = link.exact
            ? matchRoute({ to: link.to, fuzzy: false })
            : matchRoute({ to: link.to, fuzzy: true });

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <link.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{link.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings Link */}
      <div className={cn("px-3 pb-2", collapsed && "px-2")}>
        <Link
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            collapsed && "justify-center px-2",
            matchRoute({ to: "/settings", fuzzy: false })
              ? "bg-primary/10 text-primary font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Settings className={cn("h-[18px] w-[18px] shrink-0", matchRoute({ to: "/settings", fuzzy: false }) && "text-primary")} />
          {!collapsed && <span>Settings</span>}
          {matchRoute({ to: "/settings", fuzzy: false }) && !collapsed && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </Link>
      </div>

      {/* Footer */}
      <div className={cn("border-t border-border/50 p-4", collapsed && "p-3")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate">Student Portal</div>
              <button onClick={signOut} className="text-[10px] text-muted-foreground hover:text-destructive font-medium flex items-center gap-1 mt-0.5">
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border/60 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-border/50 bg-background shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300 flex flex-col",
        collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
      )}>
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-[10px] font-black shrink-0 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={studentName} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-sm font-bold truncate">{studentName}</span>
              <span className="text-[10px] text-muted-foreground font-medium truncate">{collegeName}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden">
          <Outlet context={{ user, profile }} />
        </div>
      </main>
    </div>
  );
}
