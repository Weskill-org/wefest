import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { toast } from "sonner";
import { Loader2, Coins, Sparkles } from "lucide-react";
import { COINS_PER_INR } from "@/lib/wallet.functions";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultAmount?: number;
}

const QUICK = [100, 250, 500, 1000, 2500, 5000];

export function WalletTopupDialog({ open, onOpenChange, defaultAmount = 500 }: Props) {
  const [amount, setAmount] = useState(defaultAmount);
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: async (amountInr: number) => {
      if (amountInr < 10) throw new Error("Minimum top-up is ₹10");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in to top up");
      const user = session.user;

      const { data: order, error: orderErr } = await supabase.functions.invoke<{
        orderId: string; amount: number; currency: string; keyId: string;
      }>("razorpay-create-order", { body: { amountInr } });
      if (orderErr || !order) throw new Error(orderErr?.message || "Failed to create order");

      return new Promise<{ ok: boolean }>((resolve, reject) => {
        openRazorpayCheckout({
          keyId: order.keyId,
          orderId: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "WeFest Wallet",
          description: `Add ₹${amountInr} to WeCoin wallet`,
          prefill: {
            email: user?.email ?? undefined,
            name: (user?.user_metadata as any)?.full_name,
          },
          onSuccess: async (resp) => {
            const { error: vErr } = await supabase.functions.invoke("razorpay-verify", { body: resp });
            if (vErr) return reject(new Error(vErr.message || "Verification failed"));
            resolve({ ok: true });
          },
          onDismiss: () => reject(new Error("Payment cancelled")),
        }).catch(reject);
      });
    },
    onSuccess: () => {
      toast.success(`₹${amount} added to your WeCoin wallet`);
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet-transactions"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      if (err?.message !== "Payment cancelled") toast.error(err?.message || "Top-up failed");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" /> Top up WeCoin Wallet
          </DialogTitle>
          <DialogDescription>
            1 WeCoin = ₹0.10 · Powered by Razorpay (UPI, cards, netbanking)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-2">
            {QUICK.map(v => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${
                  amount === v ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-white/20"
                }`}
              >
                ₹{v}
              </button>
            ))}
          </div>

          <div>
            <Label htmlFor="amt">Custom amount (₹)</Label>
            <Input
              id="amt"
              type="number"
              min={10}
              max={500000}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              You'll receive <strong className="text-foreground">{(amount * COINS_PER_INR).toLocaleString()} WeCoins</strong>
            </p>
          </div>

          <Button
            disabled={m.isPending || amount < 10}
            onClick={() => m.mutate(amount)}
            className="w-full"
            size="lg"
          >
            {m.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay ₹${amount} with Razorpay`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
