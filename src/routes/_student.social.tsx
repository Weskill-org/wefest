import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserMinus, Star, MessageSquare, MapPin, GraduationCap, Users } from "lucide-react";
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
    { label: "Active Students", value: profiles?.length || 0, icon: Users, color: "text-blue-400" },
    { label: "Connections", value: follows?.length || 0, icon: Star, color: "text-amber-400" },
    { label: "Colleges", value: new Set(profiles?.map(p => p.college_id)).size, icon: GraduationCap, color: "text-emerald-400" },
  ];

  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative mb-16 rounded-[3rem] glass p-12 border border-white/5 overflow-hidden group">
        <div className="absolute top-0 right-0 h-[30rem] w-[30rem] bg-brand-gradient opacity-10 blur-3xl -mr-32 -mt-32 transition-opacity duration-1000 group-hover:opacity-20" />
        <div className="absolute bottom-0 left-0 h-[20rem] w-[20rem] bg-primary opacity-10 blur-3xl -ml-20 -mb-20 transition-opacity duration-1000 group-hover:opacity-20" />
        <div className="grid gap-12 md:grid-cols-[2fr_1fr] items-center relative z-10">
          <div>
            <h1 className="font-display text-5xl font-black md:text-7xl tracking-tight">
              Campus <span className="text-gradient">Network</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              The exclusive social layer for college fests. Follow friends, discover creators, and build your inter-college network.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              {stats.map(s => (
                <div key={s.label} className="glass-panel px-6 py-4 rounded-2xl flex flex-col gap-1 border border-white/5 shadow-sm hover:shadow-primary/5 transition-shadow">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <s.icon className={`h-4 w-4 ${s.color}`} /> {s.label}
                  </div>
                  <div className="text-3xl font-black">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative h-64 w-full perspective-1000">
              <div className="absolute inset-0 bg-brand-gradient opacity-20 blur-2xl rounded-full animate-pulse" />
              <div className="absolute inset-4 rounded-[2.5rem] border border-white/10 bg-slate-800/50 backdrop-blur-xl flex items-center justify-center transform group-hover:rotate-y-12 group-hover:-rotate-x-12 transition-transform duration-700 shadow-2xl">
                <Users className="h-24 w-24 text-white/30 group-hover:text-primary transition-colors duration-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-12">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search students, interests, or colleges..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            className="pl-12 bg-background/50 backdrop-blur-md border-border/60 rounded-full h-14 text-base shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground bg-muted/30 px-6 py-3 rounded-full border border-border/40">
          <span className="uppercase tracking-widest text-xs">Sort by:</span>
          <span className="text-foreground cursor-pointer underline underline-offset-4 decoration-primary decoration-2">Recent</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">Trending</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loadingProfiles ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 glass rounded-[2.5rem] animate-pulse border-border/40" />)
        ) : filtered.length > 0 ? (
          filtered.map(p => {
            const isFollowing = follows?.some(f => f.following_id === p.id);
            const isSelf = currentUser?.id === p.id;

            return (
              <div key={p.id} className="glass group overflow-hidden rounded-[2.5rem] border border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 p-8 relative flex flex-col h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="h-20 w-20 relative">
                    <div className="absolute inset-0 bg-brand-gradient rounded-3xl blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="relative h-20 w-20 rounded-3xl bg-brand-gradient p-0.5 shadow-glow transition-transform duration-500 group-hover:scale-110">
                      <div className="h-full w-full rounded-[22px] bg-background flex items-center justify-center font-display text-3xl font-black text-foreground">
                        {p.full_name?.slice(0, 1) || "?"}
                      </div>
                    </div>
                  </div>
                  {!isSelf && (
                    <Button 
                      size="icon" 
                      variant={isFollowing ? "secondary" : "default"}
                      onClick={() => followMutation.mutate(p.id)}
                      className={`h-12 w-12 rounded-2xl transition-all duration-300 ${
                        isFollowing 
                          ? 'bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' 
                          : 'bg-primary/10 text-primary hover:bg-brand-gradient hover:text-white shadow-sm border border-primary/20'
                      }`}
                    >
                      {isFollowing ? <UserMinus className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                    </Button>
                  )}
                </div>

                <div className="mt-6 relative z-10">
                  <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-1">{p.full_name || "Anonymous Student"}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> <span className="truncate">{(p.colleges as any)?.name || "Unknown College"}</span>
                  </div>
                </div>

                <p className="mt-5 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1 relative z-10">
                  {p.bio || "This student hasn't added a bio yet. They're letting their festival attendance speak for itself."}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                  {p.interests?.slice(0, 3).map(interest => (
                    <span key={interest} className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-background/50 border border-white/10 text-foreground shadow-sm">
                      {interest}
                    </span>
                  ))}
                  {(p.interests?.length || 0) > 3 && (
                    <span className="text-[10px] font-bold text-muted-foreground py-1.5 px-2">+{p.interests!.length - 3} more</span>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted border border-white/10 shadow-sm" />
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black ring-2 ring-background">
                      +12
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary font-bold group-hover:gap-3 transition-all rounded-xl hover:bg-primary/10">
                    View Profile <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-24 text-center glass rounded-[3rem] border-dashed border-2 border-white/10">
            <div className="mx-auto h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-display font-bold">No students found</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">We couldn't find anyone matching your search. Try broadening your criteria or follow more friends to expand your network.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
