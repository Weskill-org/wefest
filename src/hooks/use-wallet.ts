import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyWallet, getMyWalletTransactions, coinsToInr } from "@/lib/wallet.functions";

export function useWallet() {
  const fetchWallet = useServerFn(getMyWallet);
  const q = useQuery({
    queryKey: ["wallet"],
    queryFn: () => fetchWallet(),
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
    queryFn: () => fetchTx({ data: { limit } }),
    staleTime: 5_000,
  });
}
