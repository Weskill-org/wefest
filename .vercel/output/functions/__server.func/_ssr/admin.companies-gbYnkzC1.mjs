import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { au as Search, a3 as LoaderCircle, i as Building2, U as Globe, r as Check, aY as X } from "../_libs/lucide-react.mjs";
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
function AdminCompanies() {
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("pending");
  const {
    data: companies,
    isLoading
  } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("company_profiles").select("*, profile:profiles!company_profiles_user_id_fkey(email, full_name)").order("created_at", {
        ascending: false
      });
      if (error) {
        const {
          data: d2,
          error: e2
        } = await supabase.from("company_profiles").select("*").order("created_at", {
          ascending: false
        });
        if (e2) throw e2;
        return d2;
      }
      return data;
    }
  });
  const decide = useMutation({
    mutationFn: async ({
      id,
      status,
      reason
    }) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      const {
        error
      } = await supabase.from("company_profiles").update({
        status,
        approved_by: user?.id,
        approved_at: (/* @__PURE__ */ new Date()).toISOString(),
        rejection_reason: reason ?? null
      }).eq("id", id);
      if (error) throw error;
      await supabase.from("audit_logs").insert({
        admin_user_id: user.id,
        action: `company_${status}`,
        resource_type: "company_profile",
        resource_id: id,
        details: {
          reason: reason ?? null
        }
      });
    },
    onSuccess: () => {
      toast.success("Company status updated");
      qc.invalidateQueries({
        queryKey: ["admin-companies"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const filtered = companies?.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    const q = search.toLowerCase();
    return !q || c.company_name?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Company Approvals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Review and approve sponsor / brand accounts." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["pending", "approved", "rejected", "all"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: filter === s ? "default" : "outline", onClick: () => setFilter(s), className: "capitalize", children: s }, s)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search companies…", className: "pl-9 max-w-md" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }) : filtered?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-10 text-center text-muted-foreground", children: "No companies found." }) : filtered?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: c.company_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: c.status === "approved" ? "default" : c.status === "rejected" ? "destructive" : "secondary", className: "capitalize", children: c.status }),
          c.industry && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "· ",
            c.industry
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground flex items-center gap-3 flex-wrap", children: [
          c.profile?.email && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.profile.email }),
          c.website_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.website_url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 text-primary hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3" }),
            c.website_url
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Applied ",
            new Date(c.created_at).toLocaleDateString()
          ] })
        ] }),
        c.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-destructive", children: [
          "Reason: ",
          c.rejection_reason
        ] })
      ] }),
      c.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => decide.mutate({
          id: c.id,
          status: "approved"
        }), disabled: decide.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-1" }),
          " Approve"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", onClick: () => {
          const r = window.prompt("Rejection reason?") || "Not eligible";
          decide.mutate({
            id: c.id,
            status: "rejected",
            reason: r
          });
        }, disabled: decide.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
          " Reject"
        ] })
      ] })
    ] }, c.id)) })
  ] });
}
export {
  AdminCompanies as component
};
