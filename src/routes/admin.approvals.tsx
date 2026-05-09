import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, School, CalendarCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/approvals")({
  component: AdminApprovals,
});

function AdminApprovals() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-approvals-counts"],
    queryFn: async () => {
      const [colleges, companies, events] = await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("company_profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      return {
        colleges: colleges.count ?? 0,
        companies: companies.count ?? 0,
        events: events.count ?? 0,
      };
    },
  });

  if (isLoading) {
    return <div className="flex h-60 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const cards = [
    { to: "/admin/colleges", label: "Colleges", icon: School, count: data?.colleges ?? 0, desc: "New college applications waiting for verification." },
    { to: "/admin/companies", label: "Companies", icon: Building2, count: data?.companies ?? 0, desc: "Sponsor & brand accounts awaiting approval." },
    { to: "/admin/events", label: "Fests & Events", icon: CalendarCheck, count: data?.events ?? 0, desc: "Events submitted by organizers pending review." },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Pending Approvals</h1>
      <p className="text-muted-foreground">All items waiting on your decision in one place.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="glass rounded-2xl p-6 hover:border-primary/40 transition group">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center text-primary"><c.icon className="h-5 w-5" /></div>
              <div className="text-3xl font-display font-black">{c.count}</div>
            </div>
            <div className="mt-4 font-semibold flex items-center gap-2">{c.label} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" /></div>
            <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
