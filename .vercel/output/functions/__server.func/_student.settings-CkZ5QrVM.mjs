import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./_ssr/router-C5_6oBDd.mjs";
import { I as Input } from "./_ssr/input-DfdhTZrH.mjs";
import { L as Label } from "./_ssr/label-Dd0kFXLk.mjs";
import { S as Switch } from "./_ssr/switch-CKkXT9Zh.mjs";
import { T as Textarea } from "./_ssr/textarea-D6eI1C7e.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-Zp0RaQmE.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { a3 as LoaderCircle, E as CircleUser, o as Camera, aM as TriangleAlert, y as CircleCheck, aq as Save, a4 as Lock, a7 as Mail, i as Building2 } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-switch.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
function StudentSettings() {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: loadingUser
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: {
          user: user2
        }
      } = await supabase.auth.getUser();
      return user2;
    }
  });
  const {
    data: profile,
    isLoading: loadingProfile
  } = useQuery({
    queryKey: ["student-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("student_profiles").select(`*, colleges (id, name, city)`).eq("id", user.id).maybeSingle();
      if (!data) {
        const {
          data: newProfile
        } = await supabase.from("student_profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          college_id: user.user_metadata?.college_id || null
        }).select().single();
        return {
          ...newProfile,
          colleges: null
        };
      }
      return data;
    }
  });
  const {
    data: colleges,
    isLoading: loadingColleges
  } = useQuery({
    queryKey: ["all-colleges"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("colleges").select("id, name, city").eq("status", "approved").order("name");
      return data || [];
    }
  });
  const [fullName, setFullName] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [collegeId, setCollegeId] = reactExports.useState("none");
  const [isPublic, setIsPublic] = reactExports.useState(true);
  const [isDirty, setIsDirty] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.user_metadata?.full_name || "");
      setBio(profile.bio || "");
      setCollegeId(profile.college_id || user?.user_metadata?.college_id || "none");
      setIsPublic(profile.is_public ?? true);
    }
  }, [profile, user]);
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not logged in");
      const {
        error
      } = await supabase.from("student_profiles").update({
        full_name: fullName,
        bio,
        college_id: collegeId === "none" ? null : collegeId,
        is_public: isPublic
      }).eq("id", user.id);
      if (error) throw error;
      await supabase.auth.updateUser({
        data: {
          full_name: fullName
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-profile"]
      });
      queryClient.invalidateQueries({
        queryKey: ["current-user"]
      });
      toast.success("Profile updated successfully");
      setIsDirty(false);
    },
    onError: (e) => toast.error(e.message)
  });
  if (loadingUser || loadingProfile || loadingColleges) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const initials = fullName.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "ST";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-4xl px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-black tracking-tight", children: "Profile & Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 font-medium", children: "Manage your public presence and college affiliation." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-[1fr_300px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-panel rounded-3xl p-6 md:p-8 border-white/5 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-[50px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: "Personal Information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This info will be visible to other students." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          updateProfileMutation.mutate();
        }, className: "space-y-5 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-2xl bg-brand-gradient p-0.5 shadow-glow ring-4 ring-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-[14px] bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-primary", children: initials }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 text-white" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Full Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fullName, onChange: (e) => {
                setFullName(e.target.value);
                setIsDirty(true);
              }, className: "h-12 rounded-xl bg-background/50 border-border/50 text-base font-medium", placeholder: "Your name" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Bio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: bio, onChange: (e) => {
              setBio(e.target.value);
              setIsDirty(true);
            }, placeholder: "Tell the community about yourself... (e.g., Computer Science sophomore, avid photographer)", className: "min-h-[100px] resize-none rounded-xl bg-background/50 border-border/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "College Affiliation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: collegeId, onValueChange: (v) => {
              setCollegeId(v);
              setIsDirty(true);
            }, disabled: collegeId !== "none" && collegeId !== null, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-12 rounded-xl bg-background/50 border-border/50 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select your college" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[300px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Not affiliated / Other" }),
                colleges?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c.id, children: [
                  c.name,
                  " ",
                  c.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1", children: [
                    "(",
                    c.city,
                    ")"
                  ] })
                ] }, c.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: collegeId !== "none" ? "Your college affiliation is locked. Contact support to change it." : "Linking your college unlocks campus-specific events and leaderboards." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border/40 bg-background/30 p-4 mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold", children: "Public Profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Allow other users to see your profile and digital memories." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: isPublic, onCheckedChange: (v) => {
              setIsPublic(v);
              setIsDirty(true);
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-6 border-t border-border/20", children: [
            isDirty ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-amber-500 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
              " Unsaved changes"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-muted-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
              " Up to date"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: !isDirty || updateProfileMutation.isPending, className: "bg-brand-gradient text-white rounded-xl font-bold px-6 shadow-glow", children: [
              updateProfileMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
              "Save Changes"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel rounded-2xl p-5 border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm", children: "Account Security" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Email Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: user?.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full mt-1 justify-start font-medium text-xs rounded-lg h-9", children: "Change Password" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel rounded-2xl p-5 border-white/5 border-primary/20 bg-primary/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-primary", children: "College Status" })
          ] }),
          collegeId !== "none" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "You are currently affiliated with a college. Your fest points contribute to your college's overall ranking in the National Leaderboard." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "You are not currently linked to any college. Select your institution to join the campus network and represent them!" })
        ] })
      ] })
    ] })
  ] });
}
export {
  StudentSettings as component
};
