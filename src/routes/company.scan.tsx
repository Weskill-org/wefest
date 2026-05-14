import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine, CheckCircle2, XCircle, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/company/scan")({
  head: () => ({ meta: [{ title: "Booth Scanner — Company Portal — WeFest" }] }),
  component: CompanyScan,
});

function CompanyScan() {
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

  const { data: sponsorships, isLoading: loadingSponsorships, error: sponsorshipsError } = useQuery({
    queryKey: ["my-active-sponsorships", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*, event:events(*)")
        .eq("company_user_id", user!.id)
        .eq("status", "accepted");
      if (error) throw error;
      return data;
    }
  });

  // Auto-select first event if available
  useEffect(() => {
    if (!selectedEventId && sponsorships && sponsorships.length > 0) {
      const firstEventId = sponsorships[0].event_id;
      if (firstEventId) {
        setSelectedEventId(firstEventId);
      }
    }
  }, [sponsorships, selectedEventId]);

  const scanMutation = useMutation({
    mutationFn: async ({ ticketCode, eventId }: { ticketCode: string; eventId: string }) => {
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("code", ticketCode)
        .single();

      if (ticketError || !ticket) throw new Error("Invalid ticket code");

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

  const successCount = log.filter(l => l.ok).length;
  const failCount = log.filter(l => !l.ok).length;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
          <ScanLine className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight">Booth Scanner</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Log student visits to your booth for engagement analytics</p>
        </div>
      </div>

      {/* Event Select */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="grid gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Event</label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="glass border-white/10 h-11">
              <SelectValue placeholder={loadingSponsorships ? "Loading events…" : "Select an event"} />
            </SelectTrigger>
            <SelectContent>
               {sponsorships?.map((s) => {
                 const eventData = Array.isArray(s.event) ? s.event[0] : s.event;
                 if (!eventData) return null;
                 return (
                   <SelectItem key={s.event_id} value={s.event_id}>
                     {(eventData as any).title}
                   </SelectItem>
                 );
               })}
               {!loadingSponsorships && (!sponsorships || sponsorships.length === 0) && (
                 <SelectItem value="none" disabled>No active sponsorships found</SelectItem>
               )}
               {sponsorshipsError && (
                 <SelectItem value="error" disabled className="text-destructive">Error loading fests</SelectItem>
               )}
            </SelectContent>
          </Select>
        </div>

        {/* Scan Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Student Ticket Code (e.g. MI26-XXXX)"
            className="glass border-white/10 h-11 font-mono"
            disabled={scanMutation.isPending}
          />
          <Button
            type="submit"
            disabled={scanMutation.isPending || !selectedEventId}
            className="bg-brand-gradient text-white hover:opacity-90 min-w-[110px] h-11 shadow-glow"
          >
            {scanMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                <Zap className="h-4 w-4 mr-1.5" /> Log Visit
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Stats Bar */}
      {log.length > 0 && (
        <div className="flex gap-4">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold">{successCount}</span>
            <span className="text-[10px] text-muted-foreground">successful</span>
          </div>
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-bold">{failCount}</span>
            <span className="text-[10px] text-muted-foreground">failed</span>
          </div>
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">{log.length}</span>
            <span className="text-[10px] text-muted-foreground">total</span>
          </div>
        </div>
      )}

      {/* Scan Log */}
      <div className="glass divide-y divide-white/5 rounded-2xl overflow-hidden border border-white/5">
        <div className="bg-muted/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Session Scan Log
        </div>
        {log.length === 0 && (
          <div className="p-12 text-center">
            <ScanLine className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-sm text-muted-foreground">No scans in this session</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">Select an event and scan a ticket code to begin</p>
          </div>
        )}
        {log.map((l, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5 text-sm transition hover:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              {l.ok ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
              )}
              <div>
                <code className="font-mono font-bold text-xs">{l.code || "—"}</code>
                {!l.ok && <p className="text-[10px] text-destructive mt-0.5">{l.error}</p>}
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">{l.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
