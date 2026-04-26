import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React from "react";
import App from "./app";
import ReactDOM from "react-dom/client";

if (!posthog.__loaded) posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  capture_pageview: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
