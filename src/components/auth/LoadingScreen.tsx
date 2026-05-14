import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 h-24 w-24 rounded-full bg-primary/20 blur-2xl animate-pulse" />
        
        {/* Animated logo / icon */}
        <div className="relative h-20 w-20 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow animate-in zoom-in duration-500">
          <span className="text-3xl font-black text-white tracking-tighter">WF</span>
        </div>
        
        {/* Rotating loader border */}
        <div className="absolute -inset-2 rounded-[22px] border-2 border-primary/10 border-t-primary animate-spin" />
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-700">
          WeFest
        </h2>
        <p className="text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
          Preparing your festival experience...
        </p>
      </div>
      
      {/* Subtle bottom text */}
      <div className="absolute bottom-10 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-30">
        Securely Authenticating
      </div>
    </div>
  );
}
