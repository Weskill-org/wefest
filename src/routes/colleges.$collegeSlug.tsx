
import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, School, MapPin, Globe, Calendar, Users, Trophy, ShieldCheck, ChevronRight, Edit3, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/colleges/$collegeSlug")({
  component: CollegeDetailPage,
});

function CollegeDetailPage() {
  const { collegeSlug } = useParams({ from: "/colleges/$collegeSlug" });

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: adminData } = useQuery({
    queryKey: ["check-admin-status", currentUser?.id],
    enabled: !!currentUser,
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_users")
        .select("rank")
        .eq("user_id", currentUser!.id)
        .single();
      return data;
    }
  });

  const queryClient = useQueryClient();

  const { data: college, isLoading } = useQuery({
    queryKey: ["college-detail", collegeSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select(`
          *,
          events (*)
        `)
        .eq("slug", collegeSlug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: "approved" | "rejected") => {
      if (!college) return;
      const { error } = await supabase
        .from("colleges")
        .update({ status, approved_by: currentUser?.id })
        .eq("id", college.id);
      if (error) throw error;
      
      await supabase.rpc('log_activity', {
        _type: 'college_status_updated',
        _title: status === 'approved' ? 'College Approved' : 'College Rejected',
        _description: `College ${college.name} updated to ${status}`,
        _metadata: { college_id: college.id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-detail", collegeSlug] });
      toast.success("College status updated");
    },
    onError: (error: any) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!college) return;
      const { error } = await supabase.from("colleges").delete().eq("id", college.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("College deleted");
      // navigate to /colleges
    },
    onError: (error: any) => toast.error(error.message)
  });

  const isAdmin = !!adminData;
  const canApprove = adminData?.rank && ["Organizer", "Admin", "Superadmin"].includes(adminData.rank);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <School className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold">College not found</h1>
        <Link to="/colleges" className="mt-6 inline-block text-primary hover:underline">
          Back to all colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white shadow-2xl md:p-12">
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            {college.status === 'approved' ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" /> Verified Institution
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1 text-sm font-bold backdrop-blur-md text-amber-200">
                <Clock className="h-4 w-4" /> Verification Pending
              </div>
            )}
            <h1 className="font-display text-4xl font-black md:text-6xl">{college.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {college.city}
              </span>
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> {college.domain}
              </span>
              <span className="flex items-center gap-2 text-white font-bold">
                <Trophy className="h-4 w-4 text-yellow-400" /> {college.fests} Festivals Hosted
              </span>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-white/20 text-white gap-2">
                <Edit3 className="h-4 w-4" /> Edit Profile
              </Button>
              {canApprove && college.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                    onClick={() => updateStatusMutation.mutate('approved')}
                    disabled={updateStatusMutation.isPending}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="gap-2"
                    onClick={() => updateStatusMutation.mutate('rejected')}
                    disabled={updateStatusMutation.isPending}
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </>
              )}
              <Button 
                size="sm" 
                variant="destructive" 
                className="bg-red-500/20 hover:bg-red-500/40 text-red-100 border-red-500/20 gap-2"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this college?")) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>
        
        {/* Background Decorations */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main Content: Events */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Hosted Festivals</h2>
            <p className="text-muted-foreground mt-2">Explore events organized by {college.name}.</p>
          </div>

          <div className="grid gap-6">
            {college.events && college.events.length > 0 ? (
              college.events.map((event: any) => (
                <Link
                  key={event.id}
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="glass group flex flex-col overflow-hidden rounded-2xl border-border/40 transition-all hover:scale-[1.02] hover:border-primary/40 md:flex-row"
                >
                  <div className={cn(
                    "h-48 w-full shrink-0 md:h-auto md:w-48 bg-gradient-to-br",
                    event.cover || "from-fuchsia-500 to-indigo-700"
                  )} />
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {event.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" /> {event.attendees} interested
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {event.city}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-3xl border border-dashed border-border/60">
                <Calendar className="h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-bold">No active festivals</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-1">This college hasn't listed any upcoming festivals yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Stats & Info */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl font-bold">Institutional Stats</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Rank</span>
                </div>
                <span className="font-bold">#4 Region</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Network</span>
                </div>
                <span className="font-bold">4.2k+ Students</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                  {college.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl font-bold">About the Institution</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {college.name} is a premier educational institution located in {college.city}. 
              Known for its vibrant campus life and excellence in fests, it has become a cornerstone of our festival network.
            </p>
            <Button variant="outline" className="mt-6 w-full rounded-2xl border-primary/20 text-primary hover:bg-primary/5">
              Visit Official Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
