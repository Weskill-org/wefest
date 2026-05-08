import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

    // Fetch the user's role to determine redirect
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user?.id)
      .maybeSingle();

    setLoading(false);
    toast.success("Welcome back");

    const role = roleData?.role || "student";
    
    if (search.redirect) {
      navigate({ to: search.redirect });
    } else if (role === "company") {
      navigate({ to: "/sponsor/dashboard" });
    } else if (role === "college") {
      navigate({ to: "/organizer" });
    } else {
      navigate({ to: "/tickets" });
    }
  };

  const sendMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    const redirectUrl = search.redirect ? `${window.location.origin}${search.redirect}` : `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success(`Magic link sent to ${email}`);
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-20">
      <form onSubmit={submit} className="glass w-full rounded-2xl p-8">
        <h1 className="font-display text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with your password, or use a magic link.</p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="bg-brand-gradient text-primary-foreground hover:opacity-90">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <div className="relative my-1 text-center text-xs text-muted-foreground">
            <span className="bg-background/40 px-2">or</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border/60" />
          </div>
          <Button type="button" variant="outline" size="lg" disabled={loading} onClick={sendMagicLink}>
            Email me a magic link
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            New here? <Link to="/signup" search={{ redirect: search.redirect }} className="text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

