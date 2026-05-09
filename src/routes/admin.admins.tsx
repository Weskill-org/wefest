import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Crown, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/admins")({
  component: AdminAdmins,
});

const RANKS = ["Moderator", "Organizer", "Admin", "Superadmin"] as const;
type Rank = typeof RANKS[number];

function AdminAdmins() {
  const qc = useQueryClient();
  const [userId, setUserId] = useState("");
  const [rank, setRank] = useState<Rank>("Moderator");

  const { data: me } = useQuery({
    queryKey: ["me-admin-rank"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("admin_users").select("rank").eq("user_id", user.id).maybeSingle();
      return data;
    },
  });

  const isSuper = me?.rank === "Superadmin";

  const { data: admins, isLoading } = useQuery({
    queryKey: ["all-admins"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID required");
      const { error } = await supabase.from("admin_users").insert({ user_id: userId, rank });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Admin added"); setUserId(""); qc.invalidateQueries({ queryKey: ["all-admins"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admin_users").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Admin removed"); qc.invalidateQueries({ queryKey: ["all-admins"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Admin Team</h1>
      <p className="text-muted-foreground">Manage internal administrators. Only Superadmins can add or remove members.</p>

      {!isSuper && (
        <div className="mt-6 glass rounded-2xl p-4 text-sm text-muted-foreground border border-amber-500/20">
          You are signed in as <Badge>{me?.rank ?? "Unknown"}</Badge>. Only a Superadmin can modify this list.
        </div>
      )}

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/60 bg-muted/30 font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Active administrators
          </div>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="p-4 font-medium">User ID</th>
                    <th className="p-4 font-medium">Rank</th>
                    <th className="p-4 font-medium">Added</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {admins?.map((a) => (
                    <tr key={a.id}>
                      <td className="p-4 font-mono text-xs">{a.user_id}</td>
                      <td className="p-4">
                        <Badge variant={a.rank === "Superadmin" ? "default" : "secondary"} className="capitalize gap-1">
                          {a.rank === "Superadmin" && <Crown className="h-3 w-3" />} {a.rank}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Button size="icon" variant="ghost" disabled={!isSuper || remove.isPending} className="h-8 w-8 text-red-500" onClick={() => remove.mutate(a.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6 h-fit">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Crown className="h-4 w-4 text-primary" /> Add admin</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">User ID (UUID from auth.users)</label>
              <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="123e4567-…" className="font-mono text-xs" disabled={!isSuper} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Rank</label>
              <select value={rank} onChange={(e) => setRank(e.target.value as Rank)} disabled={!isSuper} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <Button className="w-full" onClick={() => add.mutate()} disabled={!isSuper || !userId || add.isPending}>
              {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Grant access"}
            </Button>
            <p className="text-[10px] text-muted-foreground">User must already have a Supabase auth account.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
