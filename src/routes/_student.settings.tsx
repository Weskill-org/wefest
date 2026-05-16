import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  UserCircle,
  Building2,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  Save,
  AlertTriangle,
  Camera
} from "lucide-react";

export const Route = createFileRoute("/_student/settings")({
  head: () => ({
    meta: [
      { title: "Profile Settings — WeFest" },
      { name: "description", content: "Manage your student profile, college affiliation, and preferences." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname + location.search },

      });
    }
  },
  component: StudentSettings,
});

function StudentSettings() {
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch student profile
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["student-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("student_profiles")
        .select(`*, colleges (id, name, city)`)
        .eq("id", user!.id)
        .maybeSingle();

      if (!data) {
        // Auto-create profile if missing
        const { data: newProfile } = await supabase
          .from("student_profiles")
          .insert({
            id: user!.id,
            full_name: user!.user_metadata?.full_name || "",
            college_id: user!.user_metadata?.college_id || null,
          })
          .select()
          .single();
        return { ...newProfile, colleges: null };
      }
      return data;
    },
  });

  // Fetch all approved colleges for selection
  const { data: colleges, isLoading: loadingColleges } = useQuery({
    queryKey: ["all-colleges"],
    queryFn: async () => {
      const { data } = await supabase
        .from("colleges")
        .select("id, name, city")
        .eq("status", "approved")
        .order("name");
      return data || [];
    },
  });

  // Form State
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [collegeId, setCollegeId] = useState<string>("none");
  const [isPublic, setIsPublic] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.user_metadata?.full_name || "");
      setBio(profile.bio || "");
      setCollegeId(profile.college_id || user?.user_metadata?.college_id || "none");
      setIsPublic(profile.is_public ?? true);
    }
  }, [profile, user]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not logged in");
      
      const { error } = await supabase
        .from("student_profiles")
        .update({
          full_name: fullName,
          bio,
          college_id: collegeId === "none" ? null : collegeId,
          is_public: isPublic,
        })
        .eq("id", user.id);
        
      if (error) throw error;

      // Keep Auth metadata in sync
      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Profile updated successfully");
      setIsDirty(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (loadingUser || loadingProfile || loadingColleges) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = fullName.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "ST";

  return (
    <div className="container mx-auto max-w-4xl px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage your public presence and college affiliation.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        {/* Main Settings Form */}
        <div className="space-y-6">
          <section className="glass-panel rounded-3xl p-6 md:p-8 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-[50px]" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                <UserCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Personal Information</h2>
                <p className="text-xs text-muted-foreground">This info will be visible to other students.</p>
              </div>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                updateProfileMutation.mutate(); 
              }} 
              className="space-y-5 relative z-10"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative group shrink-0">
                  <div className="h-24 w-24 rounded-2xl bg-brand-gradient p-0.5 shadow-glow ring-4 ring-background">
                    <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center">
                      <span className="text-3xl font-black text-primary">{initials}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
                    <Input 
                      value={fullName} 
                      onChange={(e) => { setFullName(e.target.value); setIsDirty(true); }}
                      className="h-12 rounded-xl bg-background/50 border-border/50 text-base font-medium"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bio</Label>
                <Textarea 
                  value={bio}
                  onChange={(e) => { setBio(e.target.value); setIsDirty(true); }}
                  placeholder="Tell the community about yourself... (e.g., Computer Science sophomore, avid photographer)"
                  className="min-h-[100px] resize-none rounded-xl bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">College Affiliation</Label>
                <Select 
                  value={collegeId} 
                  onValueChange={(v) => { setCollegeId(v); setIsDirty(true); }}
                  disabled={collegeId !== "none" && collegeId !== null}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/50 font-medium">
                    <SelectValue placeholder="Select your college" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="none">Not affiliated / Other</SelectItem>
                    {colleges?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.city && <span className="text-muted-foreground ml-1">({c.city})</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {collegeId !== "none" 
                    ? "Your college affiliation is locked. Contact support to change it." 
                    : "Linking your college unlocks campus-specific events and leaderboards."}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/30 p-4 mt-6">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Public Profile</Label>
                  <p className="text-xs text-muted-foreground">Allow other users to see your profile and digital memories.</p>
                </div>
                <Switch 
                  checked={isPublic} 
                  onCheckedChange={(v) => { setIsPublic(v); setIsDirty(true); }} 
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/20">
                {isDirty ? (
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Unsaved changes
                  </span>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Up to date
                  </span>
                )}
                <Button 
                  type="submit" 
                  disabled={!isDirty || updateProfileMutation.isPending}
                  className="bg-brand-gradient text-white rounded-xl font-bold px-6 shadow-glow"
                >
                  {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border-white/5">
            <div className="flex items-center gap-2.5 mb-4">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-bold text-sm">Account Security</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</Label>
                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/40">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">{user?.email}</span>
                </div>
              </div>
              <div>
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
                <Button variant="outline" className="w-full mt-1 justify-start font-medium text-xs rounded-lg h-9">
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-white/5 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2.5 mb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-sm text-primary">College Status</h3>
            </div>
            {collegeId !== "none" ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are currently affiliated with a college. Your fest points contribute to your college's overall ranking in the National Leaderboard.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are not currently linked to any college. Select your institution to join the campus network and represent them!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
