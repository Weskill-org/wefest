import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "../router";
import { RegionProvider } from "@/contexts/RegionContext";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the festival crowd</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "WeFest — The digital backbone of college festivals" },
      { name: "description", content: "Host, manage, sponsor, and ticket college festivals on India's first college-native event ecosystem." },
      { property: "og:title", content: "WeFest — The digital backbone of college festivals" },
      { property: "og:description", content: "Host, manage, sponsor, and ticket college festivals on India's first college-native event ecosystem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "WeFest — The digital backbone of college festivals" },
      { name: "twitter:description", content: "Host, manage, sponsor, and ticket college festivals on India's first college-native event ecosystem." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c59fe210-a7d1-4b78-b701-d17ab3e930d5/id-preview-132cb495--272cb781-a3b7-42b3-b429-7a4083e42d44.lovable.app-1778076928123.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c59fe210-a7d1-4b78-b701-d17ab3e930d5/id-preview-132cb495--272cb781-a3b7-42b3-b429-7a4083e42d44.lovable.app-1778076928123.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isOrganizerRoute = pathname.startsWith("/organizer");

  return (
    <QueryClientProvider client={queryClient}>
      <RegionProvider>
        <div className="flex min-h-screen flex-col">
          <GlobalBroadcasts />
          {!isOrganizerRoute && <SiteHeader />}
          <main className="flex-1">
            <Outlet />
          </main>
          {!isOrganizerRoute && <SiteFooter />}
          <Toaster />
        </div>
      </RegionProvider>
    </QueryClientProvider>
  );
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Info } from "lucide-react";

function GlobalBroadcasts() {
  const { data: broadcasts } = useQuery({
    queryKey: ["global-broadcasts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("broadcast_messages").select("*").eq("active", true).order("created_at", { ascending: false });
      if (error && error.code !== "42P01") throw error; // Ignore if table missing initially
      return data || [];
    },
    refetchInterval: 60000 // Refetch every minute
  });

  if (!broadcasts || broadcasts.length === 0) return null;

  return (
    <div className="w-full">
      {broadcasts.map(b => (
        <div key={b.id} className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-white ${b.severity === 'emergency' ? 'bg-red-600' : b.severity === 'warning' ? 'bg-amber-600' : 'bg-blue-600'}`}>
          {b.severity === 'emergency' || b.severity === 'warning' ? <AlertTriangle className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
          {b.message}
        </div>
      ))}
    </div>
  );
}
