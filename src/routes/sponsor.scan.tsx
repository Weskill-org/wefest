import { createFileRoute } from '@tanstack/react-router'
import { QRScanner } from "@/components/qr-scanner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sponsor/scan")({
  head: () => ({ meta: [{ title: "Booth Scanner — WeFest" }] }),
  component: SponsorScan,
});

function SponsorScan() {
  const [code, setCode] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [log, setLog] = useState<{ code: string; ok: boolean; t: string; error?: string }[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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
      const trimmedCode = ticketCode.trim();
      // 1. Verify ticket exists
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("code", trimmedCode)
        .maybeSingle();
      
      if (ticketError || !ticket) throw new Error("Invalid ticket code");

      // 2. Insert booth visit
      const { error: visitError } = await supabase
        .from("sponsor_booth_visits")
        .insert({
          sponsor_user_id: user!.id,
          event_id: eventId,
          student_user_id: ticket.user_id,
        });
      
      if (visitError) {
        if (visitError.code === "23505") throw new Error("Student already logged for this event");
        throw visitError;
      }
      return trimmedCode;
    },
    onSuccess: (ticketCode) => {
      toast.success("Visit logged successfully!");
      setLog((l) => [{ code: ticketCode, ok: true, t: new Date().toLocaleTimeString() }, ...l]);
      setCode("");
      setIsScannerOpen(false);
    },
    onError: (error: any, variables) => {
      toast.error(error.message || "Failed to log visit");
      setLog((l) => [{ code: variables.ticketCode, ok: false, t: new Date().toLocaleTimeString(), error: error.message }, ...l]);
    }
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedEventId) {
      toast.error("Please select an event first");
      return;
    }
    if (!code) return;
    scanMutation.mutate({ ticketCode: code, eventId: selectedEventId });
  };

  const handleScanSuccess = (decodedText: string) => {
    if (scanMutation.isPending) return;
    let finalCode = decodedText;
    if (decodedText.includes("/")) {
      finalCode = decodedText.split("/").pop() || decodedText;
    }
    setCode(finalCode);
    scanMutation.mutate({ ticketCode: finalCode, eventId: selectedEventId });
  };

  return (
    <div className="container mx-auto max-w-2xl px-6 py-12 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient shadow-glow text-white">
          <ScanLine className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">Booth Scanner</h1>
          <p className="text-sm text-muted-foreground">Lead capture & engagement analytics system.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Event Session</label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/[0.02] transition-all hover:bg-white/[0.04]">
              <SelectValue placeholder={loadingSponsorships ? "Connecting to fests..." : "Select active festival"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {sponsorships?.map((s) => (
                <SelectItem key={s.event_id} value={s.event_id} className="rounded-lg">
                  {(s.event as any).title}
                </SelectItem>
              ))}
              {!loadingSponsorships && sponsorships?.length === 0 && (
                <SelectItem value="none" disabled>No accepted sponsorships</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <Input 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="Enter Ticket ID..." 
              className="h-14 rounded-2xl border-white/10 bg-white/[0.02] font-mono text-center tracking-[0.2em] uppercase"
              disabled={scanMutation.isPending || !selectedEventId}
            />
            <Button 
              type="submit" 
              disabled={scanMutation.isPending || !selectedEventId || !code.trim()}
              className="bg-brand-gradient text-white shadow-glow px-8 h-14 rounded-2xl font-bold"
            >
              {scanMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log Visit"}
            </Button>
          </form>

          <Dialog open={isScannerOpen} onOpenChange={(open) => selectedEventId ? setIsScannerOpen(open) : toast.error("Select event first")}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-14 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-primary/10 hover:text-primary transition-all p-0"
              >
                <QrCode className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-white/10 bg-black/90 backdrop-blur-2xl p-6 rounded-3xl">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">Booth Camera</h3>
                <p className="text-xs text-muted-foreground">Scan student ticket QR to log visit.</p>
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

        <div className="space-y-4">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Session History</h3>
          <div className="rounded-2xl border border-white/10 bg-white/[0.01] divide-y divide-white/10 overflow-hidden shadow-sm">
            {log.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center justify-center opacity-20">
                <ScanLine className="h-12 w-12 mb-3" />
                <p className="text-sm font-medium tracking-tight">No leads captured in this session</p>
              </div>
            )}
            {log.map((l, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between p-5 text-sm transition-all animate-in slide-in-from-top-2",
                i === 0 && (l.ok ? "bg-emerald-500/[0.03]" : "bg-destructive/[0.03]")
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    l.ok ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                  )}>
                    {l.ok ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <code className="font-mono font-bold text-base tracking-tight">{l.code || "—"}</code>
                    {!l.ok && <p className="text-[10px] text-destructive mt-0.5 font-medium">{l.error}</p>}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/40">{l.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
