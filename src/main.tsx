/**
 * Mobile SPA entry point.
 *
 * This file is only used by the Capacitor mobile build (vite.config.mobile.ts).
 * The SSR web build uses TanStack Start's own entry (`start.ts` / `__root.tsx`).
 *
 * It bootstraps React, the TanStack Router (client-only), TanStack Query,
 * and initialises Capacitor native plugins.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { getRouter, queryClient } from "./router";
import { initCapacitorPlugins } from "./lib/capacitor-init";

// Import global styles
import "./styles.css";

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const router = getRouter();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

// Global error handler for debugging the white screen on Capacitor
window.addEventListener("error", (event) => {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace; word-break: break-all;">
        <h3>App Startup Error</h3>
        <p><strong>Message:</strong> ${event.message}</p>
        <p><strong>Filename:</strong> ${event.filename}:${event.lineno}</p>
        <pre style="font-size: 10px; overflow-x: auto;">${event.error?.stack || 'No stack trace'}</pre>
      </div>
    `;
  }
});

// Mount and then kick off Capacitor plugin init
const rootEl = document.getElementById("root");
if (rootEl) {
  try {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    // Initialise native plugins after first paint
    requestAnimationFrame(() => {
      initCapacitorPlugins((path) => {
        router.navigate({ to: path });
      });
    });
  } catch (err: any) {
    rootEl.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace; word-break: break-all;">
        <h3>Render Error</h3>
        <p>${err.message}</p>
        <pre style="font-size: 10px;">${err.stack}</pre>
      </div>
    `;
  }
}
