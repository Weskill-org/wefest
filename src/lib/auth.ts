import { supabase } from "@/integrations/supabase/client";

export type UserRole = "student" | "college" | "company" | "admin";

export interface AuthSession {
  user: any;
  role: UserRole;
  isAdmin: boolean;
}

/**
 * Gets the current authenticated session, including role and admin status.
 * Uses getUser() for maximum reliability.
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) return null;

  // Check admin table
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Check user roles table
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user,
    role: (roleData?.role as UserRole) || "student",
    isAdmin: !!adminData,
  };
}

/**
 * Returns the default dashboard path for a given role/admin status.
 */
export function getDashboardRedirect(role: UserRole, isAdmin: boolean): string {
  if (isAdmin) return "/admin";
  if (role === "company") return "/company";
  if (role === "college") return "/organizer";
  return "/dashboard";
}

/** Approved committee membership (student join flow) grants organizer portal access. */
export function canAccessOrganizerPortal(
  role: UserRole,
  membership: { is_approved?: boolean | null } | null | undefined
): boolean {
  if (role === "college") return true;
  return membership?.is_approved === true;
}

export async function getCollegeMembership(userId: string) {
  const { data } = await supabase
    .from("college_members")
    .select(`
      *,
      colleges (id, name, status)
    `)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

/** Bearer headers for authenticated serverFn calls (wallet pay, redeem, etc.). */
export async function getSupabaseAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
