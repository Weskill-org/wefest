import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyWallet, getMyWalletTransactions, coinsToInr } from "@/lib/wallet.functions";
import { supabase } from "@/integrations/supabase/client";

export function useWallet() {
  const fetchWallet = useServerFn(getMyWallet);
  const q = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return fetchWallet({
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    staleTime: 10_000,
  });
  return {
    ...q,
    balanceCoins: q.data?.balance_coins ?? 0,
    balanceInr: coinsToInr(q.data?.balance_coins ?? 0),
  };
}

export function useWalletTransactions(limit = 50) {
  const fetchTx = useServerFn(getMyWalletTransactions);
  return useQuery({
    queryKey: ["wallet-transactions", limit],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return fetchTx({ 
        data: { limit },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    staleTime: 5_000,
  });
}
