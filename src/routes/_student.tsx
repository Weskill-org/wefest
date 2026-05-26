import { createFileRoute, Outlet, redirect, Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getAuthSession } from "@/lib/auth";
import { 
  LayoutDashboard, CalendarRange, Ticket, Users, 
  ShoppingBag, Settings, Menu, X, LogOut, 
  ChevronLeft, ChevronRight, GraduationCap, Sparkles, Coins,
  Bell, Image as ImageIcon, Award, BellRing, Gift, UsersRound
} from "lucide-react";
import {
  getReferralCodeFromUser,
  markReferralProcessed,
  processReferralIfPending,
  wasReferralProcessedThisSession,
} from "@/lib/referral";
import { REFERRAL_REWARD_COINS } from "@/lib/wallet.functions";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ActivityFeedPopover } from "@/components/activity-feed-popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentAppLayout } from "@/components/layout/StudentAppLayout";
import { PreferenceOnboarding } from "@/components/PreferenceOnboarding";

export const Route = createFileRoute("/_student")({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    const session = await getAuthSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname + location.searchStr },
      });
    }

    if (session.role !== "student") {
      throw redirect({ to: "/" });
    }

    const currentUser = session.user;

    // Fetch student profile to get college details
    let profile = null;
    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select(`
          *,
          colleges (id, name)
        `)
        .eq("id", currentUser.id)
        .maybeSingle();
      
      if (!data) {
        // Auto-create profile if missing, syncing from signup metadata
        const { data: newProfile, error: insertError } = await supabase
          .from("student_profiles")
          .insert({
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || "",
            college_id: currentUser.user_metadata?.college_id || null,
          })
          .select(`*, colleges (id, name)`)
          .single();
        
        if (!insertError) {
          profile = newProfile;
          if (!newProfile?.referral_code) {
            const { data: code } = await supabase.rpc("ensure_student_referral_code", {
              _user_id: currentUser.id,
            });
            if (code) {
              profile = { ...newProfile, referral_code: code };
            }
          }
        }
      } else {
        profile = data;
        if (profile && !profile.referral_code) {
          const { data: code } = await supabase.rpc("ensure_student_referral_code", {
            _user_id: currentUser.id,
          });
          if (code) profile = { ...profile, referral_code: code };
        }
      }

      const referralCode = getReferralCodeFromUser(currentUser);
      if (
        referralCode &&
        !profile?.referred_by &&
        !wasReferralProcessedThisSession(currentUser.id)
      ) {
        try {
          const result = await processReferralIfPending({
            userId: currentUser.id,
            referralCode,
            alreadyReferred: !!profile?.referred_by,
          });
          if (result.processed) {
            markReferralProcessed(currentUser.id);
            const { data: refreshed } = await supabase
              .from("student_profiles")
              .select(`*, colleges (id, name)`)
              .eq("id", currentUser.id)
              .maybeSingle();
            if (refreshed) profile = refreshed;
          } else if (result.reason === "migration_missing") {
            console.error("Referral RPC missing — apply Supabase migrations.");
          }
        } catch (refErr) {
          console.error("Referral processing failed:", refErr);
        }
      }
    } catch (e) {
      console.error("Error syncing student profile:", e);
    }

    return {
      user: currentUser,
      profile
    };
  },
  component: StudentLayout,
});

const navLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/fest", label: "Festivals", icon: CalendarRange, exact: false },
  { to: "/tickets", label: "My Tickets", icon: Ticket, exact: false },
  { to: "/social", label: "Campus Network", icon: Users, exact: false },
  { to: "/shop", label: "Campus Store", icon: ShoppingBag, exact: false },
  { to: "/wallet", label: "WeCoin Wallet", icon: Coins, exact: false },
  { to: "/referrals", label: "Refer & Earn", icon: Gift, exact: false },
  { to: "/activity", label: "Activity Feed", icon: Bell, exact: false },
  { to: "/memories", label: "Memories", icon: ImageIcon, exact: false },
  { to: "/certifications", label: "Certifications", icon: Award, exact: false },
  { to: "/committees", label: "Committees", icon: UsersRound, exact: false },
  { to: "/alerts", label: "Alerts", icon: BellRing, exact: false, badge: true },
];


function StudentLayout() {
  const ctx = Route.useRouteContext() as any;
  const user = ctx?.user as any;
  const profile = ctx?.profile as any;
  const queryClient = useQueryClient();
  const referralAttempted = useRef(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show preference onboarding when interests have never been set
  useEffect(() => {
    if (profile && profile.interests === null) {
      setShowOnboarding(true);
    }
  }, [profile]);

  useEffect(() => {
    if (!user?.id || referralAttempted.current) return;
    const code = getReferralCodeFromUser(user);
    if (!code || profile?.referred_by || wasReferralProcessedThisSession(user.id)) return;

    referralAttempted.current = true;

    (async () => {
      try {
        const result = await processReferralIfPending({
          userId: user.id,
          referralCode: code,
          alreadyReferred: !!profile?.referred_by,
        });
        if (result.processed) {
          markReferralProcessed(user.id);
          toast.success(
            `Referral bonus! ${(result.rewardCoins ?? REFERRAL_REWARD_COINS).toLocaleString()} WeCoins added to your wallet.`
          );
          queryClient.invalidateQueries({ queryKey: ["wallet"] });
          queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
          queryClient.invalidateQueries({ queryKey: ["referral-info"] });
        }
      } catch (e) {
        console.error("Referral bonus failed:", e);
        referralAttempted.current = false;
      }
    })();
  }, [user?.id, profile?.referred_by, queryClient]);

  return (
    <StudentAppLayout user={user} profile={profile}>
      <Outlet />
      {showOnboarding && user?.id && (
        <PreferenceOnboarding
          userId={user.id}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
    </StudentAppLayout>
  );
}

