import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { aD as ShieldCheck, a3 as LoaderCircle, K as Crown, aK as Trash2, a7 as Mail } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
const RANKS = ["Moderator", "Organizer", "Admin", "Superadmin"];
function AdminAdmins() {
  const qc = useQueryClient();
  const [email, setEmail] = reactExports.useState("");
  const [rank, setRank] = reactExports.useState("Moderator");
  const {
    data: me
  } = useQuery({
    queryKey: ["me-admin-rank"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      const {
        data
      } = await supabase.from("admin_users").select("rank").eq("user_id", user.id).maybeSingle();
      return data;
    }
  });
  const isSuper = me?.rank === "Superadmin";
  const {
    data: admins,
    isLoading
  } = useQuery({
    queryKey: ["all-admins"],
    queryFn: async () => {
      const {
        data: adminData,
        error
      } = await supabase.from("admin_users").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      if (!adminData?.length) return [];
      const userIds = adminData.map((a) => a.user_id);
      const {
        data: profiles
      } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
      return adminData.map((a) => {
        const profile = profiles?.find((p) => p.user_id === a.user_id);
        return {
          ...a,
          profiles: profile || null
        };
      });
    }
  });
  const add = useMutation({
    mutationFn: async () => {
      if (!email.trim()) throw new Error("Email required");
      const {
        data: profile,
        error: profileErr
      } = await supabase.from("profiles").select("user_id").eq("email", email.trim().toLowerCase()).maybeSingle();
      if (profileErr || !profile) {
        throw new Error("User not found with this email. They must have a WeFest account first.");
      }
      const {
        error
      } = await supabase.from("admin_users").insert({
        user_id: profile.user_id,
        rank
      });
      if (error) {
        if (error.code === "23505") throw new Error("User is already an admin");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Admin added successfully");
      setEmail("");
      qc.invalidateQueries({
        queryKey: ["all-admins"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("admin_users").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Admin removed");
      qc.invalidateQueries({
        queryKey: ["all-admins"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Admin Team" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage internal administrators. Only Superadmins can add or remove members." }),
    !isSuper && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 glass rounded-2xl p-4 text-sm text-muted-foreground border border-amber-500/20", children: [
      "You are signed in as ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: me?.rank ?? "Unknown" }),
      ". Only a Superadmin can modify this list."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-8 xl:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border/60 bg-muted/30 font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
          " Active administrators"
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Administrator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Rank" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Added" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: admins?.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0", children: (a.profiles?.full_name || a.profiles?.email || "U").charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: a.profiles?.full_name || "Unknown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: a.profiles?.email || a.user_id })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: a.rank === "Superadmin" ? "default" : "secondary", className: "capitalize gap-1", children: [
              a.rank === "Superadmin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
              " ",
              a.rank
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-muted-foreground text-xs", children: new Date(a.created_at).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", disabled: !isSuper || remove.isPending, className: "h-8 w-8 text-red-500 hover:bg-red-500/10", onClick: () => {
              if (confirm("Are you sure you want to remove this admin?")) {
                remove.mutate(a.id);
              }
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
          ] }, a.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 h-fit sticky top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold mb-6 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-primary" }),
          " Add Administrator"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-muted-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
              " Email Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@example.com", className: "h-10 bg-background/50", disabled: !isSuper })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground", children: "Assign Rank" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: RANKS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: !isSuper, onClick: () => setRank(r), className: `flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${rank === r ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-muted/5 text-muted-foreground hover:bg-muted/20"}`, children: [
              r === "Superadmin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3.5 w-3.5" }),
              r
            ] }, r)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full mt-2 h-10 bg-brand-gradient text-white font-bold shadow-glow", onClick: () => add.mutate(), disabled: !isSuper || !email.trim() || add.isPending, children: add.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Grant Admin Access" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center", children: "The user must already have a registered account on the platform." })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminAdmins as component
};
