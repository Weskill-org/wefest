/**
 * Capacitor platform detection utilities.
 *
 * Provides helpers to distinguish native (Android/iOS) from web environments,
 * resolve the API base URL for server-function calls, and gather device info.
 */

import { Capacitor } from "@capacitor/core";

// ---------------------------------------------------------------------------
// Platform checks
// ---------------------------------------------------------------------------

/** True when running inside a Capacitor native shell (Android / iOS). */
export function isNativePlatform(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isAndroid(): boolean {
  try {
    return Capacitor.getPlatform() === "android";
  } catch {
    return false;
  }
}

export function isIOS(): boolean {
  try {
    return Capacitor.getPlatform() === "ios";
  } catch {
    return false;
  }
}

export function isWeb(): boolean {
  try {
    return Capacitor.getPlatform() === "web";
  } catch {
    return true; // default to web if Capacitor is not available
  }
}

// ---------------------------------------------------------------------------
// API base URL
// ---------------------------------------------------------------------------

/**
 * The deployed WeFest backend.
 *
 * On the web the app is served from the same origin, so relative URLs work.
 * On native the WebView runs from `capacitor://localhost` so we need an
 * absolute URL to the production server.
 */
const PRODUCTION_API_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "https://wefest.weskill.org";

export function getApiBaseUrl(): string {
  return isNativePlatform() ? PRODUCTION_API_URL : "";
}

export function getAuthRedirectUrl(path: string = "/"): string {
  const base = isNativePlatform()
    ? PRODUCTION_API_URL
    : (typeof window !== "undefined" ? window.location.origin : "");
  
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${formattedPath}`;
}

// ---------------------------------------------------------------------------
// Device info (lightweight, no extra plugin needed)
// ---------------------------------------------------------------------------

export interface PlatformInfo {
  platform: "android" | "ios" | "web";
  isNative: boolean;
  userAgent: string;
}

export function getPlatformInfo(): PlatformInfo {
  return {
    platform: Capacitor.getPlatform() as PlatformInfo["platform"],
    isNative: isNativePlatform(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
}
