import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sponsor/scan")({
  head: () => ({ meta: [{ title: "Booth Scanner — WeFest" }] }),
  component: SponsorScan,
});

function SponsorScan() {
  const [code, setCode] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [log, setLog] = useState<{ code: string; ok: boolean; t: string; error?: string }[]>([]);

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: sponsorships, isLoading: loadingSponsorships } = useQuery({
    queryKey: ["my-active-sponsorships", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*, event:event_id(*)")
        .eq("company_user_id", user!.id)
        .eq("status", "accepted");
      if (error) throw error;
      return data;
    }
  });

  const scanMutation = useMutation({
    mutationFn: async ({ ticketCode, eventId }: { ticketCode: string; eventId: string }) => {
      // 1. Verify ticket exists
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("code", ticketCode)
        .single();
      
      if (ticketError || !ticket) throw new Error("Invalid ticket code");

      // 2. Insert booth visit
      const { error: visitError } = await supabase
        .from("sponsor_booth_visits")
        .insert({
          sponsor_user_id: user!.id,
          event_id: eventId,
          student_user_id: ticket.user_id,
        });
      
      if (visitError) throw visitError;
      return ticketCode;
    },
    onSuccess: (ticketCode) => {
      toast.success("Visit logged successfully!");
      setLog((l) => [{ code: ticketCode, ok: true, t: new Date().toLocaleTimeString() }, ...l]);
      setCode("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to log visit");
      setLog((l) => [{ code, ok: false, t: new Date().toLocaleTimeString(), error: error.message }, ...l]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      toast.error("Please select an event first");
      return;
    }
    if (!code) return;
    scanMutation.mutate({ ticketCode: code, eventId: selectedEventId });
  };

  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient">
          <ScanLine className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-black">Booth Scanner</h1>
          <p className="text-sm text-muted-foreground">Log student visits to your booth for engagement analytics</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Select Active Event</label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="glass border-border/60">
              <SelectValue placeholder={loadingSponsorships ? "Loading..." : "Select an event"} />
            </SelectTrigger>
            <SelectContent>
              {sponsorships?.map((s) => (
                <SelectItem key={s.event_id} value={s.event_id}>
                  {(s.event as any).title}
                </SelectItem>
              ))}
              {!loadingSponsorships && sponsorships?.length === 0 && (
                <SelectItem value="none" disabled>No active sponsorships found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            placeholder="Student Ticket Code (e.g. MI26-XXXX)" 
            className="glass border-border/60"
            disabled={scanMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={scanMutation.isPending || !selectedEventId}
            className="bg-brand-gradient text-primary-foreground hover:opacity-90 min-w-[100px]"
          >
            {scanMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Visit"}
          </Button>
        </form>

        <div className="glass divide-y divide-border/60 rounded-2xl overflow-hidden border border-border/60">
          <div className="bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Scans
          </div>
          {log.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No scans in this session</div>}
          {log.map((l, i) => (
            <div key={i} className="flex items-center justify-between p-4 text-sm transition hover:bg-muted/20">
              <div className="flex items-center gap-3">
                {l.ok ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <code className="font-mono font-bold">{l.code || "—"}</code>
                  {!l.ok && <p className="text-[10px] text-destructive mt-0.5">{l.error}</p>}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{l.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
