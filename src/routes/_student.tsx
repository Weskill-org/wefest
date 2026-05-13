import { createFileRoute, Outlet, redirect, Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, CalendarRange, Ticket, Users, 
  ShoppingBag, Settings, Menu, X, LogOut, 
  ChevronLeft, ChevronRight, GraduationCap, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_student")({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    // Try session first, fall back to getUser for reliability
    const { data: { session } } = await supabase.auth.getSession();
    let currentUser = session?.user ?? null;
    
    if (!currentUser) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUser = user;
    }

    if (!currentUser) {
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
        .eq("id", currentUser.id)
        .maybeSingle();
      profile = data;
    } catch (e) {}

    return {
      user: currentUser,
      profile
    };
  },
  component: StudentLayout,
});

const navLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/explore", label: "Explore Fests", icon: CalendarRange, exact: false },
  { to: "/tickets", label: "My Tickets", icon: Ticket, exact: false },
  { to: "/social", label: "Campus Network", icon: Users, exact: false },
  { to: "/shop", label: "Campus Store", icon: ShoppingBag, exact: false },
  { to: "/wallet", label: "WeCoin Wallet", icon: Coins, exact: false },
];

function StudentLayout() {
  const ctx = Route.useRouteContext() as any;
  const user = ctx?.user as any;
  const profile = ctx?.profile as any;
  
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

  const NavItem = ({ link, onClick }: { link: typeof navLinks[0]; onClick?: () => void }) => {
    const isActive = link.exact
      ? matchRoute({ to: link.to, fuzzy: false })
      : matchRoute({ to: link.to, fuzzy: true });

    return (
      <Link
        to={link.to}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 relative group",
          collapsed && "justify-center px-2.5",
          isActive
            ? "bg-brand-gradient text-white shadow-glow font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        )}
      >
        <link.icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
        {!collapsed && <span className="truncate">{link.label}</span>}
        {isActive && !collapsed && (
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/40" />
        )}
      </Link>
    );
  };

  const settingsActive = matchRoute({ to: "/settings", fuzzy: false });

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      {/* Brand / Profile Header */}
      <div className={cn("px-4 pt-5 pb-3", collapsed && "px-2.5")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xs shadow-lg overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={studentName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate leading-tight">{studentName}</div>
              <div className="text-[10px] text-muted-foreground font-medium truncate leading-tight mt-0.5">{collegeName}</div>
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className={cn("mx-4 border-t border-white/5 my-1", collapsed && "mx-2.5")} />

      {/* Navigation */}
      <nav className={cn("flex-1 px-3 py-3 space-y-0.5 overflow-y-auto hide-scrollbar", collapsed && "px-2")}>
        {navLinks.map((link) => (
          <NavItem key={link.to} link={link} onClick={onNavigate} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={cn("px-3 pb-2 space-y-0.5", collapsed && "px-2")}>
        {/* Settings */}
        <Link
          to="/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 group",
            collapsed && "justify-center px-2.5",
            settingsActive
              ? "bg-brand-gradient text-white shadow-glow font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <Settings className={cn("h-[18px] w-[18px] shrink-0 transition-colors", settingsActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* Footer */}
      <div className={cn("border-t border-white/5 px-4 py-3", collapsed && "px-2.5")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-7 w-7 shrink-0 rounded-lg bg-white/5 flex items-center justify-center">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-muted-foreground">Student Portal</div>
              <button 
                onClick={signOut} 
                className="text-[10px] text-muted-foreground/60 hover:text-destructive font-medium flex items-center gap-1 transition-colors"
              >
                <LogOut className="h-2.5 w-2.5" /> Sign out
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
        "hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-white/5 bg-background/95 backdrop-blur-2xl transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}>
        <SidebarInner />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 h-6 w-6 rounded-full border border-white/10 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all shadow-sm"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] border-r border-white/5 bg-background shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300 flex flex-col",
        collapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"
      )}>
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-background/90 backdrop-blur-xl px-4 py-2.5 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-[9px] font-bold shrink-0 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={studentName} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold truncate block leading-tight">{studentName}</span>
              <span className="text-[10px] text-muted-foreground font-medium truncate block leading-tight">{collegeName}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
