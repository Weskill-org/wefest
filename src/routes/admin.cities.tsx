import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Plus, Loader2, Globe, Building2, TrendingUp, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/cities")({
  component: AdminCities,
});

function AdminCities() {
  const { data: cities, isLoading } = useQuery({
    queryKey: ["all-cities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display">Regional Clusters</h1>
          <p className="text-muted-foreground mt-1">Manage city-wise expansion and regional growth frameworks.</p>
        </div>
        <Button className="bg-brand-gradient text-white">
          <Plus className="mr-2 h-4 w-4" /> Add New City
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10 glass border-white/10" placeholder="Search cities, states or regions..." />
        </div>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> State</Button>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Cluster</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cities?.map((city: any) => (
          <div key={city.id} className="glass rounded-3xl p-6 hover:border-primary/40 transition-all group">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <MapPin className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Active</Badge>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold">{city.name}</h3>
              <p className="text-sm text-muted-foreground">{city.state}, {city.country}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{city.region_cluster || "General"}</span>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <TrendingUp className="h-3 w-3" /> Growth Mode
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="ghost" className="w-full text-[10px] uppercase font-black tracking-widest py-4">Manage Metrics</Button>
              <Button size="sm" variant="ghost" className="w-full text-[10px] uppercase font-black tracking-widest py-4">View Colleges</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[2.5rem] p-12 text-center border-dashed border-2 border-primary/20">
        <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
          <Building2 className="h-10 w-10 text-primary/40" />
        </div>
        <h2 className="text-2xl font-bold">Expansion Strategy 2026</h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
          We are currently targeting Tier-2 cities in the Western and Southern clusters. Our goal is to onboard 50+ new colleges by Q4.
        </p>
        <Button className="mt-8 bg-brand-gradient text-white px-10 py-6 rounded-2xl font-bold shadow-glow">
          Launch Regional Campaign
        </Button>
      </div>
    </div>
  );
}
