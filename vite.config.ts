import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  // Web builds use absolute root paths (unlike Capacitor which requires relative pathing)
  base: "/",

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
      // Drop-in server function compatibility shims for client-side web SPA execution
      { find: "@tanstack/react-start/server", replacement: path.resolve(__dirname, "src/lib/server-fn-shim-server.ts") },
      { find: "@tanstack/react-start", replacement: path.resolve(__dirname, "src/lib/server-fn-shim.ts") },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});
