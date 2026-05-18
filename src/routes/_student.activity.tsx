import { createFileRoute, Link } from "@tanstack/react-router";
import { RecentActivity } from "@/components/organizer/recent-activity";
import { Sparkles, Clock, Zap, Target, Flame, ArrowUpRight, Trophy, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/activity")({
  component: StudentActivityPage,
});

function StudentActivityPage() {
  const ctx = Route.useRouteContext() as any;
  const profile = ctx?.profile;

  const { data: sponsors } = useQuery({
    queryKey: ["active-sponsors-pulse", profile?.college_id],
    queryFn: async () => {
      // 1. Fetch accepted proposals (optionally filtered by college if we join events)
      const query = supabase
        .from("sponsorship_proposals")
        .select(`
          *,
          events!inner (
            college_id
          )
        `)
        .eq("status", "accepted");

      if (profile?.college_id) {
        query.eq("events.college_id", profile.college_id);
      }

      const { data: proposals, error } = await query.limit(6);
        
      if (error) {
        console.error("Error fetching sponsorships:", error);
        throw error;
      }
      
      if (!proposals || proposals.length === 0) return [];

      // 2. Extract unique company user IDs
      const companyIds = [...new Set(proposals.map(p => p.company_user_id).filter(Boolean))];
      
      if (companyIds.length === 0) {
        return proposals.map(p => ({ ...p, company_users: null }));
      }

      // 3. Fetch company names from company_profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("company_profiles")
        .select("user_id, company_name")
        .in("user_id", companyIds);

      if (profilesError) {
        console.error("Error fetching company profiles:", profilesError);
        return proposals.map(p => ({ ...p, company_users: null }));
      }

      // 4. Map them back to the proposals so the UI can render `company_users.full_name`
      return proposals.map(proposal => {
        const profile = profilesData?.find(p => p.user_id === proposal.company_user_id);
        return {
          ...proposal,
          company_users: {
            full_name: profile?.company_name || "Official Sponsor"
          }
        };
      });
    }
  });

  return (
    <div className="flex-1 min-h-screen bg-[#020617] overflow-y-auto">
      {/* Premium Header */}
      <div className="relative border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-[400px] w-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
        
        <div className="relative max-w-[1000px] mx-auto p-8 pt-20">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Institutional Stream</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-[0.9]">
                Campus <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic">Pulse</span>
              </h1>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
                The definitive feed for <span className="text-foreground font-bold">{profile?.colleges?.name || "your institution"}</span>. 
                Real-time intelligence on festival drops, team hires, and student activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-8 pb-24 space-y-16">
        
        {/* Sponsor Spotlight - Show before activity as requested */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <h2 className="text-xl font-bold text-white tracking-tight">Institutional Partners</h2>
            </div>
            <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                <Trophy className="h-3 w-3" /> Featured
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sponsors && sponsors.length > 0 ? (
              sponsors.map((s: any) => (
                <div key={s.id} className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-primary transition-colors">{s.company_users?.full_name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Official Sponsor</p>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-center opacity-40">
                  <Sparkles className="h-5 w-5 mb-2 text-muted-foreground/20" />
                  <div className="h-2 w-16 bg-white/5 rounded-full" />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Timeline Feed */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <h2 className="text-xl font-bold text-white tracking-tight">Timeline Feed</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
               <Clock className="h-3 w-3" />
               Live Sync Active
            </div>
          </div>
          
          <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden group min-h-[600px]">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <RecentActivity collegeId={profile?.college_id} />
          </div>

          <div className="flex items-center justify-center gap-6 pt-12">
             <div className="h-[1px] flex-1 bg-white/5" />
             <div className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] whitespace-nowrap">End of Transmission</div>
             <div className="h-[1px] flex-1 bg-white/5" />
          </div>
        </section>
      </div>
    </div>
  );
}

