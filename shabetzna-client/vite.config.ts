import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import vercel from "vite-plugin-vercel";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["logo512x512.png"],
  manifest: {
    name: "שבץנא",
    short_name: "שבץנא",
    description: 'שבץנא - השבצ"ק המבצעי האוטומטי',
    icons: [
      {
        src: "/logo512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercel(), VitePWA(manifestForPlugIn)],
  define: {
    "process.env.VITE_SERVER_URL": JSON.stringify(process.env.VITE_SERVER_URL),
    "process.env.VITE_CHAT_URL": JSON.stringify(process.env.VITE_CHAT_URL),
    "process.env.VITE_ENV": JSON.stringify(process.env.VITE_ENV),
    "process.env.VITE_GA_TRACKING_ID": JSON.stringify(
      process.env.VITE_GA_TRACKING_ID
    ),
    "process.env.VITE_ONE_SIGNAL_APP_ID": JSON.stringify(
      process.env.VITE_ONE_SIGNAL_APP_ID
    ),
    "process.env.VITE_USE_GOOGLE_AUTH": JSON.stringify(
      process.env.VITE_USE_GOOGLE_AUTH
    ),
    "process.env.VITE_POSTHOG_KEY": JSON.stringify(
      process.env.VITE_POSTHOG_KEY
    ),
    "process.env.VITE_POSTHOG_HOST": JSON.stringify(
      process.env.VITE_POSTHOG_HOST
    ),
  },
});
