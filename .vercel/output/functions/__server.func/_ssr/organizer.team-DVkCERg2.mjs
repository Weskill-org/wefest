import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button, t as cn } from "./router-C5_6oBDd.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a3 as LoaderCircle, aU as UserPlus, y as CircleCheck, F as CircleX, aV as Users, K as Crown, aK as Trash2, aS as UserCog, aD as ShieldCheck, aJ as Ticket, aY as X, a7 as Mail, au as Search } from "../_libs/lucide-react.mjs";
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
function AddMemberDialog({
  collegeId,
  onClose
}) {
  const queryClient = useQueryClient();
  const [email, setEmail] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("member");
  const [position, setPosition] = reactExports.useState("");
  const [searchResult, setSearchResult] = reactExports.useState(null);
  const [searching, setSearching] = reactExports.useState(false);
  const [notFound, setNotFound] = reactExports.useState(false);
  const searchUser = async () => {
    if (!email.trim()) return;
    setSearching(true);
    setNotFound(false);
    setSearchResult(null);
    const {
      data,
      error
    } = await supabase.from("profiles").select("user_id, full_name, email").eq("email", email.trim().toLowerCase()).maybeSingle();
    if (error || !data) {
      setNotFound(true);
    } else {
      const {
        data: existing
      } = await supabase.from("college_members").select("id").eq("college_id", collegeId).eq("user_id", data.user_id).maybeSingle();
      if (existing) {
        toast.error("This user is already a member of your college");
        setSearchResult(null);
      } else {
        setSearchResult(data);
      }
    }
    setSearching(false);
  };
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!searchResult) throw new Error("No user selected");
      const {
        error
      } = await supabase.from("college_members").insert({
        college_id: collegeId,
        user_id: searchResult.user_id,
        role,
        position: position.trim() || null,
        is_approved: true
      });
      if (error) throw error;
      const {
        data: college
      } = await supabase.from("colleges").select("name").eq("id", collegeId).single();
      await supabase.from("notification_logs").insert({
        user_id: searchResult.user_id,
        title: "New Team Position",
        body: `You have been selected as ${position.trim() || role} for ${college?.name || "the committee"}. Congratulations!`,
        metadata: {
          type: "team_assignment",
          college_id: collegeId,
          role,
          position
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["college-team"]
      });
      toast.success(`${searchResult.full_name || searchResult.email} added to team`);
      onClose();
    },
    onError: (e) => toast.error(e.message || "Failed to add member")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md rounded-2xl border border-border/60 bg-background p-6 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black tracking-tight", children: "Add Team Member" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-muted-foreground hover:text-foreground transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5 text-primary" }),
            " Email Address"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "member@example.com", value: email, onChange: (e) => {
              setEmail(e.target.value);
              setNotFound(false);
              setSearchResult(null);
            }, onKeyDown: (e) => e.key === "Enter" && searchUser(), className: "h-11 rounded-xl border-border/50 bg-muted/5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: searchUser, disabled: searching || !email.trim(), className: "h-11 rounded-xl bg-brand-gradient text-white font-bold px-4 shrink-0", children: searching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }) })
          ] })
        ] }),
        notFound && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-500", children: "User not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "They must have a WeFest account first. Ask them to sign up, then try again." })
        ] }),
        searchResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary", children: (searchResult.full_name || searchResult.email || "U").charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm truncate", children: searchResult.full_name || "Unnamed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: searchResult.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 ml-auto" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold", children: "Assign Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
              value: "member",
              label: "Member",
              icon: Users,
              color: "text-muted-foreground"
            }, {
              value: "coordinator",
              label: "Coordinator",
              icon: ShieldCheck,
              color: "text-emerald-500"
            }, {
              value: "ticket_poc",
              label: "Ticket POC",
              icon: Ticket,
              color: "text-blue-500"
            }, {
              value: "admin",
              label: "Admin",
              icon: Crown,
              color: "text-yellow-500"
            }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setRole(r.value), className: cn("flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-bold transition-all", role === r.value ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-muted/5 text-muted-foreground hover:bg-muted/20"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: cn("h-4 w-4", role === r.value ? "text-primary" : r.color) }),
              r.label
            ] }, r.value)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold", children: "Position Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. Head of Marketing, Volunteer", value: position, onChange: (e) => setPosition(e.target.value), className: "h-11 rounded-xl border-border/50 bg-muted/5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground px-1", children: "This will be displayed as their official title in the team list." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => addMutation.mutate(), disabled: addMutation.isPending, className: "w-full h-11 bg-brand-gradient text-white rounded-xl font-bold shadow-glow", children: addMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-2" }),
            " Add to Team"
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
function TeamManagement() {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = reactExports.useState(false);
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
    data: collegeData,
    isLoading: loadingCollege
  } = useQuery({
    queryKey: ["my-college-data", userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      const {
        data: memberData
      } = await supabase.from("college_members").select(`*, colleges (id, name, city, domain, slug, status, fests, created_at)`).eq("user_id", userData.id).maybeSingle();
      if (memberData?.colleges) {
        return {
          college: memberData.colleges,
          role: memberData.role,
          isApproved: memberData.is_approved,
          collegeId: memberData.colleges.id
        };
      }
      const userCollegeName = userData.user_metadata?.full_name;
      if (userCollegeName) {
        const {
          data: collegeByName
        } = await supabase.from("colleges").select("id, name, city, domain, slug, status, fests, created_at").eq("name", userCollegeName).maybeSingle();
        if (collegeByName) {
          await supabase.from("college_members").upsert({
            college_id: collegeByName.id,
            user_id: userData.id,
            role: "admin",
            is_approved: true
          }, {
            onConflict: "college_id,user_id"
          });
          return {
            college: collegeByName,
            role: "admin",
            isApproved: true,
            collegeId: collegeByName.id
          };
        }
      }
      return {
        college: {
          id: null,
          name: userCollegeName || userData.email || "My College",
          status: "pending"
        },
        role: "admin",
        isApproved: true,
        collegeId: null
      };
    }
  });
  const {
    data: teamMembers,
    isLoading: loadingTeam
  } = useQuery({
    queryKey: ["college-team", collegeData?.collegeId],
    enabled: !!collegeData?.collegeId,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("college_members").select(`*, profiles (full_name, email, avatar_url)`).eq("college_id", collegeData.collegeId).order("created_at", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const updateMemberMutation = useMutation({
    mutationFn: async ({
      memberId,
      updates,
      memberUserId,
      collegeName
    }) => {
      const {
        error
      } = await supabase.from("college_members").update(updates).eq("id", memberId);
      if (error) throw error;
      if (memberUserId && (updates.position !== void 0 || updates.role !== void 0)) {
        await supabase.from("notification_logs").insert({
          user_id: memberUserId,
          title: "Team Role Updated",
          body: `Your position at ${collegeName || "the committee"} has been updated to: ${updates.position || updates.role || "Member"}.`,
          metadata: {
            type: "team_update",
            role: updates.role,
            position: updates.position
          }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["college-team"]
      });
      toast.success("Member updated");
    },
    onError: (e) => toast.error(e.message)
  });
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId) => {
      const {
        error
      } = await supabase.from("college_members").delete().eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["college-team"]
      });
      toast.success("Member removed");
    },
    onError: (e) => toast.error(e.message)
  });
  if (loadingCollege || loadingTeam) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const isAdmin = collegeData?.role === "admin" && collegeData?.isApproved;
  const myCollegeName = collegeData?.college?.name || "Your College";
  const pendingRequests = teamMembers?.filter((m) => !m.is_approved) || [];
  const activeMembers = teamMembers?.filter((m) => m.is_approved) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 lg:px-10 lg:py-10 max-w-[1200px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight lg:text-3xl", children: "Team" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          "Manage your festival committee for ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: myCollegeName })
        ] })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowAddDialog(true), className: "bg-brand-gradient text-white rounded-xl h-10 px-5 font-bold shadow-glow gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        " Add Member"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-muted/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black mt-1", children: activeMembers.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-amber-500/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Pending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-amber-500 mt-1", children: pendingRequests.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-emerald-500/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Admins" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-emerald-500 mt-1", children: activeMembers.filter((m) => m.role === "admin").length })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 xl:grid-cols-[1fr_320px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
        isAdmin && pendingRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground", children: "Join Requests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-500/20 text-amber-500 border-none text-[10px]", children: pendingRequests.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pendingRequests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0", children: (request.profiles?.full_name || "U").charAt(0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm truncate", children: request.profiles?.full_name || "Unknown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: request.profiles?.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 w-8 p-0", onClick: () => updateMemberMutation.mutate({
                memberId: request.id,
                updates: {
                  is_approved: true
                },
                memberUserId: request.user_id,
                collegeName: myCollegeName
              }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", className: "rounded-lg h-8 w-8 p-0", onClick: () => removeMemberMutation.mutate(request.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }) })
            ] })
          ] }, request.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4", children: [
            "Committee Members (",
            activeMembers.length,
            ")"
          ] }),
          activeMembers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border/50 p-12 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground/40 mx-auto mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-muted-foreground", children: "No team members yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'Click "Add Member" to build your festival committee.' })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: activeMembers.map((member) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/5 hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary", children: (member.profiles?.full_name || "U").charAt(0).toUpperCase() }),
                member.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center text-white border-2 border-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-2 w-2" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm truncate", children: member.profiles?.full_name || "Unknown" }),
                  member.user_id === userData?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase px-1.5 py-0", children: "You" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: member.role }),
                  member.position && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded-md border border-primary/10", children: member.position }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: member.profiles?.email })
                ] })
              ] })
            ] }),
            isAdmin && member.user_id !== userData?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Position", className: "h-8 w-32 text-[10px] font-bold bg-muted/20 border-border/40", defaultValue: member.position || "", onBlur: (e) => {
                if (e.target.value !== (member.position || "")) {
                  updateMemberMutation.mutate({
                    memberId: member.id,
                    updates: {
                      position: e.target.value
                    },
                    memberUserId: member.user_id,
                    collegeName: myCollegeName
                  });
                }
              }, onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.target.blur();
                }
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "bg-muted/30 border border-border/50 rounded-lg text-[10px] font-bold p-1.5 focus:ring-1 ring-primary h-8", value: member.role, onChange: (e) => updateMemberMutation.mutate({
                memberId: member.id,
                updates: {
                  role: e.target.value
                },
                memberUserId: member.user_id,
                collegeName: myCollegeName
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "member", children: "Member" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "coordinator", children: "Coordinator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ticket_poc", children: "Ticket POC" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "text-muted-foreground hover:text-destructive rounded-lg h-8 w-8 p-0", onClick: () => {
                if (confirm("Remove this member from the committee?")) removeMemberMutation.mutate(member.id);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] })
          ] }, member.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-muted/10 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4 text-primary" }),
          " Role Privileges"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoleDetail, { icon: Crown, title: "College Admin", color: "text-yellow-500", desc: "Full control over festivals, finances, and team." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoleDetail, { icon: ShieldCheck, title: "Coordinator", color: "text-emerald-500", desc: "Manage festival content and sponsorships." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoleDetail, { icon: Ticket, title: "Ticket POC", color: "text-blue-500", desc: "Access ticket inventory and check-ins." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoleDetail, { icon: Users, title: "Member", color: "text-muted-foreground", desc: "View-only access to dashboard." })
        ] })
      ] }) })
    ] }),
    showAddDialog && collegeData?.collegeId && /* @__PURE__ */ jsxRuntimeExports.jsx(AddMemberDialog, { collegeId: collegeData.collegeId, onClose: () => setShowAddDialog(false) })
  ] });
}
function RoleBadge({
  role
}) {
  const configs = {
    admin: {
      label: "Admin",
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    },
    coordinator: {
      label: "Coordinator",
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    ticket_poc: {
      label: "Ticket POC",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    member: {
      label: "Member",
      color: "bg-muted/50 text-muted-foreground border-border/50"
    }
  };
  const config = configs[role] || configs.member;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cn("uppercase text-[8px] font-black tracking-wider px-1.5 py-0", config.color), children: config.label });
}
function RoleDetail({
  icon: Icon,
  title,
  color,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-7 w-7 rounded-lg bg-muted/30 flex items-center justify-center shrink-0", color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 leading-relaxed", children: desc })
    ] })
  ] });
}
export {
  TeamManagement as component
};
