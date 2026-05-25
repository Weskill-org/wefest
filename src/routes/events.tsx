import React from "react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuthSession } from "@/lib/auth";

function EventsLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute("/events")({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    const session = await getAuthSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname + location.searchStr },
      });
    }
  },
  component: EventsLayout,
});
