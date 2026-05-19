import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Loader2, CheckCircle2, XCircle, Building2, Shield,
  ArrowRight, AlertTriangle, Mail, PartyPopper, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type InviteSearch = { token?: string };

export const Route = createFileRoute("/invite/accept")({
  validateSearch: (search: Record<string, unknown>): InviteSearch => ({
    token: search.token as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Accept Invitation — WeFest" },
      { name: "description", content: "Accept your team invitation to join an organization on WeFest." },
    ],
  }),
  component: InviteAcceptPage,
});

function InviteAcceptPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  // Check if user is logged in
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["invite-current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch invitation details by token
  const { data: invitation, isLoading: loadingInvite, error: inviteError } = useQuery({
    queryKey: ["invite-details", token],
    enabled: !!token,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_invitation_by_token", {
        _token: token!,
      } as any);
      if (error) throw error;
      return data as {
        ok: boolean;
        error?: string;
        type: "organizer";
        status: string;
        company_name: string; // returns college name
        role: string;
        position: string | null;
        message: string | null;
        invitee_email: string;
        expires_at: string;
        expired: boolean;
      };
    },
  });

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("accept_team_invitation_by_token", {
        _token: token!,
      } as any);
      if (error) throw error;
      return data as {
        ok: boolean;
        college_id?: string;
        company_name: string; // returns college name
        role: string;
        position: string | null;
      };
    },
    onSuccess: (data: any) => {
      setAccepted(true);
      toast.success(`Welcome to ${data.company_name}!`, {
        description: `You've joined as ${data.position || data.role}.`,
        duration: 5000,
      });
    },
    onError: (e: any) => toast.error(e.message || "Failed to accept invitation"),
  });

  // Decline mutation
  const declineMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("decline_team_invitation_by_token", {
        _token: token!,
      } as any);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setDeclined(true);
      toast.success("Invitation declined");
    },
    onError: (e: any) => toast.error(e.message || "Failed to decline invitation"),
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Invalid Link</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This invitation link is missing the required token. Please check the link in your email and try again.
          </p>
          <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loadingUser || loadingInvite) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  // Invalid invitation
  if (!invitation?.ok || inviteError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Invitation Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {invitation?.error || "This invitation doesn't exist or the link is invalid."}
          </p>
          <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Already used
  if (invitation.status !== "pending") {
    const statusConfig = {
      accepted: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", label: "Already Accepted", desc: "This invitation has already been accepted." },
      declined: { icon: XCircle, color: "text-red-500 bg-red-500/10", label: "Already Declined", desc: "This invitation has been declined." },
      cancelled: { icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10", label: "Cancelled", desc: "This invitation was cancelled by the sender." },
      expired: { icon: Clock, color: "text-muted-foreground bg-muted/20", label: "Expired", desc: "This invitation has expired. Please ask for a new one." },
    }[invitation.status] || { icon: AlertTriangle, color: "text-muted-foreground bg-muted/20", label: "Unavailable", desc: "This invitation is no longer available." };

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5", statusConfig.color)}>
            <statusConfig.icon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">{statusConfig.label}</h1>
          <p className="text-sm text-muted-foreground mb-6">{statusConfig.desc}</p>
          <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Expired
  if (invitation.expired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
            <Clock className="h-7 w-7 text-amber-500" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Invitation Expired</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This invitation has expired. Please contact {invitation.company_name} to request a new one.
          </p>
          <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Accepted state
  if (accepted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="h-9 w-9 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">You're In! 🎉</h1>
          <p className="text-sm text-muted-foreground mb-2">
            You've successfully joined <span className="font-bold text-foreground">{invitation.company_name}</span>
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            Role: <span className="font-semibold text-primary">{invitation.position || invitation.role}</span>
          </p>
          <Button
            onClick={() => navigate({ to: "/organizer" })}
            className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow h-11 px-8 text-sm"
          >
            Go to Organizer Dashboard <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Declined state
  if (declined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-5">
            <XCircle className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Invitation Declined</h1>
          <p className="text-sm text-muted-foreground mb-6">
            You've declined the invitation from {invitation.company_name}. The sender has been notified.
          </p>
          <Button asChild className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // User not logged in — show prompt
  if (!user) {
    const loginRedirect = `/invite/accept?token=${token}`;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Invite preview card */}
          <div className="rounded-2xl border border-border/50 bg-muted/5 overflow-hidden mb-8">
            <div className="h-2 bg-brand-gradient" />
            <div className="p-8 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-black tracking-tight mb-2">Team Invitation</h1>
              <p className="text-sm text-muted-foreground mb-6">
                <span className="font-bold text-foreground">{invitation.company_name}</span> has invited you to join their team on WeFest.
              </p>
              <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 mb-4">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">
                  {invitation.position || invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                </span>
              </div>
              {invitation.message && (
                <div className="mt-4 text-left rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Personal Note</div>
                  <p className="text-sm text-muted-foreground/90 italic leading-relaxed">
                    &ldquo;{invitation.message}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Auth prompt */}
          <div className="rounded-2xl border border-border/50 bg-muted/5 p-8 text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-lg font-black tracking-tight mb-1">Sign in to accept</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Sign in with <span className="font-bold text-foreground">{invitation.invitee_email}</span> to join the team.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="bg-brand-gradient text-white rounded-xl font-bold shadow-glow h-11 text-sm"
              >
                <Link to="/login" search={{ redirect: loginRedirect }}>
                  Sign In <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl font-bold h-11 text-sm border-border/50"
              >
                <Link to="/signup" search={{ redirect: loginRedirect }}>
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main acceptance UI — user is logged in
  const roleDisplay = invitation.position
    ? `${invitation.position} (${invitation.role})`
    : invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Invitation Card */}
        <div className="rounded-2xl border border-border/50 bg-muted/5 overflow-hidden">
          <div className="h-2 bg-brand-gradient" />

          <div className="p-8">
            {/* College Badge */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-brand-gradient p-0.5 shadow-glow">
                <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-tight mb-2">Join {invitation.company_name}</h1>
              <p className="text-sm text-muted-foreground">
                You've been invited to join the team. Review the details below and accept to get started.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/50 p-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Organization
                </span>
                <span className="text-sm font-bold">{invitation.company_name}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/50 p-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Role</span>
                <span className="text-sm font-bold text-primary">{roleDisplay}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/50 p-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Signed in as</span>
                <span className="text-sm font-medium text-muted-foreground">{user.email}</span>
              </div>
            </div>

            {/* Email mismatch warning */}
            {user.email?.toLowerCase() !== invitation.invitee_email.toLowerCase() && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-500">Email mismatch</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This invitation was sent to <span className="font-bold">{invitation.invitee_email}</span> but you're signed in as <span className="font-bold">{user.email}</span>.
                      Please sign in with the correct email.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-3 h-8 rounded-lg text-xs font-bold border-amber-500/30 text-amber-500"
                    >
                      <Link to="/login" search={{ redirect: `/invite/accept?token=${token}` }}>
                        Switch Account
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {invitation.message && (
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 mb-6">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Personal Note from Inviter</div>
                <p className="text-sm text-muted-foreground/90 italic leading-relaxed">
                  &ldquo;{invitation.message}&rdquo;
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending || declineMutation.isPending || user.email?.toLowerCase() !== invitation.invitee_email.toLowerCase()}
                className="flex-1 bg-brand-gradient text-white rounded-xl font-bold shadow-glow h-12 text-sm"
              >
                {acceptMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Accept & Join
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to decline this invitation?")) {
                    declineMutation.mutate();
                  }
                }}
                disabled={acceptMutation.isPending || declineMutation.isPending}
                variant="outline"
                className="rounded-xl font-bold h-12 text-sm border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                {declineMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          This invitation expires on {new Date(invitation.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
