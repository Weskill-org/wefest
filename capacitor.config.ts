import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.weskill.wefest",
  appName: "WeFest",
  webDir: "dist/mobile",
  server: {
    // Use https scheme for Autofill, secure cookies, and WebView security
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1a1025",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1a1025",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: true, // set to true for dev
  },
};

export default config;
