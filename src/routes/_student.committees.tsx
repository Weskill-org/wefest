import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  MapPin,
  Loader2,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Sparkles,
  X,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fetchStudentJoinRequests, submitCollegeJoinRequest } from "@/lib/college-join-requests";

export const Route = createFileRoute("/_student/committees")({
  head: () => ({
    meta: [
      { title: "Committees — WeFest" },
      { name: "description", content: "Request to join your college festival committee on WeFest." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: location.pathname + location.searchStr } });
  },
  component: CommitteesPage,
});

type CollegeRow = { id: string; name: string; city: string | null; slug: string | null; fests: number };

function JoinRequestDialog({ college, onClose }: { college: CollegeRow; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [pitch, setPitch] = useState("");

  const submitMutation = useMutation({
    mutationFn: () => submitCollegeJoinRequest(college.id, pitch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["student-join-requests"] });
      toast.success(`Request sent to ${data.college_name || college.name}`, {
        description: "Organizers will review your pitch. You will get an alert when they respond.",
      });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message || "Could not send request"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-background/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/5 pointer-events-none" />
        <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5">
          <X className="h-4 w-4" />
        </button>
        <div className="px-6 pt-6 pb-4 border-b border-white/5 pr-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Send className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Request to Join</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">{college.name}</p>
            </div>
          </div>
        </div>
        <div className="relative p-6 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tell the committee why you want to join. A strong pitch helps organizers decide faster.
          </p>
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Hi! I'm passionate about event management and would love to contribute to your fest team..."
            rows={4}
            maxLength={500}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 resize-none transition-all"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Min. 10 characters</span>
            <span>{pitch.trim().length}/500</span>
          </div>
          <Button
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || pitch.trim().length < 10}
            className="w-full h-11 bg-brand-gradient text-white rounded-xl font-bold shadow-glow"
          >
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Send Request
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function JoinRequestStatusBadge({ status }: { status: string }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  }
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
        <CheckCircle2 className="h-3 w-3" /> Accepted
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 text-[9px] font-bold uppercase tracking-wider">
        <XCircle className="h-3 w-3" /> Declined
      </span>
    );
  }
  return null;
}

