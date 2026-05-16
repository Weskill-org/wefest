import { supabase } from "@/integrations/supabase/client";

export type CollegeJoinRequest = {
  id: string;
  college_id: string;
  user_id: string;
  pitch: string;
  status: string;
  created_at: string;
  responded_at: string | null;
  student_name: string;
  student_email: string;
};

export type StudentJoinRequest = {
  id: string;
  college_id: string;
  pitch: string;
  status: string;
  created_at: string;
  responded_at: string | null;
  colleges?: { id: string; name: string; city: string | null } | null;
};

export async function fetchCollegeJoinRequests(
  collegeId: string
): Promise<CollegeJoinRequest[]> {
  const { data, error } = await supabase.rpc("get_college_join_requests", {
    _college_id: collegeId,
  } as never);

  if (error) throw error;
  if (!data?.length) return [];

  return (data as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    college_id: row.college_id as string,
    user_id: row.user_id as string,
    pitch: row.pitch as string,
    status: row.status as string,
    created_at: row.created_at as string,
    responded_at: (row.responded_at as string | null) ?? null,
    student_name: (row.student_name as string) || "Student",
    student_email: (row.student_email as string) || "",
  }));
}

export async function fetchStudentJoinRequests(
  userId: string,
  collegeId?: string | null
): Promise<StudentJoinRequest[]> {
  let query = supabase
    .from("college_join_requests" as never)
    .select("id, college_id, pitch, status, created_at, responded_at, colleges(id, name, city)")
    .eq("user_id", userId);

  if (collegeId) {
    query = query.eq("college_id", collegeId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as StudentJoinRequest[];
}

export async function submitCollegeJoinRequest(
  collegeId: string,
  pitch: string
): Promise<{ college_name?: string }> {
  const { data, error } = await supabase.rpc("submit_college_join_request", {
    _college_id: collegeId,
    _pitch: pitch,
  } as never);
  if (error) throw error;
  return (data as { college_name?: string }) || {};
}

export async function acceptCollegeJoinRequest(requestId: string): Promise<void> {
  const { error } = await supabase.rpc("accept_college_join_request", {
    _request_id: requestId,
    _role: "member",
    _position: null,
  } as never);
  if (error) throw error;
}

export async function declineCollegeJoinRequest(requestId: string): Promise<void> {
  const { error } = await supabase.rpc("decline_college_join_request", {
    _request_id: requestId,
  } as never);
  if (error) throw error;
}
