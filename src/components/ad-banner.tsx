import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface AdBannerProps {
  title: string;
  description: string;
  ctaText: string;
  type?: "premium" | "standard";
}

export function AdBanner({ title, description, ctaText, type = "standard" }: AdBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 mb-12 ${
      type === "premium" 
        ? "bg-slate-950 text-white border border-white/10" 
        : "bg-brand-gradient text-primary-foreground"
    }`}>
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
          </div>
          <h2 className="text-3xl font-black mb-2 font-display tracking-tight">{title}</h2>
          <p className="text-white/80 max-w-xl">{description}</p>
        </div>
        
        <Button size="lg" className={`${
          type === "premium" 
            ? "bg-white text-slate-900 hover:bg-white/90" 
            : "bg-white text-primary hover:bg-white/90"
        } font-bold rounded-full px-8`}>
          {ctaText} <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
