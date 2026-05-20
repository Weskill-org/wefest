import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users2, Award, Zap, TrendingUp, CheckCircle2, ArrowRight, Loader2, Sparkles, Instagram, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/ambassadors")({
  head: () => ({
    meta: [
      { title: "Campus Ambassador Program | WeFest" },
      { name: "description", content: "Become the face of festivals on your campus. Join the WeFest Campus Ambassador Program, earn perks, exclusive rewards, cash incentives, and internships." },
      { name: "keywords", content: "campus ambassador, college representative, student intern, college festivals, WeFest, campus marketing, college rewards" },
      { property: "og:title", content: "Campus Ambassador Program | WeFest" },
      { property: "og:description", content: "Become the face of festivals on your campus. Join the WeFest Campus Ambassador Program, earn perks, exclusive rewards, cash incentives, and internships." },
      { property: "og:url", content: "https://wefest.weskill.org/ambassadors" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Campus Ambassador Program | WeFest" },
      { name: "twitter:description", content: "Become the face of festivals on your campus. Earn perks, rewards, and internships." },
    ],
    links: [
      { rel: "canonical", href: "https://wefest.weskill.org/ambassadors" },
    ],
  }),
  component: Ambassadors,
});

function Ambassadors() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [social, setSocial] = useState("");
  const [motivation, setMotivation] = useState("");

  const { data: programs, isLoading } = useQuery({
    queryKey: ["ambassador-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ambassador_programs")
        .select("*, event:event_id(title, cover)")
        .eq("status", "active");
      if (error) throw error;
      return data;
    }
  });

  const applyMutation = useMutation({
    mutationFn: async ({ programId, social, motivation }: { programId: string, social: string, motivation: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to apply");

      const { error } = await supabase.from("ambassador_applications").insert({
        program_id: programId,
        user_id: user.id,
        social_handle: social,
        motivation: motivation
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted!", { description: "The organizers will review your profile shortly." });
      setIsDialogOpen(false);
      setSocial("");
      setMotivation("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit application");
    }
  });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero */}
      <section className="relative mb-20 text-center py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-gradient opacity-10 blur-[120px] -z-10 rounded-full" />
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur">
          <Zap className="h-3.5 w-3.5 fill-current" /> WeFest Campus Influencer Program
        </span>
        <h1 className="mt-8 font-display text-5xl font-black leading-tight md:text-7xl">
          Become the <span className="text-gradient">Face</span> of Festivals.
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
          Represent the biggest brands and festivals on your campus. Gain experience, earn exclusive rewards, and build a network that lasts a lifetime.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" className="bg-brand-gradient hover:opacity-90 px-8 rounded-full shadow-glow">
            Explore Programs
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8">
            View FAQ
          </Button>
        </div>
      </section>

      {/* Perks */}
      <div className="grid gap-6 md:grid-cols-3 mb-24">
        <PerkCard 
          icon={Award} 
          title="Verified Certificates" 
          desc="Official recognition from top colleges and WeFest for your LinkedIn and Resume." 
        />
        <PerkCard 
          icon={TrendingUp} 
          title="Incentive Rewards" 
          desc="Earn commissions on ticket sales, free merchandise, and VIP festival passes." 
        />
        <PerkCard 
          icon={Users2} 
          title="Networking" 
          desc="Connect with national-level organizers, brands, and fellow influencers." 
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold">Active Programs</h2>
          <p className="text-sm text-muted-foreground mt-1">Join a program and start leading</p>
        </div>
        <div className="hidden sm:block">
          <Button variant="outline" size="sm" className="rounded-full">Filter by college</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-48 glass rounded-3xl animate-pulse" />)
        ) : programs && programs.length > 0 ? (
          programs.map(p => (
            <div key={p.id} className="glass group overflow-hidden rounded-[2rem] border border-border/60 transition-all hover:border-primary/40">
              <div className="flex flex-col sm:flex-row h-full">
                <div className={`w-full sm:w-48 bg-gradient-to-br ${(p.event as any)?.cover || 'from-slate-800 to-slate-900'} relative flex-shrink-0`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-white/20 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{(p.event as any)?.title}</div>
                    <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.perks?.slice(0, 3).map((perk: string) => (
                        <span key={perk} className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground border border-border/40">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold">
                          {i}
                        </div>
                      ))}
                      <div className="ml-4 text-[10px] text-muted-foreground">+12 applied</div>
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedProgram(p);
                        setIsDialogOpen(true);
                      }}
                      className="bg-brand-gradient text-white rounded-full px-6 shadow-glow"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <Users2 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-bold">No active programs</h3>
            <p className="text-muted-foreground">Check back soon for new ambassador opportunities.</p>
          </div>
        )}
      </div>

      {/* Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border/60">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Apply for {selectedProgram?.title}</DialogTitle>
            <DialogDescription>
              Tell us why you'd be a great ambassador for {(selectedProgram?.event as any)?.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label>Social Media Presence</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="gap-2 text-xs"><Instagram className="h-3 w-3" /> Insta</Button>
                <Button variant="outline" className="gap-2 text-xs"><Twitter className="h-3 w-3" /> Twitter</Button>
                <Button variant="outline" className="gap-2 text-xs"><Linkedin className="h-3 w-3" /> LinkedIn</Button>
              </div>
              <Input 
                placeholder="Profile link or @handle" 
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                className="mt-2 bg-background/50 border-border/60"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Why should we pick you?</Label>
              <Textarea 
                placeholder="Mention your reach, society positions, or past experience..." 
                rows={4}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="bg-background/50 border-border/60 resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              disabled={applyMutation.isPending}
              onClick={() => applyMutation.mutate({ programId: selectedProgram.id, social, motivation })}
              className="bg-brand-gradient text-white"
            >
              {applyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PerkCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass rounded-[2rem] p-8 border border-border/60 hover:border-primary/40 transition-all">
      <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-glow mb-6">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
