import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserMinus, Star, MessageSquare, MapPin, GraduationCap, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/social")({
  head: () => ({
    meta: [
      { title: "Campus Network — WeFest" },
      { name: "description", content: "Connect with students from other colleges and follow your friends." },
    ],
  }),
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
    <div className="container mx-auto px-6 py-12">
      <div className="relative mb-16 rounded-[3rem] bg-slate-900/40 p-12 border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-brand-gradient opacity-10 blur-3xl -mr-32 -mt-32" />
        <div className="grid gap-12 md:grid-cols-[2fr_1fr] items-center relative z-10">
          <div>
            <h1 className="font-display text-5xl font-black md:text-7xl">
              Campus <span className="text-gradient">Network</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              The exclusive social layer for college fests. Follow friends, discover creators, and build your inter-college network.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              {stats.map(s => (
                <div key={s.label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <s.icon className={`h-3.5 w-3.5 ${s.color}`} /> {s.label}
                  </div>
                  <div className="text-2xl font-black">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative h-64 w-full">
              <div className="absolute inset-0 bg-brand-gradient opacity-20 blur-2xl rounded-full animate-pulse" />
              <div className="absolute inset-4 rounded-3xl border border-white/10 bg-slate-800/50 backdrop-blur-xl flex items-center justify-center">
                <Users className="h-20 w-20 text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search students, interests, or colleges..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            className="pl-9 bg-background/50 border-border/60 rounded-full h-12"
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          Sort by: <span className="text-foreground cursor-pointer underline underline-offset-4 decoration-primary">Recent</span>
          <span className="cursor-pointer hover:text-foreground">Trending</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loadingProfiles ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-72 glass rounded-[2.5rem] animate-pulse" />)
        ) : filtered.length > 0 ? (
          filtered.map(p => {
            const isFollowing = follows?.some(f => f.following_id === p.id);
            const isSelf = currentUser?.id === p.id;

            return (
              <div key={p.id} className="glass group overflow-hidden rounded-[2.5rem] border border-border/60 hover:border-primary/40 transition-all p-8 relative">
                <div className="flex items-start justify-between">
                  <div className="h-20 w-20 rounded-3xl bg-brand-gradient p-0.5 shadow-glow transition-transform group-hover:scale-105">
                    <div className="h-full w-full rounded-[22px] bg-background flex items-center justify-center font-display text-2xl font-black">
                      {p.full_name?.slice(0, 1) || "?"}
                    </div>
                  </div>
                  {!isSelf && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => followMutation.mutate(p.id)}
                      className={`h-12 w-12 rounded-2xl ${isFollowing ? 'text-red-400 hover:text-red-500 hover:bg-red-400/10' : 'text-primary hover:bg-primary/10'}`}
                    >
                      {isFollowing ? <UserMinus className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                    </Button>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="font-display text-2xl font-bold">{p.full_name || "Anonymous Student"}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {(p.colleges as any)?.name}, {(p.colleges as any)?.city}
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                  {p.bio || "No bio available yet."}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.interests?.slice(0, 3).map(interest => (
                    <span key={interest} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      {interest}
                    </span>
                  ))}
                  {(p.interests?.length || 0) > 3 && (
                    <span className="text-[10px] font-bold text-muted-foreground py-1">+{p.interests!.length - 3} more</span>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-border/40 flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted border border-border/40" />
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-bold ring-2 ring-background">
                      +12
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary font-bold group-hover:gap-3 transition-all">
                    View Profile <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-24 text-center glass rounded-[3rem]">
            <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground opacity-10" />
            <h3 className="mt-6 text-xl font-bold">No students found</h3>
            <p className="mt-2 text-muted-foreground">Try broadening your search or follow more friends.</p>
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
