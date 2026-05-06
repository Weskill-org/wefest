import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/organizer/scan")({
  head: () => ({ meta: [{ title: "Scan tickets — WeFest" }, { name: "description", content: "Validate ticket QR codes at the gate." }] }),
  component: Scan,
});

function Scan() {
  const [code, setCode] = useState("");
  const [log, setLog] = useState<{ code: string; ok: boolean; t: string }[]>([]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = code.startsWith("MI26") || code.startsWith("OAS26");
    setLog((l) => [{ code, ok, t: new Date().toLocaleTimeString() }, ...l]);
    setCode("");
  };
  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient"><ScanLine className="h-5 w-5 text-primary-foreground" /></div>
        <div>
          <h1 className="font-display text-3xl font-black">Gate scanner</h1>
          <p className="text-sm text-muted-foreground">Paste or scan ticket code</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="MI26-8821-AX" />
        <Button type="submit" className="bg-brand-gradient text-primary-foreground hover:opacity-90">Validate</Button>
      </form>

      <div className="mt-8 glass divide-y divide-border/60 rounded-2xl">
        {log.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No scans yet</div>}
        {log.map((l, i) => (
          <div key={i} className="flex items-center justify-between p-4 text-sm">
            <div className="flex items-center gap-3">
              {l.ok ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-destructive" />}
              <code className="font-mono">{l.code || "—"}</code>
            </div>
            <span className="text-xs text-muted-foreground">{l.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
