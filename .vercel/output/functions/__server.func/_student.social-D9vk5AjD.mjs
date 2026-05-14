import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./_ssr/router-C5_6oBDd.mjs";
import { I as Input } from "./_ssr/input-DfdhTZrH.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { aV as Users, aG as Star, V as GraduationCap, au as Search, a8 as MapPin, aT as UserMinus, aU as UserPlus } from "./_libs/lucide-react.mjs";
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
function CampusNetwork() {
  const [q, setQ] = reactExports.useState("");
  const queryClient = useQueryClient();
  const {
    data: currentUser
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      return user;
    }
  });
  const {
    data: myProfile
  } = useQuery({
    queryKey: ["my-profile"],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("student_profiles").select("*, colleges(name)").eq("id", currentUser.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: profiles,
    isLoading: loadingProfiles
  } = useQuery({
    queryKey: ["student-profiles", myProfile?.college_id],
    enabled: !!myProfile?.college_id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("student_profiles").select("*, colleges(name, city)").eq("college_id", myProfile.college_id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const {
    data: follows
  } = useQuery({
    queryKey: ["my-follows"],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("follows").select("*").eq("follower_id", currentUser.id);
      if (error) throw error;
      return data;
    }
  });
  const followMutation = useMutation({
    mutationFn: async (targetId) => {
      const isFollowing = follows?.some((f) => f.following_id === targetId);
      if (isFollowing) {
        const {
          error
        } = await supabase.from("follows").delete().eq("follower_id", currentUser.id).eq("following_id", targetId);
        if (error) throw error;
        return {
          type: "unfollow"
        };
      } else {
        const {
          error
        } = await supabase.from("follows").insert({
          follower_id: currentUser.id,
          following_id: targetId
        });
        if (error) throw error;
        return {
          type: "follow"
        };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["my-follows"]
      });
      toast.success(data.type === "follow" ? "Following student" : "Unfollowed student");
    }
  });
  const filtered = reactExports.useMemo(() => {
    if (!profiles) return [];
    return profiles.filter((p) => p.full_name?.toLowerCase().includes(q.toLowerCase()) || p.colleges?.name?.toLowerCase().includes(q.toLowerCase()) || p.interests?.some((i) => i.toLowerCase().includes(q.toLowerCase())));
  }, [profiles, q]);
  const stats = [{
    label: "Students",
    value: profiles?.length || 0,
    icon: Users,
    color: "text-blue-400 bg-blue-500/10"
  }, {
    label: "Following",
    value: follows?.length || 0,
    icon: Star,
    color: "text-amber-400 bg-amber-500/10"
  }, {
    label: "Colleges",
    value: new Set(profiles?.map((p) => p.college_id)).size,
    icon: GraduationCap,
    color: "text-emerald-400 bg-emerald-500/10"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 sm:px-8 py-8 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: "Campus Network" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: myProfile?.colleges?.name ? `Connecting with students from ${myProfile.colleges.name}.` : "Discover and connect with students from your college." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: stats.map((s) => {
      const [textColor, bgColor] = s.color.split(" ");
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${bgColor} ${textColor}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold tracking-tight leading-none mb-0.5", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-medium", children: s.label })
      ] }, s.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search students, interests, or colleges...", value: q, onChange: (e) => setQ(e.target.value), className: "h-10 pl-9 rounded-xl bg-white/[0.03] border-white/10 text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: loadingProfiles ? [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" }, i)) : filtered.length > 0 ? filtered.map((p) => {
      const isFollowing = follows?.some((f) => f.following_id === p.id);
      const isSelf = currentUser?.id === p.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10 p-5 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg", children: p.full_name?.slice(0, 1) || "?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm truncate group-hover:text-primary transition-colors", children: p.full_name || "Anonymous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: p.colleges?.name || "Unknown College" })
              ] })
            ] })
          ] }),
          !isSelf && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => followMutation.mutate(p.id), className: `h-8 w-8 rounded-lg shrink-0 ${isFollowing ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"}`, children: isFollowing ? /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1", children: p.bio || "This student hasn't added a bio yet." }),
        p.interests && p.interests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
          p.interests.slice(0, 3).map((interest) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/5 text-muted-foreground", children: interest }, interest)),
          p.interests.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-medium text-muted-foreground/50 py-1 px-1", children: [
            "+",
            p.interests.length - 3
          ] })
        ] })
      ] }, p.id);
    }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-muted-foreground/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-1", children: "No students found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-[280px] mx-auto", children: "Try broadening your search criteria." })
    ] }) })
  ] });
}
export {
  CampusNetwork as component
};
