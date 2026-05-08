import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/product-card";
import { Search, ShoppingBag, Filter, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Campus Store — WeFest Merch" },
      { name: "description", content: "Get official college festival hoodies, tees and gear." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const { data: products, isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, event:event_id(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(p => ({
        ...p,
        event_name: (p.event as any)?.title || "Official WeFest"
      }));
    }
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      (activeTab === "All" || p.event_name.includes(activeTab)) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.event_name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [products, q, activeTab]);

  const categories = ["All", "Hoodies", "T-Shirts", "Accessories", "Tickets"];

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero */}
      <section className="relative mb-16 overflow-hidden rounded-[2rem] bg-slate-950 p-12 text-white border border-white/5">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary opacity-10 blur-3xl" />
        
        <div className="relative z-10 grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> Official Campus Gear
            </span>
            <h1 className="mt-6 font-display text-5xl font-black leading-tight md:text-6xl">
              Wear the <span className="text-gradient">vibe</span> of your favorite fests.
            </h1>
            <p className="mt-6 text-lg text-white/60">
              Limited edition merchandise from India's top college festivals. Verified quality, zero fakes, fast delivery.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" className="bg-brand-gradient hover:opacity-90">
                Explore drop <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative grid grid-cols-2 gap-4 rotate-3 scale-110">
              <div className="h-48 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur">
                <ShoppingBag className="h-16 w-16 text-white/20" />
              </div>
              <div className="h-48 mt-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow">
                <TrendingUp className="h-16 w-16 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">Featured Drop</h2>
          <p className="text-sm text-muted-foreground mt-1">Trending gear from active festivals</p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search gear..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              className="pl-9 bg-background/50 border-border/60"
            />
          </div>
          <div className="flex gap-2">
            {categories.slice(0, 3).map(c => (
              <Button 
                key={c} 
                variant="outline" 
                size="sm" 
                className={`rounded-full ${activeTab === c ? "border-primary bg-primary/5" : "border-border/60"}`}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-[380px] rounded-2xl bg-muted animate-pulse" />)
        ) : filtered.length > 0 ? (
          filtered.map(p => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-bold">No gear found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Promotions */}
      <section className="mt-24 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-[2rem] p-10 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <TrendingUp className="h-32 w-32" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">Become a Campus Ambassador</h3>
            <p className="mt-2 text-muted-foreground max-w-xs text-sm">Spread the word, earn free merch and get exclusive access to fest VIP passes.</p>
          </div>
          <Button variant="link" className="p-0 h-auto text-primary mt-6 w-fit font-bold">
            Apply now <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="glass rounded-[2rem] p-10 flex flex-col justify-between border-primary/20 bg-primary/5 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Sparkles className="h-32 w-32" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">Official University Bundles</h3>
            <p className="mt-2 text-muted-foreground max-w-xs text-sm">Bulk orders for college societies and sports teams with custom branding.</p>
          </div>
          <Button variant="link" className="p-0 h-auto text-primary mt-6 w-fit font-bold">
            Contact sales <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}
