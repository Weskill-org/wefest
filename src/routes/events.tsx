import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

function EventsLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute("/events")({
  component: EventsLayout,
});
