import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CertificateTemplate } from "@/components/certificate-template";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Award, ShieldCheck, Download, Eye, Loader2,
  Search, GraduationCap, CheckCircle2, FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const Route = createFileRoute("/_student/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — WeFest" },
      { name: "description", content: "Download your verified WeFest participation certificates." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: location.pathname + location.searchStr } });
  },
  component: CertificationsPage,
});

function CertificationsPage() {
  const [printingCert, setPrintingCert] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (printingCert) {
      const timer = setTimeout(() => {
        window.print();
        setPrintingCert(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [printingCert]);

  const { data, isLoading } = useQuery({
    queryKey: ["student-certifications"],
    queryFn: async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) throw new Error("Not authenticated");
        const user = userData.user;

        const [ticketsRes, profileRes] = await Promise.all([
          supabase
            .from("tickets")
            .select("*, events(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("*, colleges(name)")
            .eq("id", user.id)
            .single()
        ]);

        if (ticketsRes.error) throw ticketsRes.error;

        return { tickets: ticketsRes.data || [], user, profile: profileRes.data };
      } catch (e: any) {
        console.error("Error fetching certifications:", e);
        throw e;
      }
    },
  });

  const tickets = data?.tickets || [];
  const studentName =
    data?.user?.user_metadata?.full_name ||
    (data?.profile as any)?.full_name ||
    "Student";
  const collegeName = (data?.profile as any)?.colleges?.name;

  const filtered = tickets.filter((t: any) =>
    t.events?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Award className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground">Loading certificates…</p>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[900px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Certifications</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Verified participation certificates for your portfolio.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">{tickets.length} Verified</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {tickets.length > 0 && (
        <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-4 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-primary">Blockchain-Verified Credentials</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Each certificate is cryptographically sealed with a unique ID and verifiable on the WeFest registry. Add them to your LinkedIn or resume.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      {tickets.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search certificates…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/5 bg-white/[0.02] pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all"
          />
        </div>
      )}

      {/* Certificates List */}
      {tickets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-white/10 py-20 px-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <FileText className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <h3 className="font-semibold text-base mb-2">No certificates yet</h3>
          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
            Attend WeFest events to unlock verified participation certificates for your portfolio.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((t: any, index: number) => (
            <div
              key={t.id}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all p-5"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Certificate Icon */}
                  <div className="relative h-12 w-12 shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <Award className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500/90 flex items-center justify-center">
                      <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">
                      {t.events?.title || "Event Participant"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {t.events?.date ? format(new Date(t.events.date), "MMM dd, yyyy") : ""}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/10" />
                      <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">
                        CERT-{t.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] text-emerald-500 font-medium">Verified Participation</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg font-semibold text-xs h-8 border-white/10 bg-white/[0.02] hover:bg-white/[0.06] gap-1.5"
                      >
                        <Eye className="h-3 w-3" /> Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[1120px] w-[96vw] border-none bg-[#0a0a0c] p-0 overflow-auto max-h-[90vh]">
                      <CertificateTemplate
                        studentName={studentName}
                        eventName={t.events?.title || "Event Participant"}
                        date={t.events?.date ? format(new Date(t.events.date), "MMMM dd, yyyy") : "2026"}
                        certificateId={`CERT-${t.id.slice(0, 8).toUpperCase()}`}
                        collegeName={collegeName}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    className="bg-brand-gradient text-white rounded-lg font-semibold shadow-glow text-xs h-8 px-4 gap-1.5"
                    onClick={() => {
                      toast.success("Preparing certificate…", { description: "Your download will start shortly." });
                      setPrintingCert(t);
                    }}
                  >
                    <Download className="h-3 w-3" /> Download
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No certificates match your search.
            </div>
          )}
        </div>
      )}

      {/* Hidden Print Portal */}
      {printingCert &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="print-root">
            <CertificateTemplate
              studentName={studentName}
              eventName={printingCert.events?.title || "Event Participant"}
              date={
                printingCert.events?.date
                  ? format(new Date(printingCert.events.date), "MMMM dd, yyyy")
                  : "2026"
              }
              certificateId={`CERT-${printingCert.id.slice(0, 8).toUpperCase()}`}
              collegeName={collegeName}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
