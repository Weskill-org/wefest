import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle, Search, Calendar as CalendarIcon, ShieldBan } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

function AdminEvents() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      // 1. Update event
      const { error } = await supabase.from("events").update({ status }).eq("id", id);
      if (error) throw error;
      
      // 2. Audit log
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: `update_event_status`,
          resource_type: "event",
          resource_id: id,
          details: { new_status: status }
        });
      }
    },
    onSuccess: (_, vars) => {
      toast.success(`Event marked as ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-events-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] }); // global dashboard query
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    }
  });

  const filtered = events?.filter(e => 
    e.title.toLowerCase().includes(q.toLowerCase()) || 
    e.college_name.toLowerCase().includes(q.toLowerCase())
  ) || [];

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Event Moderation</h1>
          <p className="text-muted-foreground">Approve, reject, or lock capacities for college fests.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events or colleges…" className="pl-9 bg-background/50 backdrop-blur" />
        </div>
      </div>

      <div className="mt-8 glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No events found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="p-4 font-medium">Event Name</th>
                  <th className="p-4 font-medium">College</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map(e => (
                  <tr key={e.id} className="transition-colors hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{e.title}</div>
                        {e.is_government_partnered && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] h-4">Gov Hub</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{e.category}</div>
                    </td>
                    <td className="p-4">{e.college_name}</td>
                    <td className="p-4 text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-3 w-3" /> {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={e.status || 'approved'} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {e.status !== 'approved' && (
                          <Button size="sm" variant="ghost" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 h-8 px-2" onClick={() => updateStatusMutation.mutate({ id: e.id, status: 'approved' })}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        )}
                        {e.status !== 'rejected' && (
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 px-2" onClick={() => updateStatusMutation.mutate({ id: e.id, status: 'rejected' })}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => updateStatusMutation.mutate({ id: e.id, status: 'locked' })} title="Lock ticket sales">
                          <ShieldBan className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500 uppercase">Approved</span>;
  if (status === 'rejected') return <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 uppercase">Rejected</span>;
  if (status === 'locked') return <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-500 uppercase">Sales Locked</span>;
  return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-500 uppercase">Pending</span>;
}
