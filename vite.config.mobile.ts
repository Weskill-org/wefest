/**
 * Vite configuration for the **mobile SPA** build.
 *
 * This config produces a plain client-side React SPA in `dist/mobile/`
 * that Capacitor bundles into the Android (and iOS) native shells.
 *
 * It deliberately does NOT use TanStack Start or Nitro — those are SSR-only
 * concerns handled by the default `vite.config.ts` for the Vercel deployment.
 *
 * Usage:
 *   npm run build:mobile   →   vite build --config vite.config.mobile.ts
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  // Capacitor loads from file:// so all asset URLs must be relative
  base: "./",

  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],

  resolve: {
    alias: [
      // IMPORTANT: more specific sub-path MUST come first
      { find: "@tanstack/react-start/server", replacement: path.resolve(__dirname, "src/lib/server-fn-shim-server.ts") },
      { find: "@tanstack/react-start", replacement: path.resolve(__dirname, "src/lib/server-fn-shim.ts") },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },

  build: {
    outDir: "dist/mobile",
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        manualChunks(id: string) {
          if (id.includes("blog-data")) {
            return "blog-data";
          }
          // Vendor chunks for better caching and smaller initial load
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            if (id.includes("@tanstack/react-router")) return "vendor-router";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("recharts") || id.includes("d3")) return "vendor-charts";
            if (id.includes("@capacitor")) return "vendor-capacitor";
            if (id.includes("zod") || id.includes("react-hook-form") || id.includes("@hookform")) return "vendor-forms";
            // Group other node_modules into a shared vendor chunk to avoid leaking into route chunks
            return "vendor-libs";
          }

          // Shims to break circular dependency between shared-supabase and shared-utils
          if (id.includes("server-fn-shim")) {
            return "shared-shims";
          }

          // Group shared source code files into dedicated chunks to avoid circular dependencies
          if (id.includes("/components/ui/")) {
            return "shared-ui";
          }
          if (id.includes("/components/")) {
            return "shared-components";
          }
          if (id.includes("/integrations/supabase/")) {
            return "shared-supabase";
          }
          if (id.includes("/lib/") || id.includes("/hooks/") || id.includes("/contexts/")) {
            return "shared-utils";
          }

          // Split large route files into separate chunks
          if (id.includes("/routes/admin.") && !id.endsWith("/admin.tsx")) return "routes-admin";
          if (id.includes("/routes/organizer.") && !id.endsWith("/organizer.tsx")) return "routes-organizer";
          if (id.includes("/routes/company.") && !id.endsWith("/company.tsx")) return "routes-company";
          if (id.includes("/routes/_student.") && !id.endsWith("/_student.tsx")) return "routes-student";
        }
      },
    },
  },

  // Replace process.env references that leak from SSR-shared code
  define: {
    "process.env.SUPABASE_URL": JSON.stringify(""),
    "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(""),
    "process.env.SUPABASE_SERVICE_ROLE_KEY": JSON.stringify(""),
    "process.env.VITE_SUPABASE_URL": JSON.stringify(""),
    "process.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(""),
    "process.env.VITE_SUPABASE_SERVICE_ROLE_KEY": JSON.stringify(""),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },

  // Make VITE_* env vars available at build time
  envPrefix: "VITE_",
});
