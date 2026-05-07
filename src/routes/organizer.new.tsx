import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/organizer/new")({
  head: () => ({ meta: [{ title: "New event — WeFest" }, { name: "description", content: "Create a new festival on WeFest." }] }),
  component: NewEvent,
});

function NewEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ 
    title: "", 
    date: "", 
    city: "", 
    category: "Cultural", 
    description: "",
    college_id: ""
  });

  const { data: colleges, isLoading: loadingColleges } = useQuery({
    queryKey: ["colleges-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("colleges").select("id, name").order("name");
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to create events");

      const selectedCollege = colleges?.find(c => c.id === form.college_id);
      
      const { error } = await supabase.from("events").insert({
        title: form.title,
        date: form.date,
        city: form.city,
        category: form.category,
        description: form.description,
        college_id: form.college_id || null,
        college_name: selectedCollege?.name || "Independent",
        organizer_user_id: user.id,
        organizer: user.user_metadata?.full_name || user.email || "Organizer",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${form.title} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate({ to: "/organizer" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create event");
    }
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.college_id) {
      toast.error("Please select a college");
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-4xl font-black">Create a new event</h1>
      <p className="mt-2 text-muted-foreground">Set up the basics. You can configure sub-events, tiers and sponsors next.</p>

      <form onSubmit={submit} className="glass mt-8 grid gap-4 rounded-2xl p-6">
        <Field label="Title">
          <Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Mood Indigo 2026" />
        </Field>
        
        <Field label="College">
          <select 
            required
            value={form.college_id} 
            onChange={(e) => set("college_id", e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="" className="bg-background">Select a college</option>
            {colleges?.map((c) => <option key={c.id} value={c.id} className="bg-background">{c.name}</option>)}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date"><Input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="City"><Input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Mumbai" /></Field>
        </div>
        
        <Field label="Category">
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
            {["Cultural", "Tech", "Sports", "Business", "Arts"].map((c) => <option key={c} className="bg-background">{c}</option>)}
          </select>
        </Field>
        
        <Field label="Description">
          <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What makes this fest unforgettable?" />
        </Field>
        
        <Button 
          type="submit" 
          disabled={createMutation.isPending || loadingColleges}
          size="lg" 
          className="bg-brand-gradient text-primary-foreground hover:opacity-90"
        >
          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create event"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>;
}
