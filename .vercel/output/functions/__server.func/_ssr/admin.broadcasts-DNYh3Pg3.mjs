import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-Zp0RaQmE.mjs";
import { aa as Megaphone, a3 as LoaderCircle, al as Power, aw as Send, aM as TriangleAlert, _ as Info } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
function AdminBroadcasts() {
  const queryClient = useQueryClient();
  const [message, setMessage] = reactExports.useState("");
  const [severity, setSeverity] = reactExports.useState("info");
  const {
    data: broadcasts,
    isLoading
  } = useQuery({
    queryKey: ["admin-broadcasts"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("broadcast_messages").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const broadcastMutation = useMutation({
    mutationFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      if (!message.trim()) throw new Error("Message cannot be empty");
      const {
        error
      } = await supabase.from("broadcast_messages").insert({
        message,
        severity,
        active: true,
        created_by: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Broadcast sent globally");
      setMessage("");
      queryClient.invalidateQueries({
        queryKey: ["admin-broadcasts"]
      });
      queryClient.invalidateQueries({
        queryKey: ["global-broadcasts"]
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send broadcast");
    }
  });
  const toggleActiveMutation = useMutation({
    mutationFn: async ({
      id,
      active
    }) => {
      const {
        error
      } = await supabase.from("broadcast_messages").update({
        active
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Broadcast status updated");
      queryClient.invalidateQueries({
        queryKey: ["admin-broadcasts"]
      });
      queryClient.invalidateQueries({
        queryKey: ["global-broadcasts"]
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update broadcast status");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Emergency Broadcasts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Send global alerts to all active users on the platform." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-8 md:grid-cols-[1fr_350px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border/60 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4 text-primary" }),
          " Broadcast History"
        ] }) }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }) : broadcasts?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No broadcasts sent yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium text-right", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: broadcasts?.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `transition-colors hover:bg-muted/30 ${!b.active ? "opacity-50" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 max-w-[300px] truncate", children: b.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: b.severity }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-muted-foreground", children: new Date(b.created_at).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: b.active ? "default" : "outline", className: `h-8 gap-2 ${b.active ? "bg-red-500 hover:bg-red-600 text-white" : ""}`, onClick: () => toggleActiveMutation.mutate({
              id: b.id,
              active: !b.active
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3 w-3" }),
              b.active ? "Deactivate" : "Activate"
            ] }) })
          ] }, b.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 h-fit sticky top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          " New Broadcast"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Severity Level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: severity, onValueChange: setSeverity, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-background/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "info", children: "Info" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "warning", children: "Warning" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "emergency", children: "Emergency" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Platform maintenance at 2 AM...", className: "bg-background/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-brand-gradient text-primary-foreground shadow-glow hover:opacity-90", onClick: () => broadcastMutation.mutate(), disabled: !message.trim() || broadcastMutation.isPending, children: broadcastMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Transmit Globally" })
        ] })
      ] })
    ] })
  ] });
}
function SeverityBadge({
  severity
}) {
  if (severity === "emergency") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 uppercase gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
    " Emergency"
  ] });
  if (severity === "warning") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-500 uppercase gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
    " Warning"
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-500 uppercase gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3" }),
    " Info"
  ] });
}
export {
  AdminBroadcasts as component
};
