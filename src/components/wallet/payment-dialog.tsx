import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard, Loader2, LogIn, Wallet, Plus } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { COINS_PER_INR, coinsToInr } from "@/lib/wallet.functions";
import { WalletTopupDialog } from "./wallet-topup-dialog";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** Total in INR */
  amountInr: number;
  itemTitle: string;
  itemDescription?: string;
  /** Called when user picks WeCoin wallet. Implementer should call the relevant
   *  payForXWithWallet server function. */
  onPayWithWallet: () => Promise<void> | void;
  /** Called when user picks direct Razorpay. Implementer creates an order &
   *  opens Razorpay checkout (or null to hide that option). */
  onPayWithRazorpay?: () => Promise<void> | void;
  isProcessing?: boolean;
}

export function PaymentDialog({
  open, onOpenChange, amountInr, itemTitle, itemDescription,
  onPayWithWallet, onPayWithRazorpay, isProcessing,
}: PaymentDialogProps) {
  const [topupOpen, setTopupOpen] = useState(false);

  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => (await supabase.auth.getSession()).data.session,
  });
  const isLoggedIn = !!session;

  const wallet = useWallet();
  const requiredCoins = Math.round(amountInr * COINS_PER_INR);
  const hasEnough = (wallet.balanceCoins ?? 0) >= requiredCoins;

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
              or {requiredCoins.toLocaleString()} WeCoins
            </div>
          </div>

          <div className="space-y-2 mt-3">
            {/* WeCoin option */}
            {isLoggedIn ? (
              <button
                disabled={!hasEnough || isProcessing || wallet.isLoading}
                onClick={async () => { await onPayWithWallet(); }}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  hasEnough
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
                        {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Balance: {(wallet.balanceCoins ?? 0).toLocaleString()} coins (₹{coinsToInr(wallet.balanceCoins ?? 0).toFixed(2)})
                      </div>
                    </div>
                  </div>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
                {!hasEnough && !wallet.isLoading && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-background/60 border border-white/10 p-2.5">
                    <span className="text-xs text-muted-foreground">
                      Need {(requiredCoins - (wallet.balanceCoins ?? 0)).toLocaleString()} more coins
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
            ) : (
              <Link
                to="/login"
                className="block w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Login to use WeCoin Money</div>
                    <div className="text-xs text-muted-foreground">Pay instantly from your wallet</div>
                  </div>
                  <LogIn className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            )}

            {/* Direct Razorpay option */}
            {onPayWithRazorpay && (
              <button
                disabled={isProcessing}
                onClick={async () => { await onPayWithRazorpay(); }}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Pay directly with Razorpay</div>
                    <div className="text-xs text-muted-foreground">UPI · Cards · Netbanking · Wallets</div>
                  </div>
                </div>
              </button>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground text-center mt-3">
            Secured by Razorpay · WeCoins issued at 1 ₹ = 10 coins
          </p>
        </DialogContent>
      </Dialog>

      <WalletTopupDialog
        open={topupOpen}
        onOpenChange={setTopupOpen}
        defaultAmount={Math.max(100, Math.ceil((requiredCoins - (wallet.balanceCoins ?? 0)) / COINS_PER_INR))}
      />
    </>
  );
}
