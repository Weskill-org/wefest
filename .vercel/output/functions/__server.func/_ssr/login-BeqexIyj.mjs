import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as Route$U, a as Button, x as supabase, u as getAuthSession, v as getDashboardRedirect } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as ArrowLeft, a3 as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function Login() {
  const navigate = useNavigate();
  const search = Route$U.useSearch();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: authData,
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    const uid = authData.user?.id;
    if (uid) {
      const {
        data: banned
      } = await supabase.from("blacklisted_users").select("id, reason").eq("user_id", uid).maybeSingle();
      if (banned) {
        await supabase.auth.signOut();
        setLoading(false);
        toast.error(`Your account has been suspended. ${banned.reason ? `Reason: ${banned.reason}` : ""}`);
        return;
      }
    }
    const session = await getAuthSession();
    setLoading(false);
    if (!session) {
      toast.error("Failed to retrieve user session");
      return;
    }
    toast.success("Welcome back");
    if (search.redirect) {
      navigate({
        to: search.redirect
      });
    } else {
      navigate({
        to: getDashboardRedirect(session.role, session.isAdmin)
      });
    }
  };
  const sendMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    const redirectUrl = search.redirect ? `${window.location.origin}${search.redirect}` : `${window.location.origin}/`;
    const {
      error
    } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success(`Magic link sent to ${email}`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex lg:w-[45%] bg-brand-gradient relative overflow-hidden items-center justify-center p-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-10 h-40 w-40 rounded-full bg-white blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-20 right-10 h-60 w-60 rounded-full bg-white blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/20 blur-[120px]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-md text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-12 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 transition-transform group-hover:-translate-x-1" }),
          "Back to home"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl font-black tracking-tight leading-tight", children: [
          "Welcome to",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "WeFest"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-white/70 leading-relaxed", children: "The digital backbone of college festivals. Sign in to access your dashboard, tickets, and campus network." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex items-center gap-6 text-sm text-white/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "500+ Events" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "200+ Colleges" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-6 sm:p-12 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8 lg:hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 transition-transform group-hover:-translate-x-1" }),
        "Back to home"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Enter your credentials to access your account." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-8 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", required: true, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@domain.com", className: "h-12 rounded-xl bg-white/[0.03] border-white/10 text-base" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", required: true, type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "h-12 rounded-xl bg-white/[0.03] border-white/10 text-base" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", disabled: loading, className: "w-full h-12 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-glow", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
          " Signing in…"
        ] }) : "Sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 bg-background px-3 text-xs text-muted-foreground", children: "or" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-1/2 -z-0 h-px bg-white/10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "lg", disabled: loading, onClick: sendMagicLink, className: "w-full h-12 rounded-xl border-white/10 text-sm font-semibold", children: "Email me a magic link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground pt-2", children: [
          "New here? ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", search: {
            redirect: search.redirect
          }, className: "text-primary hover:underline font-semibold", children: "Create an account" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Login as component
};
