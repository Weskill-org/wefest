import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldAlert, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const queryClient = useQueryClient();
  const [userIdToBan, setUserIdToBan] = useState("");
  const [reason, setReason] = useState("");

  const { data: blacklist, isLoading } = useQuery({
    queryKey: ["admin-blacklist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blacklisted_users")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const blacklistMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      if (!userIdToBan) throw new Error("User ID is required");

      const { error } = await supabase.from("blacklisted_users").insert({
        user_id: userIdToBan,
        reason: reason || "Violation of terms",
        created_by: user.id
      });
      if (error) throw error;
      
      // Audit log
      await supabase.from("audit_logs").insert({
        admin_user_id: user.id,
        action: `blacklist_user`,
        resource_type: "user",
        resource_id: userIdToBan,
        details: { reason }
      });
    },
    onSuccess: () => {
      toast.success("User added to blacklist");
      setUserIdToBan("");
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-blacklist"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to blacklist user");
    }
  });

  const removeBlacklistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { error } = await supabase.from("blacklisted_users").delete().eq("id", id);
      if (error) throw error;
      
      // Audit log
      await supabase.from("audit_logs").insert({
        admin_user_id: user.id,
        action: `remove_blacklist`,
        resource_type: "blacklist_record",
        resource_id: id,
      });
    },
    onSuccess: () => {
      toast.success("User removed from blacklist");
      queryClient.invalidateQueries({ queryKey: ["admin-blacklist"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove user from blacklist");
    }
  });

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">User Moderation</h1>
        <p className="text-muted-foreground">Manage platform access and blacklisted users.</p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/60 bg-muted/30">
            <h2 className="font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" /> Blacklisted Users
            </h2>
          </div>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : blacklist?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users are currently blacklisted.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="p-4 font-medium">User ID</th>
                    <th className="p-4 font-medium">Reason</th>
                    <th className="p-4 font-medium">Date added</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {blacklist?.map(b => (
                    <tr key={b.id} className="transition-colors hover:bg-muted/30">
                      <td className="p-4 font-mono text-xs">{b.user_id}</td>
                      <td className="p-4">{b.reason}</td>
                      <td className="p-4 text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8" onClick={() => removeBlacklistMutation.mutate(b.id)}>
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
          <h3 className="font-semibold mb-4 text-red-500 flex items-center gap-2">
            Ban a User
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">User ID (UUID)</label>
              <Input 
                value={userIdToBan} 
                onChange={e => setUserIdToBan(e.target.value)} 
                placeholder="123e4567-e89b..." 
                className="bg-background/50 font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Reason for ban</label>
              <Input 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                placeholder="e.g. Scalping tickets" 
                className="bg-background/50 text-sm"
              />
            </div>
            <Button 
              className="w-full bg-red-500 text-white hover:bg-red-600" 
              onClick={() => blacklistMutation.mutate()}
              disabled={!userIdToBan || blacklistMutation.isPending}
            >
              {blacklistMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enforce Ban"}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Blacklisted users will be immediately denied access to their accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
