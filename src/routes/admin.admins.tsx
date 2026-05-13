import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Crown, Trash2, ShieldCheck, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/admins")({
  component: AdminAdmins,
});

const RANKS = ["Moderator", "Organizer", "Admin", "Superadmin"] as const;
type Rank = typeof RANKS[number];

function AdminAdmins() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
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
      const { data: adminData, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (!adminData?.length) return [];
      
      const userIds = adminData.map(a => a.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
      
      return adminData.map(a => {
        const profile = profiles?.find(p => p.user_id === a.user_id);
        return {
          ...a,
          profiles: profile || null
        };
      });
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!email.trim()) throw new Error("Email required");
      
      // Lookup user by email
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();
        
      if (profileErr || !profile) {
        throw new Error("User not found with this email. They must have a WeFest account first.");
      }
      
      const { error } = await supabase.from("admin_users").insert({ user_id: profile.user_id, rank });
      if (error) {
        if (error.code === '23505') throw new Error("User is already an admin");
        throw error;
      }
    },
    onSuccess: () => { 
      toast.success("Admin added successfully"); 
      setEmail(""); 
      qc.invalidateQueries({ queryKey: ["all-admins"] }); 
    },
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

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
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
                    <th className="p-4 font-medium">Administrator</th>
                    <th className="p-4 font-medium">Rank</th>
                    <th className="p-4 font-medium">Added</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {admins?.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {(a.profiles?.full_name || a.profiles?.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{a.profiles?.full_name || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground truncate">{a.profiles?.email || a.user_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={a.rank === "Superadmin" ? "default" : "secondary"} className="capitalize gap-1">
                          {a.rank === "Superadmin" && <Crown className="h-3 w-3" />} {a.rank}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Button size="icon" variant="ghost" disabled={!isSuper || remove.isPending} className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => {
                          if (confirm("Are you sure you want to remove this admin?")) {
                            remove.mutate(a.id);
                          }
                        }}>
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

        <div className="glass rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-6 flex items-center gap-2"><Crown className="h-5 w-5 text-primary" /> Add Administrator</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </Label>
              <Input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@example.com" 
                className="h-10 bg-background/50" 
                disabled={!isSuper} 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground">Assign Rank</Label>
              <div className="grid grid-cols-2 gap-2">
                {RANKS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={!isSuper}
                    onClick={() => setRank(r)}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      rank === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-muted/5 text-muted-foreground hover:bg-muted/20"
                    }`}
                  >
                    {r === "Superadmin" && <Crown className="h-3.5 w-3.5" />}
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full mt-2 h-10 bg-brand-gradient text-white font-bold shadow-glow" 
              onClick={() => add.mutate()} 
              disabled={!isSuper || !email.trim() || add.isPending}
            >
              {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Grant Admin Access"}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              The user must already have a registered account on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
