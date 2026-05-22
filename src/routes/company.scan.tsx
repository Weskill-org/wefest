import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine, CheckCircle2, XCircle, Loader2, Zap, Download, Users, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRScanner } from "@/components/qr-scanner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function CompanyScan() {
  const [code, setCode] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [log, setLog] = useState<{ code: string; ok: boolean; t: string; error?: string }[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const queryClient = useQueryClient();

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

  // Fetch all leads (students who have visited the booth)
  const { data: leads, isLoading: loadingLeads } = useQuery({
    queryKey: ["booth-leads", user?.id, selectedEventId],
    enabled: !!user?.id && !!selectedEventId,
    queryFn: async () => {
      // 1. Get all booth visits
      const { data: visits, error: visitsError } = await supabase
        .from("sponsor_booth_visits")
        .select(`
          id,
          created_at,
          student_user_id
        `)
        .eq("sponsor_user_id", user!.id)
        .eq("event_id", selectedEventId)
        .order("created_at", { ascending: false });

      if (visitsError) throw visitsError;
      if (!visits || visits.length === 0) return [];

      // 2. Fetch profiles for these students
      const studentIds = [...new Set(visits.map(v => v.student_user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", studentIds);

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return visits.map(visit => ({
        ...visit,
        student: profileMap.get(visit.student_user_id) || null
      }));
    }
  });

  const scanMutation = useMutation({
    mutationFn: async ({ ticketCode, eventId }: { ticketCode: string; eventId: string }) => {
      const cleanCode = ticketCode.trim().toUpperCase();
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("code", cleanCode)
        .maybeSingle();

      if (ticketError || !ticket) throw new Error("Invalid ticket code");

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
      return cleanCode;
    },
    onSuccess: (ticketCode) => {
      toast.success("Visit logged successfully!");
      setLog((l) => [{ code: ticketCode, ok: true, t: new Date().toLocaleTimeString() }, ...l]);
      setCode("");
      setIsScannerOpen(false);
      // Invalidate leads query to refresh the list
      if (user?.id && selectedEventId) {
        queryClient.invalidateQueries({ queryKey: ["booth-leads", user.id, selectedEventId] });
      }
    },
    onError: (error: any, variables) => {
      toast.error(error.message || "Failed to log visit");
      setLog((l) => [{ code: variables.ticketCode, ok: false, t: new Date().toLocaleTimeString(), error: error.message }, ...l]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      toast.error("Please select an event first");
      return;
    }
    if (!code.trim()) return;
    scanMutation.mutate({ ticketCode: code.trim().toUpperCase(), eventId: selectedEventId });
  };

  const handleScanSuccess = (decodedText: string) => {
    if (scanMutation.isPending) return;
    let finalCode = decodedText;
    if (decodedText.includes("/")) {
      finalCode = decodedText.split("/").pop() || decodedText;
    }
    const cleanCode = finalCode.trim().toUpperCase();
    setCode(cleanCode);
    scanMutation.mutate({ ticketCode: cleanCode, eventId: selectedEventId });
  };

  const exportToCSV = () => {
    if (!leads || leads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    
    const headers = ["Name", "Email", "Visit Time"];
    const rows = leads.map(lead => [
      lead.student?.full_name || "Unknown",
      lead.student?.email || "No Email",
      new Date(lead.created_at).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    
    const eventName = sponsorships?.find(s => s.event_id === selectedEventId)?.event?.title || 'event';
    const filename = `booth_leads_${eventName.replace(/\s+/g, '_').toLowerCase()}.csv`;
    
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported successfully!");
  };

  const successCount = log.filter(l => l.ok).length;
  const failCount = log.filter(l => !l.ok).length;
  const totalLeads = leads?.length || 0;

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
        <div className="flex gap-3">
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Student Ticket Code (e.g. MI26-XXXX)"
              className="glass border-white/10 h-11 font-mono uppercase"
              disabled={scanMutation.isPending}
            />
            <Button
              type="submit"
              disabled={scanMutation.isPending || !selectedEventId || !code.trim()}
              className="bg-brand-gradient text-white hover:opacity-90 min-w-[110px] h-11 shadow-glow font-bold"
            >
              {scanMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <Zap className="h-4 w-4 mr-1.5" /> Log Visit
                </>
              )}
            </Button>
          </form>

          <Dialog open={isScannerOpen} onOpenChange={(open) => selectedEventId ? setIsScannerOpen(open) : toast.error("Select event first")}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-11 w-11 rounded-xl border-white/10 bg-white/[0.02] hover:bg-primary/10 hover:text-primary transition-all p-0 shrink-0"
              >
                <QrCode className="h-5 w-5" />
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

      {/* Stats Bar */}
      {(log.length > 0 || totalLeads > 0) && (
        <div className="flex flex-wrap gap-4">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" />
            <span className="text-sm font-bold">{totalLeads}</span>
            <span className="text-[10px] text-muted-foreground">total leads</span>
          </div>
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold">{successCount}</span>
            <span className="text-[10px] text-muted-foreground">successful scans</span>
          </div>
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-bold">{failCount}</span>
            <span className="text-[10px] text-muted-foreground">failed scans</span>
          </div>
        </div>
      )}

      {/* Tabs for Scan Log vs Extracted Leads */}
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/10 mb-4 h-12">
          <TabsTrigger value="leads" className="data-[state=active]:bg-white/10 rounded-md">
            All Leads ({totalLeads})
          </TabsTrigger>
          <TabsTrigger value="log" className="data-[state=active]:bg-white/10 rounded-md">
            Current Session Log ({log.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-0">
          <div className="glass rounded-2xl overflow-hidden border border-white/5 flex flex-col">
            <div className="bg-muted/20 px-5 py-3 flex items-center justify-between border-b border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Captured Leads
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToCSV}
                disabled={!leads || leads.length === 0}
                className="h-8 text-xs bg-black/40 border-white/10 hover:bg-white/10"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export CSV
              </Button>
            </div>
            
            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {loadingLeads ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-brand animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">Loading leads data...</p>
                </div>
              ) : !leads || leads.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-sm text-muted-foreground">No leads found for this event.</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Start scanning tickets to collect leads.</p>
                </div>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 text-sm transition hover:bg-white/[0.02] gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0 border border-brand/30">
                        <span className="text-brand font-bold text-xs">
                          {lead.student?.full_name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{lead.student?.full_name || "Unknown Student"}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.student?.email || "No email available"}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono sm:text-right">
                      {new Date(lead.created_at).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="log" className="mt-0">
          <div className="glass divide-y divide-white/5 rounded-2xl overflow-hidden border border-white/5">
            <div className="bg-muted/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-white/5">
              Session Scan Log
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {log.length === 0 ? (
                <div className="p-12 text-center">
                  <ScanLine className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-sm text-muted-foreground">No scans in this session</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Scan a ticket code to begin</p>
                </div>
              ) : (
                log.map((l, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 text-sm transition hover:bg-white/[0.02] gap-2">
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
                    <span className="text-[11px] text-muted-foreground font-mono sm:text-right">{l.t}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Route = createFileRoute("/company/scan")({
  head: () => ({ meta: [{ title: "Booth Scanner — Company Portal — WeFest" }] }),
  component: CompanyScan,
});
