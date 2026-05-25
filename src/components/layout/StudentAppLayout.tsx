import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useMatchRoute } from "@tanstack/react-router";
import { 
  LayoutDashboard, CalendarRange, Ticket, Users, 
  ShoppingBag, Settings, Menu, X, LogOut, 
  ChevronLeft, ChevronRight, GraduationCap, Sparkles, Coins,
  Bell, Image as ImageIcon, Award, BellRing, Gift, UsersRound
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface StudentAppLayoutProps {
  children: React.ReactNode;
  user: any;
  profile: any;
}

export function StudentAppLayout({ children, user, profile }: StudentAppLayoutProps) {
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const studentName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";
  const collegeName = profile?.colleges?.name || "Independent Student";
  const initials = studentName.substring(0, 2).toUpperCase();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const { data: alertsData } = useQuery({
    queryKey: ["student-unread-alerts-count"],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from("notification_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const totalAlertsCount = alertsData || 0;

  const navLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/fest", label: "Festivals", icon: CalendarRange, exact: false },
    { to: "/tickets", label: "My Tickets", icon: Ticket, exact: false },
    { to: "/social", label: "Campus Network", icon: Users, exact: false },
    { to: "/shop", label: "Campus Store", icon: ShoppingBag, exact: false },
    { to: "/wallet", label: "WeCoin Wallet", icon: Coins, exact: false },
    { to: "/referrals", label: "Refer & Earn", icon: Gift, exact: false },
    { to: "/activity", label: "Activity Feed", icon: Bell, exact: false },
    { to: "/memories", label: "Memories", icon: ImageIcon, exact: false },
    { to: "/certifications", label: "Certifications", icon: Award, exact: false },
    { to: "/committees", label: "Committees", icon: UsersRound, exact: false },
    { to: "/alerts", label: "Alerts", icon: BellRing, exact: false, badge: true },
  ];

  const NavItem = ({ link, onClick }: { link: any; onClick?: () => void }) => {
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
        <div className="relative shrink-0">
          <link.icon className={cn("h-[18px] w-[18px] transition-colors", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
          {link.badge && totalAlertsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
              {totalAlertsCount > 9 ? "9+" : totalAlertsCount}
            </span>
          )}
        </div>
        {!collapsed && <span className="truncate flex-1">{link.label}</span>}
      </Link>
    );
  };

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className={cn("px-4 pb-3 pt-[calc(1.25rem+env(safe-area-inset-top))]", collapsed && "px-2.5")}>
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
      <div className={cn("mx-4 border-t border-white/5 my-1", collapsed && "mx-2.5")} />
      <nav className={cn("flex-1 px-3 py-3 overflow-y-auto hide-scrollbar", collapsed && "px-2")}>
        <div className="space-y-0.5">
          {navLinks.map((link) => (
            <NavItem key={link.to} link={link} onClick={onNavigate} />
          ))}
        </div>
      </nav>
      <div className={cn("px-3 pb-2 space-y-0.5", collapsed && "px-2")}>
        <Link
          to="/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 group",
            collapsed && "justify-center px-2.5",
            matchRoute({ to: "/settings" })
              ? "bg-brand-gradient text-white shadow-glow font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
      <div className={cn("border-t border-white/5 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]", collapsed && "px-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom))]")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-7 w-7 shrink-0 rounded-lg bg-white/5 flex items-center justify-center">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-muted-foreground">Student Portal</div>
              <button onClick={signOut} className="text-[10px] text-muted-foreground/60 hover:text-destructive font-medium flex items-center gap-1 transition-colors">
                <LogOut className="h-2.5 w-2.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background flex overflow-hidden">
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

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] border-r border-white/5 bg-background shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-3 h-8 w-8 rounded-lg flex items-center justify-center">
              <X className="h-5 w-5" />
            </button>
            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className={cn(
        "flex-1 h-full transition-all duration-300 flex flex-col overflow-hidden",
        collapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"
      )}>
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-background/90 backdrop-blur-xl px-4 pb-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))] lg:hidden shrink-0">
          <button onClick={() => setMobileOpen(true)} className="h-9 w-9 rounded-lg flex items-center justify-center">
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
        <div className="flex-1 overflow-y-auto native-scroll pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
      </main>
    </div>
  );
}
