import { createFileRoute } from "@tanstack/react-router";
import { WalletPanel } from "@/components/wallet/wallet-panel";

export const Route = createFileRoute("/company/wallet")({
  head: () => ({ meta: [{ title: "WeCoin Wallet — Company" }] }),
  component: () => (
    <div className="px-6 sm:px-8 py-8 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Company Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Top up to sponsor campus festivals and reach Gen Z audiences.
        </p>
      </div>
      <WalletPanel />
    </div>
  ),
});
