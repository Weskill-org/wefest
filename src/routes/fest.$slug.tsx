import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Ticket as TicketIcon,
  Loader2,
  Sparkles,
  TrendingUp,
  Clock,
  BadgeCheck,
  Share2,
  Heart,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useRegion } from "@/contexts/RegionContext";
import { ShareEventDialog } from "@/components/events/share-event-dialog";
import { StudentAppLayout } from "@/components/layout/StudentAppLayout";

export const Route = createFileRoute("/fest/$slug")({
  loader: async ({ params }) => {
    console.log("[Loader] Fetching event for slug:", params.slug);
    try {
      const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();

      if (error) {
        console.error("[Loader] Supabase error:", error);
        throw error;
      }
      
      if (!event) {
        console.warn("[Loader] Event not found for slug:", params.slug);
        throw notFound();
      }
      
      console.log("[Loader] Successfully fetched event:", event.title);
      return event;
    } catch (err) {
      console.error("[Loader] Catch-all error:", err);
      throw err;
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — WeFest` : "Event — WeFest" },
      { name: "description", content: loaderData?.description ?? "Festival event on WeFest — India's college festival platform." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{(error as any).message}</p>
      <Link to="/fest" className="mt-4 text-primary hover:underline inline-block">
        Return to festivals
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mx-auto mb-5">
        <Calendar className="h-10 w-10 text-muted-foreground/40" />
      </div>
      <h1 className="text-2xl font-bold">Event not found</h1>
      <p className="mt-2 text-muted-foreground">This event may have been removed or doesn't exist.</p>
      <Link to="/fest" className="mt-4 text-primary hover:underline inline-block">
        Browse all fests
      </Link>
    </div>
  ),
  component: FullEventDetail,
});

function FullEventDetail() {
  const event = Route.useLoaderData();
  const navigate = useNavigate();
  const { formatPrice } = useRegion();
  const queryClient = useQueryClient();

  // Auth & Profile
  const { data: authData } = useQuery({
    queryKey: ["current-auth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("*, colleges(*)")
        .eq("id", user.id)
        .maybeSingle();
      return { user, profile };
    }
  });

  const currentUser = authData?.user;
  const profile = authData?.profile;

  const { data: hasTicket } = useQuery({
    queryKey: ["has-ticket", event.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("tickets")
        .select("id")
        .eq("event_id", event.id)
        .eq("user_id", currentUser!.id);
      return (data?.length || 0) > 0;
    },
  });

  const referralCode = profile?.referral_code;

  const tiers = useMemo(() => {
    const settings = (event as any).pass_settings;
    if (!settings) {
      return [
        { name: "Day Pass", price: 499, perks: ["Single day access", "All open events"] },
        { name: "Pro Pass", price: 1499, perks: ["All days", "Priority entry", "Pro shows"] },
        { name: "VIP", price: 3999, perks: ["All access", "Backstage tour", "Merch kit"] },
      ];
    }

    const result = [];
    if (settings.normal?.enabled) {
      result.push({
        name: "Normal Pass",
        price: settings.normal.price,
        perks: [
          `${settings.normal.days} Day(s) access`,
          "All open events",
          `Single day: ₹${settings.normal.single_day_price}`,
        ],
      });
    }
    if (settings.vip?.enabled) {
      result.push({
        name: "VIP Pass",
        price: settings.vip.price,
        perks: [
          "Priority Entry",
          "Backstage Access",
          "VIP Lounge",
          `Multi-day: ₹${settings.vip.multi_day_price}`,
        ],
      });
    }
    return result.length > 0 ? result : [
      { name: "General Entry", price: event.price_from || 0, perks: ["Standard access"] },
    ];
  }, [event]);

  const [selected, setSelected] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  const buyMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        navigate({ to: "/signup" });
        throw new Error("redirect");
      }
      const ticketCode = `${event.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const { error } = await supabase.from("tickets").insert({
        user_id: currentUser.id,
        event_id: event.id,
        tier: tiers[selected].name,
        code: ticketCode,
      });
      if (error) throw error;
      return { tier: tiers[selected].name, code: ticketCode };
    },
    onSuccess: (data) => {
      toast.success(`Success! ${data.tier} booked. Your code: ${data.code}`);
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["has-ticket", event.id] });
    },
    onError: (error: any) => {
      if (error.message === "redirect") return;
      toast.error(error.message || "Failed to book ticket");
    },
  });

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const subEvents = [
    "Headliner Concert",
    "Battle of Bands",
    "Stand-up Night",
    "Dance Showdown",
    "Hackathon",
    "Esports Arena",
  ];

  const PageUI = (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold">{event.title}</h1>
      <p className="mt-4">{event.description}</p>
      <pre className="mt-8 p-4 bg-muted rounded">{JSON.stringify(event, null, 2)}</pre>
    </div>
  );

  if (currentUser) {
    return (
      <StudentAppLayout user={currentUser} profile={profile}>
        {PageUI}
      </StudentAppLayout>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {PageUI}
    </div>
  );
}
