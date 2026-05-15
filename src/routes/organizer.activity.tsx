import { createFileRoute } from "@tanstack/react-router";
import { RecentActivity } from "@/components/organizer/recent-activity";
import { Sparkles, Clock, Activity, Zap, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/activity")({
  component: OrganizerActivityPage,
});

function OrganizerActivityPage() {
  const ctx = Route.useRouteContext() as any;
  const membership = ctx?.membership;

  return (
    <div className="flex-1 min-h-screen bg-[#020617] overflow-y-auto">
      {/* Header Section */}
      <div className="relative border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-[400px] w-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
        
        <div className="relative max-w-[1000px] mx-auto p-8 pt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Feed Active</span>
              </div>
              <div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white mb-3">
                   Recent <span className="text-primary italic">Activity</span>
                </h1>
                <p className="text-muted-foreground/80 font-medium text-lg leading-relaxed max-w-xl">
                  Real-time monitoring for <span className="text-foreground font-bold">{membership?.colleges?.name || "your campus"}</span>. 
                  Every student interaction and operational event captured instantly.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-right">
              <div className="hidden md:block">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Synchronized</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1000px] mx-auto p-8 pb-20">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <h2 className="text-xl font-bold text-white tracking-tight">Timeline</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
               <Clock className="h-3 w-3" />
               Auto-updating
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl p-8 relative overflow-hidden group min-h-[600px]">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <RecentActivity collegeId={membership?.college_id} />
          </div>
          
          <div className="flex items-center justify-center gap-6 pt-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Institutional Grade Logging Engine v2.4</div>
          </div>
        </div>
      </div>
    </div>
  );
}


