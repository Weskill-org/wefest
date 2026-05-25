import { createFileRoute, Outlet, redirect, Link, useMatchRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getAuthSession } from "@/lib/auth";
import {
  LayoutDashboard, Search, ScanLine, Settings, Menu, X,
  LogOut, ChevronLeft, ChevronRight, Building2, Briefcase, Handshake, ImageIcon, Bell, MessageSquare, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const sidebarLinks = [
  { to: "/company", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/company/proposals", label: "Proposals", icon: Handshake },
  { to: "/company/messages", label: "Messages", icon: MessageSquare },
  { to: "/company/marketplace", label: "Marketplace", icon: Search },
  { to: "/company/scan", label: "Booth Scanner", icon: ScanLine },
  { to: "/company/brand-assets", label: "Brand Assets", icon: ImageIcon },
  { to: "/company/alerts", label: "Alerts", icon: Bell, badge: true },
];

const bottomLinks = [
  { to: "/company/settings", label: "Settings", icon: Settings },
];


function CompanyLayout() {
  const ctx = (Route as any).useRouteContext();
  const user = ctx?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: alertsData } = useQuery({
    queryKey: ["company-unread-alerts-count"],
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

  const companyName = companyProfile?.company_name || user?.user_metadata?.full_name || "Company";
  const industry = companyProfile?.industry || "Brand";
  const initials = companyName.substring(0, 2).toUpperCase();
  const isApproved = companyProfile?.status === "approved";

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

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
        {isActive && !collapsed && (
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/40" />
        )}
      </Link>
    );
  };

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className={cn("px-4 pb-3 pt-[calc(1.25rem+env(safe-area-inset-top))]", collapsed && "px-2.5")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-sm shadow-glow">
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold truncate">{companyName}</span>
                {isApproved && (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] px-1.5 py-0">
                    Verified
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{industry}</span>
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className={cn("mx-4 border-t border-white/5 my-1", collapsed && "mx-2.5")} />

      {/* Navigation */}
      <nav className={cn("flex-1 px-3 py-3 space-y-0.5 overflow-y-auto hide-scrollbar", collapsed && "px-2")}>
        {sidebarLinks.map((link) => (
          <NavItem key={link.to} link={link} onClick={onNavigate} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className={cn("px-3 py-3 space-y-0.5 border-t border-white/5", collapsed && "px-2")}>
        {bottomLinks.map((link) => (
          <NavItem key={link.to} link={link} onClick={onNavigate} />
        ))}
      </div>

      {/* Footer */}
      <div className={cn("border-t border-white/5 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]", collapsed && "px-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom))]")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-7 w-7 shrink-0 rounded-lg bg-white/5 flex items-center justify-center">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-muted-foreground">Company Portal</div>
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
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-white/5 bg-background/95 backdrop-blur-2xl transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[250px]"
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
        "flex-1 h-full transition-all duration-300 flex flex-col overflow-hidden",
        collapsed ? "lg:ml-[68px]" : "lg:ml-[250px]"
      )}>
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-background/90 backdrop-blur-xl px-4 pb-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))] lg:hidden shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-[9px] font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold truncate block leading-tight">{companyName}</span>
              <span className="text-[10px] text-muted-foreground font-medium truncate block leading-tight">{industry}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto native-scroll pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "Company Portal — WeFest" },
      { name: "description", content: "Manage sponsorships, track ROI, and connect with college festivals." }
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

    if (session.role !== "company") {
      throw redirect({ to: '/' });
    }

    return { user: session.user };
  },
  component: CompanyLayout,
});
