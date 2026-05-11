import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/product-card";
import { Search, ShoppingBag, Filter, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_student/shop")({
  head: () => ({
    meta: [
      { title: "Campus Store — WeFest Merch" },
      { name: "description", content: "Get official college festival hoodies, tees and gear." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }
    }
  },
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
    <div className="container mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <section className="relative mb-16 overflow-hidden rounded-[3rem] glass p-12 border border-white/5 group">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-gradient opacity-10 blur-3xl transition-opacity duration-1000 group-hover:opacity-20" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl transition-opacity duration-1000 group-hover:opacity-20" />
        
        <div className="relative z-10 grid gap-12 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur shadow-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Official Campus Gear
            </span>
            <h1 className="mt-8 font-display text-5xl font-black leading-tight md:text-7xl tracking-tight">
              Wear the <span className="text-gradient">vibe</span> of your fests.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Limited edition merchandise from India's top college festivals. Verified quality, zero fakes, fast delivery.
            </p>
            <div className="mt-10 flex gap-4">
              <Button size="lg" className="bg-brand-gradient hover:opacity-90 rounded-2xl shadow-glow text-white font-bold h-14 px-8 text-sm hover:scale-105 transition-transform">
                Explore drop <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative grid grid-cols-2 gap-6 rotate-3 scale-110 perspective-1000 group-hover:rotate-0 transition-transform duration-1000 ease-out">
              <div className="h-56 rounded-[2.5rem] glass border border-white/10 flex items-center justify-center backdrop-blur shadow-xl transform translate-y-8 group-hover:translate-y-0 transition-transform duration-1000 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <ShoppingBag className="h-20 w-20 text-muted-foreground/30 group-hover:text-primary transition-colors duration-500 relative z-10 group-hover:scale-110" />
              </div>
              <div className="h-56 mt-16 rounded-[2.5rem] bg-brand-gradient flex items-center justify-center shadow-glow transform -translate-y-8 group-hover:translate-y-0 transition-transform duration-1000 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <TrendingUp className="h-20 w-20 text-white/40 group-hover:text-white transition-colors duration-500 relative z-10 group-hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <h2 className="font-display text-4xl font-black">Featured Drop</h2>
          <p className="text-muted-foreground mt-2 font-medium">Trending gear from active festivals</p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search gear..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              className="pl-12 bg-background/50 backdrop-blur-md border-border/60 rounded-full h-14 text-base shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.slice(0, 4).map(c => (
              <Button 
                key={c} 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab(c)}
                className={`rounded-full h-14 px-6 font-bold transition-all whitespace-nowrap ${activeTab === c ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border/60 hover:border-primary/40 bg-background/50 backdrop-blur-md"}`}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-[420px] rounded-[2.5rem] glass animate-pulse border-border/40" />)
        ) : filtered.length > 0 ? (
          filtered.map(p => <ProductCard key={p.id} product={{ ...p, description: p.description ?? "", image_url: p.image_url ?? "" } as any} />)
        ) : (
          <div className="col-span-full py-24 text-center glass rounded-[3rem] border-dashed border-2 border-white/10">
            <div className="mx-auto h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">No gear found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any merch matching your filters. Try exploring other categories.</p>
          </div>
        )}
      </div>

      {/* Promotions */}
      <section className="mt-32 grid gap-8 md:grid-cols-2">
        <div className="glass rounded-[3rem] p-12 flex flex-col justify-between group overflow-hidden relative border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 text-foreground">
            <TrendingUp className="h-40 w-40" />
          </div>
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="font-display text-3xl font-black">Become an Ambassador</h3>
            <p className="mt-4 text-muted-foreground max-w-sm text-base leading-relaxed">Spread the word, earn free merch and get exclusive access to fest VIP passes.</p>
          </div>
          <Button variant="link" className="p-0 h-auto text-primary mt-10 w-fit font-bold text-base group/btn relative z-10">
            Apply now <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="glass rounded-[3rem] p-12 flex flex-col justify-between border border-primary/20 bg-primary/5 group overflow-hidden relative transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 text-primary">
            <Sparkles className="h-40 w-40" />
          </div>
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-brand-gradient flex items-center justify-center mb-8 text-white shadow-glow group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="font-display text-3xl font-black">Official University Bundles</h3>
            <p className="mt-4 text-muted-foreground max-w-sm text-base leading-relaxed">Bulk orders for college societies and sports teams with custom branding options.</p>
          </div>
          <Button variant="link" className="p-0 h-auto text-primary mt-10 w-fit font-bold text-base group/btn relative z-10">
            Contact sales <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
}
