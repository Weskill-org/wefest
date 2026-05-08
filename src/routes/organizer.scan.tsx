import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/organizer/scan")({
  head: () => ({ meta: [{ title: "Scan tickets — WeFest" }, { name: "description", content: "Validate ticket QR codes at the gate." }] }),
  component: Scan,
});

type LogEntry = { code: string; ok: boolean; t: string; note?: string };

function Scan() {
  const [code, setCode] = useState("");
  const [eventId, setEventId] = useState<string>("");
  const [log, setLog] = useState<LogEntry[]>([]);

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ["organizer-events", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title")
        .eq("organizer_user_id", user!.id)
        .order("date", { ascending: true });
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

  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient"><ScanLine className="h-5 w-5 text-primary-foreground" /></div>
        <div>
          <h1 className="font-display text-3xl font-black">Gate scanner</h1>
          <p className="text-sm text-muted-foreground">Paste or scan ticket code to admit</p>
        </div>
      </div>

      <div className="mt-6 grid gap-2">
        <label className="text-sm font-medium">Event</label>
        <Select value={eventId} onValueChange={setEventId}>
          <SelectTrigger className="glass border-border/60">
            <SelectValue placeholder={loadingEvents ? "Loading…" : "Select an event you organize"} />
          </SelectTrigger>
          <SelectContent>
            {events?.map((e) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
            {!loadingEvents && (events?.length ?? 0) === 0 && <SelectItem value="none" disabled>No events found</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ticket code" disabled={scan.isPending} />
        <Button type="submit" disabled={scan.isPending || !eventId} className="bg-brand-gradient text-primary-foreground hover:opacity-90 min-w-[110px]">
          {scan.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validate"}
        </Button>
      </form>

      <div className="mt-8 glass divide-y divide-border/60 rounded-2xl">
        {log.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No scans yet</div>}
        {log.map((l, i) => (
          <div key={i} className="flex items-center justify-between p-4 text-sm">
            <div className="flex items-center gap-3">
              {l.ok ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-destructive" />}
              <div>
                <code className="font-mono">{l.code || "—"}</code>
                {l.note && <p className={`text-[10px] mt-0.5 ${l.ok ? "text-muted-foreground" : "text-destructive"}`}>{l.note}</p>}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{l.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
