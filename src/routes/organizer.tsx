import { createFileRoute, Outlet, redirect, Link, useMatchRoute, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getAuthSession, canAccessOrganizerPortal } from "@/lib/auth";
import { Clock, LayoutDashboard, CalendarPlus, CalendarRange, ScanLine, Users, BadgeCheck, Menu, X, LogOut, ChevronLeft, ChevronRight, Settings, BarChart3, IndianRupee, ShoppingBag, Zap, ImageIcon, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { ActivityFeedPopover } from "@/components/activity-feed-popover";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/organizer")({
  head: () => ({ 
    meta: [
      { title: "Organizer Dashboard — WeFest" }, 
      { name: "description", content: "Professional event management suite for college festivals." }
    ] 
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    const session = await getAuthSession();
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname + location.searchStr },
      });
    }
    
    const currentUser = session.user;

    // Fetch college membership
    let { data: membership } = await supabase
      .from("college_members")
      .select(`
        *,
        colleges (id, name, status)
      `)
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (!canAccessOrganizerPortal(session.role, membership)) {
      throw redirect({ to: "/" });
    }

    // Fallback: college account holders may need membership auto-repair.
    if (session.role === "college" && !membership?.colleges) {
      const userCollegeName = session.user.user_metadata?.full_name;
      if (userCollegeName) {
        const { data: collegeByName } = await supabase
          .from("colleges")
          .select("id, name, status")
          .eq("name", userCollegeName)
          .maybeSingle();

        if (collegeByName) {
          // Auto-repair: create the missing college_members record
          const { data: newMember } = await supabase
            .from("college_members")
            .upsert({
              college_id: collegeByName.id,
              user_id: session.user.id,
              role: "admin" as any,
              is_approved: true,
            }, { onConflict: "college_id,user_id" })
            .select(`*, colleges (id, name, status)`)
            .maybeSingle();

          membership = newMember || {
            role: "admin",
            is_approved: true,
            college_id: collegeByName.id,
            colleges: collegeByName,
          } as any;
        }
      }
    }

    return {
      user: session.user,
      membership
    };
  },
  component: OrganizerLayout,
});

const sidebarLinks = [
  { to: "/organizer", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/organizer/events", label: "Events", icon: CalendarRange },
  { to: "/organizer/messages", label: "Messages", icon: MessageSquare },
  { to: "/organizer/new", label: "Create Event", icon: CalendarPlus },
  { to: "/organizer/scan", label: "Scan Tickets", icon: ScanLine },
  { to: "/organizer/team", label: "Team", icon: Users },
  { to: "/organizer/sponsor-assets", label: "Sponsor Assets", icon: ImageIcon },
  { to: "/organizer/activity", label: "Recent Activity", icon: Bell },
  { to: "/organizer/alerts", label: "Alerts", icon: Bell, badge: true },
];

function OrganizerLayout() {
  const ctx = Route.useRouteContext() as any;
  const membership = ctx?.membership;
  const user = ctx?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const { data: alertsData } = useQuery({
    queryKey: ["organizer-unread-alerts-count"],
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

  if (membership && !membership.is_approved) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
          <Clock className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-3">Membership Pending</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your request to join <strong>{membership.colleges?.name}</strong> is currently pending approval from the College Admin.
        </p>
        <Button variant="ghost" className="mt-8 text-primary font-bold" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const collegeName = membership?.colleges?.name || user?.user_metadata?.full_name || "Organizer";
  const isVerified = membership?.colleges?.status === "approved";
  const initials = collegeName.substring(0, 2).toUpperCase();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const routerState = useRouterState();
  const eventMatch = routerState.matches.find((m: any) => m.routeId === "/organizer/events/$eventId");

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn("flex items-center gap-3 px-5 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-4", collapsed && "justify-center px-3")}>
        <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-sm shadow-glow">
          {initials}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold truncate">Organizer</span>
              {isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" />}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{collegeName}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-border/50 my-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <div className="relative shrink-0">
                <link.icon className={cn("h-[18px] w-[18px] transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {(link as any).badge && totalAlertsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                    {totalAlertsCount > 9 ? "9+" : totalAlertsCount}
                  </span>
                )}
              </div>
              {!collapsed && <span className="truncate flex-1">{link.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {/* Contextual Event Link */}
        {(() => {
          if (eventMatch) {
            const eventId = (eventMatch?.params as any)?.eventId;
            if (!eventId) return null;
            
            const isConsoleActive = !!matchRoute({ to: "/organizer/events/$eventId", fuzzy: false });
            const search = (Route.useSearch() as any);
            const activeTab = search?.tab || "analytics";
            
            const eventSubLinks = [
              { tab: "analytics", label: "Analytics", icon: BarChart3 },
              { tab: "sponsors", label: "Sponsors", icon: Zap },
              { tab: "volunteers", label: "Volunteers", icon: Users },
              { tab: "finance", label: "Finance", icon: IndianRupee },
              { tab: "merch", label: "Merchandise", icon: ShoppingBag },
            ];

            return (
              <div className="pt-4 mt-4 border-t border-border/40">
                {!collapsed && (
                  <div className="px-3 mb-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Current Fest
                  </div>
                )}
                <Link
                  to="/organizer/events/$eventId"
                  params={{ eventId }}
                  search={{ tab: "analytics" }}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-2",
                    isConsoleActive && activeTab === "analytics"
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <LayoutDashboard className={cn("h-[18px] w-[18px] shrink-0", isConsoleActive && activeTab === "analytics" && "text-primary")} />
                  {!collapsed && <span>Event Console</span>}
                </Link>

                {!collapsed && (
                  <div className="mt-1 space-y-1 ml-4 pl-4 border-l border-border/40">
                    {eventSubLinks.map((sub) => {
                      const isSubActive = isConsoleActive && activeTab === sub.tab;
                      return (
                        <Link
                          key={sub.tab}
                          to="/organizer/events/$eventId"
                          params={{ eventId }}
                          search={{ tab: sub.tab }}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200",
                            isSubActive
                              ? "text-primary bg-primary/5 font-bold"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                          )}
                        >
                          <sub.icon className={cn("h-3.5 w-3.5", isSubActive && "text-primary")} />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })()}
      </nav>

      {/* Settings Link */}
      <div className={cn("px-3 pb-2", collapsed && "px-2")}>
        <Link
          to="/organizer/settings"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            collapsed && "justify-center px-2",
            matchRoute({ to: "/organizer/settings", fuzzy: false })
              ? "bg-primary/10 text-primary font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Settings className={cn("h-[18px] w-[18px] shrink-0", matchRoute({ to: "/organizer/settings", fuzzy: false }) && "text-primary")} />
          {!collapsed && <span>Settings</span>}
          {matchRoute({ to: "/organizer/settings", fuzzy: false }) && !collapsed && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </Link>
      </div>

      {/* Footer */}
      <div className={cn("border-t border-border/50 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]", collapsed && "p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-muted text-xs font-bold">
              {(user?.user_metadata?.full_name || user?.email || "U").substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate">{user?.user_metadata?.full_name || user?.email}</div>
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
      <style dangerouslySetInnerHTML={{ __html: `
        input[type="date"] {
          position: relative !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0 !important;
          cursor: pointer !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        input, textarea, select {
          color-scheme: dark !important;
        }
      `}} />
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
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-[10px] font-black shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold truncate">Organizer</span>
                {isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" />}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium truncate">{collegeName}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {/* @ts-ignore */}
          <Outlet context={{ user, membership } as any} />
        </div>
      </main>
    </div>
  );
}
