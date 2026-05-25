import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuthSession } from "@/lib/auth";

export const Route = createFileRoute("/fest")({
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
  component: () => <Outlet />,
});
