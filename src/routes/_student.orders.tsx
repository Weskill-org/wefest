import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Loader2, Package, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_student/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — WeFest" },
      { name: "description", content: "Track your merchandise orders." },
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
  component: Orders,
});

function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to view orders");

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:products (
            name,
            image_url,
            event:events (
              title
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="mt-3 text-xs text-muted-foreground">Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[900px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your merchandise orders.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <ShoppingBag className="h-3 w-3" />
          <span>{orders?.length || 0} orders</span>
        </div>
      </div>

      {/* ─── Orders List ─── */}
      <div className="grid gap-4 mt-6">
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <div key={order.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden p-5">
              <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                {/* Product Image */}
                <div className="h-20 w-20 shrink-0 rounded-xl bg-black/20 overflow-hidden border border-white/5 flex items-center justify-center">
                  {order.product?.image_url ? (
                    <img src={order.product.image_url} alt={order.product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-8 w-8 text-muted-foreground/30" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                      {order.status === "paid" ? "Confirmed" : order.status}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {order.product?.name || "Unknown Product"} <span className="text-muted-foreground text-sm font-normal">x{order.quantity}</span>
                  </h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {order.product?.event?.title || "WeFest Store"}
                  </div>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(new Date(order.created_at), "MMM dd, yyyy")}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {order.shipping_address || "Pickup at Campus"}</span>
                    <span className="flex items-center gap-1.5 ml-auto text-foreground font-bold text-sm">₹{order.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed border-white/10 py-16 px-6 text-center">
            <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-sm mb-1">No orders yet</h3>
            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto mb-5">Buy official merchandise and rep your college fest.</p>
          </div>
        )}
      </div>
    </div>
  );
}
