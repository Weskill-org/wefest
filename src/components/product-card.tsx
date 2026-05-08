import { Link } from "@tanstack/react-router";
import { ShoppingBag, Star, Loader2 } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  event_name: string;
  stock: number;
}

export function ProductCard({ product }: { product: Product }) {
  const { formatPrice } = useRegion();

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card-gradient transition-all hover:border-primary/50 hover:shadow-glow">
      <div className="relative h-64 overflow-hidden bg-muted">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient opacity-20">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur text-white">
          {product.event_name}
        </span>
        
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-black text-white uppercase animate-pulse">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 z-10 grid place-items-center bg-black/60 text-lg font-black text-white uppercase">
            Sold Out
          </span>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-bold leading-tight">{product.name}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-primary">{formatPrice(product.price)}</div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-amber-400">
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current opacity-50" />
            <span className="ml-1 text-muted-foreground">(12)</span>
          </div>
          <button 
            disabled={product.stock === 0}
            className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-primary/10 disabled:hover:text-primary"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
