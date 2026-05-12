import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserMinus, Star, MapPin, GraduationCap, Users, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_student/social")({
  head: () => ({
    meta: [
      { title: "Campus Network — WeFest" },
      { name: "description", content: "Connect with students from other colleges and follow your friends." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }
    }
  },
  component: CampusNetwork,
});

function CampusNetwork() {
  const [q, setQ] = useState("");
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ["student-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*, colleges(name, city)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: follows } = useQuery({
    queryKey: ["my-follows"],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUser!.id);
      if (error) throw error;
      return data;
    }
  });

  const followMutation = useMutation({
    mutationFn: async (targetId: string) => {
      const isFollowing = follows?.some(f => f.following_id === targetId);
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUser!.id)
          .eq("following_id", targetId);
        if (error) throw error;
        return { type: 'unfollow' };
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: currentUser!.id, following_id: targetId });
        if (error) throw error;
        return { type: 'follow' };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-follows"] });
      toast.success(data.type === 'follow' ? "Following student" : "Unfollowed student");
    }
  });

  const filtered = useMemo(() => {
    if (!profiles) return [];
    return profiles.filter(p => 
      p.full_name?.toLowerCase().includes(q.toLowerCase()) || 
      (p.colleges as any)?.name?.toLowerCase().includes(q.toLowerCase()) ||
      p.interests?.some(i => i.toLowerCase().includes(q.toLowerCase()))
    );
  }, [profiles, q]);

  const stats = [
    { label: "Students", value: profiles?.length || 0, icon: Users, color: "text-blue-400 bg-blue-500/10" },
    { label: "Following", value: follows?.length || 0, icon: Star, color: "text-amber-400 bg-amber-500/10" },
    { label: "Colleges", value: new Set(profiles?.map(p => p.college_id)).size, icon: GraduationCap, color: "text-emerald-400 bg-emerald-500/10" },
  ];

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">

      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campus Network</h1>
          <p className="text-sm text-muted-foreground mt-1">Follow friends, discover creators, and build your inter-college network.</p>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => {
          const [textColor, bgColor] = s.color.split(" ");
          return (
            <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${bgColor} ${textColor}`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold tracking-tight leading-none mb-0.5">{s.value}</div>
              <div className="text-[10px] text-muted-foreground font-medium">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* ─── Search ─── */}
      <div className="relative max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search students, interests, or colleges..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          className="h-10 pl-9 rounded-xl bg-white/[0.03] border-white/10 text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* ─── Student Grid ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loadingProfiles ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />)
        ) : filtered.length > 0 ? (
          filtered.map(p => {
            const isFollowing = follows?.some(f => f.following_id === p.id);
            const isSelf = currentUser?.id === p.id;

            return (
              <div key={p.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10 p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg">
                      {p.full_name?.slice(0, 1) || "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{p.full_name || "Anonymous"}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate">{(p.colleges as any)?.name || "Unknown College"}</span>
                      </div>
                    </div>
                  </div>
                  {!isSelf && (
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => followMutation.mutate(p.id)}
                      className={`h-8 w-8 rounded-lg shrink-0 ${
                        isFollowing 
                          ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/10' 
                          : 'text-primary hover:bg-primary/10'
                      }`}
                    >
                      {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                  {p.bio || "This student hasn't added a bio yet."}
                </p>

                {p.interests && p.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.interests.slice(0, 3).map(interest => (
                      <span key={interest} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/5 text-muted-foreground">
                        {interest}
                      </span>
                    ))}
                    {p.interests.length > 3 && (
                      <span className="text-[9px] font-medium text-muted-foreground/50 py-1 px-1">+{p.interests.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center">
            <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-sm mb-1">No students found</h3>
            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">Try broadening your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
