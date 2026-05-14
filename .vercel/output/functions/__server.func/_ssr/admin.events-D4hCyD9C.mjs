import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { au as Search, a3 as LoaderCircle, C as Calendar, z as CircleCheckBig, F as CircleX, aC as ShieldBan } from "../_libs/lucide-react.mjs";
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
function AdminEvents() {
  const queryClient = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const {
    data: events,
    isLoading
  } = useQuery({
    queryKey: ["admin-events-list"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("events").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status
    }) => {
      const {
        error
      } = await supabase.from("events").update({
        status
      }).eq("id", id);
      if (error) throw error;
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: `update_event_status`,
          resource_type: "event",
          resource_id: id,
          details: {
            new_status: status
          }
        });
      }
    },
    onSuccess: (_, vars) => {
      toast.success(`Event marked as ${vars.status}`);
      queryClient.invalidateQueries({
        queryKey: ["admin-events-list"]
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-events"]
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    }
  });
  const filtered = events?.filter((e) => e.title.toLowerCase().includes(q.toLowerCase()) || e.college_name.toLowerCase().includes(q.toLowerCase())) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Event Moderation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Approve, reject, or lock capacities for college fests." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search events or colleges…", className: "pl-9 bg-background/50 backdrop-blur" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 glass rounded-2xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No events found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Event Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "College" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: filtered.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "transition-colors hover:bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: e.title }),
            e.is_government_partnered && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] h-4", children: "Gov Hub" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: e.category })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: e.college_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 text-muted-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          " ",
          new Date(e.date).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: e.status || "approved" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          e.status !== "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 h-8 px-2", onClick: () => updateStatusMutation.mutate({
            id: e.id,
            status: "approved"
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 mr-1" }),
            " Approve"
          ] }),
          e.status !== "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 px-2", onClick: () => updateStatusMutation.mutate({
            id: e.id,
            status: "rejected"
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1" }),
            " Reject"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-8 px-2", onClick: () => updateStatusMutation.mutate({
            id: e.id,
            status: "locked"
          }), title: "Lock ticket sales", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldBan, { className: "h-4 w-4" }) })
        ] }) })
      ] }, e.id)) })
    ] }) }) })
  ] });
}
function StatusBadge({
  status
}) {
  if (status === "approved") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500 uppercase", children: "Approved" });
  if (status === "rejected") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 uppercase", children: "Rejected" });
  if (status === "locked") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-500 uppercase", children: "Sales Locked" });
  if (status === "published") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500 uppercase", children: "Published" });
  if (status === "draft") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-slate-500/10 px-2 py-1 text-[10px] font-bold text-slate-500 uppercase", children: "Draft" });
  if (status === "archived") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-slate-500/10 px-2 py-1 text-[10px] font-bold text-slate-500 uppercase", children: "Archived" });
  if (status === "cancelled") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 uppercase", children: "Cancelled" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-500 uppercase", children: "Pending" });
}
export {
  AdminEvents as component
};
