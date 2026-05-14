import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Route$z, x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent, d as DialogHeader, e as DialogTitle } from "./dialog-CO1OYTv6.mjs";
import "../_libs/sonner.mjs";
import { a3 as LoaderCircle, Y as Image$1, ah as Paintbrush, L as Download, _ as Info } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
function OrganizerSponsorAssets() {
  const ctx = Route$z.useRouteContext();
  const user = ctx?.user;
  ctx?.membership;
  const {
    data: sharedAssets,
    isLoading
  } = useQuery({
    queryKey: ["organizer-shared-assets", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shared_assets").select(`
          id, permissions, created_at,
          brand_assets (
            id, name, type, file_url, company_id,
            company_profiles (company_name)
          ),
          events (title)
        `).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data || [];
    }
  });
  const [selectedAsset, setSelectedAsset] = reactExports.useState(null);
  const [showEditor, setShowEditor] = reactExports.useState(false);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 max-w-6xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-primary uppercase tracking-widest", children: "Sponsorships" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-black tracking-tight", children: "Brand Assets" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm max-w-2xl", children: "Access logos, banners, and templates shared by your sponsors. Customize templates with your college details while strictly adhering to sponsor brand guidelines." })
    ] }),
    sharedAssets?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-12 text-center flex flex-col items-center border border-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-12 w-12 text-white/20 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-1", children: "No shared assets yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "When sponsors accept your proposals, they can share their marketing materials here." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 gap-6", children: sharedAssets?.map((sa) => {
      const asset = sa.brand_assets;
      if (!asset) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl overflow-hidden border border-white/10 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-black/50 relative flex items-center justify-center p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: asset.file_url, alt: asset.name, className: "max-w-full max-h-full object-contain drop-shadow-lg" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm line-clamp-2", children: asset.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] uppercase shrink-0 bg-white/5", children: asset.type })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-4", children: [
              "Shared by ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: asset.company_profiles?.company_name }),
              " for ",
              sa.events?.title
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-auto", children: [
            asset.type === "banner" || asset.type === "poster" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "flex-1 bg-brand-gradient text-white shadow-glow", onClick: () => {
              setSelectedAsset({
                ...asset,
                shared_id: sa.id
              });
              setShowEditor(true);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Paintbrush, { className: "h-3.5 w-3.5 mr-1.5" }),
              " Customize"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", className: "flex-1", onClick: () => {
              const link = document.createElement("a");
              link.href = asset.file_url;
              link.download = asset.name;
              link.click();
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5 mr-1.5" }),
              " Download"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(GuidelinesModal, { companyId: asset.company_id, companyName: asset.company_profiles?.company_name })
          ] })
        ] })
      ] }, sa.id);
    }) }),
    showEditor && selectedAsset && /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateEditor, { asset: selectedAsset, onClose: () => {
      setShowEditor(false);
      setSelectedAsset(null);
    } })
  ] });
}
function GuidelinesModal({
  companyId,
  companyName
}) {
  const {
    data: guidelines,
    isLoading
  } = useQuery({
    queryKey: ["brand-guidelines", companyId],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("brand_guidelines").select("*").eq("company_id", companyId).maybeSingle();
      return data;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", className: "h-9 w-9 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass border-white/10 sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        companyName,
        " Guidelines"
      ] }) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }) : !guidelines ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-center text-sm text-muted-foreground", children: "No specific guidelines provided." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-muted-foreground uppercase mb-3", children: "Brand Colors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
            guidelines.colors?.primary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-md shadow-inner", style: {
                backgroundColor: guidelines.colors.primary
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", children: guidelines.colors.primary })
            ] }),
            guidelines.colors?.secondary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-md shadow-inner", style: {
                backgroundColor: guidelines.colors.secondary
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", children: guidelines.colors.secondary })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-muted-foreground uppercase mb-2", children: "Instructions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 rounded-lg p-3 text-sm whitespace-pre-wrap", children: guidelines.instructions || "Please maintain clear space around logos and do not distort images." })
        ] })
      ] })
    ] })
  ] });
}
function TemplateEditor({
  asset,
  onClose
}) {
  const canvasRef = reactExports.useRef(null);
  const [eventName, setEventName] = reactExports.useState("WeFest 2026");
  const [collegeName, setCollegeName] = reactExports.useState("IIT Bombay");
  const [date, setDate] = reactExports.useState("15th Oct, 2026");
  const [venue, setVenue] = reactExports.useState("Main Auditorium");
  const [imageLoaded, setImageLoaded] = reactExports.useState(false);
  const imgRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
      drawCanvas();
    };
    img.src = asset.file_url;
  }, [asset.file_url]);
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const isBanner = img.width > img.height;
    if (isBanner) {
      const boxHeight = 120;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.font = "bold 40px sans-serif";
      ctx.fillText(eventName, 40, canvas.height - 70);
      ctx.font = "24px sans-serif";
      ctx.fillText(`Presented by ${collegeName}`, 40, canvas.height - 30);
      ctx.textAlign = "right";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(date, canvas.width - 40, canvas.height - 70);
      ctx.font = "24px sans-serif";
      ctx.fillText(venue, canvas.width - 40, canvas.height - 30);
    } else {
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, canvas.height - 180, canvas.width, 180);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(eventName, canvas.width / 2, canvas.height - 110);
      ctx.font = "28px sans-serif";
      ctx.fillText(`at ${collegeName}`, canvas.width / 2, canvas.height - 65);
      ctx.font = "24px sans-serif";
      ctx.fillText(`${date} • ${venue}`, canvas.width / 2, canvas.height - 25);
    }
  };
  reactExports.useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [eventName, collegeName, date, venue, imageLoaded]);
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `Customized_${asset.name}.png`;
    link.click();
    toast.success("Design downloaded successfully!");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass border-white/10 max-w-4xl w-full p-0 overflow-hidden flex flex-col md:flex-row h-[80vh] max-h-[600px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-80 border-r border-white/10 bg-black/40 p-6 flex flex-col overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: "Customize Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add your event details to the sponsor's asset." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Event Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: eventName, onChange: (e) => setEventName(e.target.value), className: "glass bg-black/20 h-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "College Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: collegeName, onChange: (e) => setCollegeName(e.target.value), className: "glass bg-black/20 h-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Event Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: date, onChange: (e) => setDate(e.target.value), className: "glass bg-black/20 h-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Venue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: venue, onChange: (e) => setVenue(e.target.value), className: "glass bg-black/20 h-9" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-4 border-t border-white/10 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full bg-brand-gradient text-white shadow-glow", onClick: handleDownload, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
          " Download Image"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full text-xs", onClick: onClose, children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-black/80 flex flex-col items-center justify-center p-6 relative overflow-hidden", children: [
      !imageLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10", style: {
        display: imageLoaded ? "block" : "none"
      } }) })
    ] })
  ] }) });
}
export {
  OrganizerSponsorAssets as component
};
