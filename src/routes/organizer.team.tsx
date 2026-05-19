import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, UserPlus, ShieldCheck, Ticket, Trash2,
  CheckCircle2, XCircle, Loader2, Crown, UserCog,
  Mail, Search, X, Send, Clock, Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  teamRoleLabel,
  fetchCollegeTeamMembers,
  fetchCollegeTeamInvitations,
  type CollegeTeamMember,
} from "@/lib/team-invitations";
import {
  fetchCollegeJoinRequests,
  acceptCollegeJoinRequest,
  declineCollegeJoinRequest,
  type CollegeJoinRequest,
} from "@/lib/college-join-requests";

export const Route = createFileRoute("/organizer/team")({ component: TeamManagement });

/* â”€â”€â”€ Invite Dialog â”€â”€â”€ */
function InviteDialog({ collegeId, collegeName, onClose }: { collegeId: string; collegeName: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!email.trim()) throw new Error("Email required");
      const { data, error } = await supabase.rpc("send_team_invitation", {
        _college_id: collegeId,
        _invitee_email: email.trim().toLowerCase(),
        _role: role,
        _position: position.trim() || null,
        _message: message.trim() || null,
      } as any);
      if (error) throw error;
      const result = data as any;

      // Send the email via Edge Function (fire and forget)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.functions.invoke("send-invite-email", {
          body: {
            invitation_id: result.invitation_id,
            invitee_email: result.invitee_email,
            company_name: result.college_name || collegeName,
            role: role,
            position: position.trim() || null,
            message: message.trim() || null,
            token: result.token,
            inviter_name: user?.user_metadata?.full_name || collegeName,
            type: "organizer",
          },
        });
      } catch (emailErr) {
        console.warn("Email send failed (invite still created):", emailErr);
      }

      console.log("Organizer Invitation link:", `${window.location.origin}/invite/accept?token=${result.token}`);

      return result;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["college-invitations"] });
      toast.success(`Invitation sent to ${data?.invitee_name || email}`, {
        description: `An email has been sent. The invite link has also been logged to your console for testing!`,
      });
      onClose();
    },
    onError: (e: any) => toast.error(e.message || "Failed to send invitation"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Send className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Invite Team Member</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">They'll receive an email with an invite link</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> Student Email
            </Label>
            <Input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && inviteMutation.mutate()}
              className="h-10 rounded-xl border-border/50 bg-muted/5 text-sm"
            />
            <p className="text-[10px] text-muted-foreground px-1">They don't need a WeFest account yet — they can sign up from the invite link.</p>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Role</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "member", label: "Member", icon: Users, color: "text-muted-foreground" },
                { value: "coordinator", label: "Coordinator", icon: ShieldCheck, color: "text-emerald-500" },
                { value: "ticket_poc", label: "Ticket POC", icon: Ticket, color: "text-blue-500" },
                { value: "admin", label: "Admin", icon: Crown, color: "text-yellow-500" },
              ].map((r) => (
                <button
                  key={r.value} type="button" onClick={() => setRole(r.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-bold transition-all",
                    role === r.value ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-muted/5 text-muted-foreground hover:bg-muted/20"
                  )}
                >
                  <r.icon className={cn("h-3.5 w-3.5", role === r.value ? "text-primary" : r.color)} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Position Title <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              placeholder="e.g. Head of Marketing, Volunteer"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="h-10 rounded-xl border-border/50 bg-muted/5 text-sm"
            />
          </div>

          {/* Personal Message */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Personal Note <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <textarea
              placeholder="Hey! We'd love to have you on our team for the upcoming fest..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-border/50 bg-muted/5 px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none transition-all"
            />
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-[11px]">
            <span className="font-bold text-primary">They will be assigned as: </span>
            <span className="text-foreground font-semibold">{teamRoleLabel(role, position)}</span>
            <span className="text-muted-foreground"> at {collegeName}</span>
          </div>

          <Button
            onClick={() => inviteMutation.mutate()}
            disabled={inviteMutation.isPending || !email.trim()}
            className="w-full h-11 bg-brand-gradient text-white rounded-xl font-bold shadow-glow"
          >
            {inviteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" />Send Invitation</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Main Page â”€â”€â”€ */
function TeamManagement() {
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [tab, setTab] = useState<"members" | "invitations" | "requests">("members");

  const { data: userData } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => { const { data: { user } } = await supabase.auth.getUser(); return user; }
  });

  const { data: collegeData, isLoading: loadingCollege } = useQuery({
    queryKey: ["my-college-data", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      const { data: memberData } = await supabase
        .from("college_members")
        .select(`*, colleges (id, name, city, status)`)
        .eq("user_id", userData!.id)
        .maybeSingle();

      if (memberData?.colleges) {
        return { college: memberData.colleges as any, role: memberData.role as string, isApproved: memberData.is_approved, collegeId: (memberData.colleges as any).id };
      }

      // Try to find ANY college membership for this user if maybeSingle failed (multi-membership)
      const { data: allMemberships } = await supabase
        .from("college_members")
        .select(`*, colleges (id, name, city, status)`)
        .eq("user_id", userData!.id);
      
      const adminMember = allMemberships?.find(m => m.role === 'admin');
      const approvedMember = allMemberships?.find(m => m.is_approved);
      const firstMember = approvedMember || adminMember || allMemberships?.[0];

      if (firstMember?.colleges) {
        return { college: firstMember.colleges as any, role: firstMember.role as string, isApproved: firstMember.is_approved, collegeId: (firstMember.colleges as any).id };
      }

      // Fallback: check metadata or create one
      const metadataCollegeName = userData!.user_metadata?.college_name;
      const userFullName = userData!.user_metadata?.full_name;
      const effectiveCollegeName = metadataCollegeName || (userFullName ? `${userFullName}'s College` : "My College");

      if (effectiveCollegeName) {
        const { data: col } = await supabase.from("colleges").select("id, name, status").eq("name", effectiveCollegeName).maybeSingle();
        if (col) {
          await supabase.from("college_members").upsert({ college_id: col.id, user_id: userData!.id, role: "admin" as any, is_approved: true }, { onConflict: "college_id,user_id" });
          return { college: col, role: "admin", isApproved: true, collegeId: col.id };
        }
      }
      return { college: { id: null, name: effectiveCollegeName, status: "pending" }, role: "admin", isApproved: true, collegeId: null };
    },
  });

  const {
    data: teamMembers,
    isLoading: loadingTeam,
    isError: teamError,
    error: teamLoadError,
    refetch: refetchTeam,
  } = useQuery({
    queryKey: ["college-team", collegeData?.collegeId],
    enabled: !!collegeData?.collegeId,
    queryFn: () =>
      fetchCollegeTeamMembers(collegeData!.collegeId!, {
        currentUserId: userData?.id,
        currentUserName: userData?.user_metadata?.full_name,
        currentUserEmail: userData?.email,
      }),
    refetchInterval: 15000,
  });

  const { data: invitations } = useQuery({
    queryKey: ["college-invitations", collegeData?.collegeId],
    enabled: !!collegeData?.collegeId,
    queryFn: () => fetchCollegeTeamInvitations(collegeData!.collegeId!),
    refetchInterval: 15000,
  });

  const { data: joinRequests } = useQuery({
    queryKey: ["college-join-requests", collegeData?.collegeId],
    enabled: !!collegeData?.collegeId,
    queryFn: () => fetchCollegeJoinRequests(collegeData!.collegeId!),
    refetchInterval: 15000,
  });

  // Live refresh when a student accepts/declines
  useEffect(() => {
    if (!collegeData?.collegeId) return;
    const channel = supabase
      .channel(`team-${collegeData.collegeId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "college_members", filter: `college_id=eq.${collegeData.collegeId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["college-team", collegeData.collegeId] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_invitations", filter: `college_id=eq.${collegeData.collegeId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["college-invitations", collegeData.collegeId] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "college_join_requests", filter: `college_id=eq.${collegeData.collegeId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["college-join-requests", collegeData.collegeId] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeData?.collegeId, queryClient]);

  const acceptRequestMutation = useMutation({
    mutationFn: (requestId: string) => acceptCollegeJoinRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-join-requests"] });
      queryClient.invalidateQueries({ queryKey: ["college-team"] });
      toast.success("Request accepted — member added to your team");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const declineRequestMutation = useMutation({
    mutationFn: (requestId: string) => declineCollegeJoinRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-join-requests"] });
      toast.success("Request declined");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelInviteMutation = useMutation({
    mutationFn: async (invId: string) => {
      const { error } = await supabase.rpc("cancel_team_invitation", { _invitation_id: invId } as any);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["college-invitations"] }); toast.success("Invitation cancelled"); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ memberId, updates, memberUserId }: { memberId: string; updates: any; memberUserId?: string }) => {
      const { error } = await supabase.from("college_members").update(updates).eq("id", memberId);
      if (error) throw error;
      if (memberUserId && (updates.position !== undefined || updates.role !== undefined)) {
        await supabase.from("notification_logs").insert({
          user_id: memberUserId,
          title: "Team Role Updated",
          body: `Your position at ${collegeData?.college?.name || "the committee"} has been updated to: ${updates.position || updates.role}.`,
          type: "team_update",
          metadata: { type: "team_update", role: updates.role, position: updates.position }
        } as any);
      }
    },
    onSuccess: async (_, { memberId }) => {
      try {
        await supabase.rpc("refresh_college_member_display", { _member_id: memberId } as never);
      } catch {
        /* optional until migration applied */
      }
      queryClient.invalidateQueries({ queryKey: ["college-team"] });
      toast.success("Member role updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase.from("college_members").delete().eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["college-team"] }); toast.success("Member removed"); },
    onError: (e: any) => toast.error(e.message),
  });

  if (loadingCollege || loadingTeam) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const isAdmin = collegeData?.role === "admin" && collegeData?.isApproved;
  const myCollegeName = collegeData?.college?.name || "Your College";
  const activeMembers = teamMembers?.filter((m) => m.is_approved) || [];
  const pendingInvites = invitations?.filter((i: any) => i.status === "pending") || [];
  const pendingJoinRequests = joinRequests?.filter((r) => r.status === "pending") || [];

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1100px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">Festival committee for <span className="font-bold text-foreground">{myCollegeName}</span></p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowInvite(true)} className="bg-brand-gradient text-white rounded-xl h-10 px-5 font-bold shadow-glow gap-2 text-sm">
            <Send className="h-4 w-4" /> Invite Member
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active</div>
          <div className="text-2xl font-black mt-1">{activeMembers.length}</div>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Incoming</div>
          <div className="text-2xl font-black text-violet-500 mt-1">{pendingJoinRequests.length}</div>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending Invites</div>
          <div className="text-2xl font-black text-amber-500 mt-1">{pendingInvites.length}</div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Admins</div>
          <div className="text-2xl font-black text-emerald-500 mt-1">{activeMembers.filter((m) => m.role === "admin").length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-muted/10 rounded-xl p-1 w-fit">
        {(["members", "requests", "invitations"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize flex items-center gap-2",
              tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "invitations" && pendingInvites.length > 0 && (
              <span className="h-4 w-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">{pendingInvites.length}</span>
            )}
            {t === "requests" && pendingJoinRequests.length > 0 && (
              <span className="h-4 w-4 rounded-full bg-violet-500 text-white text-[9px] font-black flex items-center justify-center">{pendingJoinRequests.length}</span>
            )}
            {t === "members" ? "Active Members" : t === "requests" ? "Incoming Requests" : "Invitations"}
          </button>
        ))}
      </div>

      {teamError && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-destructive">Could not load team members</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(teamLoadError as Error)?.message || "Check your connection and try again."}
            </p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0" onClick={() => refetchTeam()}>
            Retry
          </Button>
        </div>
      )}

      {tab === "members" && !teamError && (
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <section>
            {activeMembers.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border/50 p-16 text-center">
                <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground">No team members yet</p>
                <p className="text-xs text-muted-foreground mt-1">Invite members using the button above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeMembers.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    isYou={member.user_id === userData?.id}
                    isAdmin={!!isAdmin}
                    onUpdate={(updates) =>
                      updateMemberMutation.mutate({ memberId: member.id, updates, memberUserId: member.user_id })
                    }
                    onRemove={() => {
                      if (confirm(`Remove ${member.full_name} from the team?`)) removeMemberMutation.mutate(member.id);
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <div className="rounded-xl border border-border/50 bg-muted/10 p-5 h-fit">
            <h3 className="text-xs font-bold mb-4 flex items-center gap-2"><UserCog className="h-4 w-4 text-primary" /> Role Privileges</h3>
            <div className="space-y-4">
              <RoleDetail icon={Crown} title="Admin" color="text-yellow-500" desc="Full control over festivals, finance & team." />
              <RoleDetail icon={ShieldCheck} title="Coordinator" color="text-emerald-500" desc="Manage content and sponsorships." />
              <RoleDetail icon={Ticket} title="Ticket POC" color="text-blue-500" desc="Ticket inventory and check-ins." />
              <RoleDetail icon={Users} title="Member" color="text-muted-foreground" desc="View-only dashboard access." />
            </div>
          </div>
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-2">
          {!joinRequests?.filter((r) => r.status === "pending").length ? (
            <div className="rounded-2xl border-2 border-dashed border-border/50 p-16 text-center">
              <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-bold text-muted-foreground">No incoming requests</p>
              <p className="text-xs text-muted-foreground mt-1">Students can request to join from the Committees page.</p>
            </div>
          ) : (
            joinRequests!
              .filter((r) => r.status === "pending")
              .map((req: CollegeJoinRequest) => (
                <JoinRequestCard
                  key={req.id}
                  request={req}
                  isAdmin={!!isAdmin}
                  onAccept={() => acceptRequestMutation.mutate(req.id)}
                  onDecline={() => {
                    if (confirm(`Decline ${req.student_name}'s request?`)) declineRequestMutation.mutate(req.id);
                  }}
                  acceptPending={acceptRequestMutation.isPending}
                  declinePending={declineRequestMutation.isPending}
                />
              ))
          )}
        </div>
      )}

      {tab === "invitations" && (
        <div className="space-y-2">
          {!invitations || invitations.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border/50 p-16 text-center">
              <Send className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-bold text-muted-foreground">No invitations sent yet</p>
              <p className="text-xs text-muted-foreground mt-1">Use "Invite Member" to send your first invite.</p>
            </div>
          ) : (
            invitations.map((inv: any) => (
              <div key={inv.id} className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-colors",
                inv.status === "pending" ? "border-amber-500/20 bg-amber-500/5" :
                inv.status === "accepted" ? "border-emerald-500/20 bg-emerald-500/5" :
                "border-border/50 bg-muted/5 opacity-60"
              )}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                    inv.status === "pending" ? "bg-amber-500/10" : inv.status === "accepted" ? "bg-emerald-500/10" : "bg-muted/20"
                  )}>
                    {inv.status === "pending" ? <Clock className="h-4 w-4 text-amber-500" /> :
                     inv.status === "accepted" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                     inv.status === "declined" ? <XCircle className="h-4 w-4 text-destructive" /> :
                     <Ban className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm">{inv.invitee_name || "Invited member"}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2">
                      {inv.invitee_email ? <span className="truncate max-w-[180px]">{inv.invitee_email}</span> : null}
                      <span className="font-semibold text-foreground/80">{teamRoleLabel(inv.role, inv.position)}</span>
                      <span className={cn("px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[8px]",
                        inv.status === "pending" ? "bg-amber-500/15 text-amber-500" :
                        inv.status === "accepted" ? "bg-emerald-500/15 text-emerald-500" :
                        "bg-muted/30 text-muted-foreground"
                      )}>{inv.status}</span>
                      <span>{formatDistanceToNow(new Date(inv.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                {inv.status === "pending" && (
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 rounded-lg shrink-0"
                    onClick={() => { if (confirm("Cancel this invitation?")) cancelInviteMutation.mutate(inv.id); }}
                    disabled={cancelInviteMutation.isPending}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showInvite && collegeData?.collegeId && (
        <InviteDialog collegeId={collegeData.collegeId} collegeName={myCollegeName} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
}

function TeamMemberField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
        {label}
      </Label>
      {children}
    </div>
  );
}

const memberControlClass =
  "h-9 w-full rounded-lg border border-border/50 bg-muted/20 text-xs font-medium text-foreground shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50";

function TeamMemberCard({
  member,
  isYou,
  isAdmin,
  onUpdate,
  onRemove,
}: {
  member: CollegeTeamMember;
  isYou: boolean;
  isAdmin: boolean;
  onUpdate: (updates: { role?: string; position?: string }) => void;
  onRemove: () => void;
}) {
  const displayName = member.full_name || member.email?.split("@")[0] || "Team Member";
  const email = member.email?.trim();
  const showAdminControls = isAdmin && !isYou;
  const roleSummary = teamRoleLabel(member.role, member.position);

  return (
    <div className="rounded-xl border border-border/50 bg-muted/[0.03] hover:bg-muted/10 transition-colors">
      <div
        className={cn(
          "flex flex-col gap-4 p-4 sm:p-5",
          showAdminControls && "lg:flex-row lg:items-center lg:gap-8"
        )}
      >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
          {member.role === "admin" && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center border-2 border-background">
              <Crown className="h-2 w-2 text-white" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm truncate">{displayName}</span>
            {isYou && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase px-1.5 py-0">
                You
              </Badge>
            )}
            {!showAdminControls && <RoleBadge role={member.role} />}
          </div>
          {email ? (
            <a href={`mailto:${email}`} className="text-xs text-muted-foreground hover:text-primary truncate block">
              {email}
            </a>
          ) : (
            <span className="text-xs text-muted-foreground/60 italic">Email not on file</span>
          )}
          <p className="text-[10px] text-muted-foreground">
            {roleSummary}
            <span className="mx-1.5">·</span>
            Joined {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {showAdminControls && (
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px_auto] gap-3 sm:gap-4 items-end shrink-0 border-t border-border/30 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 lg:min-w-[min(100%,420px)]">
          <TeamMemberField label="Position title" className="sm:min-w-[180px] lg:min-w-[200px]">
            <Input
              placeholder="Head of Marketing"
              className={memberControlClass}
              defaultValue={member.position || ""}
              onBlur={(e) => {
                if (e.target.value !== (member.position || "")) onUpdate({ position: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
            />
          </TeamMemberField>
          <TeamMemberField label="Role">
            <select
              className={cn(memberControlClass, "cursor-pointer")}
              value={member.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="coordinator">Coordinator</option>
              <option value="ticket_poc">Ticket POC</option>
              <option value="admin">Admin</option>
            </select>
          </TeamMemberField>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-self-end sm:justify-self-auto"
            onClick={onRemove}
            title="Remove from team"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const configs: Record<string, { label: string; color: string }> = {
    admin: { label: "Admin", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    coordinator: { label: "Coordinator", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    ticket_poc: { label: "Ticket POC", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    member: { label: "Member", color: "bg-muted/50 text-muted-foreground border-border/50" },
  };
  const config = configs[role] || configs.member;
  return <Badge variant="outline" className={cn("uppercase text-[8px] font-black tracking-wider px-1.5 py-0", config.color)}>{config.label}</Badge>;
}

function RoleDetail({ icon: Icon, title, color, desc }: { icon: any; title: string; color: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className={cn("h-7 w-7 rounded-lg bg-muted/30 flex items-center justify-center shrink-0", color)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-xs font-bold">{title}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function JoinRequestCard({
  request,
  isAdmin,
  onAccept,
  onDecline,
  acceptPending,
  declinePending,
}: {
  request: CollegeJoinRequest;
  isAdmin: boolean;
  onAccept: () => void;
  onDecline: () => void;
  acceptPending: boolean;
  declinePending: boolean;
}) {
  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <JoinRequestCardBody request={request} />
        {isAdmin && (
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              className="h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5"
              onClick={onAccept}
              disabled={acceptPending || declinePending}
            >
              {acceptPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle2 className="h-3 w-3" /> Accept</>}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs"
              onClick={onDecline}
              disabled={acceptPending || declinePending}
            >
              <XCircle className="h-3 w-3 mr-1" /> Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function JoinRequestCardBody({ request }: { request: CollegeJoinRequest }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-sm font-black text-violet-400 shrink-0">
          {request.student_name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm">{request.student_name}</p>
          {request.student_email && (
            <p className="text-[10px] text-muted-foreground truncate">{request.student_email}</p>
          )}
          <p className="text-[10px] text-muted-foreground/50 mt-0.5">
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-l-2 border-violet-500/30 pl-3 italic">
        &ldquo;{request.pitch}&rdquo;
      </p>
    </div>
  );
}
