import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Route, t as cn, a as Button, x as supabase } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { T as Textarea } from "./textarea-D6eI1C7e.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { aj as Pencil, aP as Type, C as Calendar, a8 as MapPin, _ as Info, aF as Sparkles, aH as Tag, aY as X, aV as Users, ak as Plus, aJ as Ticket, a3 as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const ALL_TAGS = ["music", "dance", "tech", "sports", "fashion", "food", "art", "literature", "photography", "drama", "comedy", "magic", "quiz", "debate", "workshop", "seminar", "conference", "exhibition", "fair", "festival", "concert", "show", "performance", "competition", "tournament", "game", "race", "challenge", "film", "hackathon"];
function Field({
  label,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      label
    ] }),
    children
  ] });
}
function normalizeMembers(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((m) => typeof m === "string" ? {
    name: m,
    role: "Member"
  } : {
    name: m.name || "",
    role: m.role || "Member"
  });
}
function EditEvent() {
  const event = Route.useLoaderData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    eventId
  } = Route.useParams();
  const initialTags = Array.isArray(event.tags) ? event.tags : [];
  const [form, setForm] = reactExports.useState({
    title: event.title || "",
    date: event.date ? event.date.slice(0, 10) : "",
    city: event.city || "",
    category: event.category || "Cultural",
    description: event.description || "",
    price_from: event.price_from?.toString() || "",
    attendees: event.attendees?.toString() || "",
    status: event.status || "draft",
    venue: event.venue || "",
    time: event.time || "",
    tags: initialTags,
    team_members: normalizeMembers(event.team_members || []),
    pass_settings: event.pass_settings || {
      vip: {
        enabled: false,
        price: 0,
        days: 1,
        single_day_price: 0,
        multi_day_price: 0
      },
      normal: {
        enabled: true,
        price: 0,
        days: 1,
        single_day_price: 0,
        multi_day_price: 0
      }
    }
  });
  const [newMemberName, setNewMemberName] = reactExports.useState("");
  const [newMemberRole, setNewMemberRole] = reactExports.useState("");
  const set = (k, v) => setForm((f) => ({
    ...f,
    [k]: v
  }));
  const toggleTag = (tag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag]
    }));
  };
  const updatePass = (type, field, value) => {
    setForm((f) => ({
      ...f,
      pass_settings: {
        ...f.pass_settings,
        [type]: {
          ...f.pass_settings[type],
          [field]: value
        }
      }
    }));
  };
  const addTeamMember = () => {
    if (!newMemberName.trim()) return;
    setForm((f) => ({
      ...f,
      team_members: [...f.team_members, {
        name: newMemberName.trim(),
        role: newMemberRole.trim() || "Member"
      }]
    }));
    setNewMemberName("");
    setNewMemberRole("");
  };
  const removeTeamMember = (index) => {
    setForm((f) => ({
      ...f,
      team_members: f.team_members.filter((_, i) => i !== index)
    }));
  };
  const updateMutation = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("events").update({
        title: form.title,
        date: form.date,
        city: form.city,
        category: form.category,
        description: form.description,
        price_from: form.price_from ? parseFloat(form.price_from) : void 0,
        attendees: form.attendees ? parseInt(form.attendees) : void 0,
        status: form.status,
        venue: form.venue,
        time: form.time,
        tags: form.tags,
        team_members: form.team_members,
        pass_settings: form.pass_settings
      }).eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["my-college-events"]
      });
      queryClient.invalidateQueries({
        queryKey: ["all-college-events"]
      });
      queryClient.invalidateQueries({
        queryKey: ["events"]
      });
      navigate({
        to: "/organizer/events/$eventId",
        params: {
          eventId
        }
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save changes");
    }
  });
  const submit = (e) => {
    e.preventDefault();
    updateMutation.mutate();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 lg:px-10 lg:py-10 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight lg:text-3xl", children: "Edit Event" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Update the details of ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: event.title })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Event Title", icon: Type, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.title, onChange: (e) => set("title", e.target.value), placeholder: "e.g. Mood Indigo 2026", className: "h-11 rounded-xl border-border/50 bg-muted/5 text-base font-medium" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date", icon: Calendar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: "date", value: form.date, onChange: (e) => set("date", e.target.value), className: "h-11 rounded-xl border-border/50 bg-muted/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "City", icon: MapPin, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.city, onChange: (e) => set("city", e.target.value), placeholder: "e.g. Mumbai", className: "h-11 rounded-xl border-border/50 bg-muted/5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Starting Price (₹)", icon: Info, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.price_from, onChange: (e) => set("price_from", e.target.value), placeholder: "e.g. 299", className: "h-11 rounded-xl border-border/50 bg-muted/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Expected Attendees", icon: Info, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.attendees, onChange: (e) => set("attendees", e.target.value), placeholder: "e.g. 5000", className: "h-11 rounded-xl border-border/50 bg-muted/5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", icon: Sparkles, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["Cultural", "Tech", "Sports", "Business", "Arts"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => set("category", c), className: cn("rounded-full px-4 py-2 text-sm font-bold transition-all duration-200", form.category === c ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"), children: c }, c)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", icon: Info, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, value: form.description, onChange: (e) => set("description", e.target.value), placeholder: "Tell the world what makes this festival unforgettable...", className: "rounded-xl border-border/50 bg-muted/5 text-sm leading-relaxed" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 sm:grid-cols-2 border-t border-border/20 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Venue", icon: MapPin, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.venue, onChange: (e) => set("venue", e.target.value), placeholder: "e.g. Open Air Theater", className: "h-11 rounded-xl border-border/50 bg-muted/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Time", icon: Calendar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.time, onChange: (e) => set("time", e.target.value), placeholder: "e.g. 10:00 AM - 8:00 PM", className: "h-11 rounded-xl border-border/50 bg-muted/5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Publication Status", icon: Info, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["draft", "published", "archived", "cancelled"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => set("status", s), className: cn("rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200", form.status === s ? s === "published" ? "bg-emerald-500 text-white shadow-glow" : s === "cancelled" ? "bg-red-500 text-white" : s === "archived" ? "bg-muted text-foreground" : "bg-amber-500 text-white" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"), children: s }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1", children: [
          form.status === "draft" && "Only you can see this event. Students won't see it until published.",
          form.status === "published" && "Event is live and visible to students.",
          form.status === "archived" && "Event is hidden from the public marketplace.",
          form.status === "cancelled" && "Event is cancelled and hidden from students."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-t border-border/20 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm", children: "Event Tags" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: [
            form.tags.length,
            " selected"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select tags that best describe your festival. These help students discover your event." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ALL_TAGS.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleTag(tag), className: cn("rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-150 border", form.tags.includes(tag) ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105" : "bg-muted/20 text-muted-foreground border-border/40 hover:bg-muted/40 hover:text-foreground hover:border-border"), children: [
          "#",
          tag
        ] }, tag)) }),
        form.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 pt-1", children: form.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary", children: [
          "#",
          tag,
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleTag(tag), className: "text-primary/60 hover:text-primary transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" }) })
        ] }, tag)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 border-t border-border/20 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm", children: "Team Members" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: [
            form.team_members.length,
            " added"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add or remove committee members organizing this event." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newMemberName, onChange: (e) => setNewMemberName(e.target.value), placeholder: "Full name", className: "h-9 rounded-lg border-border/40 bg-muted/5 text-sm flex-1", onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTeamMember();
            }
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newMemberRole, onChange: (e) => setNewMemberRole(e.target.value), placeholder: "Role (e.g. Coordinator)", className: "h-9 rounded-lg border-border/40 bg-muted/5 text-sm flex-1", onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTeamMember();
            }
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: addTeamMember, disabled: !newMemberName.trim(), className: cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150", newMemberName.trim() ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted/30 text-muted-foreground cursor-not-allowed"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
        ] }),
        form.team_members.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/40 bg-muted/5 divide-y divide-border/30 overflow-hidden", children: form.team_members.map((member, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: member.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: member.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeTeamMember(index), className: "text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 border-t border-border/20 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm", children: "Pass Settings" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/40 bg-muted/5 p-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-black uppercase tracking-widest text-xs", children: "Normal Pass" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.pass_settings.normal.enabled, onChange: (e) => updatePass("normal", "enabled", e.target.checked), className: "rounded border-border/50 accent-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold", children: "Enabled" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Full Pass Price (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.pass_settings.normal.price, onChange: (e) => updatePass("normal", "price", parseInt(e.target.value) || 0), className: "h-9 rounded-lg border-border/30 bg-background" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Days" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "1", value: form.pass_settings.normal.days, onChange: (e) => updatePass("normal", "days", parseInt(e.target.value) || 1), className: "h-9 rounded-lg border-border/30 bg-background" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Single Day (₹)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.pass_settings.normal.single_day_price, onChange: (e) => updatePass("normal", "single_day_price", parseInt(e.target.value) || 0), className: "h-9 rounded-lg border-border/30 bg-background" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Multi Day (₹)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.pass_settings.normal.multi_day_price, onChange: (e) => updatePass("normal", "multi_day_price", parseInt(e.target.value) || 0), className: "h-9 rounded-lg border-border/30 bg-background" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-black uppercase tracking-widest text-xs text-primary", children: "VIP Pass" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.pass_settings.vip.enabled, onChange: (e) => updatePass("vip", "enabled", e.target.checked), className: "rounded border-border/50 accent-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-primary", children: "Enabled" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Full Pass Price (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.pass_settings.vip.price, onChange: (e) => updatePass("vip", "price", parseInt(e.target.value) || 0), className: "h-9 rounded-lg border-border/30 bg-background" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Days" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "1", value: form.pass_settings.vip.days, onChange: (e) => updatePass("vip", "days", parseInt(e.target.value) || 1), className: "h-9 rounded-lg border-border/30 bg-background" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Single Day (₹)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.pass_settings.vip.single_day_price, onChange: (e) => updatePass("vip", "single_day_price", parseInt(e.target.value) || 0), className: "h-9 rounded-lg border-border/30 bg-background" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase opacity-60", children: "Multi Day (₹)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: form.pass_settings.vip.multi_day_price, onChange: (e) => updatePass("vip", "multi_day_price", parseInt(e.target.value) || 0), className: "h-9 rounded-lg border-border/30 bg-background" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1 h-12 rounded-xl font-bold", onClick: () => navigate({
          to: "/organizer/events/$eventId",
          params: {
            eventId
          }
        }), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: updateMutation.isPending, size: "lg", className: "flex-1 h-12 bg-brand-gradient text-base font-black uppercase tracking-widest text-white shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl", children: updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Save Changes" })
      ] })
    ] })
  ] });
}
export {
  EditEvent as component
};
