import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/organizer/new")({
  head: () => ({ meta: [{ title: "New event — WeFest" }, { name: "description", content: "Create a new festival on WeFest." }] }),
  component: NewEvent,
});

function NewEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", date: "", city: "", category: "Cultural", description: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${form.title} created`);
    setTimeout(() => navigate({ to: "/organizer" }), 600);
  };
  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-4xl font-black">Create a new event</h1>
      <p className="mt-2 text-muted-foreground">Set up the basics. You can configure sub-events, tiers and sponsors next.</p>

      <form onSubmit={submit} className="glass mt-8 grid gap-4 rounded-2xl p-6">
        <Field label="Title"><Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Mood Indigo 2026" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date"><Input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="City"><Input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Mumbai" /></Field>
        </div>
        <Field label="Category">
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
            {["Cultural", "Tech", "Sports", "Business", "Arts"].map((c) => <option key={c} className="bg-background">{c}</option>)}
          </select>
        </Field>
        <Field label="Description"><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What makes this fest unforgettable?" /></Field>
        <Button type="submit" size="lg" className="bg-brand-gradient text-primary-foreground hover:opacity-90">Create event</Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>;
}
