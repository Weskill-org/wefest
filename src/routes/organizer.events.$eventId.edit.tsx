import React from "react";
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
  Users,
  Plus,
  X,
  Tag,
  Ticket
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/events/$eventId/edit")({
  loader: async ({ params }) => {
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

const ALL_TAGS = [
  "music", "dance", "tech", "sports", "fashion", "food", "art", "literature",
  "photography", "drama", "comedy", "magic", "quiz", "debate", "workshop",
  "seminar", "conference", "exhibition", "fair", "festival", "concert", "show",
  "performance", "competition", "tournament", "game", "race", "challenge",
  "film", "hackathon"
];

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Label>
      {children}
    </div>
  );
}

// Normalize team_members from the DB: could be string[] or {name,role}[]
function normalizeMembers(raw: any[]): { name: string; role: string }[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map(m =>
    typeof m === "string"
      ? { name: m, role: "Member" }
      : { name: m.name || "", role: m.role || "Member" }
  );
}

function EditEvent() {
  const event = Route.useLoaderData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { eventId } = Route.useParams();

  // Initialise tags as string[]
  const initialTags: string[] = Array.isArray(event.tags) ? (event.tags as string[]) : [];

  const [form, setForm] = useState({
    title: event.title || "",
    date: event.date ? event.date.slice(0, 10) : "",
    city: event.city || "",
    category: event.category || "Cultural",
    description: event.description || "",
    price_from: event.price_from?.toString() || "",
    attendees: event.attendees?.toString() || "",
    status: (event.status || "draft") as "draft" | "published" | "archived" | "cancelled",
    venue: (event as any).venue || "",
    time: (event as any).time || "",
    tags: initialTags,
    team_members: normalizeMembers((event as any).team_members || []),
    pass_settings: (event as any).pass_settings || {
      vip: { enabled: false, price: 0, days: 1, single_day_price: 0, multi_day_price: 0 },
      normal: { enabled: true, price: 0, days: 1, single_day_price: 0, multi_day_price: 0 }
    }
  });

  // Team member input state
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter(t => t !== tag)
        : [...f.tags, tag]
    }));
  };

  const updatePass = (type: 'vip' | 'normal', field: string, value: any) => {
    setForm(f => ({
      ...f,
      pass_settings: {
        ...(f.pass_settings as any),
        [type]: {
          ...(f.pass_settings as any)[type],
          [field]: value
        }
      }
    }));
  };

  const addTeamMember = () => {
    if (!newMemberName.trim()) return;
    setForm(f => ({
      ...f,
      team_members: [...f.team_members, { name: newMemberName.trim(), role: newMemberRole.trim() || "Member" }]
    }));
    setNewMemberName("");
    setNewMemberRole("");
  };

  const removeTeamMember = (index: number) => {
    setForm(f => ({
      ...f,
      team_members: f.team_members.filter((_, i) => i !== index)
    }));
  };

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
          status: form.status,
          venue: form.venue,
          time: form.time,
          tags: form.tags,
          team_members: form.team_members,
          pass_settings: form.pass_settings
        })
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["all-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
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

        <div className="grid gap-6 sm:grid-cols-2 border-t border-border/20 pt-6">
          <Field label="Venue" icon={MapPin}>
            <Input 
              value={form.venue} 
              onChange={(e) => set("venue", e.target.value)} 
              placeholder="e.g. Open Air Theater" 
              className="h-11 rounded-xl border-border/50 bg-muted/5"
            />
          </Field>
          <Field label="Time" icon={Calendar}>
            <Input 
              value={form.time} 
              onChange={(e) => set("time", e.target.value)} 
              placeholder="e.g. 10:00 AM - 8:00 PM" 
              className="h-11 rounded-xl border-border/50 bg-muted/5"
            />
          </Field>
        </div>

        {/* Status */}
        <Field label="Publication Status" icon={Info}>
          <div className="flex flex-wrap gap-2">
            {(["draft", "published", "archived", "cancelled"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("status", s)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  form.status === s 
                    ? s === "published" 
                      ? "bg-emerald-500 text-white shadow-glow"
                      : s === "cancelled"
                        ? "bg-red-500 text-white"
                        : s === "archived"
                          ? "bg-muted text-foreground"
                          : "bg-amber-500 text-white"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {form.status === "draft" && "Only you can see this event. Students won't see it until published."}
            {form.status === "published" && "Event is live and visible to students."}
            {form.status === "archived" && "Event is hidden from the public marketplace."}
            {form.status === "cancelled" && "Event is cancelled and hidden from students."}
          </p>
        </Field>

        {/* Tags — Rich Chip Selector */}
        <div className="space-y-3 border-t border-border/20 pt-6">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-display font-bold text-sm">Event Tags</h3>
            <span className="ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {form.tags.length} selected
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Select tags that best describe your festival. These help students discover your event.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-150 border",
                  form.tags.includes(tag)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                    : "bg-muted/20 text-muted-foreground border-border/40 hover:bg-muted/40 hover:text-foreground hover:border-border"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {form.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="text-primary/60 hover:text-primary transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="space-y-4 border-t border-border/20 pt-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="font-display font-bold text-sm">Team Members</h3>
            <span className="ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {form.team_members.length} added
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Add or remove committee members organizing this event.
          </p>

          {/* Add member row */}
          <div className="flex gap-2">
            <Input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Full name"
              className="h-9 rounded-lg border-border/40 bg-muted/5 text-sm flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTeamMember(); }}}
            />
            <Input
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              placeholder="Role (e.g. Coordinator)"
              className="h-9 rounded-lg border-border/40 bg-muted/5 text-sm flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTeamMember(); }}}
            />
            <button
              type="button"
              onClick={addTeamMember}
              disabled={!newMemberName.trim()}
              className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150",
                newMemberName.trim()
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Team member list */}
          {form.team_members.length > 0 && (
            <div className="rounded-xl border border-border/40 bg-muted/5 divide-y divide-border/30 overflow-hidden">
              {form.team_members.map((member, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-bold">{member.name}</div>
                    <div className="text-[11px] text-muted-foreground">{member.role}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pass Settings */}
        <div className="space-y-4 border-t border-border/20 pt-6">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            <h3 className="font-display font-bold text-sm">Pass Settings</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Normal Pass */}
            <div className="rounded-2xl border border-border/40 bg-muted/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-black uppercase tracking-widest text-xs">Normal Pass</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={(form.pass_settings as any).normal.enabled}
                    onChange={(e) => updatePass('normal', 'enabled', e.target.checked)}
                    className="rounded border-border/50 accent-primary"
                  />
                  <span className="text-[10px] font-bold">Enabled</span>
                </label>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase opacity-60">Full Pass Price (₹)</Label>
                  <Input 
                    type="number"
                    min="0"
                    value={(form.pass_settings as any).normal.price}
                    onChange={(e) => updatePass('normal', 'price', parseInt(e.target.value) || 0)}
                    className="h-9 rounded-lg border-border/30 bg-background"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Days</Label>
                    <Input 
                      type="number"
                      min="1"
                      value={(form.pass_settings as any).normal.days}
                      onChange={(e) => updatePass('normal', 'days', parseInt(e.target.value) || 1)}
                      className="h-9 rounded-lg border-border/30 bg-background"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Single Day (₹)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={(form.pass_settings as any).normal.single_day_price}
                      onChange={(e) => updatePass('normal', 'single_day_price', parseInt(e.target.value) || 0)}
                      className="h-9 rounded-lg border-border/30 bg-background"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Multi Day (₹)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={(form.pass_settings as any).normal.multi_day_price}
                      onChange={(e) => updatePass('normal', 'multi_day_price', parseInt(e.target.value) || 0)}
                      className="h-9 rounded-lg border-border/30 bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Pass */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-black uppercase tracking-widest text-xs text-primary">VIP Pass</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={(form.pass_settings as any).vip.enabled}
                    onChange={(e) => updatePass('vip', 'enabled', e.target.checked)}
                    className="rounded border-border/50 accent-primary"
                  />
                  <span className="text-[10px] font-bold text-primary">Enabled</span>
                </label>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase opacity-60">Full Pass Price (₹)</Label>
                  <Input 
                    type="number"
                    min="0"
                    value={(form.pass_settings as any).vip.price}
                    onChange={(e) => updatePass('vip', 'price', parseInt(e.target.value) || 0)}
                    className="h-9 rounded-lg border-border/30 bg-background"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Days</Label>
                    <Input 
                      type="number"
                      min="1"
                      value={(form.pass_settings as any).vip.days}
                      onChange={(e) => updatePass('vip', 'days', parseInt(e.target.value) || 1)}
                      className="h-9 rounded-lg border-border/30 bg-background"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Single Day (₹)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={(form.pass_settings as any).vip.single_day_price}
                      onChange={(e) => updatePass('vip', 'single_day_price', parseInt(e.target.value) || 0)}
                      className="h-9 rounded-lg border-border/30 bg-background"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Multi Day (₹)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={(form.pass_settings as any).vip.multi_day_price}
                      onChange={(e) => updatePass('vip', 'multi_day_price', parseInt(e.target.value) || 0)}
                      className="h-9 rounded-lg border-border/30 bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
