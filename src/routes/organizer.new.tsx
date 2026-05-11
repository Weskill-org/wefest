import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  Type, 
  Info, 
  Sparkles,
  School
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/new")({
  head: () => ({ 
    meta: [
      { title: "Create Event — WeFest" }, 
      { name: "description", content: "Launch your next festival on the WeFest platform." }
    ] 
  }),
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

  const { data: userData } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: colleges, isLoading: loadingColleges } = useQuery({
    queryKey: ["colleges-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("colleges").select("id, name").order("name");
      if (error) throw error;
      return data;
    }
  });

  const ctx = Route.useRouteContext() as any;
  const membership = ctx.membership;

  // Pre-fill college from context
  useEffect(() => {
    const userCollegeId = membership?.college_id || userData?.user_metadata?.college_id;
    
    if (userCollegeId && !form.college_id) {
      setForm(f => ({ ...f, college_id: userCollegeId }));
    } else if (!userCollegeId && userData?.user_metadata?.full_name && colleges) {
      const matchedCollege = colleges.find(c => 
        c.name.toLowerCase() === userData.user_metadata.full_name.toLowerCase()
      );
      if (matchedCollege && !form.college_id) {
        setForm(f => ({ ...f, college_id: matchedCollege.id }));
      }
    }
  }, [userData, membership, form.college_id, colleges]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!userData) throw new Error("Please login to create events");

      const selectedCollege = colleges?.find(c => c.id === form.college_id);
      
      const { error } = await supabase.from("events").insert({
        title: form.title,
        date: form.date,
        city: form.city,
        category: form.category,
        description: form.description,
        college_id: form.college_id || null,
        college_name: membership?.colleges?.name || selectedCollege?.name || "Institutional Event",
        organizer_user_id: userData.id,
        organizer: membership?.colleges?.name || userData.user_metadata?.full_name || userData.email || "Organizer",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${form.title} has been launched!`, {
        description: "Your festival is now visible on the marketplace."
      });
      queryClient.invalidateQueries({ queryKey: ["my-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["all-college-events"] });
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
      toast.error("Institutional ID missing", {
        description: "Your account is not linked to a college. Please ensure your profile name matches your institution or contact support."
      });
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">
          Create Festival
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Define the core identity of your event. You'll add sub-events, ticket tiers, and sponsorship packages later.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Institution Info */}
        <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/10 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <School className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold truncate">
              {membership?.colleges?.name || colleges?.find(c => c.id === form.college_id)?.name || "Institutional Account"}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Linked to your institution
            </div>
          </div>
        </div>
        {!form.college_id && (
          <div className="rounded-lg bg-amber-500/10 p-3 border border-amber-500/20 flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-500 font-bold">
              Identity verification required. If your college isn't listed, please update your College Details in Settings.
            </p>
          </div>
        )}

        <Field label="Event Title" icon={Type}>
          <Input 
            required 
            value={form.title} 
            onChange={(e) => set("title", e.target.value)} 
            placeholder="e.g. Mood Indigo 2026" 
            className="h-11 rounded-xl border-border/50 bg-muted/5 text-base font-medium"
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Date" icon={Calendar}>
            <Input 
              required 
              type="date" 
              value={form.date} 
              onChange={(e) => set("date", e.target.value)} 
              className="h-11 rounded-xl border-border/50 bg-muted/5"
            />
          </Field>
          <Field label="City" icon={MapPin}>
            <Input 
              required 
              value={form.city} 
              onChange={(e) => set("city", e.target.value)} 
              placeholder="e.g. Mumbai" 
              className="h-11 rounded-xl border-border/50 bg-muted/5"
            />
          </Field>
        </div>
        
        <Field label="Category" icon={Sparkles}>
          <div className="flex flex-wrap gap-2">
            {["Cultural", "Tech", "Sports", "Business", "Arts"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("category", c)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition-all duration-200",
                  form.category === c 
                    ? "bg-primary text-primary-foreground shadow-glow" 
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>
        
        <Field label="Description" icon={Info}>
          <Textarea 
            rows={5} 
            value={form.description} 
            onChange={(e) => set("description", e.target.value)} 
            placeholder="Tell the world what makes this festival unforgettable..." 
            className="rounded-xl border-border/50 bg-muted/5 text-sm leading-relaxed"
          />
        </Field>
        
        <Button 
          type="submit" 
          disabled={createMutation.isPending || loadingColleges}
          size="lg" 
          className="h-12 w-full bg-brand-gradient text-base font-black uppercase tracking-widest text-white shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl"
        >
          {createMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Launch Event"
          )}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 text-sm font-bold">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );
}
