import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Loader2 } from "lucide-react";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "My tickets — WeFest" }, { name: "description", content: "Your WeFest tickets and QR codes." }] }),
  component: Tickets,
});

function Tickets() {
  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to view tickets");

      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          events (
            title,
            date
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-6 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Please login</h1>
        <p className="mt-2 text-muted-foreground">You need to be logged in to view your tickets.</p>
        <Link to="/login" className="mt-4 text-primary hover:underline inline-block">Login here</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl font-black">My tickets</h1>
      <p className="mt-2 text-muted-foreground">Show the QR at the gate to enter.</p>

      <div className="mt-8 grid gap-4">
        {tickets && tickets.length > 0 ? (
          tickets.map((t) => (
            <div key={t.id} className="glass flex items-center gap-6 rounded-2xl p-5">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-white text-black">
                <QrCode className="h-16 w-16" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">{t.tier}</div>
                <div className="font-display text-xl font-bold">{t.events?.title || "Unknown Event"}</div>
                <div className="text-sm text-muted-foreground">
                  {t.events?.date ? new Date(t.events.date).toDateString() : "No date"}
                </div>
                <code className="mt-2 inline-block rounded-md bg-secondary px-2 py-0.5 text-xs">{t.code}</code>
              </div>
            </div>
          ))
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No tickets found.</p>
            <Link to="/events" className="mt-4 text-primary hover:underline inline-block">Find a festival to attend →</Link>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Looking for more? <Link to="/events" className="text-primary hover:underline">Browse events →</Link>
      </div>
    </div>
  );
}
