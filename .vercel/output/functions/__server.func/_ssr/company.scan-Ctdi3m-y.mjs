import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-Zp0RaQmE.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { as as ScanLine, a3 as LoaderCircle, aZ as Zap, y as CircleCheck, F as CircleX } from "../_libs/lucide-react.mjs";
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
function CompanyScan() {
  const [code, setCode] = reactExports.useState("");
  const [selectedEventId, setSelectedEventId] = reactExports.useState("");
  const [log, setLog] = reactExports.useState([]);
  const {
    data: user
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
    data: sponsorships,
    isLoading: loadingSponsorships,
    error: sponsorshipsError
  } = useQuery({
    queryKey: ["my-active-sponsorships", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sponsorship_proposals").select("*, event:events(*)").eq("company_user_id", user.id).eq("status", "accepted");
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    if (!selectedEventId && sponsorships && sponsorships.length > 0) {
      const firstEventId = sponsorships[0].event_id;
      if (firstEventId) {
        setSelectedEventId(firstEventId);
      }
    }
  }, [sponsorships, selectedEventId]);
  const scanMutation = useMutation({
    mutationFn: async ({
      ticketCode,
      eventId
    }) => {
      const {
        data: ticket,
        error: ticketError
      } = await supabase.from("tickets").select("*").eq("code", ticketCode).single();
      if (ticketError || !ticket) throw new Error("Invalid ticket code");
      const {
        error: visitError
      } = await supabase.from("sponsor_booth_visits").insert({
        sponsor_user_id: user.id,
        event_id: eventId,
        student_user_id: ticket.user_id
      });
      if (visitError) throw visitError;
      return ticketCode;
    },
    onSuccess: (ticketCode) => {
      toast.success("Visit logged successfully!");
      setLog((l) => [{
        code: ticketCode,
        ok: true,
        t: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      }, ...l]);
      setCode("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to log visit");
      setLog((l) => [{
        code,
        ok: false,
        t: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
        error: error.message
      }, ...l]);
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      toast.error("Please select an event first");
      return;
    }
    if (!code) return;
    scanMutation.mutate({
      ticketCode: code,
      eventId: selectedEventId
    });
  };
  const successCount = log.filter((l) => l.ok).length;
  const failCount = log.filter((l) => !l.ok).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 max-w-3xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-6 w-6 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-black tracking-tight", children: "Booth Scanner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Log student visits to your booth for engagement analytics" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Active Event" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedEventId, onValueChange: setSelectedEventId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass border-white/10 h-11", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: loadingSponsorships ? "Loading events…" : "Select an event" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            sponsorships?.map((s) => {
              const eventData = Array.isArray(s.event) ? s.event[0] : s.event;
              if (!eventData) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.event_id, children: eventData.title }, s.event_id);
            }),
            !loadingSponsorships && (!sponsorships || sponsorships.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", disabled: true, children: "No active sponsorships found" }),
            sponsorshipsError && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "error", disabled: true, className: "text-destructive", children: "Error loading fests" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: code, onChange: (e) => setCode(e.target.value), placeholder: "Student Ticket Code (e.g. MI26-XXXX)", className: "glass border-white/10 h-11 font-mono", disabled: scanMutation.isPending }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: scanMutation.isPending || !selectedEventId, className: "bg-brand-gradient text-white hover:opacity-90 min-w-[110px] h-11 shadow-glow", children: scanMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-1.5" }),
          " Log Visit"
        ] }) })
      ] })
    ] }),
    log.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl px-4 py-2.5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: successCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "successful" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl px-4 py-2.5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: failCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "failed" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl px-4 py-2.5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: log.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "total" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass divide-y divide-white/5 rounded-2xl overflow-hidden border border-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Session Scan Log" }),
      log.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-10 w-10 mx-auto text-muted-foreground/20 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No scans in this session" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60 mt-1", children: "Select an event and scan a ticket code to begin" })
      ] }),
      log.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 text-sm transition hover:bg-white/[0.02]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          l.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-destructive shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono font-bold text-xs", children: l.code || "—" }),
            !l.ok && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-destructive mt-0.5", children: l.error })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground font-mono", children: l.t })
      ] }, i))
    ] })
  ] });
}
export {
  CompanyScan as component
};
