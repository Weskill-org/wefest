import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Coins, CreditCard, Loader2, LogIn, Wallet, Plus, Sparkles } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { COINS_PER_INR, coinsToInr } from "@/lib/wallet.functions";
import { WalletTopupDialog } from "./wallet-topup-dialog";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const qc = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => (await supabase.auth.getSession()).data.session,
  });
  const isLoggedIn = !!session;

  const wallet = useWallet();
  const totalCoins = Math.round(amountInr * COINS_PER_INR);
  const balance = wallet.balanceCoins ?? 0;
  const hasFullWallet = balance >= totalCoins;
  const walletApplyCoins = Math.min(balance, totalCoins); // coins we'd use in split mode
  const walletApplyInr = walletApplyCoins / COINS_PER_INR;
  const remainderInr = Math.max(0, amountInr - walletApplyInr);
  // Razorpay requires >= ₹1 remainder
  const splitAvailable = walletApplyCoins > 0 && remainderInr >= 1;

  useEffect(() => { if (!open) setProcessing(false); }, [open]);

  const invalidateAfter = () => {
    qc.invalidateQueries({ queryKey: ["wallet"] });
    qc.invalidateQueries({ queryKey: ["wallet-transactions"] });
    if (purchase.kind === "ticket") {
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
      qc.invalidateQueries({ queryKey: ["has-ticket", purchase.eventId] });
    } else {
      qc.invalidateQueries({ queryKey: ["shop-products"] });
    }
  };

  // ---------- Wallet-only path ----------
  const payFullWallet = async () => {
    setProcessing(true);
    try {
      const { payForTicketWithWallet, payForProductWithWallet } = await import("@/lib/wallet.functions");
      if (purchase.kind === "ticket") {
        const res = await payForTicketWithWallet({ data: { eventId: purchase.eventId, tier: purchase.tier } });
        if (!res.ok) throw new Error("Wallet payment failed");
        toast.success(`Ticket booked! Code: ${res.ticketCode}`);
      } else {
        const res = await payForProductWithWallet({
          data: {
            productId: purchase.productId,
            quantity: purchase.quantity,
            shippingAddress: purchase.shippingAddress ?? "Pickup at Campus",
          },
        });
        if (!res.ok) throw new Error("Wallet payment failed");
        toast.success(`Order placed!`);
      }
      invalidateAfter();
      onSuccess?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || "Payment failed");
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

      invalidateAfter();
      onSuccess?.();
      onOpenChange(false);
    } catch (e: any) {
      if (e?.message !== "Payment cancelled") toast.error(e?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>{itemTitle}{itemDescription ? ` · ${itemDescription}` : ""}</DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mt-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Amount</div>
            <div className="text-3xl font-black mt-1">₹{amountInr.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalCoins.toLocaleString()} WeCoins equivalent
            </div>
          </div>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="block w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 mt-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Login to continue</div>
                  <div className="text-xs text-muted-foreground">Sign in to pay & track your purchases</div>
                </div>
              </div>
            </Link>
          ) : (
          <div className="space-y-2 mt-3">
            {/* WeCoin full payment */}
            <button
              disabled={!hasFullWallet || processing || wallet.isLoading}
              onClick={payFullWallet}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-all",
                hasFullWallet
                  ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 hover:bg-amber-500/10"
                  : "border-white/10 bg-white/[0.02] opacity-60 cursor-not-allowed",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      Pay with WeCoin Wallet
                      {processing && <Loader2 className="h-3 w-3 animate-spin" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Balance: {balance.toLocaleString()} coins (₹{coinsToInr(balance).toFixed(2)})
                    </div>
                  </div>
                </div>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              {!hasFullWallet && !wallet.isLoading && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-background/60 border border-white/10 p-2.5">
                  <span className="text-xs text-muted-foreground">
                    Need {(totalCoins - balance).toLocaleString()} more coins for full wallet pay
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setTopupOpen(true); }}
                    className="text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Top up
                  </button>
                </div>
              )}
            </button>

            {/* Split: wallet + Razorpay */}
            {splitAvailable && !hasFullWallet && (
              <button
                disabled={processing}
                onClick={() => payRazorpay(true)}
                className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 hover:bg-emerald-500/10 p-4 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      Use ₹{walletApplyInr.toFixed(2)} wallet + ₹{remainderInr.toFixed(2)} via Razorpay
                      {processing && <Loader2 className="h-3 w-3 animate-spin" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Apply your wallet balance and pay the rest with UPI / Cards
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Direct Razorpay */}
            <button
              disabled={processing}
              onClick={() => payRazorpay(false)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    Pay ₹{amountInr.toLocaleString()} with Razorpay
                    {processing && <Loader2 className="h-3 w-3 animate-spin" />}
                  </div>
                  <div className="text-xs text-muted-foreground">UPI · Cards · Netbanking · Wallets</div>
                </div>
              </div>
            </button>
          </div>
          )}

          <p className="text-[10px] text-muted-foreground text-center mt-3">
            Secured by Razorpay · WeCoins issued at 1 ₹ = 10 coins
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
