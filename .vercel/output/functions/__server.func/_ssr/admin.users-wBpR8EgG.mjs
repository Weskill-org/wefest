import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { aB as ShieldAlert, a3 as LoaderCircle, aK as Trash2 } from "../_libs/lucide-react.mjs";
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
function AdminUsers() {
  const queryClient = useQueryClient();
  const [userIdToBan, setUserIdToBan] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const {
    data: blacklist,
    isLoading
  } = useQuery({
    queryKey: ["admin-blacklist"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("blacklisted_users").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const blacklistMutation = useMutation({
    mutationFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      if (!userIdToBan) throw new Error("User ID is required");
      const {
        error
      } = await supabase.from("blacklisted_users").insert({
        user_id: userIdToBan,
        reason: reason || "Violation of terms",
        created_by: user.id
      });
      if (error) throw error;
      await supabase.from("audit_logs").insert({
        admin_user_id: user.id,
        action: `blacklist_user`,
        resource_type: "user",
        resource_id: userIdToBan,
        details: {
          reason
        }
      });
    },
    onSuccess: () => {
      toast.success("User added to blacklist");
      setUserIdToBan("");
      setReason("");
      queryClient.invalidateQueries({
        queryKey: ["admin-blacklist"]
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to blacklist user");
    }
  });
  const removeBlacklistMutation = useMutation({
    mutationFn: async (id) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      const {
        error
      } = await supabase.from("blacklisted_users").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("audit_logs").insert({
        admin_user_id: user.id,
        action: `remove_blacklist`,
        resource_type: "blacklist_record",
        resource_id: id
      });
    },
    onSuccess: () => {
      toast.success("User removed from blacklist");
      queryClient.invalidateQueries({
        queryKey: ["admin-blacklist"]
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove user from blacklist");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "User Moderation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage platform access and blacklisted users." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-8 md:grid-cols-[1fr_300px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border/60 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-red-500" }),
          " Blacklisted Users"
        ] }) }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }) : blacklist?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No users are currently blacklisted." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "User ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Date added" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: blacklist?.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "transition-colors hover:bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-mono text-xs", children: b.user_id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: b.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-muted-foreground", children: new Date(b.created_at).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8", onClick: () => removeBlacklistMutation.mutate(b.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
          ] }, b.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-4 text-red-500 flex items-center gap-2", children: "Ban a User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "User ID (UUID)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: userIdToBan, onChange: (e) => setUserIdToBan(e.target.value), placeholder: "123e4567-e89b...", className: "bg-background/50 font-mono text-xs" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Reason for ban" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: reason, onChange: (e) => setReason(e.target.value), placeholder: "e.g. Scalping tickets", className: "bg-background/50 text-sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-red-500 text-white hover:bg-red-600", onClick: () => blacklistMutation.mutate(), disabled: !userIdToBan || blacklistMutation.isPending, children: blacklistMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Enforce Ban" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center", children: "Blacklisted users will be immediately denied access to their accounts." })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminUsers as component
};
