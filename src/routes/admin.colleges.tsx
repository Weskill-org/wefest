
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, School, CheckCircle2, XCircle, Clock, Search, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/colleges")({
  component: AdminColleges,
});

type College = {
  id: string;
  name: string;
  slug: string;
  city: string;
  domain: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function AdminColleges() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: colleges, isLoading } = useQuery({
    queryKey: ["admin-colleges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as College[];
    },
  });

  const { data: adminData } = useQuery({
    queryKey: ["check-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("admin_users")
        .select("rank")
        .eq("user_id", user.id)
        .single();
      return data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("colleges")
        .update({ 
          status, 
          approved_by: user?.id 
        })
        .eq("id", id);
      
      if (error) throw error;

      // Log activity manually if needed, but we have triggers for some things.
      // For colleges, let's log it here or via trigger.
      // Let's assume we add a trigger for colleges too later, but for now log here.
      await supabase.rpc('log_activity', {
        _type: 'college_status_updated',
        _title: status === 'approved' ? 'College Approved' : 'College Rejected',
        _description: `College status updated to ${status}`,
        _metadata: { college_id: id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-colleges"] });
      toast.success("College status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const filteredColleges = colleges?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const canApprove = adminData?.rank && ["Organizer", "Admin", "Superadmin"].includes(adminData.rank);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Colleges</h1>
          <p className="text-muted-foreground mt-1">Manage institutional approvals and registrations.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search colleges by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredColleges?.map((college) => (
          <div key={college.id} className="glass group relative overflow-hidden rounded-2xl p-6 transition-all hover:bg-muted/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <School className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{college.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {college.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {college.domain}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(college.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                  college.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                  college.status === "rejected" ? "bg-destructive/10 text-destructive" :
                  "bg-amber-500/10 text-amber-500"
                )}>
                  {college.status === "approved" && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {college.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                  {college.status === "pending" && <Clock className="h-3.5 w-3.5" />}
                  {college.status}
                </div>

                {canApprove && college.status !== "approved" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => approveMutation.mutate({ id: college.id, status: "approved" })}
                    disabled={approveMutation.isPending}
                  >
                    Approve
                  </Button>
                )}
                
                {canApprove && college.status === "pending" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => approveMutation.mutate({ id: college.id, status: "rejected" })}
                    disabled={approveMutation.isPending}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 transition-all group-hover:opacity-100" />
          </div>
        ))}

        {filteredColleges?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <School className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold">No colleges found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
