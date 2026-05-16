import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Gift,
  Copy,
  Check,
  Share2,
  Users,
  Coins,
  Loader2,
  Link2,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMyReferralInfo, REFERRAL_REWARD_COINS } from "@/lib/wallet.functions";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const Route = createFileRoute("/_student/referrals")({
  head: () => ({
    meta: [
      { title: "Refer & Earn — WeFest" },
      { name: "description", content: "Invite friends and earn WeCoins together." },
    ],
  }),
  component: StudentReferrals,
});

const STEPS = [
  { title: "Share your code", desc: "Send your unique link to friends on campus." },
  { title: "Friend signs up", desc: "They create a student account with your code." },
  { title: "Both earn rewards", desc: `You each get ${REFERRAL_REWARD_COINS} WeCoins instantly.` },
];

function StudentReferrals() {
  const fetchReferralInfo = useServerFn(getMyReferralInfo);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const { data, isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: ["referral-info"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Please sign in again");
      return fetchReferralInfo({
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
    },
    retry: 1,
  });

  const referralCode = data?.referralCode ?? null;
  const signupUrl =
    typeof window !== "undefined" && referralCode
      ? `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`
      : "";

  const copyCode = async () => {
    if (!data?.referralCode) return;
    await navigator.clipboard.writeText(data.referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    if (!signupUrl) return;
    await navigator.clipboard.writeText(signupUrl);
    setLinkCopied(true);
    toast.success("Signup link copied!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareText = `Join me on WeFest — use my code ${referralCode} and we both get ${REFERRAL_REWARD_COINS} WeCoins! ${signupUrl}`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join WeFest", text: shareText, url: signupUrl });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="px-6 sm:px-8 py-8 max-w-[1100px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Gift className="h-7 w-7 text-primary" />
          Refer & Earn
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Invite friends to WeFest. When they sign up, you both earn {REFERRAL_REWARD_COINS} WeCoins.
        </p>
      </div>

      {/* Hero — referral code */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-primary/10 to-amber-500/10 p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your referral code</p>
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin mt-4 text-muted-foreground" />
          ) : isError ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-destructive">
                {(queryError as Error)?.message || "Could not load your referral code."}
              </p>
              <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : referralCode ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-3xl sm:text-4xl font-black tracking-wider font-mono">{referralCode}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="gap-2 rounded-xl border-white/15"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy code"}
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Generating your code… refresh the page in a moment.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={shareWhatsApp}
              disabled={!referralCode}
              className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={shareTwitter}
              disabled={!referralCode}
              className="gap-2 rounded-xl border-white/15"
            >
              <Share2 className="h-4 w-4" /> Share on X
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={shareNative}
              disabled={!referralCode}
              className="gap-2 rounded-xl border-white/15"
            >
              <Share2 className="h-4 w-4" /> Share link
            </Button>
          </div>

          {signupUrl && (
            <div className="mt-5 rounded-xl bg-background/50 border border-white/10 p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1 text-xs text-muted-foreground">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-mono">{signupUrl}</span>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={copyLink} className="shrink-0 gap-1.5 h-8">
                {linkCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {linkCopied ? "Copied" : "Copy link"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-lg font-bold mb-4">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 relative"
            >
              <span className="absolute top-4 right-4 text-4xl font-black text-white/5">{i + 1}</span>
              <h3 className="font-bold text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Friends referred"
          value={isLoading ? "—" : String(data?.totalReferrals ?? 0)}
          highlight={
            !isLoading && (data?.totalReferrals ?? 0) > 0
              ? `You've referred ${data!.totalReferrals} friend${data!.totalReferrals === 1 ? "" : "s"}!`
              : undefined
          }
        />
        <StatCard
          icon={Coins}
          label="Coins earned"
          value={isLoading ? "—" : (data?.totalCoinsEarned ?? 0).toLocaleString()}
        />
        <StatCard
          icon={Gift}
          label="Per referral"
          value={REFERRAL_REWARD_COINS.toLocaleString()}
          sub="WeCoins each"
        />
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-bold mb-3">Referral history</h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {isLoading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              Loading…
            </div>
          )}
          {!isLoading && (data?.referrals?.length ?? 0) === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No referrals yet. Share your code to start earning!
            </div>
          )}
          {!isLoading && (data?.referrals?.length ?? 0) > 0 && (
            <div className="divide-y divide-white/5">
              {data!.referrals.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{r.referredName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(r.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-500">+{r.rewardCoins.toLocaleString()}</p>
                    <p
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wider",
                        r.status === "credited" ? "text-emerald-500/70" : "text-amber-500/70"
                      )}
                    >
                      {r.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub?: string;
  highlight?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <Icon className="h-5 w-5 text-primary mb-3" />
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      {highlight && <p className="text-xs text-primary font-medium mt-2">{highlight}</p>}
    </div>
  );
}
