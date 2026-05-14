import { ShoppingBag, Star } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { useState } from "react";
import { PaymentDialog } from "@/components/wallet/payment-dialog";

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
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="perspective-1000 group w-full h-full">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full">
        <div className="relative h-64 overflow-hidden bg-black/5 dark:bg-white/5 border-b border-white/5 shrink-0">
          <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0" />
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-gradient opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-30 relative z-10">
              <ShoppingBag className="h-16 w-16 text-white drop-shadow-xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 z-10" />

          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-background/50 backdrop-blur-md px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-foreground shadow-sm z-20">
            {product.event_name}
          </span>

          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute right-4 top-4 rounded-full bg-red-500/90 backdrop-blur px-3 py-1.5 text-[9px] font-black text-white uppercase tracking-widest animate-pulse shadow-sm z-20">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute inset-0 z-30 grid place-items-center bg-black/80 backdrop-blur-sm text-2xl font-black text-white uppercase tracking-widest">
              Sold Out
            </span>
          )}

          <div className="absolute bottom-4 right-4 z-20 bg-background/80 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="text-xl font-black text-foreground">{formatPrice(product.price)}</div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
          <div className="flex-1">
            <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-1 text-[10px] text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current opacity-30" />
              <span className="ml-1.5 text-muted-foreground font-bold text-xs">(12)</span>
            </div>
            <button
              onClick={() => setPaymentOpen(true)}
              disabled={product.stock === 0}
              className="flex items-center gap-2 rounded-xl bg-primary/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-brand-gradient hover:text-white disabled:opacity-50 disabled:hover:bg-primary/10 disabled:hover:text-primary shadow-sm hover:shadow-glow group-hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amountInr={product.price}
        itemTitle={product.name}
        itemDescription="Official Merchandise"
        purchase={{
          kind: "product",
          productId: product.id,
          quantity: 1,
          shippingAddress: "Pickup at Campus",
        }}
      />
    </div>
  );
}
