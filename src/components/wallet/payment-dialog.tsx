import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Coins, Loader2, LogIn, Wallet, Plus, Sparkles, ArrowRight } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { COINS_PER_INR, coinsToInr, payForTicketWithWallet, payForProductWithWallet } from "@/lib/wallet.functions";
import { getSupabaseAuthHeaders } from "@/lib/auth";
import { WalletTopupDialog } from "./wallet-topup-dialog";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type PurchaseIntent =
  | { kind: "ticket"; eventId: string; tier: string }
  | { kind: "product"; productId: string; quantity: number; shippingAddress?: string };

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  amountInr: number;
  itemTitle: string;
  itemDescription?: string;
  /** What is being purchased — drives the wallet-only AND razorpay flows server-side. */
  purchase: PurchaseIntent;
  /** Called after a successful purchase (wallet-only or razorpay). */
  onSuccess?: () => void;
}

export function PaymentDialog({
  open, onOpenChange, amountInr, itemTitle, itemDescription, purchase, onSuccess,
}: PaymentDialogProps) {
  const [topupOpen, setTopupOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [useCoins, setUseCoins] = useState(true);
  const qc = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => (await supabase.auth.getSession()).data.session,
  });
  const isLoggedIn = !!session;

  const wallet = useWallet();
  const totalCoins = Math.round(amountInr * COINS_PER_INR);
  const balance = wallet.balanceCoins ?? 0;
  
  const walletApplyCoins = Math.min(balance, totalCoins);
  const walletApplyInr = walletApplyCoins / COINS_PER_INR;
  const remainderInr = Math.max(0, amountInr - walletApplyInr);
  
  // Logic for UI
  const effectiveUseCoins = useCoins && balance > 0;
  const discountInr = effectiveUseCoins ? walletApplyInr : 0;
  const finalAmountInr = amountInr - discountInr;
  
  // Can we pay fully with wallet?
  const isFullWalletPay = effectiveUseCoins && balance >= totalCoins;
  // Is split available? (Razorpay needs >= 1 INR)
  const isSplitPay = effectiveUseCoins && balance < totalCoins && remainderInr >= 1;
  // Is it just Razorpay?
  const isRazorpayOnly = !effectiveUseCoins || (!isFullWalletPay && !isSplitPay);

  useEffect(() => { 
    if (!open) {
      setProcessing(false);
      setUseCoins(true);
    }
  }, [open]);

  const syncWalletCache = (coinsDebited: number, balanceAfter?: number) => {
    if (balanceAfter != null && balanceAfter >= 0) {
      qc.setQueryData(["wallet"], (prev: { balance_coins?: number; lifetime_debited?: number } | undefined) =>
        prev
          ? {
              ...prev,
              balance_coins: balanceAfter,
              lifetime_debited: (prev.lifetime_debited ?? 0) + coinsDebited,
            }
          : prev,
      );
    }
  };

  const invalidateAfter = async () => {
    await Promise.all([
      qc.refetchQueries({ queryKey: ["wallet"] }),
      qc.refetchQueries({ queryKey: ["wallet-transactions"] }),
      purchase.kind === "ticket"
        ? Promise.all([
            qc.refetchQueries({ queryKey: ["my-tickets"] }),
            qc.refetchQueries({ queryKey: ["has-ticket", purchase.eventId] }),
          ])
        : Promise.all([
            qc.refetchQueries({ queryKey: ["shop-products"] }),
            qc.refetchQueries({ queryKey: ["my-orders"] }),
          ]),
    ]);
  };

  const handlePay = async () => {
    if (isFullWalletPay) {
      await payFullWallet();
    } else {
      await payRazorpay(effectiveUseCoins);
    }
  };

  // ---------- Wallet-only path ----------
  const payFullWallet = async () => {
    setProcessing(true);
    try {
      const headers = await getSupabaseAuthHeaders();
      if (!headers.Authorization) throw new Error("Please sign in to pay with WeCoins");

      if (purchase.kind === "ticket") {
        const res = await payForTicketWithWallet({
          data: { eventId: purchase.eventId, tier: purchase.tier },
          headers,
        });
        syncWalletCache(res.coinsDebited ?? totalCoins);
        toast.success(`Ticket booked! Code: ${res.ticketCode}`);
      } else {
        const res = await payForProductWithWallet({
          data: {
            productId: purchase.productId,
            quantity: purchase.quantity,
            shippingAddress: purchase.shippingAddress ?? "Pickup at Campus",
          },
          headers,
        });
        syncWalletCache(res.coinsDebited, res.balanceAfter);
        toast.success(
          `Order placed! ${res.coinsDebited.toLocaleString()} WeCoins debited · Balance ${res.balanceAfter.toLocaleString()}`,
        );
      }
      await invalidateAfter();
      onSuccess?.();
      onOpenChange(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Payment failed";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  // ---------- Razorpay (with optional wallet split) ----------
  const payRazorpay = async (useWalletPart: boolean) => {
    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in");

      const walletCoinsToUse = useWalletPart ? walletApplyCoins : 0;
      const body: Record<string, unknown> = {
        purpose: purchase.kind === "ticket" ? "ticket_purchase" : "product_purchase",
        walletCoinsToUse,
      };
      if (purchase.kind === "ticket") {
        body.eventId = purchase.eventId;
        body.tier = purchase.tier;
      } else {
        body.productId = purchase.productId;
        body.quantity = purchase.quantity;
        body.shippingAddress = purchase.shippingAddress ?? "Pickup at Campus";
      }

      const { data: order, error } = await supabase.functions.invoke<{
        orderId: string; amount: number; currency: string; keyId: string; remainderInr: number;
      }>("razorpay-create-order", { body });
      if (error || !order) throw new Error(error?.message || "Failed to create order");

      await new Promise<void>((resolve, reject) => {
        openRazorpayCheckout({
          keyId: order.keyId,
          orderId: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "WeFest",
          description: itemTitle,
          prefill: {
            email: session.user?.email ?? undefined,
            name: (session.user?.user_metadata as any)?.full_name,
          },
          onSuccess: async (resp) => {
            const { data: vData, error: vErr } = await supabase.functions.invoke<any>(
              "razorpay-verify", { body: resp },
            );
            if (vErr || vData?.error) {
              return reject(new Error(vErr?.message || vData?.error || "Verification failed"));
            }
            if (purchase.kind === "ticket" && vData?.ticketCode) {
              toast.success(`Ticket booked! Code: ${vData.ticketCode}`);
            } else {
              toast.success("Payment successful — order placed!");
            }
            resolve();
          },
          onDismiss: () => reject(new Error("Payment cancelled")),
        }).catch(reject);
      });

      await invalidateAfter();
      onSuccess?.();
      onOpenChange(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Payment failed";
      if (message !== "Payment cancelled") toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const payButtonLabel = processing
    ? null
    : isFullWalletPay
      ? `Pay ${totalCoins.toLocaleString()} WeCoins`
      : `Pay ₹${finalAmountInr.toLocaleString()}`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md border-white/5 bg-slate-950/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Complete Payment</DialogTitle>
            <DialogDescription className="text-slate-400">
              {itemTitle}{itemDescription ? ` · ${itemDescription}` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 mt-4">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet className="h-12 w-12" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Total Amount</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">₹{amountInr.toLocaleString()}</span>
                {effectiveUseCoins && discountInr > 0 && (
                  <span className="text-sm text-emerald-400 font-medium animate-in fade-in slide-in-from-left-2">
                    (-₹{discountInr.toFixed(2)})
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {totalCoins.toLocaleString()} WeCoins equivalent
              </div>
            </div>
          </div>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="group block w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition-all mt-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogIn className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-200">Login to continue</div>
                  <div className="text-xs text-slate-500">Sign in to pay & track your purchases</div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ) : (
            <div className="space-y-6 mt-6">
              {/* WeCoin Toggle Section */}
              <div className={cn(
                "rounded-2xl border p-4 transition-all duration-300",
                useCoins && balance > 0 
                  ? "border-amber-500/30 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.05)]" 
                  : "border-white/5 bg-white/[0.01]",
                balance === 0 && "opacity-40 scale-[0.96] pointer-events-none select-none"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                      useCoins && balance > 0 ? "bg-amber-500/20" : "bg-slate-800"
                    )}>
                      <Coins className={cn("h-5 w-5", useCoins && balance > 0 ? "text-amber-500" : "text-slate-500")} />
                    </div>
                    <div>
                      <Label htmlFor="use-coins" className="text-sm font-bold text-slate-200 cursor-pointer">
                        Apply WeCoins
                      </Label>
                      <div className="text-[10px] text-slate-500">
                        Balance: {balance.toLocaleString()} (₹{coinsToInr(balance).toFixed(2)})
                      </div>
                    </div>
                  </div>
                  <Switch 
                    id="use-coins" 
                    checked={useCoins && balance > 0} 
                    onCheckedChange={setUseCoins}
                    disabled={balance === 0 || processing}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>

                {balance > 0 && useCoins && balance < totalCoins && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      Top up to pay fully with coins
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setTopupOpen(true); }}
                      className="text-[10px] font-black text-amber-500 hover:text-amber-400 flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Plus className="h-3 w-3" /> Top up
                    </button>
                  </div>
                )}
              </div>

              {/* Glassy Animated Pay Button */}
              <div className="flex flex-col gap-4">
                <button
                  disabled={processing || wallet.isLoading}
                  onClick={handlePay}
                  className="group relative w-full h-16 overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Background Gradient & Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Glass Layer */}
                  <div className="absolute inset-[1px] rounded-[15px] bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/10" />
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                  {/* Button Content */}
                  <div className="relative h-full flex items-center justify-center gap-3">
                    {processing ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                        <span className="text-xl font-black text-white tracking-tight">
                          {payButtonLabel}
                        </span>
                      </>
                    )}
                  </div>
                </button>
                
                <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest font-bold">
                  {isFullWalletPay ? "Instant confirmation via WeCoin" : "Secure payment powered by Razorpay"}
                </p>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-700 text-center mt-2 border-t border-white/5 pt-4">
            WeCoins issued at 1 ₹ = {COINS_PER_INR} coins · Zero platform fees
          </p>
        </DialogContent>
      </Dialog>

      <WalletTopupDialog
        open={topupOpen}
        onOpenChange={setTopupOpen}
        defaultAmount={Math.max(100, Math.ceil((totalCoins - balance) / COINS_PER_INR))}
      />
    </>
  );
}
