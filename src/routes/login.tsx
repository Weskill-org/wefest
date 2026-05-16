import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { getAuthSession, getDashboardRedirect } from "@/lib/auth";
import { processReferralAfterLogin } from "@/lib/referral";
import { REFERRAL_REWARD_COINS } from "@/lib/wallet.functions";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect as string | undefined,
    };
  },
  head: () => ({ meta: [{ title: "Sign in — WeFest" }, { name: "description", content: "Sign in to WeFest with email and password or a magic link." }] }),
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
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    const uid = authData.user?.id;

    // Block blacklisted users
    if (uid) {
      const { data: banned } = await supabase
        .from("blacklisted_users")
        .select("id, reason")
        .eq("user_id", uid)
        .maybeSingle();
      if (banned) {
        await supabase.auth.signOut();
        setLoading(false);
        toast.error(`Your account has been suspended. ${banned.reason ? `Reason: ${banned.reason}` : ""}`);
        return;
      }
    }

    const session = await getAuthSession();
    setLoading(false);
    
    if (!session) {
      toast.error("Failed to retrieve user session");
      return;
    }

    if (session.role === "student" && session.user?.id) {
      try {
        const referral = await processReferralAfterLogin(session.user);
        if (referral.processed) {
          toast.success(
            `Referral bonus! ${(referral.rewardCoins ?? REFERRAL_REWARD_COINS).toLocaleString()} WeCoins added to your wallet.`
          );
        }
      } catch (refErr) {
        console.error("Referral processing on login:", refErr);
      }
    }

    toast.success("Welcome back");

    if (search.redirect) {
      navigate({ to: search.redirect });
    } else {
      navigate({ to: getDashboardRedirect(session.role, session.isAdmin) });
    }
  };

  const sendMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    const redirectUrl = search.redirect 
      ? (search.redirect.startsWith('http') ? search.redirect : `${window.location.origin}${search.redirect}`)
      : `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success(`Magic link sent to ${email}`);
  };

  return (
    <div className="min-h-screen flex">
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
            Welcome to<br />WeFest
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed">
            The digital backbone of college festivals. Sign in to access your dashboard, tickets, and campus network.
          </p>
          <div className="mt-12 flex items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span>500+ Events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              <span>200+ Colleges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8 lg:hidden group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access your account.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input 
                id="email" 
                required 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@domain.com" 
                className="h-12 rounded-xl bg-white/[0.03] border-white/10 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
              <Input 
                id="password" 
                required 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="h-12 rounded-xl bg-white/[0.03] border-white/10 text-base"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading} 
              className="w-full h-12 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-glow"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing in…</> : "Sign in"}
            </Button>
            
            <div className="relative my-2 text-center">
              <span className="relative z-10 bg-background px-3 text-xs text-muted-foreground">or</span>
              <div className="absolute inset-x-0 top-1/2 -z-0 h-px bg-white/10" />
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              disabled={loading} 
              onClick={sendMagicLink}
              className="w-full h-12 rounded-xl border-white/10 text-sm font-semibold"
            >
              Email me a magic link
            </Button>
            
            <p className="text-center text-xs text-muted-foreground pt-2">
              New here? <Link to="/signup" search={{ redirect: search.redirect }} className="text-primary hover:underline font-semibold">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
