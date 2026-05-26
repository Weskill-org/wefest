import React from "react";
import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, Calendar, MapPin, Type, Info, Sparkles, Pencil,
  Users, Plus, X, Tag, Ticket, Link2, Dices, Check, AlertCircle, BadgeCheck, Clock, Trash
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateEventSlug, formatSlug, parseSlug } from "@/lib/event-words";
import { capacityFromDb, capacityToDb } from "@/lib/event-capacity";
import { CapacityField } from "@/components/organizer/capacity-field";
import { TimePicker } from "@/components/organizer/time-picker";
import { parsePassSettings, serializePassSettings } from "@/lib/pass-settings";

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

const sanitizeNumberInput = (val: string) => {
  if (!val) return "";
  return val.replace(/^0+(?=\d)/, "");
};

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

  // Limit check data
  const { data: userData } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: subscription } = useQuery({
    queryKey: ["my-subscription", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userData!.id)
        .eq("status", "active")
        .maybeSingle();
      if (error && error.code !== "PGRST116") throw error;
      return data || { plan_type: "free" };
    },
  });

  const { data: publishedCount } = useQuery({
    queryKey: ["my-published-events-count", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("organizer_user_id", userData!.id)
        .eq("status", "published");
      if (error) throw error;
      return count || 0;
    },
  });

  // Initialise tags as string[]
  const initialTags: string[] = Array.isArray(event.tags) ? (event.tags as string[]) : [];

  const initialCapacity = capacityFromDb(event.attendees);

  const initialPassSettings = parsePassSettings(event.pass_settings);

  const [form, setForm] = useState({
    title: event.title || "",
    date: event.date ? event.date.slice(0, 10) : "",
    city: event.city || "",
    category: event.category || "Cultural",
    description: event.description || "",
    price_from: event.price_from?.toString() || "",
    capacity_unlimited: initialCapacity.unlimited,
    capacity: initialCapacity.value,
    status: (event.status || "draft") as "draft" | "published" | "archived" | "cancelled",
    venue: (event as any).venue || "",
    time: (event as any).time || "",
    tags: initialTags,
    team_members: normalizeMembers((event as any).team_members || []),
    pass_settings: initialPassSettings
  });

  // Team member input state
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  // ── Slug State (Read Only) ──────────────────────────────────────────────
  const existingSlug = (event as any).slug || "";
  const { word1: initW1, word2: initW2 } = parseSlug(existingSlug);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter(t => t !== tag)
        : [...f.tags, tag]
    }));
  };

  const updatePass = (index: number, field: string, value: any) => {
    setForm(f => {
      const updated = [...f.pass_settings];
      updated[index] = { ...updated[index], [field]: value };
      return { ...f, pass_settings: updated };
    });
  };

  const addPassTier = () => {
    setForm(f => ({
      ...f,
      pass_settings: [
        ...f.pass_settings,
        {
          id: `pass-${Date.now()}`,
          name: "",
          enabled: true,
          price: "",
          days: "1",
          single_day_price: "",
          multi_day_price: ""
        }
      ]
    }));
  };

  const removePassTier = (index: number) => {
    if (form.pass_settings.length <= 1) return;
    setForm(f => ({
      ...f,
      pass_settings: f.pass_settings.filter((_, i) => i !== index)
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
    mutationFn: async (finalMembers: any[]) => {
      const finalPassSettings = serializePassSettings(form.pass_settings);

      const { error } = await supabase
        .from("events")
        .update({
          title: form.title,
          date: form.date,
          city: form.city,
          category: form.category,
          description: form.description,
          price_from: form.price_from ? parseFloat(form.price_from) : 0,
          attendees: capacityToDb(form.capacity_unlimited, form.capacity),
          status: form.status,
          venue: form.venue,
          time: form.time,
          tags: form.tags,
          team_members: finalMembers,
          pass_settings: finalPassSettings
        })
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["all-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate({ to: "/organizer/events/$eventId", params: { eventId }, search: { tab: "analytics" } });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save changes");
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limit Check for Publishing
    if (form.status === "published" && event.status !== "published") {
      if (subscription?.plan_type === "free" && (publishedCount || 0) >= 3) {
        toast.error("Free Tier Limit Reached", {
          description: "You can only have 3 active fests at a time. Please upgrade to Premium."
        });
        navigate({ to: "/organizer/settings" });
        return;
      }
    }

    // Auto-add pending team member
    let finalMembers = form.team_members;
    if (newMemberName.trim()) {
      finalMembers = [...form.team_members, { name: newMemberName.trim(), role: newMemberRole.trim() || "Member" }];
      setForm(f => ({ ...f, team_members: finalMembers }));
      setNewMemberName("");
      setNewMemberRole("");
    }
    
    updateMutation.mutate(finalMembers);
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
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

        {/* ── Event Code (Slug) ── */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Link2 className="h-3.5 w-3.5" /> Event Code
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 w-fit">
              <span className="text-lg font-black text-primary">{initW1}</span>
              <span className="text-primary/40 text-2xl font-black">.</span>
              <span className="text-lg font-black text-primary">{initW2}</span>
              <BadgeCheck className="h-4 w-4 text-primary ml-1" />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-1.5">
              <Info className="h-3 w-3" /> Event codes are permanent and cannot be changed after creation.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Public URL: <span className="font-bold text-foreground">wefest.com/fest/{existingSlug}</span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Date" icon={Calendar}>
            <div className="relative">
              <Input
                required
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="h-11 rounded-xl border-border/50 bg-muted/5 pr-10 cursor-pointer w-full"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
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
              onChange={(e) => set("price_from", sanitizeNumberInput(e.target.value))}
              placeholder="e.g. 299"
              className="h-11 rounded-xl border-border/50 bg-muted/5"
            />
          </Field>
          <Field label="Event capacity" icon={Users}>
            <CapacityField
              unlimited={form.capacity_unlimited}
              value={form.capacity}
              onUnlimitedChange={(v) => set("capacity_unlimited", v)}
              onValueChange={(v) => set("capacity", v)}
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
          <Field label="Time" icon={Clock}>
            <TimePicker 
              value={form.time} 
              onChange={(v) => set("time", v)} 
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

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Full name"
              className="h-10 rounded-lg border-border/40 bg-muted/5 text-sm sm:flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTeamMember(); }}}
            />
            <Input
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              placeholder="Role (e.g. Coordinator)"
              className="h-10 rounded-lg border-border/40 bg-muted/5 text-sm sm:flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTeamMember(); }}}
            />
            <Button
              type="button"
              onClick={addTeamMember}
              disabled={!newMemberName.trim()}
              className="h-10 shrink-0 rounded-lg font-bold text-xs gap-1.5 px-4"
            >
              <Plus className="h-4 w-4" />
              Add member
            </Button>
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
          <p className="text-xs text-muted-foreground">
            Configure ticket tiers and pricing. You can offer custom ticket tiers and per-day pricing.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {form.pass_settings.map((pass, index) => (
              <div 
                key={pass.id} 
                className={cn(
                  "rounded-2xl border p-5 space-y-4 transition-all relative group",
                  pass.enabled 
                    ? pass.id === 'vip' 
                      ? "border-primary/20 bg-primary/5" 
                      : "border-border/40 bg-muted/5" 
                    : "opacity-50 border-border/20 bg-muted/5"
                )}
              >
                {/* Delete button (only show if we have more than 1 pass tier) */}
                {form.pass_settings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassTier(index)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete tier"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}

                <div className="flex items-center justify-between pr-8">
                  <input
                    type="text"
                    value={pass.name}
                    onChange={(e) => updatePass(index, 'name', e.target.value)}
                    placeholder="e.g. Silver Pass"
                    className="bg-transparent font-black uppercase tracking-widest text-xs border-b border-transparent hover:border-border/40 focus:border-primary outline-none py-0.5 text-foreground shrink-0 max-w-[150px]"
                  />
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={pass.enabled}
                      onChange={(e) => updatePass(index, 'enabled', e.target.checked)}
                      className="rounded border-border/50 accent-primary"
                    />
                    <span className="text-[10px] font-bold">Enabled</span>
                  </label>
                </div>

                <div className={cn("grid gap-3", !pass.enabled && "pointer-events-none")}>
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Full Pass Price (₹)</Label>
                    <Input 
                      type="number"
                      min="0"
                      disabled={!pass.enabled}
                      value={pass.price}
                      onChange={(e) => updatePass(index, 'price', sanitizeNumberInput(e.target.value))}
                      className="h-9 rounded-lg border-border/30 bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] font-bold uppercase opacity-60">Days</Label>
                      <Input 
                        type="number"
                        min="1"
                        value={pass.days}
                        onChange={(e) => updatePass(index, 'days', sanitizeNumberInput(e.target.value))}
                        className="h-9 rounded-lg border-border/30 bg-background"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] font-bold uppercase opacity-60">Single Day (₹)</Label>
                      <Input 
                        type="number"
                        min="0"
                        value={pass.single_day_price}
                        onChange={(e) => updatePass(index, 'single_day_price', sanitizeNumberInput(e.target.value))}
                        className="h-9 rounded-lg border-border/30 bg-background"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] font-bold uppercase opacity-60">Multi Day (₹)</Label>
                      <Input 
                        type="number"
                        min="0"
                        value={pass.multi_day_price}
                        onChange={(e) => updatePass(index, 'multi_day_price', sanitizeNumberInput(e.target.value))}
                        className="h-9 rounded-lg border-border/30 bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Pass Card */}
            <button
              type="button"
              onClick={addPassTier}
              className="rounded-2xl border border-dashed border-border/40 hover:border-primary/40 bg-muted/5 hover:bg-primary/5 p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all group min-h-[180px]"
            >
              <div className="h-10 w-10 rounded-full border border-dashed border-border/60 group-hover:border-primary/40 flex items-center justify-center transition-all mb-1">
                <Plus className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider">Add Pass Tier</span>
              <span className="text-[10px] text-muted-foreground/60 font-medium">e.g. Gold, Premium, Early Bird</span>
            </button>
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
                search: { tab: "analytics" },
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
