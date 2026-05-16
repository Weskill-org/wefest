import { useState } from "react";
import { useWallet, useWalletTransactions } from "@/hooks/use-wallet";
import { WalletTopupDialog } from "./wallet-topup-dialog";
import { RedeemGiftCardDialog } from "./redeem-gift-card-dialog";
import { Button } from "@/components/ui/button";
import { Coins, Plus, ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { coinsToInr } from "@/lib/wallet.functions";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  topup: "Top-up",
  purchase: "Purchase",
  sale: "Sale",
  refund: "Refund",
  sponsorship: "Sponsorship sent",
  sponsorship_received: "Sponsorship received",
  withdrawal: "Withdrawal",
  withdrawal_hold: "Withdrawal pending",
  withdrawal_release: "Withdrawal cancelled",
  admin_adjustment: "Adjustment",
  referral: "Referral Reward",
};

export function WalletPanel({ showTopup = true }: { showTopup?: boolean }) {
  const wallet = useWallet();
  const tx = useWalletTransactions(50);
  const [topupOpen, setTopupOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 p-6 sm:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
            <Coins className="h-3.5 w-3.5 text-amber-500" /> WeCoin Wallet
          </div>
          <div className="mt-3 flex items-end gap-3 flex-wrap">
            <div className="text-5xl sm:text-6xl font-black tracking-tight">
              {wallet.isLoading ? <Loader2 className="h-10 w-10 animate-spin" /> : (wallet.balanceCoins ?? 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              ≈ ₹{coinsToInr(wallet.balanceCoins ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {showTopup && (
              <>
                <Button onClick={() => setTopupOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Money
                </Button>
                <Button onClick={() => setRedeemOpen(true)} variant="outline" className="gap-2 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 text-rose-500 hover:text-rose-400">
                  <Plus className="h-4 w-4" /> Redeem Code
                </Button>
              </>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 max-w-sm text-xs">
            <div className="rounded-lg bg-background/40 border border-white/5 p-3">
              <div className="text-muted-foreground">Lifetime credited</div>
              <div className="font-bold text-base mt-0.5">{(wallet.data?.lifetime_credited ?? 0).toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-background/40 border border-white/5 p-3">
              <div className="text-muted-foreground">Lifetime debited</div>
              <div className="font-bold text-base mt-0.5">{(wallet.data?.lifetime_debited ?? 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-lg font-bold mb-3">Recent Transactions</h2>
        <div className="rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
          {tx.isLoading && (
            <div className="p-6 text-center text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin inline mr-2" />Loading…</div>
          )}
          {!tx.isLoading && (tx.data?.length ?? 0) === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No transactions yet. Add money to get started.</div>
          )}
          {Array.isArray(tx.data) && tx.data.map((t) => {
            const credit = t.amount_coins > 0;
            return (
              <div key={t.id} className="flex items-center gap-3 p-4 hover:bg-white/[0.02]">
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  credit ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                  {credit ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{t.description ?? TYPE_LABEL[t.type] ?? t.type}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {TYPE_LABEL[t.type] ?? t.type} · {new Date(t.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={cn("text-sm font-bold", credit ? "text-emerald-500" : "text-rose-500")}>
                    {credit ? "+" : ""}{t.amount_coins.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">bal {t.balance_after.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <WalletTopupDialog open={topupOpen} onOpenChange={setTopupOpen} />
      <RedeemGiftCardDialog open={redeemOpen} onOpenChange={setRedeemOpen} />
    </div>
  );
}
