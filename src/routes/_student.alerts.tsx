import { useState } from "react";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Bell, BellOff, CheckCheck, Loader2, Info, AlertCircle,
  Gift, Ticket, Megaphone, Tag, Filter, Users, CheckCircle2, XCircle, Crown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  friendlyTeamInviteError,
  teamRoleLabel,
  type AcceptTeamInvitationResult,
} from "@/lib/team-invitations";

export const Route = createFileRoute("/_student/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — WeFest" },
      { name: "description", content: "Your WeFest notifications, alerts and important updates." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: location.pathname + location.search } });
  },
  component: AlertsPage,
});

type NotificationType = "all" | "unread" | "event" | "promo" | "system";

const notificationTypeIcon = (type: string) => {
  switch (type) {
    case "event": return Ticket;
    case "promo": return Tag;
    case "gift": return Gift;
    case "broadcast": return Megaphone;
    case "team_invite": return Users;
    case "team_update": return Crown;
    case "team_response": return CheckCircle2;
    case "join_request_accepted": return CheckCircle2;
    case "join_request_declined": return XCircle;
    default: return Info;
  }
};

const notificationTypeColor = (type: string) => {
  switch (type) {
    case "event": return "bg-blue-500/10 text-blue-400";
    case "promo": return "bg-amber-500/10 text-amber-400";
    case "gift": return "bg-emerald-500/10 text-emerald-400";
    case "broadcast": return "bg-purple-500/10 text-purple-400";
    case "team_invite": return "bg-violet-500/10 text-violet-400";
    case "team_update": return "bg-yellow-500/10 text-yellow-400";
    case "team_response": return "bg-emerald-500/10 text-emerald-400";
    case "join_request_accepted": return "bg-emerald-500/10 text-emerald-400";
    case "join_request_declined": return "bg-red-500/10 text-red-400";
    default: return "bg-white/5 text-muted-foreground";
  }
};

function AlertsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<NotificationType>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["student-alerts"],
    queryFn: async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) throw new Error("Not authenticated");
        const user = userData.user;

        const { data: notifications, error } = await supabase
          .from("notification_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return { notifications: notifications || [] };
      } catch (e: any) {
        console.error("Error fetching alerts:", e);
        throw e;
      }
    },
  });

  const respondInviteMutation = useMutation({
    mutationFn: async ({ invitationId, accept, collegeName }: { invitationId: string; accept: boolean; collegeName?: string }) => {
      const fn = accept ? "accept_team_invitation" : "decline_team_invitation";
      const { data, error } = await supabase.rpc(fn as any, { _invitation_id: invitationId });
      if (error) throw error;
      return { accept, data: data as AcceptTeamInvitationResult | { ok: boolean; college_name?: string } | null, collegeName };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["student-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["student-unread-alerts-count"] });
      queryClient.invalidateQueries({ queryKey: ["student-unread-alerts-count"] });
      queryClient.invalidateQueries({ queryKey: ["student-memberships"] });

      if (result.accept) {
        const payload = result.data as AcceptTeamInvitationResult | null;
        const college = payload?.college_name || result.collegeName || "the committee";
        const roleLabel = payload?.role_label || teamRoleLabel(payload?.role || "member", payload?.position);
        toast.success(`You're on the ${college} team`, {
          description: `Your role: ${roleLabel}. Use Committees or Team tools when you need organizer access.`,
          duration: 6000,
        });
      } else {
        const college = (result.data as { college_name?: string })?.college_name || result.collegeName || "the committee";
        toast.success("Invitation declined", {
          description: `Your response was sent to ${college}.`,
        });
      }
    },
    onError: (e: any) => toast.error(friendlyTeamInviteError(e.message)),
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string | "all") => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (id === "all") {
        const { error } = await supabase
          .from("notification_logs")
          .update({ is_read: true })
          .eq("user_id", user.id)
          .eq("is_read", false);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("notification_logs")
          .update({ is_read: true })
          .eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["student-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["student-unread-alerts-count"] });
      if (id === "all") toast.success("All notifications marked as read");
    },
    onError: () => toast.error("Failed to update notification"),
  });

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const filtered = notifications.filter((n: any) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    return (n.type || "system") === filter;
  });

  const filters: { key: NotificationType; label: string; count?: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "event", label: "Events" },
    { key: "promo", label: "Promos" },
    { key: "system", label: "System" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground">Loading alerts…</p>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[800px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="relative h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Alerts</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Stay on top of events, promos, and platform updates.
          </p>
        </div>

        {/* Mark All Read */}
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold gap-1.5 h-8 shrink-0"
            onClick={() => markReadMutation.mutate("all")}
            disabled={markReadMutation.isPending}
          >
            {markReadMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCheck className="h-3 w-3" />
            )}
            Mark all read
          </Button>
        )}
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: notifications.length, icon: Bell, color: "text-foreground" },
          { label: "Unread", value: unreadCount, icon: AlertCircle, color: "text-primary" },
          { label: "Read", value: notifications.length - unreadCount, icon: CheckCheck, color: "text-emerald-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5",
              filter === f.key
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-white/5 text-muted-foreground hover:border-white/10 hover:text-foreground"
            )}
          >
            {f.label}
            {f.count !== undefined && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-md text-[8px] font-bold",
                filter === f.key ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
              )}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-white/10 py-20 px-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <BellOff className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <h3 className="font-semibold text-base mb-2">No alerts yet</h3>
          <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
            You're all caught up! Alerts about events and promos will appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No {filter} notifications yet.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden divide-y divide-white/5">
          {filtered.map((n: any) => {
            const isInvite = n.type === "team_invite";
            const isJoinAccepted = n.type === "join_request_accepted";
            const inviteMeta = isInvite ? (n.metadata || {}) : null;
            const joinMeta = isJoinAccepted ? (n.metadata || {}) : null;
            const alreadyResponded = inviteMeta?.responded;
            const IconComp = notificationTypeIcon(n.type || "system");
            const iconColor = notificationTypeColor(n.type || "system");

            return (
              <div
                key={n.id}
                className={cn(
                  "flex gap-4 px-5 py-4 transition-all group",
                  isInvite && !alreadyResponded ? "bg-violet-500/[0.04] hover:bg-violet-500/[0.07]" :
                  isJoinAccepted && !n.is_read ? "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]" :
                  !n.is_read ? "bg-primary/[0.03] hover:bg-primary/[0.05]" : "hover:bg-white/[0.02]"
                )}
              >
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  !n.is_read ? iconColor : "bg-white/5 text-muted-foreground"
                )}>
                  <IconComp className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className={cn("text-sm font-semibold leading-tight", !n.is_read ? "text-foreground" : "text-foreground/80")}>
                      {n.title || "Notification"}
                    </div>
                    {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>

                  {n.body && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>}

                  {isJoinAccepted && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="h-8 rounded-lg bg-brand-gradient text-white font-bold text-xs"
                        asChild
                      >
                        <Link to="/committees" onClick={() => markReadMutation.mutate(n.id)}>
                          View Committees
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg border-amber-500/30 text-amber-400 font-bold text-xs"
                        asChild
                      >
                        <Link to="/organizer/team" onClick={() => markReadMutation.mutate(n.id)}>
                          Open Team Tools
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* Invite action card */}
                  {isInvite && !alreadyResponded && inviteMeta?.invitation_id && (
                    <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                        {inviteMeta.college_name && <span className="font-bold text-foreground">{inviteMeta.college_name}</span>}
                        {inviteMeta.position && <><span>·</span><span className="font-semibold text-violet-400">{inviteMeta.position}</span></>}
                        {inviteMeta.role && (
                          <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-bold uppercase text-[9px] tracking-wider">
                            {teamRoleLabel(inviteMeta.role, inviteMeta.position)}
                          </span>
                        )}
                      </div>
                      {inviteMeta.message && (
                        <p className="text-[11px] text-muted-foreground italic border-l-2 border-violet-500/30 pl-2">&ldquo;{inviteMeta.message}&rdquo;</p>
                      )}
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5 flex-1"
                          onClick={() => {
                            respondInviteMutation.mutate({
                              invitationId: inviteMeta.invitation_id,
                              accept: true,
                              collegeName: inviteMeta.college_name,
                            });
                            markReadMutation.mutate(n.id);
                          }}
                          disabled={respondInviteMutation.isPending}
                        >
                          {respondInviteMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle2 className="h-3 w-3" /> Accept</>}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs gap-1.5 flex-1"
                          onClick={() => {
                            respondInviteMutation.mutate({
                              invitationId: inviteMeta.invitation_id,
                              accept: false,
                              collegeName: inviteMeta.college_name,
                            });
                            markReadMutation.mutate(n.id);
                          }}
                          disabled={respondInviteMutation.isPending}
                        >
                          <XCircle className="h-3 w-3" /> Decline
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[10px] text-muted-foreground/50 font-medium">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </div>
                    {!n.is_read && (
                      <button onClick={() => markReadMutation.mutate(n.id)} className="text-[10px] text-primary/70 hover:text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all">
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
