import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_student/explore/$eventId")({
  loader: async ({ params }) => {
    // Attempt to find the event and its slug
    const { data: event } = await supabase
      .from("events")
      .select("slug")
      .eq("id", params.eventId)
      .maybeSingle();

    if (event?.slug) {
      // Redirect to the new slug-based public URL
      throw redirect({
        to: "/fest/$slug",
        params: { slug: event.slug },
        replace: true,
      });
    }

    // Fallback: If no slug exists (unlikely after migration), we might still want to show the event
    // but the user wants to replace it. For now, redirect to explore or a public events page.
    throw redirect({ to: "/fest" });
  },
});
