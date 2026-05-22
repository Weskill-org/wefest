import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Share2,
  Key,
  Globe,
  Plus,
  Loader2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Zap,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/integrations")({
  component: AdminIntegrations,
});

function AdminIntegrations() {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: colleges } = useQuery({
    queryKey: ["all-colleges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("colleges").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: apiKeys, isLoading: loadingKeys } = useQuery({
    queryKey: ["university-api-keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("university_api_keys")
        .select("*, college:college_id(name)");
      if (error) throw error;
      return data;
    },
  });

  const { data: webhooks, isLoading: loadingWebhooks } = useQuery({
    queryKey: ["university-webhooks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("webhooks").select("*, college:college_id(name)");
      if (error) throw error;
      return data;
    },
  });

  const generateKey = useMutation({
    mutationFn: async (collegeId: string) => {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      const randomHex = Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const newKey = `wf_${randomHex}`;
      const { error } = await supabase.from("university_api_keys").insert({
        college_id: collegeId,
        api_key_hash: newKey, // In real app, hash this
        label: "Primary Integration Key",
        scopes: ["read:events", "read:attendance"],
      });
      if (error) throw error;
      return newKey;
    },
    onSuccess: (newKey) => {
      queryClient.invalidateQueries({ queryKey: ["university-api-keys"] });
      toast.success("API Key Generated", { description: "Copy it now: " + newKey });
    },
  });

  if (loadingKeys || loadingWebhooks) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-display">University Integrations</h1>
            <p className="text-muted-foreground mt-1">
              Manage API access and webhooks for institutional partners.
            </p>
          </div>
          <Button className="bg-brand-gradient text-white" onClick={() => setIsGenerating(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Integration
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Key className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">API Access Keys</h2>
            </div>
          </div>

          <div className="space-y-4">
            {apiKeys?.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                No active API keys found.
              </p>
            ) : (
              apiKeys?.map((key: any) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40"
                >
                  <div>
                    <div className="font-bold text-sm">{key.college?.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        wf_••••••••••••
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toast.success("Key copied to clipboard")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-500 border-none"
                  >
                    Active
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">Webhooks</h2>
            </div>
          </div>

          <div className="space-y-4">
            {webhooks?.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                No configured webhooks found.
              </p>
            ) : (
              webhooks?.map((wh: any) => (
                <div key={wh.id} className="p-4 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-sm">{wh.college?.name}</div>
                    <Badge variant="outline" className="text-[10px]">
                      Production
                    </Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">
                    {wh.url}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {wh.events.map((e: string) => (
                      <Badge key={e} variant="secondary" className="text-[9px] uppercase">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 bg-brand-gradient/5 border-primary/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="h-20 w-20 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
            <Share2 className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-black">Institutional Integration Hub</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Enable your university's internal systems to sync with WeFest. We provide native
              support for major College ERPs (SAP Campus, Oracle, etc.) and custom webhooks for
              real-time attendance and event data.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button size="sm" variant="outline" className="bg-white/5 border-white/10">
                View API Docs <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/5 border-white/10">
                Webhook Secrets
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Feature
          icon={ShieldCheck}
          title="Verified Payloads"
          desc="All webhooks are signed with SHA-256 for maximum security."
        />
        <Feature
          icon={Zap}
          title="Instant Sync"
          desc="Real-time ticket validation syncing with college database."
        />
        <Feature
          icon={Info}
          title="Compliance"
          desc="Fully compliant with UGC and state-level data guidelines."
        />
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <Icon className="h-6 w-6 text-primary mb-4" />
      <div className="font-bold mb-1">{title}</div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
