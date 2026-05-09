
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Ticket, 
  Activity, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Crown,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/team")({
  component: TeamManagement,
});

function TeamManagement() {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: myMembership, isLoading: loadingMembership } = useQuery({
    queryKey: ["my-membership", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("college_members")
        .select(`
          *,
          colleges (name)
        `)
        .eq("user_id", userData!.id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: teamMembers, isLoading: loadingTeam } = useQuery({
    queryKey: ["college-team", myMembership?.college_id],
    enabled: !!myMembership?.college_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("college_members")
        .select(`
          *,
          profiles (full_name, email, avatar_url)
        `)
        .eq("college_id", myMembership!.college_id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ memberId, updates }: { memberId: string, updates: any }) => {
      const { error } = await supabase
        .from("college_members")
        .update(updates)
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-team"] });
      toast.success("Member updated successfully");
    },
    onError: (error: any) => toast.error(error.message)
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("college_members")
        .delete()
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-team"] });
      toast.success("Member removed");
    },
    onError: (error: any) => toast.error(error.message)
  });

  if (loadingMembership || loadingTeam) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!myMembership) {
    return (
      <div className="px-6 py-20 text-center">
        <h1 className="text-xl font-bold">You are not associated with any college.</h1>
        <Link to="/signup" className="mt-4 inline-block text-primary text-sm">Go to Signup</Link>
      </div>
    );
  }

  const isAdmin = myMembership.role === 'admin' && myMembership.is_approved;
  const myCollegeName = myMembership.colleges?.name || "Your College";

  const pendingRequests = teamMembers?.filter(m => !m.is_approved) || [];
  const activeMembers = teamMembers?.filter(m => m.is_approved) || [];

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your festival committee and assign roles.</p>
        </div>
        {isAdmin && (
          <Button className="bg-brand-gradient text-white rounded-xl h-10 px-5 font-bold shadow-glow gap-2 text-sm">
            <UserPlus className="h-4 w-4" /> Invite Staff
          </Button>
        )}
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
                        {request.profiles?.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{request.profiles?.full_name}</div>
                        <div className="text-xs text-muted-foreground truncate">{request.profiles?.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button 
                        size="sm" 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 w-8 p-0"
                        onClick={() => updateMemberMutation.mutate({ memberId: request.id, updates: { is_approved: true } })}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="rounded-lg h-8 w-8 p-0"
                        onClick={() => removeMemberMutation.mutate(request.id)}
                      >
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
            <div className="space-y-2">
              {activeMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/5 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
                        {member.profiles?.full_name?.charAt(0) || "U"}
                      </div>
                      {member.role === 'admin' && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center text-white border-2 border-background">
                          <Crown className="h-2 w-2" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">{member.profiles?.full_name}</span>
                        {member.user_id === userData?.id && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase px-1.5 py-0">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RoleBadge role={member.role} />
                        <span className="text-[10px] text-muted-foreground">{member.profiles?.email}</span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && member.user_id !== userData?.id && (
                    <div className="flex items-center gap-2 shrink-0">
                      <select 
                        className="bg-muted/30 border border-border/50 rounded-lg text-xs font-bold p-1.5 focus:ring-1 ring-primary"
                        value={member.role}
                        onChange={(e) => updateMemberMutation.mutate({ memberId: member.id, updates: { role: e.target.value } })}
                      >
                        <option value="member">Member</option>
                        <option value="coordinator">Coordinator</option>
                        <option value="ticket_poc">Ticket POC</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-muted-foreground hover:text-destructive rounded-lg h-8 w-8 p-0"
                        onClick={() => {
                          if (confirm("Remove this member from the committee?")) {
                            removeMemberMutation.mutate(member.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Roles Sidebar */}
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
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const configs: Record<string, { label: string, color: string }> = {
    admin: { label: "Admin", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    coordinator: { label: "Coordinator", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    ticket_poc: { label: "Ticket POC", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    member: { label: "Member", color: "bg-muted/50 text-muted-foreground border-border/50" }
  };
  const config = configs[role] || configs.member;
  return <Badge variant="outline" className={cn("uppercase text-[8px] font-black tracking-wider px-1.5 py-0", config.color)}>{config.label}</Badge>;
}

function RoleDetail({ icon: Icon, title, color, desc }: { icon: any, title: string, color: string, desc: string }) {
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
