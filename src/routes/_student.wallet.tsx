import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { WalletPanel } from "@/components/wallet/wallet-panel";

export const Route = createFileRoute("/_student/wallet")({
  head: () => ({ meta: [{ title: "WeCoin Wallet — WeFest" }] }),
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: location.pathname + location.search } });

  },
  component: StudentWallet,
});

function StudentWallet() {
  return (
    <div className="px-6 sm:px-8 py-8 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">WeCoin Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">Your in-app currency for tickets, merch and campus experiences.</p>
      </div>
      <WalletPanel />
    </div>
  );
}
