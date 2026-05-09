import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/scan")({
  head: () => ({ meta: [{ title: "Scan tickets — WeFest" }, { name: "description", content: "Validate ticket QR codes at the gate." }] }),
  component: Scan,
});

type LogEntry = { code: string; ok: boolean; t: string; note?: string };

function Scan() {
  const [code, setCode] = useState("");
  const [eventId, setEventId] = useState<string>("");
  const [log, setLog] = useState<LogEntry[]>([]);

  const ctx = Route.useRouteContext();
  const membership = ctx.membership as any;
 
   const { data: userData } = useQuery({
     queryKey: ["current-user"],
     queryFn: async () => {
       const { data: { user } } = await supabase.auth.getUser();
       return user;
     }
   });

   const { data: events, isLoading: loadingEvents } = useQuery({
     queryKey: ["college-events-scan", userData?.id, membership?.college_id],
     enabled: !!userData?.id,
     queryFn: async () => {
       let query = supabase
         .from("events")
         .select("id, title")
         .order("date", { ascending: true });

       if (membership?.college_id) {
         query = query.or(`organizer_user_id.eq.${userData!.id},college_id.eq.${membership.college_id}`);
       } else {
         query = query.eq("organizer_user_id", userData!.id);
       }

       const { data, error } = await query;
       if (error) throw error;
       return data;
     },
   });

  const scan = useMutation({
    mutationFn: async ({ ticketCode, evId }: { ticketCode: string; evId: string }) => {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .select("id, event_id, scanned_at, tier")
        .eq("code", ticketCode.trim())
        .maybeSingle();
      if (error) throw error;
      if (!ticket) throw new Error("Ticket not found");
      if (ticket.event_id !== evId) throw new Error("Ticket is for a different event");
      if (ticket.scanned_at) throw new Error(`Already scanned at ${new Date(ticket.scanned_at).toLocaleTimeString()}`);
      const { error: updErr } = await supabase
        .from("tickets")
        .update({ scanned_at: new Date().toISOString() })
        .eq("id", ticket.id);
      if (updErr) throw updErr;
      return ticket;
    },
    onSuccess: (ticket) => {
      toast.success(`Admitted • ${ticket.tier}`);
      setLog((l) => [{ code, ok: true, t: new Date().toLocaleTimeString(), note: ticket.tier }, ...l]);
      setCode("");
    },
    onError: (e: any) => {
      toast.error(e.message);
      setLog((l) => [{ code, ok: false, t: new Date().toLocaleTimeString(), note: e.message }, ...l]);
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return toast.error("Select your event first");
    if (!code.trim()) return;
    scan.mutate({ ticketCode: code, evId: eventId });
  };

  const scannedCount = log.filter(l => l.ok).length;
  const rejectedCount = log.filter(l => !l.ok).length;

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-black tracking-tight lg:text-3xl">Gate Scanner</h1>
        <p className="text-sm text-muted-foreground mt-1">Paste or scan ticket codes to admit attendees.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border border-border/50 bg-emerald-500/5 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Admitted</div>
          <div className="text-2xl font-black text-emerald-500 mt-1">{scannedCount}</div>
        </div>
        <div className="rounded-xl border border-border/50 bg-destructive/5 p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rejected</div>
          <div className="text-2xl font-black text-destructive mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* Event Selector */}
      <div className="grid gap-2 mb-4">
        <label className="text-sm font-bold">Event</label>
        <Select value={eventId} onValueChange={setEventId}>
          <SelectTrigger className="h-11 rounded-xl border-border/50 bg-muted/5">
            <SelectValue placeholder={loadingEvents ? "Loading…" : "Select an event you organize"} />
          </SelectTrigger>
          <SelectContent>
            {events?.map((e) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
            {!loadingEvents && (events?.length ?? 0) === 0 && <SelectItem value="none" disabled>No events found</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {/* Scan Input */}
      <form onSubmit={submit} className="flex gap-2 mb-8">
        <Input 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder="Ticket code" 
          disabled={scan.isPending} 
          className="h-11 rounded-xl border-border/50 bg-muted/5 font-mono"
        />
        <Button type="submit" disabled={scan.isPending || !eventId} className="bg-brand-gradient text-primary-foreground hover:opacity-90 min-w-[100px] h-11 rounded-xl font-bold">
          {scan.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validate"}
        </Button>
      </form>

      {/* Scan Log */}
      <div>
        <h3 className="text-sm font-bold mb-3">Scan Log</h3>
        <div className="rounded-xl border border-border/50 divide-y divide-border/50 overflow-hidden">
          {log.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No scans yet — start validating tickets above.</div>}
          {log.map((l, i) => (
            <div key={i} className={cn("flex items-center justify-between px-4 py-3 text-sm", i === 0 && "bg-muted/10")}>
              <div className="flex items-center gap-3 min-w-0">
                {l.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                <div className="min-w-0">
                  <code className="font-mono text-xs truncate block">{l.code || "—"}</code>
                  {l.note && <p className={`text-[10px] mt-0.5 ${l.ok ? "text-muted-foreground" : "text-destructive"}`}>{l.note}</p>}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-4">{l.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
