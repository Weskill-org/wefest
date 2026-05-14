import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Ticket, Gift } from "lucide-react";
import { redeemGiftCard } from "@/lib/wallet.functions";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function RedeemGiftCardDialog({ open, onOpenChange }: Props) {
  const [code, setCode] = useState("");
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: async (giftCode: string) => {
      if (!giftCode.trim()) throw new Error("Please enter a code");
      const { data: { session } } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
      return redeemGiftCard({
        data: { code: giftCode.trim() },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    onSuccess: (res) => {
      const amount = res?.amount ?? 0;
      toast.success(`${amount.toLocaleString()} WeCoins added to your wallet!`);
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet-transactions"] });
      setCode("");
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to redeem code");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-rose-500" /> Redeem Gift Card
          </DialogTitle>
          <DialogDescription>
            Enter your 8-12 character alphanumeric code to add WeCoins instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="code">Gift Card Code</Label>
            <div className="relative">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="code"
                placeholder="WF-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="pl-10 font-mono tracking-widest uppercase"
                disabled={m.isPending}
              />
            </div>
          </div>

          <Button
            disabled={m.isPending || !code.trim()}
            onClick={() => m.mutate(code)}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            size="lg"
          >
            {m.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redeem Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
