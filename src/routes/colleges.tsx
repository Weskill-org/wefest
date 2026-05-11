import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/colleges")({
  component: CollegesLayout,
});

function CollegesLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