function CommitteesPage() {
  const [requestCollege, setRequestCollege] = useState<CollegeRow | null>(null);
  const [section, setSection] = useState<"discover" | "status">("discover");

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      return u;
    },
  });

  const { data: studentProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["student-profile-committees", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("id, college_id, colleges(id, name, city, slug, fests, status)")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const collegeId = studentProfile?.college_id ?? null;

  const { data: ownCollege, isLoading: loadingCollege } = useQuery({
    queryKey: ["own-college-committee", collegeId],
    enabled: !!collegeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("id, name, city, slug, fests, status")
        .eq("id", collegeId!)
        .eq("status", "approved")
        .maybeSingle();
      if (error) throw error;
      return data as CollegeRow | null;
    },
  });

  const { data: memberships } = useQuery({
    queryKey: ["student-memberships", user?.id, collegeId],
    enabled: !!user?.id && !!collegeId,
    queryFn: async () => {
      const { data } = await supabase
        .from("college_members")
        .select("college_id, role, position, colleges(id, name, city)")
        .eq("user_id", user!.id)
        .eq("college_id", collegeId!)
        .eq("is_approved", true);
      return data || [];
    },
  });

  const { data: joinRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["student-join-requests", user?.id, collegeId],
    enabled: !!user?.id,
    queryFn: () => fetchStudentJoinRequests(user!.id, collegeId),
  });

  const isMember = (memberships?.length || 0) > 0;
  const isPending = (joinRequests || []).some((r) => r.status === "pending");
  const canRequest = !!ownCollege && !isMember && !isPending;

  const pendingRequests = (joinRequests || []).filter((r) => r.status === "pending");

  if (loadingProfile || (collegeId && loadingCollege)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading committees…</p>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[1100px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Committees</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-lg">
            Request to join your college&apos;s festival committee. Membership is limited to your registered institution.
          </p>
        </div>
        {isMember && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 shrink-0 font-bold"
          >
            <Link to="/organizer">
              My organizer tools <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Member", value: isMember ? 1 : 0, icon: Users, color: "text-emerald-400", border: "border-emerald-500/20 bg-emerald-500/5" },
          { label: "Pending Requests", value: pendingRequests.length, icon: Clock, color: "text-amber-400", border: "border-amber-500/20 bg-amber-500/5" },
          { label: "Your College", value: collegeId ? 1 : 0, icon: Sparkles, color: "text-primary", border: "border-primary/20 bg-primary/5" },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-2xl border p-4", stat.border)}>
            <stat.icon className={cn("h-4 w-4 mb-2", stat.color)} />
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 w-fit border border-white/5">
        {(["discover", "status"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              section === s ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s === "discover" ? "Discover" : "My Requests & Teams"}
            {s === "status" && pendingRequests.length > 0 && (
              <span className="ml-1.5 h-4 w-4 inline-flex items-center justify-center rounded-full bg-amber-500 text-white text-[9px] font-black">
                {pendingRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {section === "discover" && (
        <div className="space-y-4">
          {!collegeId ? (
            <div className="rounded-2xl border-2 border-dashed border-white/10 py-16 text-center px-6">
              <GraduationCap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-semibold text-muted-foreground">Link your college first</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                You can only join the festival committee at the college on your profile.
              </p>
              <Button asChild className="mt-4 rounded-xl bg-brand-gradient text-white font-bold">
                <Link to="/settings">Go to Settings</Link>
              </Button>
            </div>
          ) : !ownCollege ? (
            <div className="rounded-2xl border-2 border-dashed border-white/10 py-16 text-center px-6">
              <GraduationCap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-semibold text-muted-foreground">College not available yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Your linked college is not verified on WeFest yet. Try updating it in Settings or contact your organizers.
              </p>
              <Button asChild className="mt-4 rounded-xl" variant="outline">
                <Link to="/settings">Update college in Settings</Link>
              </Button>
            </div>
          ) : (
            <div className="max-w-lg">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  {ownCollege.fests > 0 && (
                    <span className="text-[9px] font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md">
                      {ownCollege.fests} fest{ownCollege.fests !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg leading-tight">{ownCollege.name}</h3>
                {ownCollege.city && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {ownCollege.city}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  This is your college&apos;s fest committee. Send a short pitch to request a spot on the team.
                </p>
                <Button
                  size="sm"
                  disabled={!canRequest}
                  onClick={() => canRequest && setRequestCollege(ownCollege)}
                  className={cn(
                    "w-full mt-5 h-10 rounded-xl font-bold text-sm",
                    isMember
                      ? "bg-emerald-500/15 text-emerald-400"
                      : isPending
                        ? "bg-muted/20 text-muted-foreground"
                        : "bg-brand-gradient text-white shadow-glow"
                  )}
                >
                  {isMember ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> You&apos;re on the team
                    </>
                  ) : isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" /> Request Pending
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Request to Join
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {section === "status" && (
        <div className="space-y-6">
          {loadingRequests ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {(memberships?.length || 0) > 0 && (
                <div>
                  <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" /> Active Memberships
                  </h2>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {memberships!.map((m: { college_id: string; role: string; colleges?: { name?: string; city?: string | null } | null }) => (
                      <div
                        key={m.college_id}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{m.colleges?.name || "Committee"}</p>
                          {m.colleges?.city && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" /> {m.colleges.city}
                            </p>
                          )}
                          <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1">{m.role}</p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs font-bold text-primary shrink-0">
                          <Link to="/organizer">Open</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" /> Join Requests
                </h2>
                {!joinRequests?.length ? (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center text-sm text-muted-foreground">
                    No requests yet. Send a pitch from the Discover tab to join your college committee.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {joinRequests.map((req) => (
                      <div
                        key={req.id}
                        className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-bold text-sm">{req.colleges?.name || "Committee"}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{req.pitch}</p>
                            <p className="text-[10px] text-muted-foreground/50 mt-1">
                              {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <JoinRequestStatusBadge status={req.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {requestCollege && (
        <JoinRequestDialog college={requestCollege} onClose={() => setRequestCollege(null)} />
      )}
    </div>
  );
}
