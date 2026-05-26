import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
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
  School,
  Users,
  Plus,
  X,
  Tag,
  Ticket,
  Dices,
  Link2,
  Check,
  AlertCircle,
  Clock,
  Trash
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateEventSlug, formatSlug } from "@/lib/event-words";
import { capacityToDb } from "@/lib/event-capacity";
import { CapacityField } from "@/components/organizer/capacity-field";
import { serializePassSettings } from "@/lib/pass-settings";
import { TimePicker } from "@/components/organizer/time-picker";

export const Route = createFileRoute("/organizer/new")({
  head: () => ({ 
    meta: [
      { title: "Create Event — WeFest" }, 
      { name: "description", content: "Launch your next festival on the WeFest platform." }
    ] 
  }),
  component: NewEvent,
});

const sanitizeNumberInput = (val: string) => {
  if (!val) return "";
  return val.replace(/^0+(?=\d)/, "");
};

const ALL_TAGS = [
  "music", "dance", "tech", "sports", "fashion", "food", "art", "literature",
  "photography", "drama", "comedy", "magic", "quiz", "debate", "workshop",
  "seminar", "conference", "exhibition", "fair", "festival", "concert", "show",
  "performance", "competition", "tournament", "game", "race", "challenge",
  "film", "hackathon"
];

function NewEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Slug State ──────────────────────────────────────────────
  const [slugWord1, setSlugWord1] = useState("");
  const [slugWord2, setSlugWord2] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced uniqueness check
  const checkSlugUniqueness = useCallback((w1: string, w2: string) => {
    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    if (!w1 || !w2 || w1.length < 2 || w2.length < 2) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    slugCheckTimer.current = setTimeout(async () => {
      const slug = formatSlug(w1, w2);
      const { data } = await supabase.from("events").select("id").eq("slug", slug).maybeSingle();
      setSlugStatus(data ? "taken" : "available");
    }, 500);
  }, []);

  useEffect(() => {
    const initial = generateEventSlug();
    const [w1, w2] = initial.split(".");
    setSlugWord1(w1);
    setSlugWord2(w2);
    checkSlugUniqueness(w1, w2);
  }, [checkSlugUniqueness]);

  const handleSlugWord1 = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z]/g, "");
    setSlugWord1(clean);
    checkSlugUniqueness(clean, slugWord2);
  };

  const handleSlugWord2 = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z]/g, "");
    setSlugWord2(clean);
    checkSlugUniqueness(slugWord1, clean);
  };

  const regenerateSlug = () => {
    const fresh = generateEventSlug();
    const [w1, w2] = fresh.split(".");
    setSlugWord1(w1);
    setSlugWord2(w2);
    checkSlugUniqueness(w1, w2);
  };

  const [form, setForm] = useState({ 
    title: "",
    date: "",
    city: "",
    category: "Cultural",
    description: "",
    college_id: "",
    price_from: "",
    capacity_unlimited: true,
    capacity: "",
    status: "draft" as "draft" | "published" | "archived" | "cancelled",
    venue: "",
    time: "",
    tags: [] as string[],
    team_members: [] as { name: string; role: string }[],
    pass_settings: [
      { id: "normal", name: "Normal Pass", enabled: true, price: "", days: "1", single_day_price: "", multi_day_price: "" },
      { id: "vip", name: "VIP Pass", enabled: false, price: "", days: "1", single_day_price: "", multi_day_price: "" }
    ]
  });

  // Team member input state
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

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

  const validateForm = (isDraft = false): string | null => {
    if (!form.title.trim()) return "Event title is required";
    if (!form.college_id) return "Your account must be linked to a college";
    if (isDraft) return null;
    if (!form.date) return "Event date is required";
    if (!form.city.trim()) return "City is required";
    if (!slugWord1 || !slugWord2 || slugWord1.length < 2 || slugWord2.length < 2) {
      return "Enter a valid two-word event code";
    }
    if (slugStatus === "taken") return "This event code is already taken";
    if (slugStatus === "checking") return "Still checking event code availability";
    if (!form.capacity_unlimited) {
      const cap = parseInt(form.capacity, 10);
      if (!Number.isFinite(cap) || cap < 1) {
        return "Enter maximum attendees or enable unlimited capacity";
      }
    }
    return null;
  };

  const createMutation = useMutation({
    mutationFn: async ({ status, finalMembers }: { status: "draft" | "published" | "archived" | "cancelled", finalMembers: any[] }) => {
      if (!userData) throw new Error("Please login to create events");

      const validationError = validateForm(status === "draft");
      if (validationError) throw new Error(validationError);

      const selectedCollege = colleges?.find(c => c.id === form.college_id);
      const eventSlug = formatSlug(slugWord1, slugWord2);

      const finalPassSettings = serializePassSettings(form.pass_settings);

      const { error } = await supabase.from("events").insert({
        title: form.title.trim(),
        date: form.date,
        city: form.city.trim(),
        category: form.category,
        description: form.description.trim(),
        price_from: form.price_from ? parseFloat(form.price_from) : 0,
        attendees: capacityToDb(form.capacity_unlimited, form.capacity),
        college_id: form.college_id || null,
        college_name: membership?.colleges?.name || selectedCollege?.name || "Institutional Event",
        organizer_user_id: userData.id,
        organizer: membership?.colleges?.name || userData.user_metadata?.full_name || userData.email || "Organizer",
        status,
        venue: form.venue.trim(),
        time: form.time.trim(),
        tags: form.tags,
        team_members: finalMembers,
        pass_settings: finalPassSettings,
        slug: eventSlug,
      });

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast.success(`${form.title} has been created!`, {
        description: status === "published" 
          ? "Your festival is now visible on the marketplace." 
          : "Saved as draft. Publish when ready."
      });
      queryClient.invalidateQueries({ queryKey: ["my-college-events"] });
      queryClient.invalidateQueries({ queryKey: ["all-college-events"] });
      navigate({ to: "/organizer/events" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create event", {
        description: "Please check all required fields and try again."
      });
    }
  });

  const launch = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm(false);
    if (err) {
      toast.error(err);
      return;
    }
    // Limit Check
    const targetStatus = form.status === "draft" ? "published" : form.status;
    if (targetStatus === "published") {
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
    
    createMutation.mutate({ status: form.status === "draft" ? "published" : form.status, finalMembers });
  };

  const saveDraft = () => {
    const err = validateForm(true);
    if (err) {
      toast.error(err);
      return;
    }
    
    // Auto-add pending team member
    let finalMembers = form.team_members;
    if (newMemberName.trim()) {
      finalMembers = [...form.team_members, { name: newMemberName.trim(), role: newMemberRole.trim() || "Member" }];
      setForm(f => ({ ...f, team_members: finalMembers }));
      setNewMemberName("");
      setNewMemberRole("");
    }
    
    createMutation.mutate({ status: "draft", finalMembers });
  };

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
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    launch(e);
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
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

        {/* ── Event Code (Two-Word Slug) ── */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-bold">
            <Link2 className="h-3.5 w-3.5 text-primary" />
            Event Code
          </Label>
          <p className="text-xs text-muted-foreground">
            A unique two-word code for your event. Students can find your event by typing these two words. Your public URL will be <span className="font-bold text-foreground">wefest.com/fest/{slugWord1}.{slugWord2}</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-0 rounded-xl border border-border/50 bg-muted/10 overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all opacity-80 cursor-not-allowed">
              <input
                type="text"
                value={slugWord1}
                readOnly
                onChange={(e) => handleSlugWord1(e.target.value)}
                placeholder="word1"
                className="flex-1 h-11 px-4 bg-transparent text-base font-bold text-right outline-none placeholder:text-muted-foreground/40 cursor-not-allowed"
                maxLength={20}
              />
              <div className="flex items-center justify-center w-8 shrink-0">
                <span className="text-2xl font-black text-primary">.</span>
              </div>
              <input
                type="text"
                value={slugWord2}
                readOnly
                onChange={(e) => handleSlugWord2(e.target.value)}
                placeholder="word2"
                className="flex-1 h-11 px-4 bg-transparent text-base font-bold outline-none placeholder:text-muted-foreground/40 cursor-not-allowed"
                maxLength={20}
              />
            </div>
            <button
              type="button"
              onClick={regenerateSlug}
              className="h-11 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-2 shrink-0 font-bold text-sm"
              title="Generate random code"
            >
              <Dices className="h-4 w-4" />
              Generate
            </button>
          </div>
          {/* Status indicator */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-2 h-5">
              {slugStatus === "checking" && (
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                  <Loader2 className="h-3 w-3 animate-spin" /> Checking availability…
                </span>
              )}
              {slugStatus === "available" && (
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-bold">
                  <Check className="h-3 w-3" /> {slugWord1}.{slugWord2} is available!
                </span>
              )}
              {slugStatus === "taken" && (
                <span className="flex items-center gap-1.5 text-[11px] text-red-500 font-bold">
                  <AlertCircle className="h-3 w-3" /> This code is already taken. Try generating a new one.
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-1.5">
              <Info className="h-3 w-3" /> Event codes are permanent and cannot be changed after creation.
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
          <Field label="Starting price (₹)" icon={Ticket}>
            <Input
              type="number"
              min="0"
              step="1"
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

        <div className="grid gap-6 sm:grid-cols-2">
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
            Add the core committee members organizing this event. You can add coordinators, volunteers, etc.
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
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={createMutation.isPending || loadingColleges}
            size="lg" 
            className="flex-[2] h-12 bg-brand-gradient text-base font-black uppercase tracking-widest text-white shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Launch Event"
            )}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            disabled={createMutation.isPending || loadingColleges}
            onClick={saveDraft}
            size="lg" 
            className="flex-1 h-12 border-border/50 font-bold rounded-xl"
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );
}
