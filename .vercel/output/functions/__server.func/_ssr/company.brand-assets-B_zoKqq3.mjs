import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { T as Textarea } from "./textarea-D6eI1C7e.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent, d as DialogHeader, e as DialogTitle } from "./dialog-CO1OYTv6.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-Zp0RaQmE.mjs";
import { a3 as LoaderCircle, Y as Image, aQ as Upload, ak as Plus, az as Share2, aK as Trash2, y as CircleCheck, ai as Palette, ay as Settings2, Q as FileText } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
function CompanyBrandAssets() {
  const qc = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
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
      if (!user2) throw new Error("Unauthorized");
      return user2;
    }
  });
  const {
    data: companyProfile
  } = useQuery({
    queryKey: ["company-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("company_profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    }
  });
  const {
    data: assets,
    isLoading: assetsLoading,
    refetch: refetchAssets
  } = useQuery({
    queryKey: ["brand-assets", companyProfile?.id],
    enabled: !!companyProfile?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("brand_assets").select("*").eq("company_id", companyProfile.id).order("created_at", {
        ascending: false
      });
      if (error) {
        toast.error("Failed to fetch assets: " + error.message);
        throw error;
      }
      return data || [];
    }
  });
  const {
    data: guidelines,
    isLoading: guidelinesLoading
  } = useQuery({
    queryKey: ["brand-guidelines", companyProfile?.id],
    enabled: !!companyProfile?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("brand_guidelines").select("*").eq("company_id", companyProfile.id).maybeSingle();
      return data;
    }
  });
  const {
    data: acceptedEvents
  } = useQuery({
    queryKey: ["company-accepted-events", companyProfile?.id],
    enabled: !!companyProfile?.id,
    queryFn: async () => {
      const {
        data: proposals,
        error
      } = await supabase.from("sponsorship_proposals").select("event_id, events(title, college_name)").eq("company_user_id", user.id).eq("status", "accepted");
      if (error) {
        console.error("Error fetching accepted sponsorships:", error);
        return [];
      }
      return proposals || [];
    }
  });
  const [uploading, setUploading] = reactExports.useState(false);
  const [newAssetType, setNewAssetType] = reactExports.useState("banner");
  const [newAssetName, setNewAssetName] = reactExports.useState("");
  const [isUploadOpen, setIsUploadOpen] = reactExports.useState(false);
  const [guidelineColors, setGuidelineColors] = reactExports.useState({
    primary: "#000000",
    secondary: "#ffffff"
  });
  const [guidelineInstructions, setGuidelineInstructions] = reactExports.useState("");
  const [isEditingGuidelines, setIsEditingGuidelines] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (guidelines) {
      setGuidelineColors(guidelines.colors || {
        primary: "#000000",
        secondary: "#ffffff"
      });
      setGuidelineInstructions(guidelines.instructions || "");
    }
  }, [guidelines]);
  const uploadAsset = useMutation({
    mutationFn: async (fileDataUrl) => {
      if (!companyProfile?.id) throw new Error("No company profile");
      const {
        data,
        error
      } = await supabase.from("brand_assets").insert({
        company_id: companyProfile.id,
        name: newAssetName || "Untitled Asset",
        type: newAssetType,
        file_url: fileDataUrl
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (newAsset) => {
      toast.success("Asset uploaded successfully", {
        description: `Name: ${newAsset.name} • Type: ${newAsset.type}`
      });
      qc.setQueryData(["brand-assets", companyProfile?.id], (old) => {
        return [newAsset, ...old || []];
      });
      qc.invalidateQueries({
        queryKey: ["brand-assets"]
      });
      refetchAssets();
      setNewAssetName("");
      setIsUploadOpen(false);
    },
    onError: (e) => toast.error(e.message),
    onSettled: () => setUploading(false)
  });
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large for demo. Please use an image under 2MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      uploadAsset.mutate(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const deleteAsset = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("brand_assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Asset deleted");
      qc.invalidateQueries({
        queryKey: ["brand-assets"]
      });
      refetchAssets();
    }
  });
  const saveGuidelines = useMutation({
    mutationFn: async () => {
      if (!companyProfile?.id) throw new Error("No company profile");
      const {
        error
      } = await supabase.from("brand_guidelines").upsert({
        company_id: companyProfile.id,
        colors: guidelineColors,
        instructions: guidelineInstructions
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Guidelines saved successfully");
      setIsEditingGuidelines(false);
      qc.invalidateQueries({
        queryKey: ["brand-guidelines"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const shareAsset = useMutation({
    mutationFn: async ({
      assetId,
      eventId
    }) => {
      const {
        error
      } = await supabase.from("shared_assets").insert({
        asset_id: assetId,
        event_id: eventId,
        permissions: "edit"
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Asset shared with organizer!");
    },
    onError: (e) => toast.error(e.message)
  });
  if (assetsLoading || guidelinesLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 max-w-6xl mx-auto space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-primary uppercase tracking-widest", children: "Brand Hub" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-black tracking-tight", children: "Assets & Creativity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm max-w-2xl", children: "Manage your logos, banners, and merchandise templates. Share them directly with event organizers to ensure your brand is represented perfectly at every fest." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_350px] gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5 text-primary" }),
            " Brand Assets"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isUploadOpen, onOpenChange: (open) => {
            setIsUploadOpen(open);
            if (!open) {
              setNewAssetName("");
              setNewAssetType("banner");
            }
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-brand-gradient text-white shadow-glow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
              " Upload Asset"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass border-white/10 sm:max-w-[425px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Upload New Asset" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Asset Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newAssetName, onChange: (e) => setNewAssetName(e.target.value), placeholder: "e.g., Primary Logo, Main Banner", className: "glass bg-black/20" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Asset Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newAssetType, onValueChange: setNewAssetType, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass bg-black/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass bg-black/90", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "logo", children: "Logo" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "banner", children: "Banner Template" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "poster", children: "Poster" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "merchandise", children: "Merchandise Design" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other Creative" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-white/5", children: [
                    uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mb-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-8 w-8 text-muted-foreground mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Click to browse file" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mt-1", children: "PNG, JPG up to 2MB" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, className: "hidden", accept: "image/*" })
                ] }) })
              ] })
            ] })
          ] })
        ] }),
        assets?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-12 text-center flex flex-col items-center border border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-12 w-12 text-white/20 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-1", children: "No assets uploaded yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-6", children: "Upload your brand logos and marketing banners to share with college organizers." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setIsUploadOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            " Quick Upload"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 gap-4", children: assets?.map((asset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl overflow-hidden border border-white/10 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-black/50 relative overflow-hidden flex items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: asset.file_url, alt: asset.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-8 w-full bg-white text-black hover:bg-white/90 font-semibold text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3 w-3 mr-1" }),
                  " Share"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass border-white/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Share Asset" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select an accepted sponsorship event to share this asset with the organizer." }),
                    acceptedEvents?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white/5 rounded-lg text-sm text-center", children: "No accepted sponsorships found yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-2", children: acceptedEvents?.map((pe) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate pr-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm truncate", children: pe.events?.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: pe.events?.college_name })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => shareAsset.mutate({
                        assetId: asset.id,
                        eventId: pe.event_id
                      }), disabled: shareAsset.isPending, children: "Share" })
                    ] }, pe.event_id)) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", className: "h-8 w-8 p-0 shrink-0", onClick: () => deleteAsset.mutate(asset.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm truncate", title: asset.name, children: asset.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] capitalize shrink-0", children: asset.type })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-500" }),
              " Approved"
            ] })
          ] })
        ] }, asset.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6 border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "h-5 w-5 text-primary" }),
            " Brand Guidelines"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => setIsEditingGuidelines(!isEditingGuidelines), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-4 w-4" }) })
        ] }),
        isEditingGuidelines ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase", children: "Brand Colors" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Primary Hex" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: guidelineColors.primary, onChange: (e) => setGuidelineColors((c) => ({
                    ...c,
                    primary: e.target.value
                  })), className: "h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: guidelineColors.primary, onChange: (e) => setGuidelineColors((c) => ({
                    ...c,
                    primary: e.target.value
                  })), className: "h-8 text-xs glass bg-black/20" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Secondary Hex" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: guidelineColors.secondary, onChange: (e) => setGuidelineColors((c) => ({
                    ...c,
                    secondary: e.target.value
                  })), className: "h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: guidelineColors.secondary, onChange: (e) => setGuidelineColors((c) => ({
                    ...c,
                    secondary: e.target.value
                  })), className: "h-8 text-xs glass bg-black/20" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase", children: "Instructions for Organizers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: guidelineInstructions, onChange: (e) => setGuidelineInstructions(e.target.value), placeholder: "E.g., Do not distort the logo. Maintain at least 20px padding around the logo...", className: "h-24 text-xs resize-none glass bg-black/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-brand-gradient text-white", onClick: () => saveGuidelines.mutate(), disabled: saveGuidelines.isPending, children: saveGuidelines.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }) : "Save Guidelines" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-muted-foreground uppercase mb-3", children: "Brand Colors" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border border-white/20 shadow-inner", style: {
                  backgroundColor: guidelineColors.primary
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono", children: guidelineColors.primary })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border border-white/20 shadow-inner", style: {
                  backgroundColor: guidelineColors.secondary
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono", children: guidelineColors.secondary })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
              " Instructions"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm bg-white/5 rounded-xl p-4 text-white/80 whitespace-pre-wrap border border-white/5", children: guidelineInstructions || "No instructions provided." })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CompanyBrandAssets as component
};
