import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, u as useMatchRoute, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { p as Route$2, x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-BK_SLcQl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CO1OYTv6.mjs";
import { T as Textarea } from "./textarea-D6eI1C7e.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-Zp0RaQmE.mjs";
import { r as Check, Z as IndianRupee, aJ as Ticket, A as Activity, ak as Plus, p as ChartColumn, ao as Receipt, aw as Send, aY as X, aE as ShoppingBag, aZ as Zap, aV as Users, a3 as LoaderCircle } from "../_libs/lucide-react.mjs";
import { e as eachDayOfInterval, s as subDays, f as format, p as parseISO } from "../_libs/date-fns.mjs";
import { R as ResponsiveContainer, a as AreaChart, X as XAxis, Y as YAxis, T as Tooltip, A as Area, d as PieChart, P as Pie, c as Cell } from "../_libs/recharts.mjs";
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
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function OrganizerEventDashboard() {
  const event = Route$2.useLoaderData();
  if (!event) return null;
  const {
    tab
  } = Route$2.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  const [selectedProposal, setSelectedProposal] = reactExports.useState(null);
  const [acceptNotes, setAcceptNotes] = reactExports.useState("");
  const [isProductDialogOpen, setIsProductDialogOpen] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [productForm, setProductForm] = reactExports.useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: ""
  });
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = reactExports.useState(false);
  const [campaignForm, setCampaignForm] = reactExports.useState({
    title: "",
    message_content: "",
    channel: "email",
    target_segment: "ticket_holders",
    scheduled_at: ""
  });
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = reactExports.useState(false);
  const [budgetForm, setBudgetForm] = reactExports.useState({
    category: "",
    allocated_amount: "",
    currency: "INR"
  });
  const [isProgramDialogOpen, setIsProgramDialogOpen] = reactExports.useState(false);
  const [programForm, setProgramForm] = reactExports.useState({
    title: "",
    description: "",
    requirements: "",
    perks: "",
    status: "active"
  });
  const isBaseRoute = !!matchRoute({
    to: "/organizer/events/$eventId",
    fuzzy: false
  });
  const {
    data: volunteers,
    isLoading: loadingVols
  } = useQuery({
    queryKey: ["volunteers", event?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("volunteers").select("*, user:user_id(email, raw_user_meta_data)").eq("event_id", event?.id);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: proposals,
    isLoading: loadingProposals
  } = useQuery({
    queryKey: ["proposals", event?.id],
    queryFn: async () => {
      const {
        data: proposalsData,
        error: proposalsError
      } = await supabase.from("sponsorship_proposals").select("*").eq("event_id", event?.id);
      if (proposalsError) throw proposalsError;
      if (!proposalsData || proposalsData.length === 0) return [];
      const companyIds = [...new Set(proposalsData.map((p) => p.company_user_id))];
      const {
        data: profilesData,
        error: profilesError
      } = await supabase.from("profiles").select("user_id, email, full_name").in("user_id", companyIds);
      if (profilesError) {
        console.error("Error fetching company profiles:", profilesError);
        return proposalsData.map((p) => ({
          ...p,
          company: null
        }));
      }
      return proposalsData.map((p) => ({
        ...p,
        company: profilesData.find((profile) => profile.user_id === p.company_user_id) || null
      }));
    }
  });
  reactExports.useEffect(() => {
    const channel = supabase.channel("proposals_changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "sponsorship_proposals",
      filter: `event_id=eq.${event.id}`
    }, () => {
      queryClient.invalidateQueries({
        queryKey: ["proposals", event.id]
      });
      toast.info("New sponsorship proposal received");
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [event?.id, queryClient]);
  const {
    data: tickets,
    isLoading: loadingTickets
  } = useQuery({
    queryKey: ["event-tickets-sold", event?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("tickets").select("*").eq("event_id", event?.id);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: eventProducts
  } = useQuery({
    queryKey: ["event-products", event?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("products").select("*").eq("event_id", event?.id);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: eventPrograms
  } = useQuery({
    queryKey: ["event-programs", event?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("ambassador_programs").select("*").eq("event_id", event?.id);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: budgets
  } = useQuery({
    queryKey: ["event-budgets", event?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("event_budgets").select("*").eq("event_id", event?.id);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: campaigns
  } = useQuery({
    queryKey: ["marketing-campaigns", event?.college_id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("marketing_campaigns").select("*").eq("college_id", event?.college_id ?? "");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: vendorPayouts
  } = useQuery({
    queryKey: ["vendor-payouts", event.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("vendor_payouts").select("*").eq("event_id", event.id);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: eventOrders
  } = useQuery({
    queryKey: ["event-orders", event.id],
    enabled: !!eventProducts?.length,
    queryFn: async () => {
      const productIds = eventProducts?.map((p) => p.id) || [];
      if (productIds.length === 0) return [];
      const {
        data,
        error
      } = await supabase.from("orders").select("*").in("product_id", productIds);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: ambassadorApplications
  } = useQuery({
    queryKey: ["ambassador-applications", event.id],
    enabled: !!eventPrograms?.length,
    queryFn: async () => {
      const programIds = eventPrograms?.map((p) => p.id) || [];
      if (programIds.length === 0) return [];
      const {
        data,
        error
      } = await supabase.from("ambassador_applications").select("*").in("program_id", programIds);
      if (error) throw error;
      return data;
    }
  });
  const updateVolMutation = useMutation({
    mutationFn: async ({
      id,
      status
    }) => {
      const {
        error
      } = await supabase.from("volunteers").update({
        status
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Volunteer status updated");
      queryClient.invalidateQueries({
        queryKey: ["volunteers", event.id]
      });
    }
  });
  const updateProposalMutation = useMutation({
    mutationFn: async ({
      id,
      status
    }) => {
      const {
        error
      } = await supabase.from("sponsorship_proposals").update({
        status
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sponsorship status updated");
      queryClient.invalidateQueries({
        queryKey: ["proposals", event.id]
      });
    }
  });
  const saveProductMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        // Store in Rupees
        stock: Number(data.stock),
        image_url: data.image_url || null,
        event_id: event.id
      };
      if (editingProduct) {
        const {
          error
        } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingProduct ? "Product updated successfully" : "Product added successfully");
      queryClient.invalidateQueries({
        queryKey: ["event-products", event.id]
      });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: ""
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save product");
    }
  });
  const saveCampaignMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        title: data.title,
        message_content: data.message_content,
        channel: data.channel,
        target_segment: data.target_segment,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).toISOString() : null,
        college_id: event.college_id,
        status: data.scheduled_at ? "scheduled" : "sent"
      };
      const {
        error
      } = await supabase.from("marketing_campaigns").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Campaign created successfully");
      queryClient.invalidateQueries({
        queryKey: ["marketing-campaigns", event.college_id]
      });
      setIsCampaignDialogOpen(false);
      setCampaignForm({
        title: "",
        message_content: "",
        channel: "email",
        target_segment: "ticket_holders",
        scheduled_at: ""
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create campaign");
    }
  });
  const saveBudgetMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        category: data.category,
        allocated_amount: Number(data.allocated_amount),
        currency: data.currency,
        event_id: event.id,
        spent_amount: 0
      };
      const {
        error
      } = await supabase.from("event_budgets").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Budget added successfully");
      queryClient.invalidateQueries({
        queryKey: ["event-budgets", event.id]
      });
      setIsBudgetDialogOpen(false);
      setBudgetForm({
        category: "",
        allocated_amount: "",
        currency: "INR"
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add budget");
    }
  });
  const saveProgramMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        perks: data.perks.split(",").map((p) => p.trim()).filter(Boolean),
        status: data.status,
        event_id: event.id
      };
      const {
        error
      } = await supabase.from("ambassador_programs").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Program created successfully");
      queryClient.invalidateQueries({
        queryKey: ["event-programs", event.id]
      });
      setIsProgramDialogOpen(false);
      setProgramForm({
        title: "",
        description: "",
        requirements: "",
        perks: "",
        status: "active"
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create program");
    }
  });
  const handleOpenProductDialog = (product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        // Already in Rupees
        stock: product.stock.toString(),
        image_url: product.image_url || ""
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: ""
      });
    }
    setIsProductDialogOpen(true);
  };
  const ticketRevenue = (tickets || []).reduce((acc, ticket) => {
    const passSettings = event.pass_settings;
    if (!passSettings) return acc + event.price_from;
    const tier = ticket.tier?.toLowerCase();
    if (tier === "vip" && passSettings.vip?.enabled) {
      return acc + (passSettings.vip.price || event.price_from);
    } else if (tier === "normal" && passSettings.normal?.enabled) {
      return acc + (passSettings.normal.price || event.price_from);
    }
    return acc + event.price_from;
  }, 0);
  const merchRevenue = (eventOrders || []).reduce((acc, order) => acc + order.total_amount, 0);
  const totalRevenue = ticketRevenue + merchRevenue;
  const pendingVols = volunteers?.filter((v) => v.status === "pending") || [];
  const activeVols = volunteers?.filter((v) => v.status === "approved") || [];
  const pendingProposals = proposals?.filter((p) => p.status === "pending") || [];
  const activeProposals = proposals?.filter((p) => p.status === "accepted") || [];
  if (!isBaseRoute) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 lg:px-10 lg:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight lg:text-3xl", children: event.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Analytics, volunteers, and operations management" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${event.status === "published" ? "bg-emerald-500/10 text-emerald-500" : event.status === "draft" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"}`, children: [
          event.status === "published" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) : null,
          event.status
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "rounded-xl text-xs font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/organizer/events/$eventId/edit", params: {
          eventId: event.id
        }, children: "Edit Event" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "rounded-xl text-xs font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events/$eventId", params: {
          eventId: event.id
        }, children: "View Public Page" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: (val) => navigate({
      search: {
        tab: val
      }
    }), className: "", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-6 flex-wrap h-auto gap-1 bg-muted/30 p-1 rounded-xl border border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "analytics", children: "Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "finance", children: "Finance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "marketing", children: "Marketing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "volunteers", children: [
          "Volunteers (",
          activeVols.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "sponsors", children: [
          "Sponsors (",
          activeProposals.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "merch", children: [
          "Merchandise (",
          eventProducts?.length || 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "ambassadors", children: [
          "Ambassadors (",
          eventPrograms?.length || 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "settings", children: "Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "analytics", className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-emerald-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Total Revenue" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-3xl font-bold", children: [
              "₹",
              totalRevenue.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-blue-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Tickets Sold" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl font-bold", children: tickets?.length || 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-purple-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Expected Footfall" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl font-bold", children: event.attendees.toLocaleString() })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg mb-6", children: "Ticket Sales Velocity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[250px] w-full", children: (() => {
              if (!tickets || tickets.length === 0) {
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-muted-foreground text-sm", children: "No sales data yet." });
              }
              const last7Days = eachDayOfInterval({
                start: subDays(/* @__PURE__ */ new Date(), 6),
                end: /* @__PURE__ */ new Date()
              }).map((d) => format(d, "MMM dd"));
              const salesByDate = tickets.reduce((acc, t) => {
                const dateStr = format(parseISO(t.created_at), "MMM dd");
                acc[dateStr] = (acc[dateStr] || 0) + 1;
                return acc;
              }, {});
              const chartData = last7Days.map((date) => ({
                date,
                sales: salesByDate[date] || 0
              }));
              return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorSales", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "hsl(var(--primary))", stopOpacity: 0.5 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "hsl(var(--primary))", stopOpacity: 0 })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", stroke: "hsl(var(--muted-foreground))", fontSize: 12, tickLine: false, axisLine: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "hsl(var(--muted-foreground))", fontSize: 12, tickLine: false, axisLine: false, tickFormatter: (val) => `${val}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
                  backgroundColor: "hsl(var(--background))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))"
                }, itemStyle: {
                  color: "hsl(var(--foreground))"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "sales", stroke: "hsl(var(--primary))", fillOpacity: 1, fill: "url(#colorSales)", strokeWidth: 3 })
              ] }) });
            })() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg mb-6", children: "Sales by Tier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] w-full flex flex-col items-center justify-center", children: (() => {
              if (!tickets || tickets.length === 0) {
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: "No sales data yet." });
              }
              const tierCounts = tickets.reduce((acc, t) => {
                acc[t.tier] = (acc[t.tier] || 0) + 1;
                return acc;
              }, {});
              const COLORS = ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981"];
              const pieData = Object.entries(tierCounts).map(([name, value], idx) => ({
                name,
                value,
                color: COLORS[idx % COLORS.length]
              }));
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: pieData, innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", stroke: "none", children: pieData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, `cell-${index}`)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
                    backgroundColor: "hsl(var(--background))",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))"
                  }, itemStyle: {
                    color: "hsl(var(--foreground))"
                  } })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap justify-center gap-3 text-xs", children: pieData.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: {
                    backgroundColor: d.color
                  } }),
                  " ",
                  d.name,
                  " (",
                  String(d.value),
                  ")"
                ] }, d.name)) })
              ] });
            })() })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "finance", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "Event Budget Tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Monitor allocated vs. spent amounts across categories" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-brand-gradient text-white", onClick: () => setIsBudgetDialogOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            " New Budget"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Total Budget" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black", children: [
              "₹",
              (budgets?.reduce((acc, b) => acc + b.allocated_amount, 0) || 0).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Total Spent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black text-red-400", children: [
              "₹",
              (budgets?.reduce((acc, b) => acc + b.spent_amount, 0) || 0).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Remaining" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black text-emerald-400", children: [
              "₹",
              ((budgets?.reduce((acc, b) => acc + b.allocated_amount, 0) || 0) - (budgets?.reduce((acc, b) => acc + b.spent_amount, 0) || 0)).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Burn Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black text-blue-400", children: [
              budgets?.length ? Math.round((budgets?.reduce((acc, b) => acc + b.spent_amount, 0) || 0) / (budgets?.reduce((acc, b) => acc + b.allocated_amount, 0) || 1) * 100) : 0,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5 text-primary" }),
              " Budget Allocation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              budgets?.map((budget) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: budget.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    "₹",
                    budget.spent_amount.toLocaleString(),
                    " / ₹",
                    budget.allocated_amount.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full transition-all duration-500 ${budget.spent_amount > budget.allocated_amount ? "bg-red-500" : "bg-primary"}`, style: {
                  width: `${Math.min(budget.spent_amount / budget.allocated_amount * 100, 100)}%`
                } }) })
              ] }, budget.id)),
              (!budgets || budgets.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground text-sm", children: "No budget categories defined yet." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5 text-primary" }),
                " Recent Expenses"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "View All" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground text-sm", children: "Expense tracking module ready. Add an expense to begin." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-[2.5rem] p-8 border border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold", children: "Vendor Payouts & Tax Recon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage payments to external vendors and verify GST compliance" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              " Schedule Payout"
            ] })
          ] }),
          vendorPayouts && vendorPayouts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Vendor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Tax (GST)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: vendorPayouts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-medium", children: p.vendor_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 font-bold", children: [
                "₹",
                p.amount.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 text-muted-foreground", children: [
                "₹",
                (p.tax_amount ?? 0).toLocaleString(),
                " (18%)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${p.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"}`, children: p.status.toUpperCase() }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Invoice" }) })
            ] }, p.id)) })
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center glass rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "No vendor payouts scheduled yet." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "marketing", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "Marketing & Notifications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Automate reach-out to students via Email, SMS, or Push" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-brand-gradient text-white", onClick: () => setIsCampaignDialogOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
            " Create Campaign"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
          campaigns?.map((campaign) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${campaign.status === "sent" ? "bg-emerald-500/10 text-emerald-500" : campaign.status === "scheduled" ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"}`, children: campaign.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: campaign.channel.toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold mb-2", children: campaign.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mb-4", children: campaign.message_content }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto pt-4 border-t border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground uppercase font-bold", children: campaign.target_segment.replace("_", " ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8", children: "Details" })
            ] })
          ] }, campaign.id)),
          (!campaigns || campaigns.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-12 glass rounded-2xl text-center text-muted-foreground", children: "No marketing campaigns active. Reach out to your audience to drive sales!" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "volunteers", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-lg mb-4", children: [
            "Pending Requests (",
            pendingVols.length,
            ")"
          ] }),
          pendingVols.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground glass p-6 rounded-xl text-center", children: "No pending requests" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: pendingVols.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-4 rounded-xl flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: v.user?.raw_user_meta_data?.full_name || v.user?.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Applied for: ",
                v.role
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-emerald-500", onClick: () => updateVolMutation.mutate({
                id: v.id,
                status: "approved"
              }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-red-500", onClick: () => updateVolMutation.mutate({
                id: v.id,
                status: "rejected"
              }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] })
          ] }, v.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-lg mb-4", children: [
            "Active Volunteers (",
            activeVols.length,
            ")"
          ] }),
          activeVols.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground glass p-6 rounded-xl text-center", children: "No active volunteers" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass overflow-hidden rounded-xl border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Role" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: activeVols.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-medium", children: v.user?.raw_user_meta_data?.full_name || v.user?.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 capitalize", children: v.role }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-500", children: "Active" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "text-red-500 hover:text-red-600 hover:bg-red-500/10", onClick: () => updateVolMutation.mutate({
                id: v.id,
                status: "rejected"
              }), children: "Revoke" }) })
            ] }, v.id)) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "sponsors", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-lg mb-4", children: [
            "Pending Proposals (",
            pendingProposals.length,
            ")"
          ] }),
          pendingProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground glass p-6 rounded-xl text-center", children: "No pending proposals" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: pendingProposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-4 rounded-xl flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: p.company?.full_name || p.company?.email || "Anonymous Brand" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  p.tier,
                  " Tier • ₹",
                  (p.amount / 1e5).toFixed(1),
                  "L"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-emerald-500 h-8 w-8", onClick: () => setSelectedProposal(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-red-500 h-8 w-8", onClick: () => updateProposalMutation.mutate({
                  id: p.id,
                  status: "rejected"
                }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
              ] })
            ] }),
            p.message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-lg p-3 text-xs italic text-muted-foreground border border-border/40", children: [
              '"',
              p.message,
              '"'
            ] })
          ] }, p.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-lg mb-4", children: [
            "Active Sponsors (",
            activeProposals.length,
            ")"
          ] }),
          activeProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground glass p-6 rounded-xl text-center", children: "No active sponsors" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass overflow-hidden rounded-xl border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Tier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Committed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 font-medium", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: activeProposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-medium", children: p.company?.full_name || p.company?.email || "Anonymous Brand" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 capitalize text-primary font-medium", children: p.tier }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 font-semibold", children: [
                "₹",
                (p.amount / 1e5).toFixed(1),
                "L"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-500", children: "Active" }) })
            ] }, p.id)) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "merch", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "Merchandise Drop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-brand-gradient text-white", onClick: () => handleOpenProductDialog(), children: "Add Product" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
          eventProducts?.map((p) => {
            const soldCount = (eventOrders || []).filter((o) => o.product_id === p.id).reduce((acc, o) => acc + (o.quantity || 1), 0);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`, children: p.stock > 0 ? `${p.stock} in stock` : "Out of stock" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-black mt-2 text-primary", children: [
                  "₹",
                  p.price.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-6 border-t border-border/40 flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  soldCount,
                  " Sold"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleOpenProductDialog(p), children: "Edit" })
              ] })
            ] }, p.id);
          }),
          (!eventProducts || eventProducts.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-12 glass rounded-2xl text-center text-muted-foreground", children: "No products added to this event yet." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "ambassadors", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "Ambassador Programs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-brand-gradient text-white", onClick: () => setIsProgramDialogOpen(true), children: "Create Program" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          eventPrograms?.map((prog) => {
            const applicants = (ambassadorApplications || []).filter((a) => a.program_id === prog.id);
            const approvedCount = applicants.filter((a) => a.status === "approved").length;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold", children: prog.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground capitalize", children: prog.status })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs uppercase tracking-widest font-bold", children: "Applicants" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: applicants.length })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs uppercase tracking-widest font-bold", children: "Approved" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: approvedCount })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "mt-6 w-full", children: "Manage Applications" })
            ] }, prog.id);
          }),
          (!eventPrograms || eventPrograms.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-12 glass rounded-2xl text-center text-muted-foreground", children: "No ambassador programs active for this event." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "settings", className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-primary" }),
              " Event Visibility"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "How this event appears to students" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.status === "published" ? "bg-emerald-500/10 text-emerald-500" : event.status === "cancelled" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`, children: event.status || "draft" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/30 rounded-xl border border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold mb-2", children: "Discovery Tags" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: event.tags?.length ? event.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-md", children: [
                  "#",
                  tag
                ] }, tag)) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "No tags added" }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary" }),
              " Logistics & Venue"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/30 rounded-xl border border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase mb-1", children: "Venue" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: event.venue || "TBD" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/30 rounded-xl border border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase mb-1", children: "Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: event.time || "All Day" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/30 rounded-xl border border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase mb-1", children: "Committee Members" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-1", children: (() => {
                  const members = event.team_members || [];
                  if (!members.length) {
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "No team members listed" });
                  }
                  return members.map((m, i) => {
                    const name = typeof m === "string" ? m : m.name;
                    const role = typeof m === "object" ? m.role : void 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded-full border border-border/40", children: [
                      name,
                      role ? ` · ${role}` : ""
                    ] }, i);
                  });
                })() })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-5 w-5 text-primary" }),
            " Pass Configuration"
          ] }),
          (() => {
            const ps = event.pass_settings;
            if (!ps) {
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center text-sm text-muted-foreground italic", children: [
                "Using default pricing: ₹",
                event.price_from,
                " (Day Pass)"
              ] });
            }
            const cards = [{
              key: "normal",
              label: "Normal Pass",
              data: ps.normal,
              color: "bg-muted/30 border-border/40"
            }, {
              key: "vip",
              label: "VIP Pass",
              data: ps.vip,
              color: "bg-primary/5 border-primary/20"
            }].filter((c) => c.data);
            if (!cards.length) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground italic", children: "No passes configured yet." });
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: cards.map(({
              key,
              label,
              data,
              color
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-5 rounded-xl border ${color} space-y-3`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs font-black uppercase tracking-widest ${key === "vip" ? "text-primary" : ""}`, children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${data.enabled ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`, children: data.enabled ? "Active" : "Disabled" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black text-primary", children: [
                "₹",
                data.price?.toLocaleString() || 0
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-[11px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Duration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                    data.days || 1,
                    " day",
                    (data.days || 1) > 1 ? "s" : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Single day" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                    "₹",
                    data.single_day_price?.toLocaleString() || 0
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Multi day" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                    "₹",
                    data.multi_day_price?.toLocaleString() || 0
                  ] })
                ] })
              ] })
            ] }, key)) });
          })()
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedProposal, onOpenChange: (open) => !open && setSelectedProposal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px] glass border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-6 w-6 text-emerald-500" }),
          " Accept Sponsorship"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Review the details before formally accepting this sponsorship. This will notify the sponsor and lock in the commitment." })
      ] }),
      selectedProposal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border/40 rounded-xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1", children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: selectedProposal.company?.raw_user_meta_data?.full_name || selectedProposal.company?.email || "Sponsor" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1", children: "Tier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-primary capitalize", children: selectedProposal.tier })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1", children: "Amount Committed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-black", children: [
              "₹",
              (selectedProposal.amount / 1e5).toFixed(1),
              "L ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
                "(₹",
                selectedProposal.amount.toLocaleString(),
                ")"
              ] })
            ] })
          ] }),
          selectedProposal.message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1", children: "Message from Sponsor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm italic text-muted-foreground", children: [
              '"',
              selectedProposal.message,
              '"'
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Internal Notes (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "notes", placeholder: "E.g., Payment received via wire transfer on...", className: "resize-none bg-background/50 border-border/40", value: acceptNotes, onChange: (e) => setAcceptNotes(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg p-3 text-xs flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Accepting this proposal confirms you have verified the funds or agreed to the payment terms offline. This action cannot be easily undone." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setSelectedProposal(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-emerald-500 hover:bg-emerald-600 text-white", onClick: () => {
          updateProposalMutation.mutate({
            id: selectedProposal.id,
            status: "accepted"
          });
          setSelectedProposal(null);
          setAcceptNotes("");
        }, disabled: updateProposalMutation.isPending, children: [
          updateProposalMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }),
          "Confirm Acceptance"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isProductDialogOpen, onOpenChange: setIsProductDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px] glass border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-6 w-6 text-primary" }),
          editingProduct ? "Edit Product" : "Add New Product"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingProduct ? "Update the product details below." : "Fill in the details to add a new merchandise item to your event." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Product Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", placeholder: "E.g., Event T-Shirt", className: "bg-background/50 border-border/40", value: productForm.name, onChange: (e) => setProductForm((prev) => ({
            ...prev,
            name: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "description", placeholder: "Describe your product...", className: "resize-none bg-background/50 border-border/40", value: productForm.description, onChange: (e) => setProductForm((prev) => ({
            ...prev,
            description: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "price", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Price (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "price", type: "number", placeholder: "0.00", className: "bg-background/50 border-border/40", value: productForm.price, onChange: (e) => setProductForm((prev) => ({
              ...prev,
              price: e.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "stock", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Initial Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "stock", type: "number", placeholder: "100", className: "bg-background/50 border-border/40", value: productForm.stock, onChange: (e) => setProductForm((prev) => ({
              ...prev,
              stock: e.target.value
            })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "image_url", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Image URL (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "image_url", placeholder: "https://...", className: "bg-background/50 border-border/40", value: productForm.image_url, onChange: (e) => setProductForm((prev) => ({
            ...prev,
            image_url: e.target.value
          })) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsProductDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-brand-gradient text-white", onClick: () => saveProductMutation.mutate(productForm), disabled: saveProductMutation.isPending || !productForm.name || !productForm.price || !productForm.stock, children: [
          saveProductMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          editingProduct ? "Update Product" : "Add Product"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isCampaignDialogOpen, onOpenChange: setIsCampaignDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px] glass border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-6 w-6 text-primary" }),
          "Create Marketing Campaign"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Launch a new notification campaign to reach your audience." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "campaign-title", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Campaign Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "campaign-title", placeholder: "E.g., Early Bird Discount Ending Soon!", className: "bg-background/50 border-border/40", value: campaignForm.title, onChange: (e) => setCampaignForm((prev) => ({
            ...prev,
            title: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "campaign-message", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Message Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "campaign-message", placeholder: "Write your campaign message here...", className: "resize-none h-32 bg-background/50 border-border/40", value: campaignForm.message_content, onChange: (e) => setCampaignForm((prev) => ({
            ...prev,
            message_content: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Channel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: campaignForm.channel, onValueChange: (val) => setCampaignForm((prev) => ({
              ...prev,
              channel: val
            })), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-background/50 border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select channel" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "email", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "sms", children: "SMS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "push", children: "Push Notification" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Target Segment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: campaignForm.target_segment, onValueChange: (val) => setCampaignForm((prev) => ({
              ...prev,
              target_segment: val
            })), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-background/50 border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select segment" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all_students", children: "All Students" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ticket_holders", children: "Ticket Holders" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "past_attendees", children: "Past Attendees" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "scheduled-at", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Schedule (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "scheduled-at", type: "datetime-local", className: "bg-background/50 border-border/40", value: campaignForm.scheduled_at, onChange: (e) => setCampaignForm((prev) => ({
            ...prev,
            scheduled_at: e.target.value
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Leave empty to send immediately." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsCampaignDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-brand-gradient text-white", onClick: () => saveCampaignMutation.mutate(campaignForm), disabled: saveCampaignMutation.isPending || !campaignForm.title || !campaignForm.message_content, children: [
          saveCampaignMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
          campaignForm.scheduled_at ? "Schedule Campaign" : "Send Campaign Now"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isBudgetDialogOpen, onOpenChange: setIsBudgetDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md bg-background/95 backdrop-blur-xl border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add New Budget" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Create a new budget category for tracking event expenses." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "budget-category", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Category Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "budget-category", placeholder: "e.g. Venue, Marketing, Talent", className: "bg-background/50 border-border/40", value: budgetForm.category, onChange: (e) => setBudgetForm((prev) => ({
            ...prev,
            category: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "budget-amount", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Allocated Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-2.5 text-muted-foreground", children: "₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "budget-amount", type: "number", placeholder: "0.00", className: "bg-background/50 border-border/40 pl-8", value: budgetForm.allocated_amount, onChange: (e) => setBudgetForm((prev) => ({
              ...prev,
              allocated_amount: e.target.value
            })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Currency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: budgetForm.currency, onValueChange: (val) => setBudgetForm((prev) => ({
            ...prev,
            currency: val
          })), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-background/50 border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select currency" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "INR", children: "INR (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USD", children: "USD ($)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EUR", children: "EUR (€)" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsBudgetDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-brand-gradient text-white", onClick: () => saveBudgetMutation.mutate(budgetForm), disabled: saveBudgetMutation.isPending || !budgetForm.category || !budgetForm.allocated_amount, children: [
          saveBudgetMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Save Budget"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isProgramDialogOpen, onOpenChange: setIsProgramDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px] glass border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-6 w-6 text-primary" }),
          "Create Ambassador Program"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Launch a new program to recruit campus ambassadors for your event." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "program-title", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Program Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "program-title", placeholder: "E.g., Campus Leader Program", className: "bg-background/50 border-border/40", value: programForm.title, onChange: (e) => setProgramForm((prev) => ({
            ...prev,
            title: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "program-desc", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "program-desc", placeholder: "What is this program about? What are the responsibilities?", className: "resize-none h-24 bg-background/50 border-border/40", value: programForm.description, onChange: (e) => setProgramForm((prev) => ({
            ...prev,
            description: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "program-req", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Requirements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "program-req", placeholder: "E.g., Active on social media, strong communication skills...", className: "resize-none h-20 bg-background/50 border-border/40", value: programForm.requirements, onChange: (e) => setProgramForm((prev) => ({
            ...prev,
            requirements: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "program-perks", className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Perks (Comma Separated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "program-perks", placeholder: "E.g., Free Ticket, VIP Access, Certificate", className: "bg-background/50 border-border/40", value: programForm.perks, onChange: (e) => setProgramForm((prev) => ({
            ...prev,
            perks: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider font-bold text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: programForm.status, onValueChange: (val) => setProgramForm((prev) => ({
            ...prev,
            status: val
          })), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-background/50 border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active (Visible to public)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft (Hidden)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "closed", children: "Closed" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsProgramDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-brand-gradient text-white", onClick: () => saveProgramMutation.mutate(programForm), disabled: saveProgramMutation.isPending || !programForm.title || !programForm.description, children: [
          saveProgramMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-2" }),
          "Create Program"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  OrganizerEventDashboard as component
};
