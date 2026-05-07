import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "../router";

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
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
