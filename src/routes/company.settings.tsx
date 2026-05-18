import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2, Globe, Briefcase, Loader2, Check, Sparkles,
  Shield, ArrowRight, ImageIcon, Settings2, Tag, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { format } from "date-fns";

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

  const { data: transactions } = useQuery({
    queryKey: ["my-transactions"],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    }
  });

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [validatedCoupon, setValidatedCoupon] = useState<{code: string, discount: number, message: string} | null>(null);
  const [couponError, setCouponError] = useState("");

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

  const validateCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!code.trim()) throw new Error("Please enter a coupon code");
      const { data, error } = await supabase.rpc("validate_coupon", {
        _code: code.trim(),
        _user_id: user!.id,
        _plan_amount: 9999, // Hardcoded for Growth plan currently
      });
      if (error) throw error;
      return data as { valid: boolean; discount_amount: number; message: string };
    },
    onSuccess: (data, code) => {
      if (data.valid) {
        setValidatedCoupon({ code: code.trim().toUpperCase(), discount: data.discount_amount, message: data.message });
        setCouponError("");
        toast.success(data.message);
      } else {
        setValidatedCoupon(null);
        setCouponError(data.message);
      }
    },
    onError: (err: any) => {
      setValidatedCoupon(null);
      setCouponError(err.message || "Failed to validate coupon");
    }
  });

  const handleApplyCoupon = () => {
    if (couponCodeInput) validateCouponMutation.mutate(couponCodeInput);
  };

  const upgradePlan = useMutation({
    mutationFn: async (plan: string) => {
      if (plan !== "Growth") {
        throw new Error("Only the Growth plan is available for direct purchase.");
      }

      const { data: order, error: orderErr } = await supabase.functions.invoke<{
        orderId?: string; amount?: number; currency?: string; keyId?: string;
        freeSubscription?: boolean;
      }>("razorpay-create-order", { 
        body: { 
          purpose: "subscription_purchase", 
          planType: plan,
          couponCode: validatedCoupon?.code
        } 
      });
      
      if (orderErr) {
        throw new Error(orderErr.message || "Failed to create order");
      }
      if (order?.error) {
        throw new Error(order.error);
      }

      if (order?.freeSubscription) {
        return { ok: true, free: true };
      }

      if (!order?.orderId || !order?.keyId || !order?.amount) {
        throw new Error("Invalid order response");
      }

      return new Promise<{ ok: boolean, free?: boolean }>((resolve, reject) => {
        openRazorpayCheckout({
          keyId: order.keyId!,
          orderId: order.orderId!,
          amount: order.amount!,
          currency: order.currency || "INR",
          name: "WeFest",
          description: `${plan} Plan Subscription`,
          prefill: {
            email: user?.email ?? undefined,
            name: (user?.user_metadata as any)?.full_name,
          },
          onSuccess: async (resp) => {
            const { error: vErr } = await supabase.functions.invoke("razorpay-verify", { body: resp });
            if (vErr) return reject(new Error(vErr.message || "Verification failed"));
            resolve({ ok: true });
          },
          onDismiss: () => reject(new Error("Payment cancelled")),
        }).catch(reject);
      });
    },
    onSuccess: (res) => {
      if (res.free) {
        toast.success("Subscription upgraded successfully with 100% discount!");
      } else {
        toast.success("Subscription upgraded successfully!");
      }
      setCouponCodeInput("");
      setValidatedCoupon(null);
      setCouponError("");
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
      qc.invalidateQueries({ queryKey: ["my-transactions"] });
    },
    onError: (err: any) => {
      if (err?.message !== "Payment cancelled") toast.error(err?.message || "Upgrade failed");
    },
  });

  const handleUpgrade = (plan: string) => {
    if (plan === "Explorer") {
      toast.info("The Explorer plan is the default free tier.");
      return;
    }
    if (plan === "Enterprise") {
      toast.info("Please contact sales for Enterprise plan.");
      window.location.href = "mailto:sales@wefest.co.in";
      return;
    }
    upgradePlan.mutate(plan);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const growthPlanPrice = 9999;
  const finalPrice = Math.max(0, growthPlanPrice - (validatedCoupon?.discount || 0));

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
            loading={upgradePlan.isPending && upgradePlan.variables === "Growth"}
            onUpgrade={() => handleUpgrade("Growth")}
            extra={
              !subscription || subscription.plan_type !== "Growth" ? (
                <div className="mt-5 pt-4 border-t border-white/15">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 tracking-wide">
                      <Tag className="h-3.5 w-3.5 text-white/90" />
                      <span>Have a discount code?</span>
                    </div>
                    
                    {validatedCoupon ? (
                      <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3.5 text-white animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-md">
                        <div className="flex justify-between items-center font-bold text-xs mb-2.5">
                          <span className="flex items-center gap-1.5 text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                            Applied: {validatedCoupon.code}
                          </span>
                          <button 
                            onClick={() => setValidatedCoupon(null)} 
                            className="text-white hover:text-red-300 transition-colors uppercase text-[9px] font-black tracking-widest bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-1.5 text-xs border-t border-white/10 pt-2.5">
                          <div className="flex justify-between text-white/80 font-medium"><span>Subtotal</span> <span>₹9,999</span></div>
                          <div className="flex justify-between font-bold text-emerald-300"><span>Discount</span> <span>-₹{validatedCoupon.discount}</span></div>
                          <div className="flex justify-between font-extrabold pt-2 border-t border-white/10 text-white text-base mt-1.5 tracking-wide">
                            <span>Total Payable</span> <span>₹{finalPrice}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="ENTER CODE" 
                            className="h-10 text-sm bg-black/20 border-white/20 text-white font-bold placeholder:text-white/40 focus:bg-black/35 focus:border-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 uppercase rounded-xl tracking-wider shadow-inner" 
                            value={couponCodeInput}
                            onChange={(e) => {
                              setCouponCodeInput(e.target.value.toUpperCase());
                              setCouponError("");
                            }}
                          />
                          <Button 
                            size="sm" 
                            className="h-10 px-5 text-xs font-black shrink-0 bg-white text-purple-600 hover:bg-white/95 hover:scale-[1.02] active:scale-95 transition-all shadow-md rounded-xl"
                            onClick={handleApplyCoupon}
                            disabled={!couponCodeInput || validateCouponMutation.isPending}
                          >
                            {validateCouponMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin text-purple-600" /> : "Apply"}
                          </Button>
                        </div>
                        {couponError && (
                          <div className="text-xs font-semibold text-rose-100 flex items-start gap-2 bg-rose-500/25 p-2.5 rounded-xl border border-rose-500/30 animate-in fade-in slide-in-from-bottom-1 duration-200">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-300 mt-0.5" />
                            <span>{couponError}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : null
            }
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

      {/* Payment History */}
      <section className="glass rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold">Payment History</h2>
          <p className="text-xs text-muted-foreground">View your past transactions and subscription payments.</p>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx: any) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs">
                      {format(new Date(tx.created_at), "PPp")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {tx.description || "Subscription Payment"}
                      {tx.metadata?.couponCode && (
                        <Badge variant="outline" className="ml-2 text-[9px] bg-primary/10 text-primary border-primary/20">
                          <Tag className="h-2.5 w-2.5 mr-1" /> {tx.metadata.couponCode}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium">
                      {tx.amount === 0 ? "Free" : `₹${tx.amount.toLocaleString()}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border-none">
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            No payment history found.
          </div>
        )}
      </section>
    </div>
  );
}

function PricingCard({
  name, price, period, desc, features, featured, active, loading, onUpgrade, extra
}: {
  name: string; price: string; period?: string; desc: string;
  features: string[]; featured?: boolean; active?: boolean; loading?: boolean; onUpgrade: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 ${
      featured
        ? "bg-brand-gradient text-white shadow-glow border border-white/20"
        : "glass border-white/5"
    }`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-purple-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-md flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-purple-500 animate-pulse" /> Popular
        </div>
      )}
      {active && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 text-[9px] font-bold">
            <Check className="h-2.5 w-2.5 mr-0.5" /> Current
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-base font-extrabold tracking-wide">{name}</h3>
        <div className="mt-2 flex items-baseline gap-0.5">
          <span className="text-3xl font-black tracking-tight">{price}</span>
          {period && <span className="text-xs font-bold opacity-80">{period}</span>}
        </div>
        <p className={`mt-2 text-xs font-medium ${featured ? "text-slate-200/90" : "text-muted-foreground"}`}>{desc}</p>
      </div>

      <div className="flex-1 space-y-2.5 mb-6">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-medium">
            <div className={`h-4 w-4 shrink-0 rounded-full flex items-center justify-center ${featured ? "bg-white/25 border border-white/10" : "bg-primary/10"}`}>
              <Check className={`h-2.5 w-2.5 ${featured ? "text-white" : "text-primary"}`} />
            </div>
            <span className={featured ? "text-slate-100 font-semibold" : "text-foreground/80"}>{f}</span>
          </div>
        ))}
      </div>

      {extra}

      <Button
        onClick={onUpgrade}
        size="sm"
        variant={featured ? "secondary" : "default"}
        className={`w-full text-xs font-black mt-4 hover:scale-[1.01] transition-transform ${featured ? "bg-white text-purple-600 hover:bg-white/95" : ""}`}
        disabled={active || loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
        {active ? "Current Plan" : price === "Custom" ? "Contact Sales" : "Get Started"}
      </Button>
    </div>
  );
}
