import { createFileRoute } from "@tanstack/react-router";
import { WalletPanel } from "@/components/wallet/wallet-panel";

export const Route = createFileRoute("/organizer/wallet")({
  head: () => ({ meta: [{ title: "WeCoin Wallet — Organizer" }] }),
  component: () => (
    <div className="px-6 sm:px-8 py-8 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">College Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Receive ticket sales, sponsorships, and merch revenue here. Request payouts to your bank account.
        </p>
      </div>
      <WalletPanel />
    </div>
  ),
});
