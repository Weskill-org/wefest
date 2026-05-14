import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { h as Route$x, x as supabase, a as Button, t as cn } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-Zp0RaQmE.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a3 as LoaderCircle, y as CircleCheck, F as CircleX } from "../_libs/lucide-react.mjs";
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
function Scan() {
  const [code, setCode] = reactExports.useState("");
  const [eventId, setEventId] = reactExports.useState("");
  const [log, setLog] = reactExports.useState([]);
  const ctx = Route$x.useRouteContext();
  const membership = ctx.membership;
  const {
    data: userData
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
    data: events,
    isLoading: loadingEvents
  } = useQuery({
    queryKey: ["college-events-scan", userData?.id, membership?.college_id],
    enabled: !!userData?.id,
    queryFn: async () => {
      let query = supabase.from("events").select("id, title").order("date", {
        ascending: true
      });
      if (membership?.college_id) {
        query = query.or(`organizer_user_id.eq.${userData.id},college_id.eq.${membership.college_id}`);
      } else {
        query = query.eq("organizer_user_id", userData.id);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data;
    }
  });
  const scan = useMutation({
    mutationFn: async ({
      ticketCode,
      evId
    }) => {
      const {
        data: ticket,
        error
      } = await supabase.from("tickets").select("id, event_id, scanned_at, tier").eq("code", ticketCode.trim()).maybeSingle();
      if (error) throw error;
      if (!ticket) throw new Error("Ticket not found");
      if (ticket.event_id !== evId) throw new Error("Ticket is for a different event");
      if (ticket.scanned_at) throw new Error(`Already scanned at ${new Date(ticket.scanned_at).toLocaleTimeString()}`);
      const {
        error: updErr
      } = await supabase.from("tickets").update({
        scanned_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", ticket.id);
      if (updErr) throw updErr;
      return ticket;
    },
    onSuccess: (ticket) => {
      toast.success(`Admitted • ${ticket.tier}`);
      setLog((l) => [{
        code,
        ok: true,
        t: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
        note: ticket.tier
      }, ...l]);
      setCode("");
    },
    onError: (e) => {
      toast.error(e.message);
      setLog((l) => [{
        code,
        ok: false,
        t: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
        note: e.message
      }, ...l]);
    }
  });
  const submit = (e) => {
    e.preventDefault();
    if (!eventId) return toast.error("Select your event first");
    if (!code.trim()) return;
    scan.mutate({
      ticketCode: code,
      evId: eventId
    });
  };
  const scannedCount = log.filter((l) => l.ok).length;
  const rejectedCount = log.filter((l) => !l.ok).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 lg:px-10 lg:py-10 max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight lg:text-3xl", children: "Gate Scanner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Paste or scan ticket codes to admit attendees." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-emerald-500/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Admitted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-emerald-500 mt-1", children: scannedCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-destructive/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Rejected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-destructive mt-1", children: rejectedCount })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold", children: "Event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: eventId, onValueChange: setEventId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-11 rounded-xl border-border/50 bg-muted/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: loadingEvents ? "Loading…" : "Select an event you organize" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          events?.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: e.id, children: e.title }, e.id)),
          !loadingEvents && (events?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", disabled: true, children: "No events found" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "flex gap-2 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: code, onChange: (e) => setCode(e.target.value), placeholder: "Ticket code", disabled: scan.isPending, className: "h-11 rounded-xl border-border/50 bg-muted/5 font-mono" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: scan.isPending || !eventId, className: "bg-brand-gradient text-primary-foreground hover:opacity-90 min-w-[100px] h-11 rounded-xl font-bold", children: scan.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Validate" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold mb-3", children: "Scan Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 divide-y divide-border/50 overflow-hidden", children: [
        log.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No scans yet — start validating tickets above." }),
        log.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center justify-between px-4 py-3 text-sm", i === 0 && "bg-muted/10"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            l.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-xs truncate block", children: l.code || "—" }),
              l.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] mt-0.5 ${l.ok ? "text-muted-foreground" : "text-destructive"}`, children: l.note })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium shrink-0 ml-4", children: l.t })
        ] }, i))
      ] })
    ] })
  ] });
}
export {
  Scan as component
};
