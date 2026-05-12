import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Megaphone, Send, Power, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/broadcasts")({
  component: AdminBroadcasts,
});

function AdminBroadcasts() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const { data: broadcasts, isLoading } = useQuery({
    queryKey: ["admin-broadcasts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("broadcast_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      if (!message.trim()) throw new Error("Message cannot be empty");

      const { error } = await supabase.from("broadcast_messages").insert({
        message,
        severity,
        active: true,
        created_by: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Broadcast sent globally");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["global-broadcasts"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send broadcast");
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string, active: boolean }) => {
      const { error } = await supabase.from("broadcast_messages").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Broadcast status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["global-broadcasts"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update broadcast status");
    }
  });

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Emergency Broadcasts</h1>
        <p className="text-muted-foreground">Send global alerts to all active users on the platform.</p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_350px]">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/60 bg-muted/30">
            <h2 className="font-semibold flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" /> Broadcast History
            </h2>
          </div>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : broadcasts?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No broadcasts sent yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="p-4 font-medium">Message</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {broadcasts?.map(b => (
                    <tr key={b.id} className={`transition-colors hover:bg-muted/30 ${!b.active ? 'opacity-50' : ''}`}>
                      <td className="p-4 max-w-[300px] truncate">{b.message}</td>
                      <td className="p-4">
                        <SeverityBadge severity={b.severity} />
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(b.created_at).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <Button 
                          size="sm" 
                          variant={b.active ? "default" : "outline"}
                          className={`h-8 gap-2 ${b.active ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                          onClick={() => toggleActiveMutation.mutate({ id: b.id, active: !b.active })}
                        >
                          <Power className="h-3 w-3" />
                          {b.active ? "Deactivate" : "Activate"}
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
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Send className="h-4 w-4" /> New Broadcast
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Severity Level</label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Message</label>
              <Input 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder="Platform maintenance at 2 AM..." 
                className="bg-background/50"
              />
            </div>
            <Button 
              className="w-full bg-brand-gradient text-primary-foreground shadow-glow hover:opacity-90" 
              onClick={() => broadcastMutation.mutate()}
              disabled={!message.trim() || broadcastMutation.isPending}
            >
              {broadcastMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Transmit Globally"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === 'emergency') return <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 uppercase gap-1"><AlertTriangle className="h-3 w-3" /> Emergency</span>;
  if (severity === 'warning') return <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-500 uppercase gap-1"><AlertTriangle className="h-3 w-3" /> Warning</span>;
  return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-500 uppercase gap-1"><Info className="h-3 w-3" /> Info</span>;
}
