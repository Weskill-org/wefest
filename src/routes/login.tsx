import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — WeFest" }, { name: "description", content: "Sign in to WeFest with your college email." }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Magic link sent");
    setTimeout(() => navigate({ to: "/events" }), 600);
  };
  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-20">
      <form onSubmit={submit} className="glass w-full rounded-2xl p-8">
        <h1 className="font-display text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">We'll email you a magic sign-in link.</p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">College email</Label>
            <Input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@iitb.ac.in" />
          </div>
          <Button type="submit" size="lg" className="bg-brand-gradient text-primary-foreground hover:opacity-90">
            Send magic link
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
