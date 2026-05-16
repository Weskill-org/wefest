import { supabase } from "@/integrations/supabase/client";

export type CollegeTeamMember = {
  id: string;
  college_id: string;
  user_id: string;
  role: string;
  position: string | null;
  is_approved: boolean;
  created_at: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
};

export type CollegeTeamInvitation = {
  id: string;
  college_id: string;
  invitee_user_id: string;
  role: string;
  position: string | null;
  message?: string | null;
  status: string;
  created_at: string;
  responded_at: string | null;
  invitee_name: string;
  invitee_email: string;
};

type MemberContext = {
  currentUserId?: string;
  currentUserName?: string;
  currentUserEmail?: string;
};

function mapRpcMember(row: Record<string, unknown>): CollegeTeamMember {
  return {
    id: row.id as string,
    college_id: row.college_id as string,
    user_id: row.user_id as string,
    role: row.role as string,
    position: (row.position as string | null) ?? null,
    is_approved: row.is_approved as boolean,
    created_at: row.created_at as string,
    full_name: (row.full_name as string) || "Team Member",
    email: (row.email as string) || "",
    avatar_url: (row.avatar_url as string | null) ?? null,
  };
}

function enrichCurrentUser(
  member: CollegeTeamMember,
  ctx?: MemberContext
): CollegeTeamMember {
  if (!ctx?.currentUserId || member.user_id !== ctx.currentUserId) return member;
  return {
    ...member,
    full_name:
      ctx.currentUserName?.trim() ||
      member.full_name ||
      "Organizer",
    email: ctx.currentUserEmail?.trim() || member.email,
  };
}

/** Load team members (RPC with RLS-safe fallback). */
export async function fetchCollegeTeamMembers(
  collegeId: string,
  ctx?: MemberContext
): Promise<CollegeTeamMember[]> {
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_college_team_members",
    { _college_id: collegeId } as never
  );

  if (!rpcError && rpcData?.length) {
    const mapped = (rpcData as Record<string, unknown>[]).map((row) =>
      enrichCurrentUser(mapRpcMember(row), ctx)
    );
    return enrichUnresolvedMembers(mapped);
  }

  const { data: members, error } = await supabase
    .from("college_members")
    .select("*")
    .eq("college_id", collegeId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!members?.length) return [];

  const userIds = [...new Set(members.map((m) => m.user_id).filter(Boolean))] as string[];

  const [{ data: profiles }, { data: students }] = await Promise.all([
    supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds),
    supabase.from("student_profiles").select("id, full_name, avatar_url").in("id", userIds),
  ]);

  const profileByUser = new Map((profiles || []).map((p) => [p.user_id, p]));
  const studentByUser = new Map((students || []).map((s) => [s.id, s]));

  const mapped = members.map((m) => {
    const row = m as typeof m & { display_name?: string; display_email?: string; position?: string | null };
    const profile = m.user_id ? profileByUser.get(m.user_id) : undefined;
    const student = m.user_id ? studentByUser.get(m.user_id) : undefined;

    const member: CollegeTeamMember = {
      id: m.id,
      college_id: m.college_id!,
      user_id: m.user_id!,
      role: m.role,
      position: row.position ?? null,
      is_approved: m.is_approved,
      created_at: m.created_at,
      full_name:
        row.display_name?.trim() ||
        profile?.full_name?.trim() ||
        student?.full_name?.trim() ||
        "Team Member",
      email:
        row.display_email?.trim() ||
        profile?.email?.trim() ||
        "",
      avatar_url: student?.avatar_url ?? null,
    };
    return enrichCurrentUser(member, ctx);
  });

  return enrichUnresolvedMembers(mapped);
}

async function enrichUnresolvedMembers(members: CollegeTeamMember[]): Promise<CollegeTeamMember[]> {
  const stale = members.filter(
    (m) => m.full_name === "Team Member" || !m.email?.trim()
  );
  if (!stale.length) return members;

  await Promise.all(
    stale.map(async (m) => {
      const { data } = await supabase.rpc("resolve_team_member_display", {
        _user_id: m.user_id,
      } as never);
      const d = data as { full_name?: string; email?: string } | null;
      if (!d) return;
      if (d.full_name && m.full_name === "Team Member") m.full_name = d.full_name;
      if (d.email && !m.email?.trim()) m.email = d.email;
    })
  );
  return members;
}

