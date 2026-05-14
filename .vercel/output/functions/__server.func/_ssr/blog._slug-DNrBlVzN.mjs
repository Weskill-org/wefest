import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as Route$n, B as BLOG_POSTS, a as Button } from "./router-C5_6oBDd.mjs";
import "../_libs/sonner.mjs";
import { b as ArrowLeft, C as Calendar, H as Clock, aO as Twitter, a2 as Linkedin, az as Share2 } from "../_libs/lucide-react.mjs";
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
function BlogPostPage() {
  const {
    slug
  } = Route$n.useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-4", children: "Post not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "The blog post you're looking for doesn't exist." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", children: "Back to blog" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "container mx-auto px-6 py-24 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Back to Blog"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold", children: post.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          " ",
          post.date
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
          " ",
          post.readTime
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-6xl font-black mb-8 leading-tight", children: post.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-6 border-y border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center font-bold", children: post.author.slice(0, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: post.author }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Expert in campus ecosystems" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-foreground font-medium italic", children: post.excerpt }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap", children: post.content }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground", children: "The Digital Transformation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "College festivals have always been the pinnacle of student life in India. From the high-octane energy of Mood Indigo to the technical brilliance of Shaastra, these events define an entire generation's campus experience. However, the manual processes that once powered these fests are no longer sufficient for the scale of the 21st century." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass p-8 rounded-3xl border-l-4 border-primary my-12", children: `"The shift from physical ticket counters to identity-verified digital ecosystems isn't just about convenience—it's about building a sustainable and transparent future for student-led initiatives."` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Why Authenticity Matters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "One of the biggest challenges facing large-scale events today is the rise of scalping and fake identities. By integrating college email verification directly into the ticketing flow, WeFest ensures that every attendee is a verified student or authorized guest. This creates a safer, more exclusive environment for everyone involved." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground", children: "The Future of Sponsorship" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Brands are no longer satisfied with just 'logo placement'. They want data-driven insights. They want to know exactly who they are reaching and what the engagement levels look like. This is where digital platforms provide the most value to student organizers." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-16 pt-16 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-brand-gradient p-8 md:p-12 rounded-3xl text-primary-foreground text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-black mb-4", children: "Want to read more?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-8 opacity-90 max-w-xl mx-auto", children: "Join 10,000+ student organizers and get the latest campus trends delivered to your inbox every week." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "Enter your college email", className: "bg-background/20 border border-white/20 rounded-xl px-6 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "lg", children: "Subscribe Now" })
      ] })
    ] }) })
  ] });
}
export {
  BlogPostPage as component
};
