import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
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
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/events/$eventId/edit")({
  loader: async ({ params, context }) => {
    const ctx = context as any;
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.eventId)
      .maybeSingle();

    if (error || !event) throw notFound();
    return event;
  },
  component: EditEvent,
});

function EditEvent() {
  const event = Route.useLoaderData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { eventId } = Route.useParams();

  const [form, setForm] = useState({
    title: event.title || "",
    date: event.date ? event.date.slice(0, 10) : "",
    city: event.city || "",
    category: event.category || "Cultural",
    description: event.description || "",
    price_from: event.price_from?.toString() || "",
    attendees: event.attendees?.toString() || "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("events")
        .update({
          title: form.title,
          date: form.date,
          city: form.city,
          category: form.category,
          description: form.description,
          price_from: form.price_from ? parseFloat(form.price_from) : undefined,
          attendees: form.attendees ? parseInt(form.attendees) : undefined,
        })
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["all-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // Go back to event management page
      navigate({ to: "/organizer/events/$eventId", params: { eventId } });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save changes");
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Pencil className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">
            Edit Event
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update the details of <span className="font-bold text-foreground">{event.title}</span>
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
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

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Starting Price (₹)" icon={Info}>
            <Input
              type="number"
              min="0"
              value={form.price_from}
              onChange={(e) => set("price_from", e.target.value)}
              placeholder="e.g. 299"
              className="h-11 rounded-xl border-border/50 bg-muted/5"
            />
          </Field>
          <Field label="Expected Attendees" icon={Info}>
            <Input
              type="number"
              min="0"
              value={form.attendees}
              onChange={(e) => set("attendees", e.target.value)}
              placeholder="e.g. 5000"
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

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-xl font-bold"
            onClick={() =>
              navigate({
                to: "/organizer/events/$eventId",
                params: { eventId },
              })
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            size="lg"
            className="flex-1 h-12 bg-brand-gradient text-base font-black uppercase tracking-widest text-white shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
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
