
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, UserPlus, ShieldCheck, Ticket, Trash2,
  CheckCircle2, XCircle, Loader2, Crown, UserCog,
  Mail, Search, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/team")({
  component: TeamManagement,
});

/* ─── Add Member Dialog ─── */
function AddMemberDialog({ collegeId, onClose }: { collegeId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("member");
  const [position, setPosition] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchUser = async () => {
    if (!email.trim()) return;
    setSearching(true);
    setNotFound(false);
    setSearchResult(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
    } else {
      // Check if already a member
      const { data: existing } = await supabase
        .from("college_members")
        .select("id")
        .eq("college_id", collegeId)
        .eq("user_id", data.user_id)
        .maybeSingle();

      if (existing) {
        toast.error("This user is already a member of your college");
        setSearchResult(null);
      } else {
        setSearchResult(data);
      }
    }
    setSearching(false);
  };

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!searchResult) throw new Error("No user selected");
      const { error } = await supabase.from("college_members").insert({
        college_id: collegeId,
        user_id: searchResult.user_id,
        role: role as any,
        position: position.trim() || null,
        is_approved: true,
      });
      if (error) throw error;

      // Send notification to the student
      const { data: college } = await supabase
        .from("colleges")
        .select("name")
        .eq("id", collegeId)
        .single();

      await supabase.from("notification_logs").insert({
        user_id: searchResult.user_id,
        title: "New Team Position",
        body: `You have been selected as ${position.trim() || role} for ${college?.name || "the committee"}. Congratulations!`,
        metadata: { type: "team_assignment", college_id: collegeId, role, position }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-team"] });
      toast.success(`${searchResult.full_name || searchResult.email} added to team`);
      onClose();
    },
    onError: (e: any) => toast.error(e.message || "Failed to add member"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black tracking-tight">Add Team Member</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email Search */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="member@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setNotFound(false); setSearchResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && searchUser()}
                className="h-11 rounded-xl border-border/50 bg-muted/5"
              />
              <Button
                type="button"
                onClick={searchUser}
                disabled={searching || !email.trim()}
                className="h-11 rounded-xl bg-brand-gradient text-white font-bold px-4 shrink-0"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Not Found */}
          {notFound && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
              <p className="text-sm font-bold text-amber-500">User not found</p>
              <p className="text-xs text-muted-foreground mt-1">
                They must have a WeFest account first. Ask them to sign up, then try again.
              </p>
            </div>
          )}

          {/* Found User Card */}
          {searchResult && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
                  {(searchResult.full_name || searchResult.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{searchResult.full_name || "Unnamed"}</div>
                  <div className="text-xs text-muted-foreground truncate">{searchResult.email}</div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 ml-auto" />
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Assign Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "member", label: "Member", icon: Users, color: "text-muted-foreground" },
                    { value: "coordinator", label: "Coordinator", icon: ShieldCheck, color: "text-emerald-500" },
                    { value: "ticket_poc", label: "Ticket POC", icon: Ticket, color: "text-blue-500" },
                    { value: "admin", label: "Admin", icon: Crown, color: "text-yellow-500" },
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-bold transition-all",
                        role === r.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-muted/5 text-muted-foreground hover:bg-muted/20"
                      )}
                    >
                      <r.icon className={cn("h-4 w-4", role === r.value ? "text-primary" : r.color)} />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position Input */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Position Title</Label>
                <Input
                  placeholder="e.g. Head of Marketing, Volunteer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="h-11 rounded-xl border-border/50 bg-muted/5"
                />
                <p className="text-[10px] text-muted-foreground px-1">
                  This will be displayed as their official title in the team list.
                </p>
              </div>

              <Button
                onClick={() => addMutation.mutate()}
                disabled={addMutation.isPending}
                className="w-full h-11 bg-brand-gradient text-white rounded-xl font-bold shadow-glow"
              >
                {addMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" /> Add to Team
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
function TeamManagement() {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: collegeData, isLoading: loadingCollege } = useQuery({
    queryKey: ["my-college-data", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      const { data: memberData } = await supabase
        .from("college_members")
        .select(`*, colleges (id, name, city, domain, slug, status, fests, created_at)`)
        .eq("user_id", userData!.id)
        .maybeSingle();

      if (memberData?.colleges) {
        return {
          college: memberData.colleges as any,
          role: memberData.role as string,
          isApproved: memberData.is_approved as boolean,
          collegeId: (memberData.colleges as any).id,
        };
      }

      const userCollegeName = userData!.user_metadata?.full_name;
      if (userCollegeName) {
        const { data: collegeByName } = await supabase
          .from("colleges")
          .select("id, name, city, domain, slug, status, fests, created_at")
          .eq("name", userCollegeName)
          .maybeSingle();

        if (collegeByName) {
          await supabase.from("college_members").upsert({
            college_id: collegeByName.id,
            user_id: userData!.id,
            role: "admin" as any,
            is_approved: true,
          }, { onConflict: "college_id,user_id" });

          return { college: collegeByName, role: "admin", isApproved: true, collegeId: collegeByName.id };
        }
      }

      return {
        college: { id: null, name: userCollegeName || userData!.email || "My College", status: "pending" },
        role: "admin", isApproved: true, collegeId: null,
      };
    },
  });

  const { data: teamMembers, isLoading: loadingTeam } = useQuery({
    queryKey: ["college-team", collegeData?.collegeId],
    enabled: !!collegeData?.collegeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("college_members")
        .select(`*, profiles (full_name, email, avatar_url)`)
        .eq("college_id", collegeData!.collegeId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ memberId, updates, memberUserId, collegeName }: { memberId: string; updates: any; memberUserId?: string; collegeName?: string }) => {
      const { error } = await supabase.from("college_members").update(updates).eq("id", memberId);
      if (error) throw error;

      // If position or role is updated, notify the user
      if (memberUserId && (updates.position !== undefined || updates.role !== undefined)) {
        await supabase.from("notification_logs").insert({
          user_id: memberUserId,
          title: "Team Role Updated",
          body: `Your position at ${collegeName || "the committee"} has been updated to: ${updates.position || updates.role || "Member"}.`,
          metadata: { type: "team_update", role: updates.role, position: updates.position }
        });
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["college-team"] }); toast.success("Member updated"); },
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = collegeData?.role === "admin" && collegeData?.isApproved;
  const myCollegeName = collegeData?.college?.name || "Your College";
  const pendingRequests = teamMembers?.filter((m) => !m.is_approved) || [];
  const activeMembers = teamMembers?.filter((m) => m.is_approved) || [];

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your festival committee for <span className="font-bold text-foreground">{myCollegeName}</span>
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-brand-gradient text-white rounded-xl h-10 px-5 font-bold shadow-glow gap-2 text-sm"
          >
            <UserPlus className="h-4 w-4" /> Add Member
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</div>
          <div className="text-2xl font-black mt-1">{activeMembers.length}</div>
        </div>
        <div className="rounded-xl border border-border/50 bg-amber-500/5 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending</div>
          <div className="text-2xl font-black text-amber-500 mt-1">{pendingRequests.length}</div>
        </div>
        <div className="rounded-xl border border-border/50 bg-emerald-500/5 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Admins</div>
          <div className="text-2xl font-black text-emerald-500 mt-1">{activeMembers.filter((m) => m.role === "admin").length}</div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {/* Pending Requests */}
          {isAdmin && pendingRequests.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Join Requests</h2>
                <Badge className="bg-amber-500/20 text-amber-500 border-none text-[10px]">{pendingRequests.length}</Badge>
              </div>
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                        {((request as any).profiles?.full_name || "U").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{(request as any).profiles?.full_name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground truncate">{(request as any).profiles?.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 w-8 p-0"
                        onClick={() => updateMemberMutation.mutate({ 
                          memberId: request.id, 
                          updates: { is_approved: true },
                          memberUserId: request.user_id,
                          collegeName: myCollegeName
                        })}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="rounded-lg h-8 w-8 p-0"
                        onClick={() => removeMemberMutation.mutate(request.id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Active Committee */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Committee Members ({activeMembers.length})
            </h2>
            {activeMembers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/50 p-12 text-center">
                <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground">No team members yet</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add Member" to build your festival committee.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
                          {((member as any).profiles?.full_name || "U").charAt(0).toUpperCase()}
                        </div>
                        {member.role === "admin" && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center text-white border-2 border-background">
                            <Crown className="h-2 w-2" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm truncate">{(member as any).profiles?.full_name || "Unknown"}</span>
                          {member.user_id === userData?.id && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase px-1.5 py-0">You</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <RoleBadge role={member.role} />
                          {member.position && (
                            <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded-md border border-primary/10">
                              {member.position}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">{(member as any).profiles?.email}</span>
                        </div>
                      </div>
                    </div>

                    {isAdmin && member.user_id !== userData?.id && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Input
                          placeholder="Position"
                          className="h-8 w-32 text-[10px] font-bold bg-muted/20 border-border/40"
                          defaultValue={member.position || ""}
                          onBlur={(e) => {
                            if (e.target.value !== (member.position || "")) {
                              updateMemberMutation.mutate({ 
                                memberId: member.id, 
                                updates: { position: e.target.value },
                                memberUserId: member.user_id,
                                collegeName: myCollegeName
                              });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                        />
                        <select
                          className="bg-muted/30 border border-border/50 rounded-lg text-[10px] font-bold p-1.5 focus:ring-1 ring-primary h-8"
                          value={member.role}
                          onChange={(e) => updateMemberMutation.mutate({ 
                            memberId: member.id, 
                            updates: { role: e.target.value },
                            memberUserId: member.user_id,
                            collegeName: myCollegeName
                          })}
                        >
                          <option value="member">Member</option>
                          <option value="coordinator">Coordinator</option>
                          <option value="ticket_poc">Ticket POC</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button size="sm" variant="ghost"
                          className="text-muted-foreground hover:text-destructive rounded-lg h-8 w-8 p-0"
                          onClick={() => { if (confirm("Remove this member from the committee?")) removeMemberMutation.mutate(member.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-muted/10 p-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <UserCog className="h-4 w-4 text-primary" /> Role Privileges
            </h3>
            <div className="space-y-4">
              <RoleDetail icon={Crown} title="College Admin" color="text-yellow-500" desc="Full control over festivals, finances, and team." />
              <RoleDetail icon={ShieldCheck} title="Coordinator" color="text-emerald-500" desc="Manage festival content and sponsorships." />
              <RoleDetail icon={Ticket} title="Ticket POC" color="text-blue-500" desc="Access ticket inventory and check-ins." />
              <RoleDetail icon={Users} title="Member" color="text-muted-foreground" desc="View-only access to dashboard." />
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Dialog */}
      {showAddDialog && collegeData?.collegeId && (
        <AddMemberDialog collegeId={collegeData.collegeId} onClose={() => setShowAddDialog(false)} />
      )}
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
