import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { y as useRegion, a as Button } from "./router-C5_6oBDd.mjs";
import { B as BadgeCheck, C as Calendar, a8 as MapPin, aV as Users, u as ChevronRight } from "../_libs/lucide-react.mjs";
function EventCard({ event }) {
  const { formatPrice } = useRegion();
  const routerState = useRouterState();
  const isStudentRoute = routerState.matches.some((m) => m.routeId === "/_student");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: isStudentRoute ? "/explore/$eventId" : "/events/$eventId",
      params: { eventId: event.id },
      className: "group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-muted/30 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(var(--brand-primary-rgb),0.1)]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-px rounded-3xl bg-brand-gradient opacity-0 transition-opacity duration-500 group-hover:opacity-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative h-52 w-full overflow-hidden`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-110 ${event.cover}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-4 top-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md", children: event.category }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 top-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-xl bg-brand-gradient px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-glow", children: event.priceFrom === 0 ? "Free" : `${formatPrice(event.priceFrom)}+` }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-4 right-4 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-white/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[150px]", children: event.college }),
            event.isVerified !== false && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3.5 w-3.5 text-blue-400 fill-blue-400/20" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary", children: event.title }),
          event.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-2 text-xs text-muted-foreground", children: event.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid grid-cols-2 gap-y-2 text-[11px] font-medium text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }) }),
                new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }) }),
                event.city
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }) }),
                (event.attendees / 1e3).toFixed(0),
                "k+ Attending"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-between rounded-xl border-border/50 bg-background/50 text-xs font-bold transition-all group-hover:border-primary/50 group-hover:bg-primary/10", children: [
              "View Details",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  EventCard as E
};
