import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { getAuthSession, getDashboardRedirect } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  head: () => ({
    meta: [
      { title: "Reset Password — WeFest" },
      { name: "description", content: "Create a new password for your WeFest account." },
    ],
  }),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // First try to get existing session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        if (mounted) {
          setHasSession(true);
          setCheckingSession(false);
        }
      } else {
        // If not immediate, listen for a brief moment for PASSWORD_RECOVERY or SIGNED_IN event
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (!mounted) return;
          if (event === "PASSWORD_RECOVERY" || newSession) {
            setHasSession(true);
            setCheckingSession(false);
          }
        });

        // Timeout check after 2 seconds if still loading
        const timeout = setTimeout(() => {
          if (mounted && checkingSession) {
            setCheckingSession(false);
          }
        }, 2000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    toast.success("Password updated successfully");

    // Retrieve full session details to redirect to appropriate dashboard
    try {
      const session = await getAuthSession();
      setLoading(false);
      if (session) {
        navigate({ to: getDashboardRedirect(session.role, session.isAdmin) });
      } else {
        navigate({ to: "/login" });
      }
    } catch (err) {
      setLoading(false);
      navigate({ to: "/login" });
    }
  };

  if (checkingSession) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Validating session...</p>
      </div>
    );
  }

  // Same layout structure as login.tsx
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
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-12 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Reset Your
            <br />
            Password
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed">
            Secure your WeFest account by creating a new, strong password.
          </p>
          <div className="mt-12 flex items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span>Secure Update</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              <span>Direct Dashboard Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — reset password form / invalid token view */}
      <div className="flex-1 w-full overflow-y-auto bg-background">
        <div className="min-h-full w-full flex px-6 py-8 sm:px-12 sm:py-12 pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-12">
          <div className="w-full max-w-md m-auto">
            {/* Mobile back link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8 lg:hidden group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>

            {!hasSession ? (
              <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold tracking-tight text-destructive">
                  Invalid or Expired Link
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This password reset link is invalid or has expired. Please return to the login
                  page and request a new password reset link.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="w-full h-12 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-glow cursor-pointer"
                >
                  Return to sign in
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight">Create new password</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please enter your new password below.
                </p>

                <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="new-password"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 rounded-xl bg-white/[0.03] border-white/10 text-base pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirm-password"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 rounded-xl bg-white/[0.03] border-white/10 text-base pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-glow cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Resetting…
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
