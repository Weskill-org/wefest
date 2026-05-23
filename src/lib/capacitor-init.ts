/**
 * Capacitor native plugin initialisation.
 *
 * Called once from `main.tsx` after React mounts. Sets up:
 *  - Status bar styling
 *  - Keyboard behaviour
 *  - Splash screen dismissal
 *  - Hardware back-button handling
 *  - Deep-link listener
 *  - App-state change (resume → refresh auth)
 */

import { isNativePlatform } from "./capacitor-platform";
import { supabase } from "@/integrations/supabase/client";

import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard } from "@capacitor/keyboard";
import { App } from "@capacitor/app";

// ---------------------------------------------------------------------------
// Main init
// ---------------------------------------------------------------------------

export async function initCapacitorPlugins(
  navigateFn?: (path: string) => void,
): Promise<void> {
  if (!isNativePlatform()) return;

  // Add native platform styling identifiers to lock document layout
  document.documentElement.classList.add("capacitor-app");
  document.body.classList.add("capacitor-app");

  try {

    // ---- Status Bar ----
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#1a1025" });

    // ---- Keyboard ----
    try {
      await Keyboard.setAccessoryBarVisible({ isVisible: false });
      await Keyboard.setScroll({ isDisabled: false });
    } catch {
      // Keyboard plugin may not support all methods on every platform
    }

    // ---- Splash Screen ----
    // Hide after a small delay to let the first paint settle
    setTimeout(() => {
      SplashScreen.hide({ fadeOutDuration: 300 });
    }, 400);

    // ---- Back Button (Android) ----
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.minimizeApp();
      }
    });

    // ---- Deep Links ----
    App.addListener("appUrlOpen", ({ url }) => {
      try {
        const parsed = new URL(url);
        const path = parsed.pathname + parsed.search + parsed.hash;
        if (navigateFn) {
          navigateFn(path);
        } else {
          window.location.hash = path;
        }
      } catch (e) {
        console.warn("[capacitor-init] Failed to parse deep link:", url, e);
      }
    });

    // ---- App State Change ----
    // Refresh the Supabase auth token when the app resumes from background
    App.addListener("appStateChange", async ({ isActive }) => {
      if (isActive) {
        try {
          await supabase.auth.getSession(); // triggers token refresh if needed
        } catch (e) {
          console.warn("[capacitor-init] Session refresh on resume failed:", e);
        }
      }
    });

    console.log("[capacitor-init] Native plugins initialised ✓");
  } catch (err) {
    console.error("[capacitor-init] Plugin initialisation failed:", err);
  }
}
