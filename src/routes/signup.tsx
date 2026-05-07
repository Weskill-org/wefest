import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShieldCheck, GraduationCap, Building2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — WeFest" }, { name: "description", content: "Create your WeFest account as a Student, College, or Company." }] }),
  component: Signup,
});

type Role = "student" | "college" | "company";

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name, role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Check your email to confirm.");
    navigate({ to: "/login" });
  };

  const sendMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name, role },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success(`Magic link sent to ${email}`);
  };

  return (
    <div className="container mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Identity-verified network
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight md:text-5xl">
          Join <span className="text-gradient">WeFest</span>
        </h1>
        <p className="mt-3 text-muted-foreground">Pick how you'll use WeFest.</p>
      </div>

      <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mt-8">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-2 bg-transparent p-0">
          <TabsTrigger
            value="student"
            className="flex h-auto flex-col items-center gap-2 rounded-2xl border-2 border-primary/40 bg-brand-gradient/10 p-6 text-base font-bold data-[state=active]:scale-105 data-[state=active]:border-primary data-[state=active]:bg-brand-gradient data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow md:p-8 md:text-lg"
          >
            <GraduationCap className="h-8 w-8 md:h-10 md:w-10" />
            Student
            <span className="text-[10px] font-normal opacity-80">Most popular</span>
          </TabsTrigger>
          <TabsTrigger
            value="college"
            className="flex h-auto flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-background/40 p-3 text-sm data-[state=active]:border-primary data-[state=active]:bg-accent/10"
          >
            <Building2 className="h-5 w-5" />
            College
          </TabsTrigger>
          <TabsTrigger
            value="company"
            className="flex h-auto flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-background/40 p-3 text-sm data-[state=active]:border-primary data-[state=active]:bg-accent/10"
          >
            <Briefcase className="h-5 w-5" />
            Company
          </TabsTrigger>
        </TabsList>

        <TabsContent value={role} className="mt-8">
          <form onSubmit={submit} className="glass mx-auto max-w-md rounded-2xl p-8">
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name">{role === "college" ? "College name" : role === "company" ? "Company name" : "Full name"}</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="bg-brand-gradient text-primary-foreground hover:opacity-90">
                {loading ? "Creating…" : "Create account"}
              </Button>
              <div className="relative my-1 text-center text-xs text-muted-foreground">
                <span className="bg-background/40 px-2">or</span>
                <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border/60" />
              </div>
              <Button type="button" variant="outline" size="lg" disabled={loading} onClick={sendMagicLink}>
                Email me a magic link
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
