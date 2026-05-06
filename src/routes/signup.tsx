import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { colleges } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — WeFest" }, { name: "description", content: "Verify your college email to join WeFest." }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const domain = email.split("@")[1]?.toLowerCase();
  const college = colleges.find((c) => domain && domain.endsWith(c.domain));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!college) {
      toast.error("Email domain not from a verified college");
      return;
    }
    toast.success(`Verification link sent to ${email}`);
    setTimeout(() => navigate({ to: "/events" }), 800);
  };

  return (
    <div className="container mx-auto grid gap-12 px-6 py-20 md:grid-cols-2">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Identity-verified network
        </div>
        <h1 className="mt-4 font-display text-5xl font-black tracking-tight">Join with your <span className="text-gradient">college email</span>.</h1>
        <p className="mt-4 text-muted-foreground">We auto-verify your college from your email domain. No documents, no friction.</p>
        <div className="mt-8 grid gap-2">
          {colleges.slice(0, 5).map((c) => (
            <div key={c.id} className="glass flex items-center justify-between rounded-lg px-4 py-2 text-sm">
              <span>{c.name}</span>
              <code className="text-xs text-muted-foreground">@{c.domain}</code>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="glass h-fit rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold">Create your account</h2>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Riya Mehta" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">College email</Label>
            <Input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@iitb.ac.in" />
            {domain && (
              <p className={`text-xs ${college ? "text-primary" : "text-destructive"}`}>
                {college ? `✓ Verified as ${college.name}` : "Domain not recognized — try a college email"}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" className="bg-brand-gradient text-primary-foreground hover:opacity-90">
            Send verification link
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