/** Load invitations for a college with invitee display names. */
export async function fetchCollegeTeamInvitations(
  collegeId: string
): Promise<CollegeTeamInvitation[]> {
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_college_team_invitations",
    { _college_id: collegeId } as never
  );

  if (!rpcError && rpcData?.length) {
    return (rpcData as Record<string, unknown>[]).map((inv) => ({
      id: inv.id as string,
      college_id: inv.college_id as string,
      invitee_user_id: inv.invitee_user_id as string,
      role: inv.role as string,
      position: (inv.position as string | null) ?? null,
      message: (inv.message as string | null) ?? null,
      status: inv.status as string,
      created_at: inv.created_at as string,
      responded_at: (inv.responded_at as string | null) ?? null,
      invitee_name: (inv.invitee_name as string) || "Invited member",
      invitee_email: (inv.invitee_email as string) || "",
    }));
  }

  const { data: invitations, error } = await supabase
    .from("team_invitations" as never)
    .select("*")
    .eq("college_id", collegeId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!invitations?.length) return [];

  const userIds = [...new Set(invitations.map((i: { invitee_user_id: string }) => i.invitee_user_id).filter(Boolean))] as string[];

  const [{ data: profiles }, { data: students }] = await Promise.all([
    supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds),
    supabase.from("student_profiles").select("id, full_name").in("id", userIds),
  ]);

  const profileByUser = new Map((profiles || []).map((p) => [p.user_id, p]));
  const studentByUser = new Map((students || []).map((s) => [s.id, s]));

  return invitations.map((row: Record<string, unknown>) => {
    const inv = row as {
      id: string;
      college_id: string;
      invitee_user_id: string;
      role: string;
      position: string | null;
      message?: string | null;
      status: string;
      created_at: string;
      responded_at: string | null;
    };
    const profile = inv.invitee_user_id ? profileByUser.get(inv.invitee_user_id) : undefined;
    const student = inv.invitee_user_id ? studentByUser.get(inv.invitee_user_id) : undefined;
    return {
      id: inv.id,
      college_id: inv.college_id,
      invitee_user_id: inv.invitee_user_id,
      role: inv.role,
      position: inv.position,
      message: inv.message,
      status: inv.status,
      created_at: inv.created_at,
      responded_at: inv.responded_at,
      invitee_name:
        profile?.full_name?.trim() ||
        student?.full_name?.trim() ||
        "Invited member",
      invitee_email: profile?.email?.trim() || "",
    };
  });
}

/** Human-readable labels for team invitation toasts and UI */
export function teamRoleLabel(role: string, position?: string | null): string {
  const labels: Record<string, string> = {
    admin: "Admin",
    coordinator: "Coordinator",
    ticket_poc: "Ticket POC",
    member: "Member",
  };
  const roleLabel = labels[role] ?? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  if (position?.trim()) {
    return `${roleLabel} · ${position.trim()}`;
  }
  return roleLabel;
}

/** Short role label without position suffix (for badges) */
export function teamRoleBadge(role: string): string {
  const labels: Record<string, string> = {
    admin: "Admin",
    coordinator: "Coordinator",
    ticket_poc: "Ticket POC",
    member: "Member",
  };
  return labels[role] ?? role;
}

export function friendlyTeamInviteError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("no longer available") || m.includes("already responded")) {
    return "This invitation is no longer available. It may have already been accepted or declined.";
  }
  if (m.includes("must be signed in")) {
    return "Please sign in again, then try accepting the invitation.";
  }
  return message || "Something went wrong. Please try again.";
}

export type AcceptTeamInvitationResult = {
  ok: boolean;
  college_id: string;
  college_name: string;
  role: string;
  position?: string | null;
  role_label: string;
};
