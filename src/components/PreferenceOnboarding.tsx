import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PREFERENCE_CATEGORIES } from "@/lib/preferences";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Check,
  ArrowRight,
  Loader2,
  X,
  Code2,
  Palette,
  Trophy,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  technical: Code2,
  cultural: Palette,
  sports: Trophy,
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  technical: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  cultural: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
  sports: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
  },
};

interface PreferenceOnboardingProps {
  userId: string;
  onComplete: () => void;
}

export function PreferenceOnboarding({ userId, onComplete }: PreferenceOnboardingProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<string>(
    PREFERENCE_CATEGORIES[0].id,
  );
  const queryClient = useQueryClient();

  const toggle = useCallback((interest: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  }, []);

  const saveMutation = useMutation({
    mutationFn: async (interests: string[]) => {
      const { error } = await supabase
        .from("student_profiles")
        .update({ interests })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      queryClient.invalidateQueries({ queryKey: ["current-auth"] });
      toast.success("Preferences saved! Events will be personalized for you.");
      onComplete();
    },
    onError: (e: any) => toast.error(e.message || "Failed to save preferences"),
  });

  const handleSave = () => {
    saveMutation.mutate(Array.from(selected));
  };

  const handleSkip = () => {
    // Save empty array so it doesn't show again (null = not onboarded, [] = skipped)
    saveMutation.mutate([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-500">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] mx-4 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/95 backdrop-blur-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-6 duration-700">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          disabled={saveMutation.isPending}
          className="absolute top-5 right-5 z-20 h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          title="Skip for now"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-80 bg-brand-gradient opacity-10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Personalize Your Feed
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              What Excites You?
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-medium">
              Select your interests so we can recommend the best events for you. You can always change these later in Settings.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 flex gap-2 justify-center">
          {PREFERENCE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
            const colors = CATEGORY_COLORS[cat.id];
            const isExpanded = expandedCategory === cat.id;
            const selectedInCat = cat.interests.filter((i) => selected.has(i)).length;

            return (
              <button
                key={cat.id}
                onClick={() => setExpandedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border",
                  isExpanded
                    ? `${colors.bg} ${colors.border} ${colors.text} ${colors.glow}`
                    : "bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
                {selectedInCat > 0 && (
                  <span
                    className={cn(
                      "h-5 min-w-5 rounded-full text-[9px] font-black flex items-center justify-center px-1",
                      isExpanded
                        ? "bg-white/20 text-white"
                        : "bg-primary/20 text-primary",
                    )}
                  >
                    {selectedInCat}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interest Chips Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-6 hide-scrollbar">
          {PREFERENCE_CATEGORIES.filter(
            (cat) => cat.id === expandedCategory,
          ).map((cat) => {
            const colors = CATEGORY_COLORS[cat.id];
            return (
              <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {cat.interests.map((interest) => {
                    const isSelected = selected.has(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggle(interest)}
                        className={cn(
                          "relative flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 border group text-left",
                          isSelected
                            ? `${colors.bg} ${colors.border} ${colors.text} ${colors.glow}`
                            : "bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10 hover:text-foreground",
                        )}
                      >
                        <div
                          className={cn(
                            "h-5 w-5 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 border",
                            isSelected
                              ? `${colors.bg} ${colors.border}`
                              : "bg-white/5 border-white/10 group-hover:border-white/20",
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 animate-in zoom-in duration-200" />
                          )}
                        </div>
                        <span className="truncate">{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            {selected.size === 0 ? (
              <span className="text-muted-foreground/60">No interests selected yet</span>
            ) : (
              <span>
                <span className="text-primary font-bold">{selected.size}</span>{" "}
                {selected.size === 1 ? "interest" : "interests"} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              disabled={saveMutation.isPending}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Skip for now
            </button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending || selected.size === 0}
              className="bg-brand-gradient text-white rounded-xl font-bold px-6 shadow-glow hover:opacity-90 transition-all h-10"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
