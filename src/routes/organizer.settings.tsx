import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Mail,
  Building2,
  Shield,
  Camera,
  Loader2,
  CheckCircle2,
  Key,
  AlertTriangle,
  BadgeCheck,
  Globe,
  MapPin,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/organizer/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Organizer — WeFest" },
      { name: "description", content: "Manage your organizer profile and account settings." },
    ],
  }),
  component: OrganizerSettings,
});

function OrganizerSettings() {
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch membership + college — with fallback for college-role users
  const { data: collegeData, isLoading: loadingCollege } = useQuery({
    queryKey: ["my-college-data", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      // 1. Try college_members first
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
          membershipId: memberData.id as string,
        };
      }

      // 2. Fallback: The college user IS the college.
      //    Find the college by matching the user's full_name (which is the college name at signup)
      const userCollegeName = userData!.user_metadata?.full_name;
      if (userCollegeName) {
        const { data: collegeByName } = await supabase
          .from("colleges")
          .select("id, name, city, domain, slug, status, fests, created_at")
          .eq("name", userCollegeName)
          .maybeSingle();

        if (collegeByName) {
          // Auto-repair: create the missing college_members record
          await supabase
            .from("college_members")
            .upsert({
              college_id: collegeByName.id,
              user_id: userData!.id,
              role: "admin" as any,
              is_approved: true,
            }, { onConflict: "college_id,user_id" });

          return {
            college: collegeByName,
            role: "admin",
            isApproved: true,
            membershipId: null,
          };
        }
      }

      // 3. Last resort: no college found at all — use user metadata as display
      return {
        college: {
          id: null,
          name: userCollegeName || userData!.email || "My College",
          city: "",
          domain: "",
          slug: null,
          status: "pending",
          fests: 0,
          created_at: userData!.created_at,
        },
        role: "admin",
        isApproved: true,
        membershipId: null,
      };
    },
  });

  // College details form state
  const [collegeName, setCollegeName] = useState("");
  const [collegeCity, setCollegeCity] = useState("");
  const [collegeDomain, setCollegeDomain] = useState("");
  const [collegeDirty, setCollegeDirty] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Populate form when college data loads
  useEffect(() => {
    if (collegeData?.college) {
      setCollegeName(collegeData.college.name || "");
      setCollegeCity(collegeData.college.city || "");
      setCollegeDomain(collegeData.college.domain || "");
    }
  }, [collegeData]);

  // Update college details mutation
  const updateCollegeMutation = useMutation({
    mutationFn: async () => {
      const collegeId = collegeData?.college?.id;
      if (!collegeId) throw new Error("No college record found. Please contact support.");
      const { error } = await supabase
        .from("colleges")
        .update({
          name: collegeName,
          city: collegeCity,
          domain: collegeDomain,
        })
        .eq("id", collegeId);
      if (error) throw error;
      // Keep user_metadata full_name in sync with college name
      await supabase.auth.updateUser({
        data: { full_name: collegeName },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-college-data"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("College details updated successfully");
      setCollegeDirty(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
      if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (loadingUser || loadingCollege) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // The college user IS the college — always use their data
  const displayCollegeName = collegeData?.college?.name || userData?.user_metadata?.full_name || "My College";
  const displayCollegeCity = collegeData?.college?.city || "";
  const isVerified = collegeData?.college?.status === "approved";
  const memberRole = collegeData?.role || "admin";
  const userEmail = userData?.email || "";
  const initials = displayCollegeName.substring(0, 2).toUpperCase();
  const joinDate = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const handleCollegeSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollegeMutation.mutate();
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMutation.mutate();
  };

  const roleLabels: Record<string, string> = {
    admin: "College Admin",
    coordinator: "Coordinator",
    ticket_poc: "Ticket POC",
    member: "Member",
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-[900px]">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your college profile, account, and preferences.</p>
      </div>

      <div className="space-y-8">
        {/* ──────────── Profile Card ──────────── */}
        <section className="rounded-2xl border border-border/50 bg-muted/5 overflow-hidden">
          {/* Profile Banner */}
          <div className="relative h-28 bg-brand-gradient overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40" />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar & Name row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 relative z-10">
              <div className="relative group">
                <div className="h-20 w-20 rounded-2xl bg-brand-gradient p-0.5 shadow-glow ring-4 ring-background">
                  <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center">
                    <span className="text-2xl font-black text-primary">{initials}</span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0 sm:pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black tracking-tight">{displayCollegeName}</h2>
                  {isVerified && <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500/10" />}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {userEmail}
                  </span>
                  {joinDate && (
                    <span className="text-xs text-muted-foreground">Joined {joinDate}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────── College Info Card ──────────── */}
        <section className="rounded-2xl border border-border/50 bg-muted/5 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Building2 className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Institutional Overview</h3>
              <p className="text-[10px] text-muted-foreground">Your college status and administrative role.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-background/50 p-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">College Name</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{displayCollegeName}</span>
                {isVerified && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-wider">
                    Verified
                  </Badge>
                )}
              </div>
              {displayCollegeCity && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" /> {displayCollegeCity}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/40 bg-background/50 p-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Your Role</div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">{roleLabels[memberRole] || memberRole}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                {memberRole === "admin" && "Full control over festivals, finances, and team."}
                {memberRole === "coordinator" && "Manage festival content and sponsorships."}
                {memberRole === "ticket_poc" && "Access ticket inventory and check-ins."}
                {memberRole === "member" && "View-only access to the organizer dashboard."}
              </p>
            </div>
          </div>
        </section>

        {/* ──────────── College Details Form ──────────── */}
        <section className="rounded-2xl border border-border/50 bg-muted/5 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">College Details</h3>
              <p className="text-[10px] text-muted-foreground">Update your college information and contact details.</p>
            </div>
          </div>

          <form onSubmit={handleCollegeSave} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="settings-college-name" className="text-xs font-bold">College Name</Label>
                <Input
                  id="settings-college-name"
                  value={collegeName}
                  onChange={(e) => { setCollegeName(e.target.value); setCollegeDirty(true); }}
                  placeholder="Enter college name"
                  className="h-10 rounded-xl border-border/50 bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="settings-email" className="text-xs font-bold">Email Address</Label>
                <div className="relative">
                  <Input
                    id="settings-email"
                    value={userEmail}
                    disabled
                    className="h-10 rounded-xl border-border/50 bg-muted/20 pr-10 cursor-not-allowed"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-[10px] text-muted-foreground">Email cannot be changed here.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="settings-city" className="text-xs font-bold">City</Label>
                <div className="relative">
                  <Input
                    id="settings-city"
                    value={collegeCity}
                    onChange={(e) => { setCollegeCity(e.target.value); setCollegeDirty(true); }}
                    placeholder="e.g. Indore, Mumbai, Delhi"
                    className="h-10 rounded-xl border-border/50 bg-background"
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="settings-domain" className="text-xs font-bold">College Domain</Label>
                <div className="relative">
                  <Input
                    id="settings-domain"
                    value={collegeDomain}
                    onChange={(e) => { setCollegeDomain(e.target.value); setCollegeDirty(true); }}
                    placeholder="e.g. davv.ac.in"
                    className="h-10 rounded-xl border-border/50 bg-background"
                  />
                  <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              {collegeDirty ? (
                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Unsaved changes
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> All changes saved
                </span>
              )}
              <Button
                type="submit"
                disabled={!collegeDirty || updateCollegeMutation.isPending}
                className="bg-brand-gradient text-white rounded-xl font-bold h-9 px-5 shadow-glow gap-2 text-xs"
              >
                {updateCollegeMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </section>

        {/* ──────────── Change Password ──────────── */}
        <section className="rounded-2xl border border-border/50 bg-muted/5 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Key className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Change Password</h3>
              <p className="text-[10px] text-muted-foreground">Update your password to keep your account secure.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <Label htmlFor="settings-new-pw" className="text-xs font-bold">New Password</Label>
              <div className="relative">
                <Input
                  id="settings-new-pw"
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                  className="h-10 rounded-xl border-border/50 bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settings-confirm-pw" className="text-xs font-bold">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="settings-confirm-pw"
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  minLength={6}
                  required
                  className="h-10 rounded-xl border-border/50 bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[10px] text-destructive font-medium">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              variant="outline"
              disabled={!newPassword || !confirmPassword || changePasswordMutation.isPending}
              className="rounded-xl font-bold h-9 px-5 text-xs gap-2 mt-2"
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Key className="h-3.5 w-3.5" />
              )}
              Update Password
            </Button>
          </form>
        </section>

        {/* ──────────── Account Info ──────────── */}
        <section className="rounded-2xl border border-border/50 bg-muted/5 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-9 w-9 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground">
              <Globe className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Account Information</h3>
              <p className="text-[10px] text-muted-foreground">A summary of your account status.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-background/50 p-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Account ID</div>
              <code className="text-[11px] font-mono text-foreground/70 break-all">{userData?.id?.slice(0, 12)}…</code>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/50 p-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Auth Provider</div>
              <span className="text-sm font-bold capitalize">{userData?.app_metadata?.provider || "email"}</span>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/50 p-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Last Sign In</div>
              <span className="text-sm font-bold">
                {userData?.last_sign_in_at
                  ? new Date(userData.last_sign_in_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                  : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* ──────────── Danger Zone ──────────── */}
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-destructive">Danger Zone</h3>
              <p className="text-[10px] text-muted-foreground">Irreversible actions. Proceed with caution.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-background/50">
            <div>
              <div className="text-sm font-bold">Delete Account</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently remove your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white rounded-xl font-bold text-xs h-9 px-5 shrink-0"
              onClick={() => toast.error("Please contact support at support@wefest.in to delete your account.")}
            >
              Delete Account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
