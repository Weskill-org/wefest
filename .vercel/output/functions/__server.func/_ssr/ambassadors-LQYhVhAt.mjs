import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CO1OYTv6.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { T as Textarea } from "./textarea-D6eI1C7e.mjs";
import { aZ as Zap, e as Award, aL as TrendingUp, aW as UsersRound, aF as Sparkles, y as CircleCheck, $ as Instagram, aO as Twitter, a2 as Linkedin, a3 as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-label.mjs";
function Ambassadors() {
  const [selectedProgram, setSelectedProgram] = reactExports.useState(null);
  const [isDialogOpen, setIsDialogOpen] = reactExports.useState(false);
  const [social, setSocial] = reactExports.useState("");
  const [motivation, setMotivation] = reactExports.useState("");
  const {
    data: programs,
    isLoading
  } = useQuery({
    queryKey: ["ambassador-programs"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("ambassador_programs").select("*, event:event_id(title, cover)").eq("status", "active");
      if (error) throw error;
      return data;
    }
  });
  const applyMutation = useMutation({
    mutationFn: async ({
      programId,
      social: social2,
      motivation: motivation2
    }) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to apply");
      const {
        error
      } = await supabase.from("ambassador_applications").insert({
        program_id: programId,
        user_id: user.id,
        social_handle: social2,
        motivation: motivation2
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted!", {
        description: "The organizers will review your profile shortly."
      });
      setIsDialogOpen(false);
      setSocial("");
      setMotivation("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit application");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mb-20 text-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-gradient opacity-10 blur-[120px] -z-10 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 fill-current" }),
        " WeFest Campus Influencer Program"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-8 font-display text-5xl font-black leading-tight md:text-7xl", children: [
        "Become the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Face" }),
        " of Festivals."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 mx-auto max-w-2xl text-lg text-muted-foreground", children: "Represent the biggest brands and festivals on your campus. Gain experience, earn exclusive rewards, and build a network that lasts a lifetime." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-brand-gradient hover:opacity-90 px-8 rounded-full shadow-glow", children: "Explore Programs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "rounded-full px-8", children: "View FAQ" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-3 mb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PerkCard, { icon: Award, title: "Verified Certificates", desc: "Official recognition from top colleges and WeFest for your LinkedIn and Resume." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PerkCard, { icon: TrendingUp, title: "Incentive Rewards", desc: "Earn commissions on ticket sales, free merchandise, and VIP festival passes." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PerkCard, { icon: UsersRound, title: "Networking", desc: "Connect with national-level organizers, brands, and fellow influencers." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold", children: "Active Programs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Join a program and start leading" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "rounded-full", children: "Filter by college" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2", children: isLoading ? [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 glass rounded-3xl animate-pulse" }, i)) : programs && programs.length > 0 ? programs.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass group overflow-hidden rounded-[2rem] border border-border/60 transition-all hover:border-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-full sm:w-48 bg-gradient-to-br ${p.event?.cover || "from-slate-800 to-slate-900"} relative flex-shrink-0`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-12 w-12 text-white/20 group-hover:scale-110 transition-transform" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 flex flex-col justify-between flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-primary mb-2", children: p.event?.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground line-clamp-2", children: p.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: p.perks?.slice(0, 3).map((perk) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-500" }),
            " ",
            perk
          ] }, perk)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2", children: [
            [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold", children: i }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4 text-[10px] text-muted-foreground", children: "+12 applied" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
            setSelectedProgram(p);
            setIsDialogOpen(true);
          }, className: "bg-brand-gradient text-white rounded-full px-6 shadow-glow", children: "Apply Now" })
        ] })
      ] })
    ] }) }, p.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-20 text-center glass rounded-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "mx-auto h-12 w-12 text-muted-foreground opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-lg font-bold", children: "No active programs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Check back soon for new ambassador opportunities." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px] glass border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-2xl", children: [
          "Apply for ",
          selectedProgram?.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Tell us why you'd be a great ambassador for ",
          selectedProgram?.event?.title,
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Social Media Presence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-3 w-3" }),
              " Insta"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "h-3 w-3" }),
              " Twitter"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-3 w-3" }),
              " LinkedIn"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Profile link or @handle", value: social, onChange: (e) => setSocial(e.target.value), className: "mt-2 bg-background/50 border-border/60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Why should we pick you?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Mention your reach, society positions, or past experience...", rows: 4, value: motivation, onChange: (e) => setMotivation(e.target.value), className: "bg-background/50 border-border/60 resize-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: applyMutation.isPending, onClick: () => applyMutation.mutate({
          programId: selectedProgram.id,
          social,
          motivation
        }), className: "bg-brand-gradient text-white", children: applyMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Submit Application" })
      ] })
    ] }) })
  ] });
}
function PerkCard({
  icon: Icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[2rem] p-8 border border-border/60 hover:border-primary/40 transition-all", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-glow mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold mb-3", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: desc })
  ] });
}
export {
  Ambassadors as component
};
