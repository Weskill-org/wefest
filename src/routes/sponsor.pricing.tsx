import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sponsor/pricing")({
  head: () => ({ 
    meta: [
      { title: "Sponsorship Plans — WeFest" },
      { name: "description", content: "Upgrade your brand presence and ROI tracking." }
    ] 
  }),
  component: SponsorPricing,
});

function SponsorPricing() {
  const handleUpgrade = (plan: string) => {
    toast.success(`Redirecting to payment for ${plan} plan...`, {
      description: "Secure payment processing powered by WeFest Billing Engine.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl">
          Scale your <span className="text-gradient">Brand Impact</span>.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that fits your sponsorship goals. From basic visibility to deep analytics and lead generation.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <PricingCard
          name="Explorer"
          price="Free"
          desc="Perfect for local brands testing the waters."
          features={[
            "Apply to 3 fests per month",
            "Basic profile listing",
            "Standard ROI dashboard",
            "Public proposals only"
          ]}
          onUpgrade={() => handleUpgrade("Explorer")}
        />
        <PricingCard
          name="Growth"
          price="₹9,999"
          period="/year"
          desc="The standard for serious brand partners."
          featured
          features={[
            "Unlimited fest applications",
            "Priority proposal review",
            "Real-time booth heatmap",
            "Lead export (CSV/Excel)",
            "Direct organizer chat",
            "Promoted brand status"
          ]}
          onUpgrade={() => handleUpgrade("Growth")}
        />
        <PricingCard
          name="Enterprise"
          price="Custom"
          desc="Full-scale multi-campus activation."
          features={[
            "Dedicated account manager",
            "Global campus network access",
            "White-labeled event microsites",
            "API access for CRM sync",
            "Custom footprint analytics",
            "24/7 priority support"
          ]}
          onUpgrade={() => handleUpgrade("Enterprise")}
        />
      </div>

      <div className="mt-20 glass rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> Verified ROI Guarantee
          </h3>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Our identity-verified student network ensures you are reaching real, target-demographic users. Every booth scan is a verified student lead.
          </p>
        </div>
        <Button size="lg" variant="outline" className="shrink-0">
          Schedule Demo <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PricingCard({ 
  name, price, period, desc, features, featured, onUpgrade 
}: { 
  name: string; price: string; period?: string; desc: string; features: string[]; featured?: boolean; onUpgrade: () => void;
}) {
  return (
    <div className={`relative flex flex-col rounded-3xl p-8 transition-all hover:-translate-y-1 ${
      featured 
        ? "bg-brand-gradient text-primary-foreground shadow-glow border-none" 
        : "glass border-border/60"
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> Most Popular
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-black">{price}</span>
          {period && <span className="text-sm opacity-80">{period}</span>}
        </div>
        <p className={`mt-4 text-sm ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{desc}</p>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center ${featured ? "bg-white/20" : "bg-primary/10"}`}>
              <Check className={`h-3 w-3 ${featured ? "text-white" : "text-primary"}`} />
            </div>
            <span className={featured ? "text-primary-foreground/90" : "text-foreground/90"}>{f}</span>
          </div>
        ))}
      </div>

      <Button 
        onClick={onUpgrade}
        size="lg" 
        variant={featured ? "secondary" : "default"} 
        className={`w-full font-bold ${featured ? "bg-white text-primary hover:bg-white/90" : ""}`}
      >
        {price === "Custom" ? "Contact Sales" : "Get Started"}
      </Button>
    </div>
  );
}
