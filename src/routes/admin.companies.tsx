import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, Check, X, Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/companies")({
  component: AdminCompanies,
});

function AdminCompanies() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*, profile:profiles!company_profiles_user_id_fkey(email, full_name)")
        .order("created_at", { ascending: false });
      if (error) {
        // fallback without join
        const { data: d2, error: e2 } = await supabase.from("company_profiles").select("*").order("created_at", { ascending: false });
        if (e2) throw e2;
        return d2 as any[];
      }
      return data as any[];
    },
  });

  const decide = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: "approved" | "rejected"; reason?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("company_profiles")
        .update({
          status,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason ?? null,
        })
        .eq("id", id);
      if (error) throw error;
      await supabase.from("audit_logs").insert({
        admin_user_id: user!.id,
        action: `company_${status}`,
        resource_type: "company_profile",
        resource_id: id,
        details: { reason: reason ?? null },
      });
    },
    onSuccess: () => {
      toast.success("Company status updated");
      qc.invalidateQueries({ queryKey: ["admin-companies"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = companies?.filter((c: any) => {
    if (filter !== "all" && c.status !== filter) return false;
    const q = search.toLowerCase();
    return !q || c.company_name?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold">Company Approvals</h1>
          <p className="text-muted-foreground">Review and approve sponsor / brand accounts.</p>
        </div>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies…" className="pl-9 max-w-md" />
      </div>

      <div className="mt-6 grid gap-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered?.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No companies found.</div>
        ) : (
          filtered?.map((c: any) => (
            <div key={c.id} className="glass rounded-2xl p-5 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-semibold">{c.company_name}</div>
                  <Badge variant={c.status === "approved" ? "default" : c.status === "rejected" ? "destructive" : "secondary"} className="capitalize">{c.status}</Badge>
                  {c.industry && <span className="text-xs text-muted-foreground">· {c.industry}</span>}
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                  {c.profile?.email && <span>{c.profile.email}</span>}
                  {c.website_url && <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Globe className="h-3 w-3" />{c.website_url}</a>}
                  <span>Applied {new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                {c.rejection_reason && <div className="mt-2 text-xs text-destructive">Reason: {c.rejection_reason}</div>}
              </div>
              {c.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => decide.mutate({ id: c.id, status: "approved" })} disabled={decide.isPending}>
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => {
                    const r = window.prompt("Rejection reason?") || "Not eligible";
                    decide.mutate({ id: c.id, status: "rejected", reason: r });
                  }} disabled={decide.isPending}>
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
