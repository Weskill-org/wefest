import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Gift, Plus, Ticket, CheckCircle2, XCircle, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllGiftCards, createGiftCard } from "@/lib/wallet.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/gift-cards")({
  component: AdminGiftCards,
});

function AdminGiftCards() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newAmount, setNewAmount] = useState(500);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["admin-gift-cards"],
    queryFn: async () => {
      const { data: { session } } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
      return getAllGiftCards({
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
  });

  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "WF-";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3) result += "-";
    }
    setNewCode(result);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
      return createGiftCard({
        data: { code: newCode, amountCoins: newAmount },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        }
      });
    },
    onSuccess: () => {
      toast.success("Gift card created successfully");
      setNewCode("");
      setNewAmount(500);
      qc.invalidateQueries({ queryKey: ["admin-gift-cards"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create gift card");
    },
  });

  const filteredCards = cards?.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.redeemed_by?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gift Cards</h1>
          <p className="text-muted-foreground mt-1">Generate and manage redeemable WeCoin codes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Create New Code
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Gift Code</Label>
                <div className="flex gap-2">
                  <Input 
                    id="code" 
                    value={newCode} 
                    onChange={e => setNewCode(e.target.value.toUpperCase())}
                    placeholder="WF-XXXX-XXXX"
                    className="font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={generateRandomCode} title="Generate random">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (WeCoins)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={newAmount} 
                  onChange={e => setNewAmount(parseInt(e.target.value) || 0)}
                  min={1}
                />
                <p className="text-[10px] text-muted-foreground">≈ ₹{(newAmount / 10).toFixed(2)}</p>
              </div>
              <Button 
                className="w-full mt-2" 
                disabled={!newCode || newAmount <= 0 || createMutation.isPending}
                onClick={() => createMutation.mutate()}
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Gift Card"}
              </Button>
            </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by code or user ID..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            {isLoading ? (
              <div className="p-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredCards?.length === 0 ? (
              <div className="p-20 text-center text-muted-foreground">No gift cards found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Code</th>
                      <th className="px-6 py-4 font-semibold text-right">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Redeemed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredCards?.map((card) => (
                      <tr key={card.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono font-medium">{card.code}</td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-500">+{card.amount_coins.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          {card.is_redeemed ? (
                            <span className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full text-[10px] w-fit font-bold uppercase">
                              <XCircle className="h-3 w-3" /> Redeemed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-[10px] w-fit font-bold uppercase">
                              <CheckCircle2 className="h-3 w-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {card.is_redeemed ? (
                            <div className="flex flex-col">
                              <span>{new Date(card.redeemed_at!).toLocaleString()}</span>
                              <span className="text-[10px] truncate max-w-[150px]">{card.redeemed_by}</span>
                            </div>
                          ) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
