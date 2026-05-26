import { supabase } from "@/integrations/supabase/client";
import { REFERRAL_REWARD_COINS } from "@/lib/wallet.functions";

export type ProcessReferralResult = {
  processed: boolean;
  rewardCoins?: number;
  reason?: string;
};

/** Credit referrer + referred user via DB RPC (idempotent). */
export async function processReferralIfPending(opts: {
  userId: string;
  referralCode?: string | null;
  alreadyReferred?: boolean | null;
}): Promise<ProcessReferralResult> {
  const code = opts.referralCode?.trim().toUpperCase();
  if (!code) return { processed: false, reason: "no_code" };
  if (opts.alreadyReferred) return { processed: false, reason: "already_referred" };

  const { data, error } = await supabase.rpc("process_referral", {
    _referred_user_id: opts.userId,
    _referral_code: code,
  });

  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("ALREADY_REFERRED")) return { processed: false, reason: "already_referred" };
    if (msg.includes("SELF_REFERRAL")) return { processed: false, reason: "self_referral" };
    if (msg.includes("INVALID_REFERRAL")) return { processed: false, reason: "invalid_code" };
    if (msg.includes("process_referral") || msg.includes("Could not find")) {
      return { processed: false, reason: "migration_missing" };
    }
    throw new Error(msg);
  }

  const payload = data as { success?: boolean; reward_coins?: number } | null;
  if (!payload?.success) return { processed: false, reason: "unknown" };

  return {
    processed: true,
    rewardCoins: Number(payload.reward_coins ?? REFERRAL_REWARD_COINS),
  };
}

export function getReferralCodeFromUser(user: {
  user_metadata?: Record<string, unknown>;
} | null | undefined): string | undefined {
  const raw = user?.user_metadata?.referral_code;
  return typeof raw === "string" && raw.trim() ? raw.trim().toUpperCase() : undefined;
}

const SESSION_KEY = "wefest_referral_processed";

export function markReferralProcessed(userId: string) {
  try {
    sessionStorage.setItem(`${SESSION_KEY}_${userId}`, "1");
  } catch {
    /* ignore */
  }
}

export function wasReferralProcessedThisSession(userId: string): boolean {
  try {
    return sessionStorage.getItem(`${SESSION_KEY}_${userId}`) === "1";
  } catch {
    return false;
  }
}

/** Minimal student row so process_referral can set referred_by before dashboard loads. */
export async function ensureStudentProfileRow(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
}) {
  const { data: existing } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (existing) return;

  const collegeId = user.user_metadata?.college_id;
  await supabase.from("student_profiles").insert({
    id: user.id,
    full_name: (user.user_metadata?.full_name as string) || "",
    college_id: typeof collegeId === "string" && collegeId ? collegeId : null,
  });
}

/** Run after student login when signup included a referral code. */
export async function processReferralAfterLogin(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
}): Promise<ProcessReferralResult> {
  const code = getReferralCodeFromUser(user);
  if (!code || wasReferralProcessedThisSession(user.id)) {
    return { processed: false, reason: "no_code" };
  }

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("referred_by")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.referred_by) return { processed: false, reason: "already_referred" };

  await ensureStudentProfileRow(user);

  const result = await processReferralIfPending({
    userId: user.id,
    referralCode: code,
    alreadyReferred: !!profile?.referred_by,
  });

  if (result.processed) markReferralProcessed(user.id);
  return result;
}
