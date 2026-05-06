import { createFileRoute, Link } from "@tanstack/react-router";
import { myTickets } from "@/lib/mock";
import { QrCode } from "lucide-react";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "My tickets — WeFest" }, { name: "description", content: "Your WeFest tickets and QR codes." }] }),
  component: Tickets,
});

function Tickets() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl font-black">My tickets</h1>
      <p className="mt-2 text-muted-foreground">Show the QR at the gate to enter.</p>

      <div className="mt-8 grid gap-4">
        {myTickets.map((t) => (
          <div key={t.id} className="glass flex items-center gap-6 rounded-2xl p-5">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-white text-black">
              <QrCode className="h-16 w-16" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">{t.tier}</div>
              <div className="font-display text-xl font-bold">{t.event}</div>
              <div className="text-sm text-muted-foreground">{new Date(t.date).toDateString()}</div>
              <code className="mt-2 inline-block rounded-md bg-secondary px-2 py-0.5 text-xs">{t.code}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Looking for more? <Link to="/events" className="text-primary hover:underline">Browse events →</Link>
      </div>
    </div>
  );
}
