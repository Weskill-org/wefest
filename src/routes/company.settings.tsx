import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Globe, Briefcase, Loader2, Check, Sparkles,
  Shield, ArrowRight, ImageIcon, Plus, Settings2
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/company/settings")({
  head: () => ({ meta: [{ title: "Settings — Company Portal — WeFest" }] }),
  component: CompanySettings,
});

function CompanySettings() {
  const qc = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["company-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    }
  });

  const { data: subscription } = useQuery({
    queryKey: ["my-subscription"],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    }
  });

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name || user?.user_metadata?.full_name || "");
      setIndustry(profile.industry || "");
      setWebsite(profile.website_url || "");
    }
  }, [profile, user]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!profile?.id) throw new Error("Profile not found");
      const { error } = await supabase
        .from("company_profiles")
        .update({
          company_name: companyName,
          industry,
          website_url: website,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      qc.invalidateQueries({ queryKey: ["company-profile"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleUpgrade = (plan: string) => {
    toast.success(`Redirecting to payment for ${plan} plan...`, {
      description: "Secure payment processing powered by WeFest Billing Engine.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1000px] mx-auto space-y-10">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-primary uppercase tracking-widest">Settings</div>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight">Company Profile & Plan</h1>
        <p className="mt-2 text-muted-foreground text-sm">Manage your company information, brand assets, and subscription plan.</p>
      </div>

      {/* Profile Section */}
      <section className="glass rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Company Information</h2>
            <p className="text-xs text-muted-foreground">Update your business details visible to organizers</p>
          </div>
          {profile?.status === "approved" && (
            <Badge variant="secondary" className="ml-auto bg-emerald-500/10 text-emerald-500 border-none text-[9px]">
              <Check className="h-2.5 w-2.5 mr-1" /> Verified
            </Badge>
          )}
          {profile?.status === "pending" && (
            <Badge variant="secondary" className="ml-auto bg-amber-500/10 text-amber-500 border-none text-[9px]">
              Pending Review
            </Badge>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="pl-9 glass border-white/10 h-10"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Industry</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Technology, FMCG, Education"
                className="pl-9 glass border-white/10 h-10"
              />
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://your-company.com"
                className="pl-9 glass border-white/10 h-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => updateProfile.mutate()}
            disabled={updateProfile.isPending}
            className="bg-brand-gradient text-white shadow-glow text-xs"
          >
            {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
            Save Changes
          </Button>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Brand Assets & Creatives</h2>
            <p className="text-xs text-muted-foreground">Manage your banners, logos, and guidelines from the dedicated assets page.</p>
          </div>
        </div>
        <Link to="/company/brand-assets">
          <Button size="sm" className="bg-brand-gradient text-white text-xs whitespace-nowrap">
            Manage Assets <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </Link>
      </section>

      {/* Subscription Plans */}
      <section className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">Subscription Plan</h2>
          <p className="text-xs text-muted-foreground mt-1">Choose a plan that fits your sponsorship goals.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <PricingCard
            name="Explorer"
            price="Free"
            desc="Perfect for local brands."
            active={!subscription}
            features={["3 fests per month", "Basic profile", "Standard dashboard"]}
            onUpgrade={() => handleUpgrade("Explorer")}
          />
          <PricingCard
            name="Growth"
            price="₹9,999"
            period="/yr"
            desc="Serious brand partners."
            featured
            active={subscription?.plan_type === "Growth"}
            features={["Unlimited fests", "Priority proposals", "Booth heatmap", "Lead export", "Direct chat"]}
            onUpgrade={() => handleUpgrade("Growth")}
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            desc="Multi-campus activation."
            active={subscription?.plan_type === "Enterprise"}
            features={["Dedicated manager", "Global access", "API & CRM sync", "24/7 support"]}
            onUpgrade={() => handleUpgrade("Enterprise")}
          />
        </div>

        {/* ROI Guarantee */}
        <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary shrink-0" />
            <div>
              <div className="font-bold text-sm">Verified ROI Guarantee</div>
              <p className="text-xs text-muted-foreground mt-0.5">Identity-verified student network. Every booth scan is a verified lead.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 text-xs">
            Schedule Demo <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function PricingCard({
  name, price, period, desc, features, featured, active, onUpgrade
}: {
  name: string; price: string; period?: string; desc: string;
  features: string[]; featured?: boolean; active?: boolean; onUpgrade: () => void;
}) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 ${
      featured
        ? "bg-brand-gradient text-primary-foreground shadow-glow border-none"
        : "glass border-white/5"
    }`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-foreground text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-primary" /> Popular
        </div>
      )}
      {active && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[9px]">
            <Check className="h-2.5 w-2.5 mr-0.5" /> Current
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-base font-bold">{name}</h3>
        <div className="mt-2 flex items-baseline gap-0.5">
          <span className="text-2xl font-black">{price}</span>
          {period && <span className="text-xs opacity-70">{period}</span>}
        </div>
        <p className={`mt-2 text-xs ${featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{desc}</p>
      </div>

      <div className="flex-1 space-y-2.5 mb-6">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className={`h-4 w-4 shrink-0 rounded-full flex items-center justify-center ${featured ? "bg-white/20" : "bg-primary/10"}`}>
              <Check className={`h-2.5 w-2.5 ${featured ? "text-white" : "text-primary"}`} />
            </div>
            <span className={featured ? "text-primary-foreground/90" : "text-foreground/80"}>{f}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={onUpgrade}
        size="sm"
        variant={featured ? "secondary" : "default"}
        className={`w-full text-xs font-bold ${featured ? "bg-white text-primary hover:bg-white/90" : ""}`}
        disabled={active}
      >
        {active ? "Current Plan" : price === "Custom" ? "Contact Sales" : "Get Started"}
      </Button>
    </div>
  );
}
