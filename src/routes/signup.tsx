import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Building2, Briefcase, ArrowLeft, Loader2, Gift, Eye, EyeOff, Check } from "lucide-react";
import { REFERRAL_REWARD_COINS } from "@/lib/wallet.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { getAuthSession, getDashboardRedirect } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAuthRedirectUrl } from "@/lib/capacitor-platform";

type SignupSearch = {
  redirect?: string;
  ref?: string;
};

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignupSearch => {
    return {
      redirect: search.redirect as string | undefined,
      ref: typeof search.ref === "string" ? search.ref : undefined,
    };
  },
  head: () => ({ meta: [{ title: "Sign up — WeFest" }, { name: "description", content: "Create your WeFest account as a Student, College, or Company." }] }),
  beforeLoad: async ({ search }) => {
    if (typeof window === 'undefined') return;
    const session = await getAuthSession();
    if (session) {
      if (search.redirect) {
        throw redirect({ to: search.redirect });
      }
      throw redirect({ to: getDashboardRedirect(session.role, session.isAdmin) });
    }
  },
  component: Signup,
});

type Role = "student" | "college" | "company";

const roles = [
  { value: "student" as Role, label: "Student", icon: GraduationCap, description: "Most popular" },
  { value: "college" as Role, label: "College", icon: Building2, description: "Organize events" },
  { value: "company" as Role, label: "Company", icon: Briefcase, description: "Sponsor fests" },
];

function Signup() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const referralFromLink = search.ref?.trim().toUpperCase() ?? "";
  const isReferralLocked = referralFromLink.length > 0;
  const [referralCode, setReferralCode] = useState(() => referralFromLink);
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasDigit && hasSpecialChar;

  const effectiveReferralCode = isReferralLocked ? referralFromLink : referralCode.trim().toUpperCase();

  const { data: colleges } = useQuery({
    queryKey: ["colleges-signup"],
    queryFn: async () => {
      const { data, error } = await supabase.from("colleges").select("id, name").eq("status", "approved").order("name");
      if (error) throw error;
      return data;
    }
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "student" && !collegeId) {
      toast.error("Please select your college");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Password does not meet validation requirements.");
      return;
    }
    setLoading(true);
    const redirectPath = search.redirect && !search.redirect.startsWith('http')
      ? search.redirect
      : "/";
    const redirectUrl = getAuthRedirectUrl(redirectPath);
    const signupData: Record<string, string> = { full_name: name, role };
    if (role === "student" && collegeId) signupData.college_id = collegeId;
    if (role === "student" && effectiveReferralCode) {
      signupData.referral_code = effectiveReferralCode;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: signupData,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Check your email to confirm.");
    navigate({ to: "/login", search: { redirect: search.redirect } });
  };

  const sendMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    const redirectPath = search.redirect && !search.redirect.startsWith('http')
      ? search.redirect
      : "/";
    const redirectUrl = getAuthRedirectUrl(redirectPath);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: name,
          role,
          ...(role === "student" && effectiveReferralCode
            ? { referral_code: effectiveReferralCode }
            : {}),
        },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success(`Magic link sent to ${email}`);
  };

  return (
    <div className="relative w-full h-[100dvh] flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Left side — branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-brand-gradient relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 h-60 w-60 rounded-full bg-white blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/20 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-md text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-12 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Join the<br />WeFest Network
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed">
            Create your account to discover festivals, book tickets, connect with students, and manage events.
          </p>
          <div className="mt-12 flex items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — signup form */}
      <div className="flex-1 w-full overflow-y-auto bg-background">
        <div className="min-h-full w-full flex px-6 py-8 sm:px-12 sm:py-12 pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-12">
          <div className="w-full max-w-md m-auto">
          {/* Mobile back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 lg:hidden group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Pick how you'll use WeFest.</p>

          {/* Role Selector */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all",
                  role === r.value
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                )}
              >
                <r.icon className={cn("h-5 w-5", role === r.value ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-xs font-bold", role === r.value ? "text-primary" : "text-foreground")}>{r.label}</span>
                <span className="text-[9px] text-muted-foreground">{r.description}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {role === "college" ? "College name" : role === "company" ? "Company name" : "Full name"}
              </Label>
              <Input 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="h-11 rounded-xl bg-white/[0.03] border-white/10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input 
                required 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@domain.com" 
                className="h-11 rounded-xl bg-white/[0.03] border-white/10"
              />
            </div>
            {role === "student" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isReferralLocked ? "Referral code" : "Referral Code (optional)"}
                </Label>
                <Input
                  value={isReferralLocked ? referralFromLink : referralCode}
                  onChange={
                    isReferralLocked
                      ? undefined
                      : (e) => setReferralCode(e.target.value.toUpperCase())
                  }
                  readOnly={isReferralLocked}
                  placeholder="WF-XXXXXX"
                  className={cn(
                    "h-11 rounded-xl bg-white/[0.03] border-white/10 uppercase tracking-wider",
                    isReferralLocked && "cursor-default opacity-90 bg-white/[0.06]"
                  )}
                />
                {isReferralLocked && (
                  <p className="text-xs text-muted-foreground">
                    This code was applied from your invite link and cannot be changed.
                  </p>
                )}
                {effectiveReferralCode && (
                  <p className="text-xs text-emerald-500/90 flex items-center gap-1.5 font-medium">
                    <Gift className="h-3.5 w-3.5 shrink-0" />
                    You&apos;ll both earn {REFERRAL_REWARD_COINS.toLocaleString()} WeCoins!
                  </p>
                )}
              </div>
            )}
            {role === "student" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your College</Label>
                <Select value={collegeId} onValueChange={setCollegeId}>
                  <SelectTrigger className="h-11 rounded-xl bg-white/[0.03] border-white/10 text-sm">
                    <SelectValue placeholder="Select your college" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {colleges?.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="h-11 pr-10 rounded-xl bg-white/[0.03] border-white/10 text-foreground"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {/* Password policies */}
              <div className="mt-2.5 space-y-1.5 text-xs">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password Requirements</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className={cn("flex items-center gap-1.5 transition-colors", hasMinLength ? "text-emerald-500 font-medium" : "text-muted-foreground")}>
                    {hasMinLength ? <Check className="h-3.5 w-3.5 shrink-0" /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 ml-1.5 mr-1.5" />}
                    <span>Min 8 characters</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5 transition-colors", hasDigit ? "text-emerald-500 font-medium" : "text-muted-foreground")}>
                    {hasDigit ? <Check className="h-3.5 w-3.5 shrink-0" /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 ml-1.5 mr-1.5" />}
                    <span>At least 1 digit</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5 transition-colors", hasSpecialChar ? "text-emerald-500 font-medium" : "text-muted-foreground")}>
                    {hasSpecialChar ? <Check className="h-3.5 w-3.5 shrink-0" /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 ml-1.5 mr-1.5" />}
                    <span>1 special character</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading} 
              className="w-full h-12 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-glow mt-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating…</> : "Create account"}
            </Button>
            
            <div className="relative my-1 text-center">
              <span className="relative z-10 bg-background px-3 text-xs text-muted-foreground">or</span>
              <div className="absolute inset-x-0 top-1/2 -z-0 h-px bg-white/10" />
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              disabled={loading} 
              onClick={sendMagicLink}
              className="w-full h-11 rounded-xl border-white/10 text-sm font-semibold"
            >
              Email me a magic link
            </Button>
            
            <p className="text-center text-xs text-muted-foreground pt-1">
              Already have an account? <Link to="/login" search={{ redirect: search.redirect }} className="text-primary hover:underline font-semibold">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
