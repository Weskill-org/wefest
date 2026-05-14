import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { x as supabase, a as Button } from "./router-C5_6oBDd.mjs";
import { I as Input } from "./input-DfdhTZrH.mjs";
import { L as Label } from "./label-Dd0kFXLk.mjs";
import { B as Badge } from "./badge-KECkP8lB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a3 as LoaderCircle, o as Camera, B as BadgeCheck, a7 as Mail, i as Building2, a8 as MapPin, aA as Shield, U as Globe, aM as TriangleAlert, y as CircleCheck, aq as Save, a0 as Key, P as EyeOff, O as Eye } from "../_libs/lucide-react.mjs";
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
function OrganizerSettings() {
  const queryClient = useQueryClient();
  const {
    data: userData,
    isLoading: loadingUser
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
          membershipId: memberData.id
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
            membershipId: null
          };
        }
      }
      return {
        college: {
          id: null,
          name: userCollegeName || userData.email || "My College",
          city: "",
          domain: "",
          slug: null,
          status: "pending",
          fests: 0,
          created_at: userData.created_at
        },
        role: "admin",
        isApproved: true,
        membershipId: null
      };
    }
  });
  const [collegeName, setCollegeName] = reactExports.useState("");
  const [collegeCity, setCollegeCity] = reactExports.useState("");
  const [collegeDomain, setCollegeDomain] = reactExports.useState("");
  const [collegeDirty, setCollegeDirty] = reactExports.useState(false);
  const [currentPassword, setCurrentPassword] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showNewPw, setShowNewPw] = reactExports.useState(false);
  const [showConfirmPw, setShowConfirmPw] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (collegeData?.college) {
      setCollegeName(collegeData.college.name || "");
      setCollegeCity(collegeData.college.city || "");
      setCollegeDomain(collegeData.college.domain || "");
    }
  }, [collegeData]);
  const updateCollegeMutation = useMutation({
    mutationFn: async () => {
      const collegeId = collegeData?.college?.id;
      if (!collegeId) throw new Error("No college record found. Please contact support.");
      const {
        error
      } = await supabase.from("colleges").update({
        name: collegeName,
        city: collegeCity,
        domain: collegeDomain
      }).eq("id", collegeId);
      if (error) throw error;
      await supabase.auth.updateUser({
        data: {
          full_name: collegeName
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-college-data"]
      });
      queryClient.invalidateQueries({
        queryKey: ["current-user"]
      });
      toast.success("College details updated successfully");
      setCollegeDirty(false);
    },
    onError: (e) => toast.error(e.message)
  });
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
      if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
      const {
        error
      } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (e) => toast.error(e.message)
  });
  if (loadingUser || loadingCollege) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const displayCollegeName = collegeData?.college?.name || userData?.user_metadata?.full_name || "My College";
  const displayCollegeCity = collegeData?.college?.city || "";
  const isVerified = collegeData?.college?.status === "approved";
  const memberRole = collegeData?.role || "admin";
  const userEmail = userData?.email || "";
  const initials = displayCollegeName.substring(0, 2).toUpperCase();
  const joinDate = userData?.created_at ? new Date(userData.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";
  const handleCollegeSave = (e) => {
    e.preventDefault();
    updateCollegeMutation.mutate();
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    changePasswordMutation.mutate();
  };
  const roleLabels = {
    admin: "College Admin",
    coordinator: "Coordinator",
    ticket_poc: "Ticket POC",
    member: "Member"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 lg:px-10 lg:py-10 max-w-[900px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight lg:text-3xl", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage your college profile, account, and preferences." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/50 bg-muted/5 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-28 bg-brand-gradient overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-2xl bg-brand-gradient p-0.5 shadow-glow ring-4 ring-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-[14px] bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black text-primary", children: initials }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5 text-white" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 sm:pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black tracking-tight", children: displayCollegeName }),
              isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-5 w-5 text-blue-500 fill-blue-500/10" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
                " ",
                userEmail
              ] }),
              joinDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "Joined ",
                joinDate
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/50 bg-muted/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-[18px] w-[18px]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: "Institutional Overview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Your college status and administrative role." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-background/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5", children: "College Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: displayCollegeName }),
              isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-wider", children: "Verified" })
            ] }),
            displayCollegeCity && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              " ",
              displayCollegeCity
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-background/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5", children: "Your Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: roleLabels[memberRole] || memberRole })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1.5 leading-relaxed", children: [
              memberRole === "admin" && "Full control over festivals, finances, and team.",
              memberRole === "coordinator" && "Manage festival content and sponsorships.",
              memberRole === "ticket_poc" && "Access ticket inventory and check-ins.",
              memberRole === "member" && "View-only access to the organizer dashboard."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/50 bg-muted/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-[18px] w-[18px]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: "College Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Update your college information and contact details." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCollegeSave, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "settings-college-name", className: "text-xs font-bold", children: "College Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "settings-college-name", value: collegeName, onChange: (e) => {
                setCollegeName(e.target.value);
                setCollegeDirty(true);
              }, placeholder: "Enter college name", className: "h-10 rounded-xl border-border/50 bg-background" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "settings-email", className: "text-xs font-bold", children: "Email Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "settings-email", value: userEmail, disabled: true, className: "h-10 rounded-xl border-border/50 bg-muted/20 pr-10 cursor-not-allowed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Email cannot be changed here." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "settings-city", className: "text-xs font-bold", children: "City" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "settings-city", value: collegeCity, onChange: (e) => {
                  setCollegeCity(e.target.value);
                  setCollegeDirty(true);
                }, placeholder: "e.g. Indore, Mumbai, Delhi", className: "h-10 rounded-xl border-border/50 bg-background" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "settings-domain", className: "text-xs font-bold", children: "College Domain" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "settings-domain", value: collegeDomain, onChange: (e) => {
                  setCollegeDomain(e.target.value);
                  setCollegeDirty(true);
                }, placeholder: "e.g. davv.ac.in", className: "h-10 rounded-xl border-border/50 bg-background" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border/30", children: [
            collegeDirty ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-amber-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
              " Unsaved changes"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-500" }),
              " All changes saved"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: !collegeDirty || updateCollegeMutation.isPending, className: "bg-brand-gradient text-white rounded-xl font-bold h-9 px-5 shadow-glow gap-2 text-xs", children: [
              updateCollegeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
              "Save Changes"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/50 bg-muted/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-[18px] w-[18px]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: "Change Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Update your password to keep your account secure." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePasswordChange, className: "space-y-4 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "settings-new-pw", className: "text-xs font-bold", children: "New Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "settings-new-pw", type: showNewPw ? "text" : "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "Min 6 characters", minLength: 6, required: true, className: "h-10 rounded-xl border-border/50 bg-background pr-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowNewPw(!showNewPw), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showNewPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "settings-confirm-pw", className: "text-xs font-bold", children: "Confirm New Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "settings-confirm-pw", type: showConfirmPw ? "text" : "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Re-enter your new password", minLength: 6, required: true, className: "h-10 rounded-xl border-border/50 bg-background pr-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowConfirmPw(!showConfirmPw), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showConfirmPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
            ] }),
            newPassword && confirmPassword && newPassword !== confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-destructive font-medium", children: "Passwords do not match" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", variant: "outline", disabled: !newPassword || !confirmPassword || changePasswordMutation.isPending, className: "rounded-xl font-bold h-9 px-5 text-xs gap-2 mt-2", children: [
            changePasswordMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-3.5 w-3.5" }),
            "Update Password"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/50 bg-muted/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-[18px] w-[18px]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: "Account Information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "A summary of your account status." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-background/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Account ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "text-[11px] font-mono text-foreground/70 break-all", children: [
              userData?.id?.slice(0, 12),
              "…"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-background/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Auth Provider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold capitalize", children: userData?.app_metadata?.provider || "email" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-background/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Last Sign In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: userData?.last_sign_in_at ? new Date(userData.last_sign_in_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }) : "—" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-destructive/30 bg-destructive/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-[18px] w-[18px]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-destructive", children: "Danger Zone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Irreversible actions. Proceed with caution." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-background/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: "Delete Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Permanently remove your account and all associated data. This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "border-destructive/40 text-destructive hover:bg-destructive hover:text-white rounded-xl font-bold text-xs h-9 px-5 shrink-0", onClick: () => toast.error("Please contact support at support@wefest.in to delete your account."), children: "Delete Account" })
        ] })
      ] })
    ] })
  ] });
}
export {
  OrganizerSettings as component
};
