import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRScanner } from "@/components/qr-scanner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine, QrCode, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/scan")({
  head: () => ({ meta: [{ title: "Gate Scanner — WeFest" }, { name: "description", content: "Validate ticket QR codes at the gate." }] }),
  component: Scan,
});

type LogEntry = { code: string; ok: boolean; t: string; note?: string; tier?: string };

function Scan() {
  const [code, setCode] = useState("");
  const [eventId, setEventId] = useState<string>("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const ctx = Route.useRouteContext() as any;
  const membership = ctx.membership;
 
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
       const { data, error } = await supabase
         .from("events")
         .select("id, title")
         .order("date", { ascending: true })
         .or(`organizer_user_id.eq.${userData!.id}${membership?.college_id ? `,college_id.eq.${membership.college_id}` : ""}`);

       if (error) throw error;
       return data;
     },
   });

  const scan = useMutation({
    mutationFn: async ({ ticketCode, evId }: { ticketCode: string; evId: string }) => {
      const trimmedCode = ticketCode.trim().toUpperCase();
      const { data: ticket, error } = await supabase
        .from("tickets")
        .select("id, event_id, scanned_at, tier")
        .eq("code", trimmedCode)
        .maybeSingle();
      
      if (error) throw error;
      if (!ticket) throw new Error("Ticket not found");
      if (ticket.event_id !== evId) throw new Error("Ticket is for a different event");
      if (ticket.scanned_at) throw new Error(`Already admitted at ${new Date(ticket.scanned_at).toLocaleTimeString()}`);
      
      const { error: updErr } = await supabase
        .from("tickets")
        .update({ scanned_at: new Date().toISOString() })
        .eq("id", ticket.id);
      
      if (updErr) throw updErr;
      return { ...ticket, code: trimmedCode };
    },
    onSuccess: (ticket) => {
      toast.success(`Access Granted: ${ticket.tier}`);
      setLog((l) => [{ code: ticket.code, ok: true, t: new Date().toLocaleTimeString(), tier: ticket.tier }, ...l]);
      setCode("");
      setIsScannerOpen(false);
    },
    onError: (e: any, variables) => {
      toast.error(e.message);
      setLog((l) => [{ code: variables.ticketCode, ok: false, t: new Date().toLocaleTimeString(), note: e.message }, ...l]);
    },
  });

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!eventId) return toast.error("Please select an event first");
    if (!code.trim()) return;
    scan.mutate({ ticketCode: code.trim().toUpperCase(), evId: eventId });
  };

  const handleScanSuccess = (decodedText: string) => {
    if (scan.isPending) return;
    // Standardize code: if it's a URL, extract the last part
    let finalCode = decodedText;
    if (decodedText.includes("/")) {
      finalCode = decodedText.split("/").pop() || decodedText;
    }
    
    // We update state and mutate immediately
    const cleanCode = finalCode.trim().toUpperCase();
    setCode(cleanCode);
    scan.mutate({ ticketCode: cleanCode, evId: eventId });
  };

  const scannedCount = log.filter(l => l.ok).length;
  const rejectedCount = log.filter(l => !l.ok).length;

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">Gate Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">Institutional ticket verification system.</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <ScanLine className="h-6 w-6" />
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 gap-4">
        <div className="group rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-5 transition-all hover:bg-emerald-500/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Successful Entries</span>
          </div>
          <div className="text-3xl font-black text-emerald-500">{scannedCount}</div>
        </div>
        <div className="group rounded-2xl border border-destructive/10 bg-destructive/[0.02] p-5 transition-all hover:bg-destructive/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-destructive" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Failed Attempts</span>
          </div>
          <div className="text-3xl font-black text-destructive">{rejectedCount}</div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Active Event Session</label>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger className="h-14 rounded-2xl border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] focus:ring-primary/20">
              <SelectValue placeholder={loadingEvents ? "Initializing network..." : "Select event for check-in"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/10 bg-background/95 backdrop-blur-xl">
              {events?.map((e) => <SelectItem key={e.id} value={e.id} className="rounded-lg">{e.title}</SelectItem>)}
              {!loadingEvents && (events?.length ?? 0) === 0 && <SelectItem value="none" disabled>No active events</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <form onSubmit={submit} className="flex-1 flex gap-2">
            <Input 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="Enter ticket code manually..." 
              disabled={scan.isPending || !eventId} 
              className="h-14 rounded-2xl border-white/5 bg-white/[0.02] font-mono text-center tracking-[0.2em] placeholder:tracking-normal placeholder:font-sans uppercase"
            />
            <Button 
              type="submit" 
              disabled={scan.isPending || !eventId || !code.trim()} 
              className="bg-brand-gradient text-white shadow-glow px-8 h-14 rounded-2xl font-bold transition-transform active:scale-95"
            >
              {scan.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
            </Button>
          </form>

          <Dialog open={isScannerOpen} onOpenChange={(open) => eventId ? setIsScannerOpen(open) : toast.error("Select event first")}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-14 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-primary/10 hover:text-primary transition-all p-0"
              >
                <QrCode className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-white/10 bg-black/90 backdrop-blur-2xl p-6 rounded-3xl">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">Camera Scanner</h3>
                <p className="text-xs text-muted-foreground">Align the QR code within the frame.</p>
              </div>
              <QRScanner onScanSuccess={handleScanSuccess} />
              <Button 
                variant="ghost" 
                className="mt-4 w-full text-xs font-bold text-muted-foreground"
                onClick={() => setIsScannerOpen(false)}
              >
                Cancel
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Real-time Audit Log */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Live Audit Log</h3>
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] divide-y divide-white/5 overflow-hidden">
          {log.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
              <CheckCircle2 className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">Ready for validation</p>
            </div>
          )}
          {log.map((l, i) => (
            <div key={i} className={cn(
              "flex items-center justify-between px-6 py-4 transition-all animate-in slide-in-from-top-2 duration-300", 
              i === 0 && (l.ok ? "bg-emerald-500/[0.03]" : "bg-destructive/[0.03]")
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  l.ok ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                )}>
                  {l.ok ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-bold tracking-wider">{l.code || "—"}</code>
                    {l.tier && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">{l.tier}</span>}
                  </div>
                  {l.note && <p className={cn("text-[10px] mt-0.5 font-medium", l.ok ? "text-muted-foreground" : "text-destructive")}>{l.note}</p>}
                </div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/40">{l.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
