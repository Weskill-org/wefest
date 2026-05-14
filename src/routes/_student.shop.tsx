import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/product-card";
import { Search, ShoppingBag, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

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
  const { profile } = Route.useRouteContext() as any;
  const collegeId = profile?.college_id;

  const { data: products, isLoading } = useQuery({
    queryKey: ["shop-products", collegeId],
    queryFn: async () => {
      // If no college is selected, we might want to return nothing or all products
      // But the requirement says "another college student should not see another college product"
      if (!collegeId) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*, event:event_id!inner(title, college_id)")
        .eq("event.college_id", collegeId)
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
    <div className="px-6 sm:px-8 py-8 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">

      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campus Store</h1>
          <p className="text-sm text-muted-foreground mt-1">Official merchandise from India's top college festivals.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <ShoppingBag className="h-3 w-3" />
          <span>{filtered.length} items</span>
        </div>
      </div>

      {/* ─── Search + Category Filters ─── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search gear..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            className="h-10 pl-9 rounded-xl bg-white/[0.03] border-white/10 text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setActiveTab(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === c 
                  ? "bg-brand-gradient text-white shadow-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Products Grid ─── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-[380px] rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />)
        ) : filtered.length > 0 ? (
          filtered.map(p => <ProductCard key={p.id} product={{ ...p, description: p.description ?? "", image_url: p.image_url ?? "" } as any} />)
        ) : (
          <div className="col-span-full rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center">
            <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-sm mb-1">No gear found</h3>
            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">Try exploring other categories or check back later for new drops.</p>
          </div>
        )}
      </div>
    </div>
  );
}
